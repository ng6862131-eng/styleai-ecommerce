const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const nodemailer = require("nodemailer");

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

const db = require("./db.cjs");

const app = express();

app.use(cors());
app.use(express.json({ limit: "5mb" }));

/* =========================================================
   PATHS
========================================================= */

const DATA_DIR = path.join(__dirname, "data");
const INVOICE_DIR = path.join(__dirname, "invoices");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");
const SELLERS_FILE = path.join(DATA_DIR, "sellers.json");

fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(INVOICE_DIR, { recursive: true });

if (!fs.existsSync(ORDERS_FILE)) {
  fs.writeFileSync(ORDERS_FILE, "[]", "utf8");
}

if (!fs.existsSync(SELLERS_FILE)) {
  fs.writeFileSync(SELLERS_FILE, "[]", "utf8");
}

/* =========================================================
   RAZORPAY
========================================================= */

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.warn(
    "WARNING: Razorpay credentials are missing from ../.env"
  );
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* =========================================================
   EMAIL
========================================================= */

let mailer = null;

if (process.env.EMAIL_USER && process.env.EMAIL_APP_PASSWORD) {
  mailer = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });
} else {
  console.warn(
    "WARNING: EMAIL_USER / EMAIL_APP_PASSWORD missing. Email sending is disabled."
  );
}

/* =========================================================
   PENDING ORDERS
   Stores checkout details between /create-order and
   /verify-payment during the current server session.
========================================================= */

const pendingOrders = new Map();
const customerSessions = new Map();
const adminSessions = new Map();

/* =========================================================
   COUPONS
========================================================= */

const COUPONS = {
  STYLE10: {
    type: "percent",
    value: 10,
    label: "10% OFF",
  },
  WELCOME15: {
    type: "percent",
    value: 15,
    label: "15% OFF",
  },
  STYLE500: {
    type: "flat",
    value: 500,
    label: "₹500 OFF",
  },
};

/* =========================================================
   HELPERS
========================================================= */

function readOrders() {
  try {
    const raw = fs.readFileSync(ORDERS_FILE, "utf8");
    const orders = JSON.parse(raw);

    return Array.isArray(orders) ? orders : [];
  } catch (error) {
    console.error("Unable to read orders.json:", error);
    return [];
  }
}

function readSellers() {
  try {
    const sellers = JSON.parse(fs.readFileSync(SELLERS_FILE, "utf8"));
    return Array.isArray(sellers) ? sellers : [];
  } catch (error) {
    console.error("SELLER DATA READ ERROR:", error);
    throw error;
  }
}

function writeSellers(sellers) {
  fs.writeFileSync(SELLERS_FILE, JSON.stringify(sellers, null, 2), "utf8");
}

function hashSellerPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return { salt, hash };
}

function publicSeller(seller) {
  return {
    id: seller.id,
    name: seller.name,
    email: seller.email,
    createdAt: seller.createdAt,
  };
}

function sellerPasswordMatches(seller, password) {
  const candidate = crypto.scryptSync(password, seller.passwordSalt, 64);
  const stored = Buffer.from(seller.passwordHash, "hex");
  return stored.length === candidate.length && crypto.timingSafeEqual(stored, candidate);
}

function writeOrders(orders) {
  fs.writeFileSync(
    ORDERS_FILE,
    JSON.stringify(orders, null, 2),
    "utf8"
  );
}

function cleanString(value, maxLength = 500) {
  if (value === undefined || value === null) {
    return "";
  }

  return String(value).trim().slice(0, maxLength);
}

