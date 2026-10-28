const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");
const mysql = require("mysql2/promise");

const DATA_DIR = path.join(__dirname, "data");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");
const SELLERS_FILE = path.join(DATA_DIR, "sellers.json");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "styleai",
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
  connectTimeout: 5000,
  decimalNumbers: true,
});

let databaseReady = false;

function parseJson(value) {
  if (value && typeof value === "object") return value;
  try {
    return JSON.parse(value || "null");
  } catch {
    return null;
  }
}

function readJsonArray(filePath) {
  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function ensureSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      public_id VARCHAR(80) NOT NULL UNIQUE,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL UNIQUE,
      password_salt CHAR(32) NULL,
      password_hash CHAR(128) NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      product_id INT NOT NULL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      category VARCHAR(100) NOT NULL DEFAULT '',
      gender VARCHAR(50) NULL,
      price DECIMAL(10,2) NOT NULL DEFAULT 0,
      stock INT NOT NULL DEFAULT 0,
      product_data JSON NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS sellers (
      seller_id VARCHAR(100) NOT NULL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL UNIQUE,
      password_salt CHAR(32) NOT NULL,
      password_hash CHAR(128) NOT NULL,
      created_at DATETIME NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS carts (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      user_id BIGINT UNSIGNED NOT NULL UNIQUE,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT fk_carts_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS cart_items (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      cart_id BIGINT UNSIGNED NOT NULL,
      product_id INT NULL,
      item_key VARCHAR(512) NOT NULL,
      quantity INT NOT NULL DEFAULT 1,
      item_data JSON NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY uq_cart_item (cart_id, item_key),
      CONSTRAINT fk_cart_items_cart FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
      CONSTRAINT fk_cart_items_product FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      order_id VARCHAR(100) NOT NULL PRIMARY KEY,
      razorpay_order_id VARCHAR(100) NULL UNIQUE,
      payment_id VARCHAR(100) NULL UNIQUE,
      user_id BIGINT UNSIGNED NULL,
      customer_email VARCHAR(150) NOT NULL,
      payment_status VARCHAR(30) NOT NULL DEFAULT 'Pending',
      subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
      discount DECIMAL(10,2) NOT NULL DEFAULT 0,
      total DECIMAL(10,2) NOT NULL DEFAULT 0,
      order_data JSON NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_orders_customer_email (customer_email),
      CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS order_items (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      order_id VARCHAR(100) NOT NULL,
      product_id INT NULL,
      product_name VARCHAR(255) NOT NULL,
      quantity INT NOT NULL DEFAULT 1,
      unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
      selected_color VARCHAR(80) NULL,
      selected_size VARCHAR(50) NULL,
      item_data JSON NOT NULL,
      CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
      CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
}

async function seedProducts() {
  const moduleUrl = pathToFileURL(path.join(__dirname, "../src/data/products.js")).href;
  const { default: products } = await import(moduleUrl);
  for (const product of products) {
    await pool.execute(
      `INSERT INTO products (product_id, name, category, gender, price, stock, product_data)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name=VALUES(name), category=VALUES(category), gender=VALUES(gender),
       price=VALUES(price), stock=VALUES(stock), product_data=VALUES(product_data)`,
      [product.id, product.name, product.category || "", product.gender || null, Number(product.price) || 0, Number(product.stock) || 0, JSON.stringify(product)]
    );
  }
}

async function upsertUserFromCustomer(customer = {}) {
  const email = String(customer.email || "").trim().toLowerCase();
  if (!email) return null;

  const name = String(customer.name || "Customer").trim().slice(0, 100) || "Customer";
  await pool.execute(
    `INSERT INTO users (public_id, name, email, password_salt, password_hash)
     VALUES (?, ?, ?, NULL, NULL)
     ON DUPLICATE KEY UPDATE name=IF(VALUES(name) <> '', VALUES(name), name)`,
    [`USER-${crypto.randomBytes(12).toString("hex")}`, name, email]
  );
  const [rows] = await pool.execute("SELECT id FROM users WHERE email = ? LIMIT 1", [email]);
  return rows[0]?.id || null;
}

async function saveOrder(order) {
  const customer = order.customer || {};
  const email = String(customer.email || order.email || "").trim().toLowerCase();
  const userId = await upsertUserFromCustomer({ ...customer, email });
  await pool.execute(
    `INSERT INTO orders (order_id, razorpay_order_id, payment_id, user_id, customer_email,
      payment_status, subtotal, discount, total, order_data)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE razorpay_order_id=VALUES(razorpay_order_id), payment_id=VALUES(payment_id),
      user_id=VALUES(user_id), customer_email=VALUES(customer_email), payment_status=VALUES(payment_status),
      subtotal=VALUES(subtotal), discount=VALUES(discount), total=VALUES(total), order_data=VALUES(order_data)`,
    [order.id, order.razorpayOrderId || null, order.paymentId || null, userId, email,
      order.paymentStatus || "Pending", Number(order.subtotal) || 0, Number(order.discount) || 0,
      Number(order.total) || 0, JSON.stringify(order)]
  );

  await pool.execute("DELETE FROM order_items WHERE order_id = ?", [order.id]);
  for (const item of Array.isArray(order.items) ? order.items : []) {
    await pool.execute(
      `INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price,
        selected_color, selected_size, item_data)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [order.id, Number.isInteger(Number(item.id)) ? Number(item.id) : null,
        String(item.name || "Item"), Math.max(1, Number(item.quantity) || 1), Number(item.price) || 0,
        item.selectedColor || null, item.selectedSize || null, JSON.stringify(item)]
    );
  }
}

async function saveSeller(seller) {
  await pool.execute(
    `INSERT INTO sellers (seller_id, name, email, password_salt, password_hash, created_at)
     VALUES (?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE name=VALUES(name), password_salt=VALUES(password_salt),
      password_hash=VALUES(password_hash)`,
    [seller.id, seller.name, seller.email, seller.passwordSalt, seller.passwordHash,
      new Date(seller.createdAt || Date.now())]
  );
}

async function findUserByEmail(email) {
  requireDatabase();
  const [rows] = await pool.execute(
    `SELECT id, public_id, name, email, password_salt, password_hash, created_at
     FROM users WHERE email = ? LIMIT 1`,
    [String(email || "").trim().toLowerCase()]
  );
  return rows[0] || null;
}

async function createCustomerAccount({ name, email, passwordSalt, passwordHash, publicId }) {
  requireDatabase();
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const existing = await findUserByEmail(normalizedEmail);

  if (existing?.password_hash) {
    return { created: false, user: existing };
  }

  if (existing) {
    await pool.execute(
      `UPDATE users SET name = ?, password_salt = ?, password_hash = ? WHERE id = ?`,
      [name, passwordSalt, passwordHash, existing.id]
    );
    return { created: true, user: await findUserByEmail(normalizedEmail) };
  }

  await pool.execute(
    `INSERT INTO users (public_id, name, email, password_salt, password_hash)
     VALUES (?, ?, ?, ?, ?)`,
    [publicId, name, normalizedEmail, passwordSalt, passwordHash]
  );
  return { created: true, user: await findUserByEmail(normalizedEmail) };
}

async function saveUserCart(userId, items) {
  requireDatabase();
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await connection.execute(
      `INSERT INTO carts (user_id) VALUES (?)
       ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id), updated_at = CURRENT_TIMESTAMP`,
      [userId]
    );
    const [cartRows] = await connection.execute(
      `SELECT id FROM carts WHERE user_id = ? LIMIT 1`,
      [userId]
    );
    const cartId = cartRows[0]?.id;
    if (!cartId) throw new Error("Unable to create the customer cart.");

    await connection.execute(`DELETE FROM cart_items WHERE cart_id = ?`, [cartId]);
    for (const item of items) {
      const productId = Number.isInteger(Number(item.id)) ? Number(item.id) : null;
      const customization = item.customization ? JSON.stringify(item.customization) : "";
      const itemKey = crypto.createHash("sha256")
        .update([item.id, item.selectedColor || "Default", item.selectedSize || "Standard", customization].join("|"))
        .digest("hex");
      await connection.execute(
        `INSERT INTO cart_items (cart_id, product_id, item_key, quantity, item_data)
         VALUES (?, ?, ?, ?, ?)`,
        [cartId, productId, itemKey, Math.max(1, Number(item.quantity) || 1), JSON.stringify(item)]
      );
    }
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function getUserCart(userId) {
  requireDatabase();
  const [rows] = await pool.execute(
    `SELECT ci.item_data, ci.quantity
     FROM carts c LEFT JOIN cart_items ci ON ci.cart_id = c.id
     WHERE c.user_id = ? ORDER BY ci.id`,
    [userId]
  );
  return rows.filter((row) => row.item_data).map((row) => ({
    ...parseJson(row.item_data),
    quantity: Number(row.quantity) || 1,
  }));
}

async function initializeDatabase() {
  await pool.query("SELECT 1");
  await ensureSchema();
  await seedProducts();

  for (const seller of readJsonArray(SELLERS_FILE)) {
    if (seller.id && seller.email && seller.passwordSalt && seller.passwordHash) {
      await saveSeller(seller);
    }
  }

  for (const order of readJsonArray(ORDERS_FILE)) {
    if (order.id && order.customer?.email) {
      await saveOrder(order);
    }
  }

  databaseReady = true;
}

function isDatabaseReady() {
  return databaseReady;
}

function requireDatabase() {
  if (!databaseReady) {
    throw new Error("MySQL is not connected. Check the DB settings in .env and restart the backend.");
  }
}

module.exports = {
  pool,
  initializeDatabase,
  isDatabaseReady,
  requireDatabase,
  parseJson,
  saveOrder,
  saveSeller,
  findUserByEmail,
  createCustomerAccount,
  saveUserCart,
  getUserCart,
};
