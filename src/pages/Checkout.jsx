import { useEffect, useState } from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { FaMagic } from "react-icons/fa";

import { useCart } from "../context/CartContext";

function Checkout() {
  const { cartItems, cartTotal } = useCart();

  const navigate = useNavigate();
  const location = useLocation();

  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);

  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");

  const subtotal = Number(cartTotal) || 0;
  const discountedTotal = Math.max(0, Math.round((subtotal - discount) * 100) / 100);

  const coupons = {
    STYLE10: { type: "percent", value: 10, label: "10% OFF" },
    WELCOME15: { type: "percent", value: 15, label: "15% OFF" },
    STYLE500: { type: "flat", value: 500, label: "₹500 OFF" },
  };

  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) { setDiscount(0); setCouponMessage("Enter a coupon code."); return; }
    const coupon = coupons[code];
    if (!coupon) { setDiscount(0); setCouponMessage("Invalid coupon code."); return; }
    const calculatedDiscount = coupon.type === "percent"
      ? Math.round((subtotal * coupon.value) / 100)
      : Math.min(coupon.value, subtotal);
    setDiscount(calculatedDiscount);
    setCouponMessage(`Coupon ${code} applied — ${coupon.label}`);
  };

  const removeCoupon = () => {
    setCouponCode("");
    setDiscount(0);
    setCouponMessage("");
  };

  /* =====================================================
     LOGIN PROTECTION
  ===================================================== */

  useEffect(() => {
    const loggedIn =
      localStorage.getItem(
        "styleai-logged-in"
      ) === "true";

    if (!loggedIn) {
      navigate("/login", {
        state: {
          from:
            location.pathname,
        },
      });
    }
  }, [
    navigate,
    location.pathname,
  ]);

  /* =====================================================
     LOAD USER DETAILS
  ===================================================== */

  useEffect(() => {
    const savedUser =
      localStorage.getItem(
        "styleai-user"
      );

    if (savedUser) {
      try {
        const user =
          JSON.parse(savedUser);

        setCustomer((previousCustomer) => ({
          ...previousCustomer,

          name:
            user.name || "",

          email:
            user.email || "",
        }));
      } catch (error) {
        console.error(
          "Unable to load user details:",
          error
        );
      }
    }
  }, []);

  /* =====================================================
     INPUT CHANGE
  ===================================================== */

  const handleChange = (e) => {
    setCustomer({
      ...customer,

      [e.target.name]:
        e.target.value,
    });
  };

  /* =====================================================
     RAZORPAY SCRIPT
  ===================================================== */

  const loadRazorpay = () => {
    return new Promise((resolve) => {

      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script =
        document.createElement("script");

      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () =>
        resolve(true);

      script.onerror = () =>
        resolve(false);

      document.body.appendChild(
        script
      );
    });
  };

  /* =====================================================
     PAYMENT
  ===================================================== */

  const handlePayment = async () => {

    if (
      !customer.name ||
      !customer.email ||
      !customer.phone ||
      !customer.address
    ) {
      alert(
        "Please fill all shipping details."
      );

      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty.");

      return;
    }

    const loggedIn =
      localStorage.getItem(
        "styleai-logged-in"
      ) === "true";

    if (!loggedIn) {
      navigate("/login", {
        state: {
          from:
            location.pathname,
        },
      });

      return;
    }

    try {

      setLoading(true);

      /* LOAD RAZORPAY */

      const razorpayLoaded =
        await loadRazorpay();

      if (!razorpayLoaded) {

        alert(
          "Razorpay failed to load."
        );

        setLoading(false);

        return;
      }

      /* CREATE ORDER */

      const orderResponse =
        await fetch(
          "http://localhost:5000/create-order",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              amount: discountedTotal,
              subtotal,
              discount,
              couponCode: couponCode.trim().toUpperCase() || null,
              customer,
              items: cartItems.map((item) => ({
                id: item.id,
                name: item.name,
                image: item.image,
                price: item.price,
                quantity: item.quantity,
                selectedColor: item.selectedColor,
                selectedSize: item.selectedSize,
                customization: item.customization
                  ? {
                      productType: item.customization.productType || "T-Shirt",
                      pattern: item.customization.pattern || "plain",
                      text: item.customization.text || "",
                      textColor: item.customization.textColor || "",
                    }
                  : null,
              })),
            }),
          }
        );

      const orderData =
        await orderResponse.json();

      if (!orderData.success) {

        alert(
          "Unable to create payment order."
        );

        setLoading(false);

        return;
      }

      /* RAZORPAY OPTIONS */

      const options = {

        key:
          "rzp_test_TSNJrkr76zwuFl",

        amount:
          orderData.order.amount,

        currency:
          "INR",

        name:
          "StyleAI",

        description:
          "StyleAI Fashion Purchase",

        order_id:
          orderData.order.id,

        prefill: {

          name:
            customer.name,

          email:
            customer.email,

          contact:
            customer.phone,
        },

        notes: {
          address:
            customer.address,
        },

        theme: {
          color:
            "#8b5cf6",
        },

        handler:
          async function (response) {

            try {

              const verifyResponse =
                await fetch(
                  "http://localhost:5000/verify-payment",
                  {
                    method: "POST",

                    headers: {
                      "Content-Type":
                        "application/json",
                    },

                    body:
                      JSON.stringify(
                        response
                      ),
                  }
                );

              const verifyData =
                await verifyResponse.json();

              if (verifyData.success) {

                /* =========================
                   SAVE ORDER
                ========================= */

                const newOrder = {

                  id:
                    `STYLEAI-${Date.now()}`,

                  date:
                    new Date().toLocaleDateString(
                      "en-IN",
                      {
                        day:
                          "2-digit",

                        month:
                          "short",

                        year:
                          "numeric",
                      }
                    ),

                  paymentId:
                    verifyData.transactionId,

                  subtotal,
                  discount,
                  couponCode:
                    couponCode.trim().toUpperCase() || null,
                  total:
                    discountedTotal,

                  customer: {
                    name:
                      customer.name,

                    email:
                      customer.email,

                    phone:
                      customer.phone,

                    address:
                      customer.address,
                  },

                  items:
                    cartItems.map(
                      (item) => ({
                        id:
                          item.id,

                        name:
                          item.name,

                        image:
                          item.image,

                        price:
                          item.price,

                        quantity:
                          item.quantity,

                        selectedColor:
                          item.selectedColor,

                        selectedSize:
                          item.selectedSize,

                        customization:
                          item.customization
                            ? {
                                productType:
                                  item.customization
                                    .productType ||
                                  "T-Shirt",

                                pattern:
                                  item.customization
                                    .pattern ||
                                  "plain",

                                text:
                                  item.customization
                                    .text ||
                                  "",

                                textColor:
                                  item.customization
                                    .textColor ||
                                  "",
                              }
                            : null,
                      })
                    ),
                };

                /* =========================
                   SAVE TO LOCAL STORAGE
                ========================= */

                const savedOrders =
                  localStorage.getItem(
                    "styleai-orders"
                  );

                const existingOrders =
                  savedOrders
                    ? JSON.parse(
                        savedOrders
                      )
                    : [];

                existingOrders.push(
                  newOrder
                );

                localStorage.setItem(
                  "styleai-orders",
                  JSON.stringify(
                    existingOrders
                  )
                );

                alert(
                  `Payment Successful!\n\nTransaction ID: ${verifyData.transactionId}`
                );

                navigate("/orders");

              } else {

                alert(
                  "Payment verification failed."
                );
              }

            } catch (error) {

              console.error(error);

              alert(
                "Unable to verify payment."
              );

            } finally {

              setLoading(false);
            }
          },

        modal: {

          ondismiss:
            function () {
              setLoading(false);
            },

        },
      };

      /* OPEN RAZORPAY */

      const razorpay =
        new window.Razorpay(
          options
        );

      razorpay.on(
        "payment.failed",
        function (response) {

          console.error(
            response.error
          );

          alert(
            `Payment Failed\n\n${response.error.description}`
          );

          setLoading(false);
        }
      );

      razorpay.open();

    } catch (error) {

      console.error(error);

      alert(
        "Something went wrong while starting payment."
      );

      setLoading(false);
    }
  };

  /* =====================================================
     TEXT COLOUR NAME
  ===================================================== */

  const getTextColorName = (
    value
  ) => {

    const colors = {
      "#ffffff":
        "White",

      "#111111":
        "Black",

      "#d4a72c":
        "Gold",

      "#e96b9a":
        "Pink",
    };

    return (
      colors[value] ||
      value ||
      "Not selected"
    );
  };

  /* =====================================================
     PATTERN NAME
  ===================================================== */

  const getPatternName = (
    value
  ) => {

    if (
      value === "stripes"
    ) {
      return "Stripes";
    }

    return "Plain";
  };

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <div className="checkout-page">

      <Link
        to="/"
        className="back-home"
      >
        ← Back to Home
      </Link>

      <div className="checkout-header">

        <p>
          STYLEAI SECURE CHECKOUT
        </p>

        <h1>
          Checkout
        </h1>

        <span className="checkout-subtitle">
          Complete your order securely
        </span>

      </div>

      <div className="checkout-container">

        {/* ================= SHIPPING ================= */}

        <div className="shipping-form">

          <h2>
            Shipping Details
          </h2>

          <p className="checkout-form-info">
            Enter your delivery information
            to complete your purchase.
          </p>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={customer.name}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={customer.email}
            onChange={handleChange}
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={customer.phone}
            onChange={handleChange}
          />

          <textarea
            name="address"
            placeholder="Complete Delivery Address"
            value={customer.address}
            onChange={handleChange}
          />

        </div>

        {/* ================= ORDER SUMMARY ================= */}

        <div className="order-summary">

          <h2>
            Order Summary
          </h2>

          {cartItems.map((item) => {

            const isCustomized =
              Boolean(
                item.customization
              );

            return (

              <div
                className="checkout-item"
                key={`${item.id}-${item.selectedColor}-${item.selectedSize}-${item.customization?.text || ""}`}
              >

                <div className="checkout-item-image">

                  <img
                    src={item.image}
                    alt={item.name}
                  />

                  {isCustomized && (
                    <span className="checkout-custom-badge">
                      <FaMagic />
                      Custom
                    </span>
                  )}

                </div>

                <div className="checkout-item-info">

                  <h3>
                    {item.name}
                  </h3>

                  <p>
                    Colour:{" "}
                    {item.selectedColor ||
                      "Default"}
                  </p>

                  <p>
                    Size:{" "}
                    {item.selectedSize ||
                      "Standard"}
                  </p>

                  <p>
                    Qty:{" "}
                    {item.quantity}
                  </p>

                  {isCustomized && (

                    <div className="checkout-customization">

                      <div className="checkout-custom-title">
                        <FaMagic />
                        3D Customization
                      </div>

                      <p>
                        Pattern:{" "}
                        <strong>
                          {getPatternName(
                            item.customization
                              .pattern
                          )}
                        </strong>
                      </p>

                      {item.customization
                        .text && (

                        <p>
                          Text:{" "}
                          <strong>
                            "{item.customization.text}"
                          </strong>
                        </p>
                      )}

                      {item.customization
                        .textColor && (

                        <p>
                          Text Colour:{" "}
                          <strong>
                            {getTextColorName(
                              item.customization
                                .textColor
                            )}
                          </strong>
                        </p>
                      )}

                    </div>

                  )}

                </div>

                <strong className="checkout-item-price">
                  ₹
                  {item.price *
                    item.quantity}
                </strong>

              </div>

            );
          })}

          <div className="checkout-coupon">

            <div className="checkout-coupon-title">
              <span>Have a coupon?</span>

              {discount > 0 && (
                <button
                  type="button"
                  className="checkout-coupon-remove"
                  onClick={removeCoupon}
                >
                  Remove
                </button>
              )}
            </div>

            <div className="checkout-coupon-row">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Enter coupon code"
                disabled={discount > 0}
              />

              <button
                type="button"
                onClick={applyCoupon}
                disabled={discount > 0}
              >
                Apply
              </button>
            </div>

            {couponMessage && (
              <p className={discount > 0 ? "checkout-coupon-success" : "checkout-coupon-error"}>
                {couponMessage}
              </p>
            )}

            <div className="checkout-price-row">
              <span>Subtotal</span>
              <strong>₹{subtotal}</strong>
            </div>

            <div className="checkout-price-row">
              <span>Discount</span>
              <strong>{discount > 0 ? `- ₹${discount}` : "₹0"}</strong>
            </div>

            <div className="checkout-total">
              <span>Total</span>
              <strong>₹{discountedTotal}</strong>
            </div>

          </div>

          <button
            className="pay-now-btn"
            onClick={handlePayment}
            disabled={loading}
          >
            {loading
              ? "Opening Payment..."
              : `Pay ₹${discountedTotal}`}
          </button>

          <p className="secure-payment-note">
            🔒 Secure payment powered by
            Razorpay
          </p>

        </div>

      </div>

    </div>
  );
}

export default Checkout;