function safeEqual(leftValue, rightValue) {
  const left = Buffer.from(String(leftValue || ""));
  const right = Buffer.from(String(rightValue || ""));
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

function publicUser(user) {
  return {
    id: user.public_id,
    name: user.name,
    email: user.email,
    createdAt: user.created_at,
  };
}

function createSession(sessions, details) {
  const token = crypto.randomBytes(32).toString("hex");
  sessions.set(token, {
    ...details,
    expiresAt: Date.now() + 8 * 60 * 60 * 1000,
  });
  return token;
}

function readSession(req, sessions) {
  const token = cleanString(req.headers.authorization, 200).replace(/^Bearer\s+/i, "");
  const session = sessions.get(token);
  if (!session) return null;
  if (session.expiresAt <= Date.now()) {
    sessions.delete(token);
    return null;
  }
  return session;
}

function requireDatabase(res) {
  if (db.isDatabaseReady()) return true;
  res.status(503).json({
    success: false,
    message: "The StyleAI database is not connected. Check the DB settings in .env and restart the backend.",
  });
  return false;
}

function sanitizeCartItems(items) {
  if (!Array.isArray(items)) return [];
  return items.slice(0, 100).map((item) => {
    const customization = item?.customization && typeof item.customization === "object"
      ? {
          productType: cleanString(item.customization.productType, 80),
          pattern: cleanString(item.customization.pattern, 80),
          text: cleanString(item.customization.text, 150),
          textColor: cleanString(item.customization.textColor, 40),
        }
      : null;
    return {
      id: Number(item?.id) || null,
      name: cleanString(item?.name, 200) || "Product",
      image: cleanString(item?.image, 1000),
      price: Math.max(0, Number(item?.price) || 0),
      selectedColor: cleanString(item?.selectedColor, 80) || "Default",
      selectedSize: cleanString(item?.selectedSize, 40) || "Standard",
      quantity: Math.min(100, Math.max(1, Number(item?.quantity) || 1)),
      customization,
    };
  });
}

/* =========================================================
   CUSTOMER ACCOUNTS, CARTS, AND ADMIN DATA
========================================================= */

app.post("/auth/register", async (req, res) => {
  try {
    if (!requireDatabase(res)) return;
    const name = cleanString(req.body?.name, 100);
    const email = cleanString(req.body?.email, 150).toLowerCase();
    const password = String(req.body?.password || "");

    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 8) {
      return res.status(400).json({ success: false, message: "Enter a valid name and email, and use a password with at least 8 characters." });
    }

    const { salt, hash } = hashSellerPassword(password);
    const result = await db.createCustomerAccount({
      name,
      email,
      passwordSalt: salt,
      passwordHash: hash,
      publicId: `USER-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`,
    });

    if (!result.created) {
      return res.status(409).json({ success: false, message: "An account with this email already exists. Please log in." });
    }

    return res.status(201).json({ success: true, message: "Account created successfully.", user: publicUser(result.user) });
  } catch (error) {
    console.error("CUSTOMER REGISTER ERROR:", error);
    return res.status(500).json({ success: false, message: "Unable to create the account." });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    if (!requireDatabase(res)) return;
    const email = cleanString(req.body?.email, 150).toLowerCase();
    const password = String(req.body?.password || "");
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Enter your email and password." });
    }

    const user = await db.findUserByEmail(email);
    if (!user?.password_hash || !sellerPasswordMatches({
      passwordSalt: user.password_salt,
      passwordHash: user.password_hash,
    }, password)) {
      return res.status(401).json({ success: false, message: "Email or password is incorrect." });
    }

    const token = createSession(customerSessions, {
      userId: user.id,
      userPublicId: user.public_id,
      email: user.email,
    });
    return res.json({ success: true, token, user: publicUser(user) });
  } catch (error) {
    console.error("CUSTOMER LOGIN ERROR:", error);
    return res.status(500).json({ success: false, message: "Unable to log in." });
  }
});

app.get("/auth/cart", async (req, res) => {
  try {
    if (!requireDatabase(res)) return;
    const session = readSession(req, customerSessions);
    if (!session) return res.status(401).json({ success: false, message: "Please log in again." });
    const items = await db.getUserCart(session.userId);
    return res.json({ success: true, items });
  } catch (error) {
    console.error("CUSTOMER CART READ ERROR:", error);
    return res.status(500).json({ success: false, message: "Unable to load the saved cart." });
  }
});

app.put("/auth/cart", async (req, res) => {
  try {
    if (!requireDatabase(res)) return;
    const session = readSession(req, customerSessions);
    if (!session) return res.status(401).json({ success: false, message: "Please log in again." });
    const items = sanitizeCartItems(req.body?.items);
    await db.saveUserCart(session.userId, items);
    return res.json({ success: true, count: items.length });
  } catch (error) {
    console.error("CUSTOMER CART SAVE ERROR:", error);
    return res.status(500).json({ success: false, message: "Unable to save the cart." });
  }
});

