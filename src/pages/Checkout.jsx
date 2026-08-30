import { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

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
          from: "/checkout",
        },
      });
    }
  }, [navigate]);

  /* =====================================================
     LOAD USER DETAILS
     ===================================================== */

  useEffect(() => {
    const savedUser = localStorage.getItem(
      "styleai-user"
    );

    if (savedUser) {
      const user = JSON.parse(savedUser);

      setCustomer((previousCustomer) => ({
        ...previousCustomer,
        name: user.name || "",
        email: user.email || "",
      }));
    }
  }, []);

  /* =====================================================
     INPUT CHANGE
     ===================================================== */

  const handleChange = (e) => {
    setCustomer({
      ...customer,
      [e.target.name]: e.target.value,
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

      script.onload = () => resolve(true);

      script.onerror = () => resolve(false);

      document.body.appendChild(script);
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
          from: "/checkout",
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
              amount: cartTotal,
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
        key: "rzp_test_TSNJrkr76zwuFl",

        amount:
          orderData.order.amount,

        currency: "INR",

        name: "StyleAI",

        description:
          "StyleAI Fashion Purchase",

        order_id:
          orderData.order.id,

        prefill: {
          name: customer.name,
          email: customer.email,
          contact: customer.phone,
        },

        notes: {
          address: customer.address,
        },

        theme: {
          color: "#9b5cff",
        },

        handler: async function (
          response
        ) {
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

                  body: JSON.stringify(
                    response
                  ),
                }
              );

            const verifyData =
              await verifyResponse.json();

            if (verifyData.success) {
  const newOrder = {
    id: `STYLEAI-${Date.now()}`,

    date: new Date().toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    ),

    paymentId:
      verifyData.transactionId,

    total: cartTotal,

    customer: {
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
    },

    items: cartItems.map((item) => ({
      id: item.id,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
      selectedColor:
        item.selectedColor,
      selectedSize:
        item.selectedSize,
    })),
  };

  const savedOrders =
    localStorage.getItem(
      "styleai-orders"
    );

  const existingOrders = savedOrders
    ? JSON.parse(savedOrders)
    : [];

  existingOrders.push(newOrder);

  localStorage.setItem(
    "styleai-orders",
    JSON.stringify(existingOrders)
  );

  alert(
    `Payment Successful!\n\nTransaction ID: ${verifyData.transactionId}`
  );

  navigate("/order");
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
          ondismiss: function () {
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

      </div>

      <div className="checkout-container">

        {/* ================= SHIPPING ================= */}

        <div className="shipping-form">

          <h2>
            Shipping Details
          </h2>

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

          {cartItems.map((item) => (

            <div
              className="checkout-item"
              key={`${item.id}-${item.selectedColor}-${item.selectedSize}`}
            >

              <img
                src={item.image}
                alt={item.name}
              />

              <div>

                <h3>
                  {item.name}
                </h3>

                <p>
                  {item.selectedColor} /{" "}
                  {item.selectedSize}
                </p>

                <p>
                  Qty: {item.quantity}
                </p>

              </div>

              <strong>
                ₹
                {item.price *
                  item.quantity}
              </strong>

            </div>

          ))}

          <div className="checkout-total">

            <span>
              Total
            </span>

            <strong>
              ₹{cartTotal}
            </strong>

          </div>

          <button
            className="pay-now-btn"
            onClick={handlePayment}
            disabled={loading}
          >
            {loading
              ? "Opening Payment..."
              : `Pay ₹${cartTotal}`}
          </button>

        </div>

      </div>

    </div>
  );
}

export default Checkout;