app.post("/admin/login", (req, res) => {
  const email = cleanString(req.body?.email, 150).toLowerCase();
  const password = String(req.body?.password || "");
  const configuredEmail = String(process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const configuredPassword = String(process.env.ADMIN_PASSWORD || "");

  if (!configuredEmail || !configuredPassword) {
    return res.status(503).json({ success: false, message: "Add ADMIN_EMAIL and ADMIN_PASSWORD to the project .env file first." });
  }
  if (!safeEqual(email, configuredEmail) || !safeEqual(password, configuredPassword)) {
    return res.status(401).json({ success: false, message: "Admin email or password is incorrect." });
  }

  const token = createSession(adminSessions, { email: configuredEmail });
  return res.json({ success: true, token });
});

app.get("/admin/data", async (req, res) => {
  try {
    if (!requireDatabase(res)) return;
    const session = readSession(req, adminSessions);
    if (!session) return res.status(401).json({ success: false, message: "Admin session expired. Please log in again." });

    const [users] = await db.pool.query(
      `SELECT public_id AS id, name, email, created_at AS createdAt
       FROM users ORDER BY created_at DESC LIMIT 500`
    );
    const [productRows] = await db.pool.query(
      `SELECT product_id AS id, name, category, gender, price, stock, product_data AS productData
       FROM products ORDER BY product_id`
    );
    const [cartRows] = await db.pool.query(
      `SELECT c.id AS cartId, c.updated_at AS updatedAt, u.public_id AS userId,
        u.name AS userName, u.email, ci.item_data AS itemData, ci.quantity
       FROM carts c JOIN users u ON u.id = c.user_id
       LEFT JOIN cart_items ci ON ci.cart_id = c.id
       ORDER BY c.updated_at DESC LIMIT 1000`
    );
    const [orderRows] = await db.pool.query(
      `SELECT order_data AS orderData FROM orders ORDER BY created_at DESC LIMIT 500`
    );
    const [sellers] = await db.pool.query(
      `SELECT seller_id AS id, name, email, created_at AS createdAt
       FROM sellers ORDER BY created_at DESC LIMIT 500`
    );

    const cartsById = new Map();
    for (const row of cartRows) {
      if (!cartsById.has(row.cartId)) {
        cartsById.set(row.cartId, {
          id: row.cartId,
          updatedAt: row.updatedAt,
          user: { id: row.userId, name: row.userName, email: row.email },
          items: [],
        });
      }
      if (row.itemData) {
        cartsById.get(row.cartId).items.push({
          ...db.parseJson(row.itemData),
          quantity: Number(row.quantity) || 1,
        });
      }
    }

    const products = productRows.map((row) => ({
      id: row.id,
      name: row.name,
      category: row.category,
      gender: row.gender,
      price: Number(row.price) || 0,
      stock: Number(row.stock) || 0,
    }));
    const orders = orderRows.map((row) => db.parseJson(row.orderData)).filter(Boolean);

    return res.json({
      success: true,
      summary: {
        users: users.length,
        products: products.length,
        carts: cartsById.size,
        orders: orders.length,
        sellers: sellers.length,
      },
      users,
      products,
      carts: [...cartsById.values()],
      orders,
      sellers,
    });
  } catch (error) {
    console.error("ADMIN DATA ERROR:", error);
    return res.status(500).json({ success: false, message: "Unable to load the store data." });
  }
});

app.post("/admin/logout", (req, res) => {
  const token = cleanString(req.headers.authorization, 200).replace(/^Bearer\s+/i, "");
  if (token) adminSessions.delete(token);
  return res.json({ success: true });
});

/* =========================================================
   SELLER ACCOUNT API
========================================================= */

app.post("/seller/register", async (req, res) => {
  try {
    const name = cleanString(req.body?.name, 100);
    const email = cleanString(req.body?.email, 150).toLowerCase();
    const password = String(req.body?.password || "");

    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 1) {
      return res.status(400).json({
        success: false,
        message: "Enter your name, a valid email, and a password.",
      });
    }

    const sellers = readSellers();
    if (sellers.some((seller) => seller.email === email)) {
      return res.status(409).json({
        success: false,
        message: "This seller email is already registered. Please login.",
      });
    }

    const { salt, hash } = hashSellerPassword(password);
    const seller = {
      id: `SELLER-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`,
      name,
      email,
      passwordSalt: salt,
      passwordHash: hash,
      createdAt: new Date().toISOString(),
    };

    sellers.push(seller);
    writeSellers(sellers);
    if (db.isDatabaseReady()) {
      try {
        await db.saveSeller(seller);
      } catch (databaseError) {
        console.error("SELLER DATABASE SYNC ERROR:", databaseError);
      }
    }

    return res.status(201).json({
      success: true,
      message: "Seller account created successfully.",
      seller: publicSeller(seller),
    });
  } catch (error) {
    console.error("SELLER REGISTER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to create seller account.",
    });
  }
});

app.post("/seller/login", (req, res) => {
  try {
    const email = cleanString(req.body?.email, 150).toLowerCase();
    const password = String(req.body?.password || "");

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Enter your email and password.",
      });
    }

    const seller = readSellers().find((item) => item.email === email);
    if (!seller || !sellerPasswordMatches(seller, password)) {
      return res.status(401).json({
        success: false,
        message: "Seller email or password is incorrect.",
      });
    }

    return res.json({ success: true, seller: publicSeller(seller) });
  } catch (error) {
    console.error("SELLER LOGIN ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to login to seller account.",
    });
  }
});

function sanitizeCustomer(customer = {}) {
  return {
    name: cleanString(customer.name, 100),
    email: cleanString(customer.email, 150).toLowerCase(),
    phone: cleanString(customer.phone, 30),
    address: cleanString(customer.address, 500),
  };
}

function sanitizeItems(items = []) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items.slice(0, 50).map((item) => {
    const price = Number(item.price) || 0;
    const quantity = Math.max(
      1,
      Math.min(99, Number(item.quantity) || 1)
    );

    return {
      id: item.id,
      name: cleanString(item.name, 150),
      image: cleanString(item.image, 1000),
      price,
      quantity,
      selectedColor: cleanString(item.selectedColor, 80),
      selectedSize: cleanString(item.selectedSize, 80),
      customization: item.customization
        ? {
            productType:
              cleanString(
                item.customization.productType,
                50
              ) || "T-Shirt",
            pattern:
              cleanString(
                item.customization.pattern,
                50
              ) || "plain",
            text: cleanString(
              item.customization.text,
              100
            ),
            textColor: cleanString(
              item.customization.textColor,
              50
            ),
          }
        : null,
    };
  });
}

function calculateTotals(items, couponCode) {
  const subtotal = Math.max(
    0,
    Math.round(
      items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ) * 100
    ) / 100
  );

  const code = cleanString(
    couponCode,
    40
  ).toUpperCase();

  const coupon = COUPONS[code];

  let discount = 0;

  if (coupon) {
    discount =
      coupon.type === "percent"
        ? Math.round(
            ((subtotal * coupon.value) / 100) * 100
          ) / 100
        : Math.min(coupon.value, subtotal);
  }

  const total = Math.max(
    0,
    Math.round((subtotal - discount) * 100) / 100
  );

  return {
    subtotal,
    discount,
    total,
    couponCode: coupon ? code : null,
    couponLabel: coupon ? coupon.label : null,
  };
}

function formatMoney(amount) {
  return `₹${Number(amount || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function generateInvoicePDF(order, outputPath) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margin: 45,
    });

    const stream = fs.createWriteStream(outputPath);

    stream.on("finish", () => resolve(outputPath));
    stream.on("error", reject);

    doc.pipe(stream);

    /* Header */
    doc
      .fontSize(26)
      .fillColor("#171321")
      .text("STYLEAI", 45, 45);

    doc
      .fontSize(10)
      .fillColor("#8b5cf6")
      .text("FASHION • AI STYLING • PERSONALIZATION", 45, 78);

    doc
      .fontSize(20)
      .fillColor("#171321")
      .text("INVOICE", 400, 48, {
        width: 150,
        align: "right",
      });

    doc
      .fontSize(9)
      .fillColor("#777777")
      .text(`Invoice / Order ID: ${order.id}`, 330, 78, {
        width: 220,
        align: "right",
      });

    doc.moveTo(45, 105).lineTo(550, 105).strokeColor("#e8e2ef").stroke();

    /* Customer + payment info */
    doc
      .fontSize(11)
      .fillColor("#171321")
      .text("BILL TO", 45, 125);

    doc
      .fontSize(10)
      .fillColor("#444444")
      .text(order.customer.name || "Customer", 45, 145);

    doc.text(order.customer.email || "-", 45, 161);
    doc.text(order.customer.phone || "-", 45, 177);
    doc.text(order.customer.address || "-", 45, 193, {
      width: 230,
    });

    doc
      .fontSize(11)
      .fillColor("#171321")
      .text("PAYMENT", 345, 125);

    doc
      .fontSize(10)
      .fillColor("#444444")
      .text(`Status: ${order.paymentStatus}`, 345, 145);

    doc.text(`Payment ID: ${order.paymentId}`, 345, 161, {
      width: 205,
    });

    doc.text(`Order Date: ${order.date}`, 345, 193);

    /* Items */
    let y = 245;

    doc
      .roundedRect(45, y, 505, 30, 6)
      .fill("#f4efff");

    doc
      .fontSize(9)
      .fillColor("#4b3d5b")
      .text("ITEM", 58, y + 10);

    doc.text("QTY", 350, y + 10);
    doc.text("PRICE", 415, y + 10);
    doc.text("TOTAL", 485, y + 10);

    y += 42;

    order.items.forEach((item) => {
      const lineTotal = item.price * item.quantity;

      doc
        .fontSize(9.5)
        .fillColor("#222222")
        .text(item.name || "Product", 58, y, {
          width: 270,
        });

      doc
        .fontSize(8)
        .fillColor("#777777")
        .text(
          `${item.selectedColor || "Default"} / ${
            item.selectedSize || "Standard"
          }${
            item.customization
              ? " • Customized T-Shirt"
              : ""
          }`,
          58,
          y + 15,
          {
            width: 270,
          }
        );

      doc
        .fontSize(9.5)
        .fillColor("#222222")
        .text(String(item.quantity), 350, y + 3);

      doc.text(formatMoney(item.price), 415, y + 3);
      doc.text(formatMoney(lineTotal), 485, y + 3);

      y += 48;

      if (y > 670) {
        doc.addPage();
        y = 60;
      }
    });

    doc.moveTo(320, y).lineTo(550, y).strokeColor("#ded8e6").stroke();
    y += 16;

    doc.fontSize(10).fillColor("#555555");
    doc.text("Subtotal", 350, y);
    doc.text(formatMoney(order.subtotal), 470, y);

    y += 22;

    doc.text("Discount", 350, y);
    doc
      .fillColor("#16844a")
      .text(
        order.discount > 0
          ? `- ${formatMoney(order.discount)}`
          : formatMoney(0),
        470,
        y
      );

    if (order.couponCode) {
      y += 18;
      doc
        .fontSize(8)
        .fillColor("#8b5cf6")
        .text(
          `Coupon applied: ${order.couponCode}`,
          350,
          y
        );
    }

    y += 28;

    doc
      .roundedRect(335, y, 215, 42, 8)
      .fill("#171321");

    doc
      .fontSize(12)
      .fillColor("#ffffff")
      .text("TOTAL", 350, y + 15);

    doc
      .fontSize(14)
      .text(
        formatMoney(order.total),
        460,
        y + 13,
        {
          width: 72,
          align: "right",
        }
      );

    y += 75;

    doc
      .fontSize(10)
      .fillColor("#777777")
      .text(
        "Thank you for shopping with StyleAI.",
        45,
        y
      );

    doc.text(
      "This is a computer-generated invoice and does not require a signature.",
      45,
      y + 18
    );

    doc.end();
  });
}

async function sendReceiptEmail(order, invoicePath) {
  if (!mailer) {
    return {
      sent: false,
      reason: "Email is not configured.",
    };
  }

  if (!order.customer.email) {
    return {
      sent: false,
      reason: "Customer email is missing.",
    };
  }

  const from =
    process.env.EMAIL_FROM ||
    process.env.EMAIL_USER;

  const sellerEmail =
    cleanString(process.env.SELLER_EMAIL, 150);

  const recipients = [order.customer.email];

  if (
    sellerEmail &&
    sellerEmail.toLowerCase() !==
      order.customer.email.toLowerCase()
  ) {
    recipients.push(sellerEmail);
  }

  const itemLines = order.items
    .map(
      (item) =>
        `${item.name} × ${item.quantity} — ${formatMoney(
          item.price * item.quantity
        )}`
    )
    .join("\n");

  const mailOptions = {
    from: `"StyleAI" <${from}>`,
    to: recipients.join(","),
    subject: `Thank you for your StyleAI order ${order.id}`,
    text: `Hello ${order.customer.name || "Customer"},

Thank you for shopping with StyleAI!

Your order has been successfully confirmed.

Order ID: ${order.id}
Order Date: ${order.date}
Payment Status: ${order.paymentStatus}
Payment ID: ${order.paymentId}

Items:
${itemLines}

Subtotal: ${formatMoney(order.subtotal)}
Discount: ${formatMoney(order.discount)}
Total: ${formatMoney(order.total)}

Your invoice/bill is attached to this email.

Thank you,
StyleAI`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;padding:30px;color:#171321">
        <div style="padding-bottom:18px;border-bottom:1px solid #eee">
          <div style="font-size:26px;font-weight:800;letter-spacing:1px">
            STYLE<span style="color:#8b5cf6">AI</span>
          </div>
          <div style="font-size:11px;color:#8b5cf6;letter-spacing:2px;margin-top:5px">
            THANK YOU FOR YOUR ORDER
          </div>
        </div>

        <h2 style="margin-top:28px">
          Your order is confirmed 🎉
        </h2>

        <p>
          Hello ${cleanString(
            order.customer.name || "Customer",
            100
          )},
          thank you for shopping with StyleAI.
        </p>

        <div style="background:#f7f4ff;padding:18px;border-radius:12px;margin:20px 0">
          <p><strong>Order ID:</strong> ${order.id}</p>
          <p><strong>Payment:</strong> Successful</p>
          <p><strong>Payment ID:</strong> ${
            order.paymentId
          }</p>
        </div>

        <h3>Order Summary</h3>

        <div style="border-top:1px solid #eee">
          ${order.items
            .map(
              (item) => `
                <div style="padding:12px 0;border-bottom:1px solid #eee">
                  <strong>${cleanString(
                    item.name,
                    150
                  )}</strong>
                  <div style="color:#777;font-size:13px;margin-top:4px">
                    Qty: ${item.quantity}
                    ${
                      item.selectedColor
                        ? ` • ${cleanString(
                            item.selectedColor,
                            80
                          )}`
                        : ""
                    }
                    ${
                      item.selectedSize
                        ? ` • ${cleanString(
                            item.selectedSize,
                            80
                          )}`
                        : ""
                    }
                  </div>
                  <div style="margin-top:5px">
                    ${formatMoney(
                      item.price * item.quantity
                    )}
                  </div>
                </div>
              `
            )
            .join("")}
        </div>

        <div style="margin-top:20px">
          <p>Subtotal: <strong>${formatMoney(
            order.subtotal
          )}</strong></p>
          <p style="color:#16844a">
            Discount: <strong>-${formatMoney(
              order.discount
            )}</strong>
          </p>
          <p style="font-size:18px">
            Total: <strong>${formatMoney(
              order.total
            )}</strong>
          </p>
        </div>

        <p style="margin-top:28px;color:#666">
          Your PDF bill/receipt is attached to this email.
        </p>

        <p style="margin-top:30px">
          Thank you,<br />
          <strong>StyleAI Team</strong>
        </p>
      </div>
    `,
    attachments: [
      {
        filename: `${order.id}-invoice.pdf`,
        path: invoicePath,
        contentType: "application/pdf",
      },
    ],
  };

  await mailer.sendMail(mailOptions);

  return {
    sent: true,
    recipients,
  };
}

/* =========================================================
   CONTACT FORM
========================================================= */

app.post("/contact", async (req, res) => {
  try {
    const name = cleanString(req.body?.name, 100);
    const email = cleanString(req.body?.email, 150).toLowerCase();
    const topic = cleanString(req.body?.topic, 80);
    const orderId = cleanString(req.body?.orderId, 100);
    const message = cleanString(req.body?.message, 3000);
    const allowedTopics = new Set([
      "General question",
      "Order support",
      "Account help",
      "Seller support",
      "Website feedback",
    ]);

    if (
      !name ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      !allowedTopics.has(topic) ||
      !message
    ) {
      return res.status(400).json({
        success: false,
        message: "Enter your name, a valid email address, a topic and a message.",
      });
    }

    const contactRecipient = cleanString(
      process.env.CONTACT_EMAIL || process.env.EMAIL_USER,
      150
    );

    if (!mailer || !contactRecipient) {
      return res.status(503).json({
        success: false,
        message: "Contact messages are not available right now because email is not configured.",
      });
    }

    await mailer.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: contactRecipient,
      replyTo: email,
      subject: "[StyleAI Contact] " + topic,
      text: [
        "Name: " + name,
        "Email: " + email,
        "Topic: " + topic,
        "Order number: " + (orderId || "Not provided"),
        "",
        "Message:",
        message,
      ].join("\n"),
    });

    return res.json({
      success: true,
      message: "Your message has been sent.",
    });
  } catch (error) {
    console.error("CONTACT MESSAGE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "We could not send your message. Please try again later.",
    });
  }
});
/* =========================================================
   HEALTH / HOME
========================================================= */

app.get("/", (req, res) => {
  res.send(
    "StyleAI Backend is Running Successfully! ✅"
  );
});

app.get("/health", (req, res) => {
  res.json({
    success: true,
    razorpayConfigured: Boolean(
      process.env.RAZORPAY_KEY_ID &&
        process.env.RAZORPAY_KEY_SECRET
    ),
    emailConfigured: Boolean(mailer),
    ordersFile: ORDERS_FILE,
  });
});

/* =========================================================
   CREATE ORDER
========================================================= */

app.post("/create-order", async (req, res) => {
  try {
    const {
      customer = {},
      items = [],
      couponCode = "",
    } = req.body;

    const safeCustomer = sanitizeCustomer(customer);
    const safeItems = sanitizeItems(items);

    if (!safeCustomer.name || !safeCustomer.email) {
      return res.status(400).json({
        success: false,
        message: "Customer name and email are required.",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      safeCustomer.email
    )) {
      return res.status(400).json({
        success: false,
        message: "Invalid customer email.",
      });
    }

    if (!safeItems.length) {
      return res.status(400).json({
        success: false,
        message: "Order must contain at least one item.",
      });
    }

    const totals = calculateTotals(
      safeItems,
      couponCode
    );

    if (totals.total <= 0) {
      return res.status(400).json({
        success: false,
        message: "Order total must be greater than zero.",
      });
    }

    const options = {
      amount: Math.round(totals.total * 100),
      currency: "INR",
      receipt: `styleai_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    pendingOrders.set(order.id, {
      razorpayOrderId: order.id,
      customer: safeCustomer,
      items: safeItems,
      ...totals,
      createdAt: new Date().toISOString(),
    });

    res.json({
      success: true,
      order,
      summary: {
        subtotal: totals.subtotal,
        discount: totals.discount,
        total: totals.total,
        couponCode: totals.couponCode,
        couponLabel: totals.couponLabel,
      },
    });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Unable to create payment order.",
    });
  }
});

/* =========================================================
   VERIFY PAYMENT
========================================================= */

app.post("/verify-payment", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Incomplete Razorpay payment response.",
      });
    }

    const generatedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`
      )
      .digest("hex");

    const isValid = crypto.timingSafeEqual(
      Buffer.from(generatedSignature),
      Buffer.from(razorpay_signature)
    );

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed.",
      });
    }

    const orders = readOrders();

    const alreadySaved = orders.find(
      (order) =>
        order.paymentId === razorpay_payment_id ||
        order.razorpayOrderId === razorpay_order_id
    );

    if (alreadySaved) {
      return res.json({
        success: true,
        message: "Payment already verified.",
        transactionId: razorpay_payment_id,
        order: alreadySaved,
        emailSent: Boolean(alreadySaved.emailSent),
        duplicate: true,
      });
    }

    const pending = pendingOrders.get(
      razorpay_order_id
    );

    if (!pending) {
      return res.status(400).json({
        success: false,
        message:
          "Checkout details expired. Please start the checkout again.",
      });
    }

    const order = {
      id: `STYLEAI-${Date.now()}`,
      razorpayOrderId: razorpay_order_id,
      date: new Date().toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      ),
      paymentId: razorpay_payment_id,
      paymentStatus: "Paid",
      subtotal: pending.subtotal,
      discount: pending.discount,
      couponCode: pending.couponCode,
      couponLabel: pending.couponLabel,
      total: pending.total,
      customer: pending.customer,
      items: pending.items,
      emailSent: false,
    };

    /* Save first so a paid order is never lost */
    orders.push(order);
    writeOrders(orders);
    if (db.isDatabaseReady()) {
      try {
        await db.saveOrder(order);
      } catch (databaseError) {
        console.error("ORDER DATABASE SYNC ERROR:", databaseError);
      }
    }

    /* Invoice */
    const invoicePath = path.join(
      INVOICE_DIR,
      `${order.id}-invoice.pdf`
    );

    try {
      await generateInvoicePDF(
        order,
        invoicePath
      );
    } catch (invoiceError) {
      console.error(
        "INVOICE GENERATION ERROR:",
        invoiceError
      );
    }

    /* Email */
    let emailResult = {
      sent: false,
      reason: "Email not attempted.",
    };

    if (fs.existsSync(invoicePath)) {
      try {
        emailResult =
          await sendReceiptEmail(
            order,
            invoicePath
          );
        order.emailSent =
          Boolean(emailResult.sent);

        const latestOrders = readOrders();
        const orderIndex = latestOrders.findIndex(
          (saved) => saved.id === order.id
        );

        if (orderIndex !== -1) {
          latestOrders[orderIndex] = order;
          writeOrders(latestOrders);
          if (db.isDatabaseReady()) {
            try {
              await db.saveOrder(order);
            } catch (databaseError) {
              console.error("ORDER DATABASE SYNC ERROR:", databaseError);
            }
          }
        }
      } catch (emailError) {
        console.error(
          "EMAIL ERROR:",
          emailError
        );
        order.emailSent = false;
        order.emailError =
          emailError.message || "Email sending failed.";

        const latestOrders = readOrders();
        const orderIndex = latestOrders.findIndex(
          (saved) => saved.id === order.id
        );

        if (orderIndex !== -1) {
          latestOrders[orderIndex] = order;
          writeOrders(latestOrders);
          if (db.isDatabaseReady()) {
            try {
              await db.saveOrder(order);
            } catch (databaseError) {
              console.error("ORDER DATABASE SYNC ERROR:", databaseError);
            }
          }
        }
      }
    } else {
      emailResult.reason =
        "Invoice PDF could not be generated.";
    }

    pendingOrders.delete(
      razorpay_order_id
    );

    res.json({
      success: true,
      message: "Payment verified and order saved.",
      transactionId: razorpay_payment_id,
      order,
      invoiceGenerated:
        fs.existsSync(invoicePath),
      emailSent: Boolean(emailResult.sent),
      emailMessage: emailResult.sent
        ? "Receipt emailed successfully."
        : emailResult.reason,
    });
  } catch (error) {
    console.error(
      "VERIFY PAYMENT ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Verification error.",
    });
  }
});

/* =========================================================
   SELLER DASHBOARD APIs
========================================================= */

/*
  NOTE:
  These seller endpoints are intentionally simple for a college
  project/demo. They read from server/data/orders.json.
*/

/* List all saved orders */
app.get("/seller/orders", (req, res) => {
  try {
    const orders = readOrders();

    res.json({
      success: true,
      count: orders.length,
      orders: orders
        .slice()
        .reverse(),
    });
  } catch (error) {
    console.error("SELLER ORDERS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load seller orders.",
    });
  }
});

/* View one order by StyleAI order ID */
app.get("/seller/orders/:orderId", (req, res) => {
  try {
    const orderId = cleanString(req.params.orderId, 100);

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required.",
      });
    }

    const orders = readOrders();

    const order = orders.find(
      (savedOrder) =>
        savedOrder.id === orderId ||
        savedOrder.razorpayOrderId === orderId ||
        savedOrder.paymentId === orderId
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(
      "SELLER ORDER DETAILS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to load order details.",
    });
  }
});

/* Revenue + order totals for the seller dashboard */
app.get("/seller/revenue", (req, res) => {
  try {
    const orders = readOrders();

    const paidOrders = orders.filter(
      (order) =>
        String(order.paymentStatus || "").toLowerCase() ===
        "paid"
    );

    const revenue = paidOrders.reduce(
      (sum, order) =>
        sum + (Number(order.total) || 0),
      0
    );

    const grossSubtotal = paidOrders.reduce(
      (sum, order) =>
        sum + (Number(order.subtotal) || 0),
      0
    );

    const discountGiven = paidOrders.reduce(
      (sum, order) =>
        sum + (Number(order.discount) || 0),
      0
    );

    const itemCount = paidOrders.reduce(
      (sum, order) =>
        sum +
        (Array.isArray(order.items)
          ? order.items.reduce(
              (itemSum, item) =>
                itemSum +
                (Number(item.quantity) || 0),
              0
            )
          : 0),
      0
    );

    const customerEmails = new Set(
      paidOrders
        .map(
          (order) =>
            order.customer &&
            order.customer.email
        )
        .filter(Boolean)
        .map((email) =>
          String(email).toLowerCase()
        )
    );

    res.json({
      success: true,
      revenue: Math.round(revenue * 100) / 100,
      grossSubtotal:
        Math.round(grossSubtotal * 100) / 100,
      discountGiven:
        Math.round(discountGiven * 100) / 100,
      totalOrders: paidOrders.length,
      totalItems: itemCount,
      uniqueCustomers: customerEmails.size,
      currency: "INR",
    });
  } catch (error) {
    console.error(
      "SELLER REVENUE ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to calculate revenue totals.",
    });
  }
});

/* Combined dashboard endpoint */
app.get("/seller/dashboard", (req, res) => {
  try {
    const orders = readOrders();

    const paidOrders = orders.filter(
      (order) =>
        String(order.paymentStatus || "").toLowerCase() ===
        "paid"
    );

    const revenue = paidOrders.reduce(
      (sum, order) =>
        sum + (Number(order.total) || 0),
      0
    );

    const subtotal = paidOrders.reduce(
      (sum, order) =>
        sum + (Number(order.subtotal) || 0),
      0
    );

    const discountGiven = paidOrders.reduce(
      (sum, order) =>
        sum + (Number(order.discount) || 0),
      0
    );

    const totalItems = paidOrders.reduce(
      (sum, order) =>
        sum +
        (Array.isArray(order.items)
          ? order.items.reduce(
              (itemSum, item) =>
                itemSum +
                (Number(item.quantity) || 0),
              0
            )
          : 0),
      0
    );

    const customers = new Set(
      paidOrders
        .map(
          (order) =>
            order.customer &&
            order.customer.email
        )
        .filter(Boolean)
        .map((email) =>
          String(email).toLowerCase()
        )
    );

    res.json({
      success: true,
      summary: {
        revenue:
          Math.round(revenue * 100) / 100,
        grossSubtotal:
          Math.round(subtotal * 100) / 100,
        discountGiven:
          Math.round(discountGiven * 100) / 100,
        totalOrders: paidOrders.length,
        totalItems,
        uniqueCustomers: customers.size,
        currency: "INR",
      },
      recentOrders: paidOrders
        .slice()
        .reverse()
        .slice(0, 5),
    });
  } catch (error) {
    console.error(
      "SELLER DASHBOARD ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to load seller dashboard.",
    });
  }
});

/* =========================================================
   SERVER
========================================================= */

const PORT = 5000;

async function startServer() {
  try {
    await db.initializeDatabase();
    console.log(`MySQL database ready: ${process.env.DB_NAME || "styleai"}`);
  } catch (error) {
    console.error("MySQL is not ready. Add DB settings to .env; the existing file-backed features will remain available.");
    console.error(error.message);
  }

  app.listen(PORT, () => {
    console.log(`StyleAI backend running on http://localhost:${PORT}`);
    console.log(`Orders file: ${ORDERS_FILE}`);
    console.log(`Invoice folder: ${INVOICE_DIR}`);
    console.log(`Email configured: ${Boolean(mailer)}`);
  });
}

startServer();
