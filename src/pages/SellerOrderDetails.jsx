
import { useNavigate, useParams } from "react-router-dom";
import {
  FaStore,
  FaArrowLeft,
  FaSignOutAlt,
  FaCheckCircle,
  FaUser,
  FaCreditCard,
  FaBoxOpen,
  FaFileInvoice,
} from "react-icons/fa";
import { useEffect, useState } from "react";

function SellerOrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [loadedOrderId, setLoadedOrderId] = useState("");

  const retryOrder = () => {
    setError("");
    setLoading(true);
    setRetryCount((count) => count + 1);
  };

  useEffect(() => {
    const sellerLoggedIn =
      localStorage.getItem("styleai-seller") === "true";

    if (!sellerLoggedIn) {
      navigate("/seller/login");
      return;
    }

    let active = true;
    const decodedOrderId = decodeURIComponent(orderId || "");
    const request = decodedOrderId
      ? fetch(
          `http://localhost:5000/seller/orders/${encodeURIComponent(decodedOrderId)}`
        )
      : Promise.reject(new Error("Order ID is missing."));

    request
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load order.");
        }
        return data.order;
      })
      .then((nextOrder) => {
        if (active) {
          setError("");
          setOrder(nextOrder);
          setLoadedOrderId(orderId || "");
        }
      })
      .catch((err) => {
        console.error("Seller order details error:", err);
        if (active) {
          setError(err.message || "Unable to connect to backend.");
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [orderId, navigate, retryCount]);
  const logout = () => {
    localStorage.removeItem("styleai-seller");
    navigate("/seller/login");
  };

  const backToDashboard = () => {
    navigate("/seller/dashboard");
  };

  const backToStyleAI = () => {
    navigate("/");
  };

  if (loading || (!error && loadedOrderId !== (orderId || ""))) {
    return (
      <div className="seller-order-details-page">
        <div className="seller-order-status-card">
          <FaBoxOpen />
          <h2>Loading Order...</h2>
          <p>Please wait while the order details are loaded.</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="seller-order-details-page">
        <div className="seller-order-status-card">
          <h2>Order Error</h2>
          <p>{error || "Order details could not be found."}</p>

          <div className="seller-status-actions">
            <button
              className="seller-refresh-btn"
              onClick={retryOrder}
            >
              Try Again
            </button>

            <button
              className="seller-back-home-btn"
              onClick={backToDashboard}
            >
              <FaArrowLeft />
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="seller-order-details-page">
      <header className="seller-dashboard-header">
        <div
          className="seller-dashboard-logo"
          onClick={backToDashboard}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              backToDashboard();
            }
          }}
        >
          <FaStore />
          STYLE<span>AI</span>
        </div>

        <div className="seller-header-right">
          <button
            className="seller-back-home-btn"
            onClick={backToStyleAI}
            title="Back to StyleAI"
          >
            <FaArrowLeft />
            <span>Back to StyleAI</span>
          </button>

          <button
            className="seller-back-dashboard-btn"
            onClick={backToDashboard}
          >
            Dashboard
          </button>

          <button
            className="seller-logout-btn"
            onClick={logout}
            title="Logout"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <main className="seller-order-details-container">
        <button
          className="seller-back-order-btn"
          onClick={backToDashboard}
        >
          <FaArrowLeft />
          Back to Orders
        </button>

        <div className="seller-order-details-header">
          <div>
            <p>ORDER DETAILS</p>
            <h1>{order.id}</h1>
            <span>Order Date: {order.date || "-"}</span>
          </div>

          <div className="seller-order-paid">
            <FaCheckCircle />
            {order.paymentStatus || "Paid"}
          </div>
        </div>

        <div className="seller-order-details-grid">
          <section className="seller-detail-card">
            <div className="seller-detail-card-title">
              <FaUser />
              <h2>Customer Information</h2>
            </div>

            <div className="seller-detail-row">
              <span>Name</span>
              <strong>{order.customer?.name || "-"}</strong>
            </div>

            <div className="seller-detail-row">
              <span>Email</span>
              <strong>{order.customer?.email || "-"}</strong>
            </div>

            <div className="seller-detail-row">
              <span>Phone</span>
              <strong>{order.customer?.phone || "-"}</strong>
            </div>

            <div className="seller-detail-row">
              <span>Shipping Address</span>
              <strong>{order.customer?.address || "-"}</strong>
            </div>
          </section>

          <section className="seller-detail-card">
            <div className="seller-detail-card-title">
              <FaCreditCard />
              <h2>Payment Information</h2>
            </div>

            <div className="seller-detail-row">
              <span>Status</span>
              <strong className="seller-payment-success">
                {order.paymentStatus || "Paid"}
              </strong>
            </div>

            <div className="seller-detail-row">
              <span>Payment ID</span>
              <strong>{order.paymentId || "-"}</strong>
            </div>

            <div className="seller-detail-row">
              <span>Razorpay Order ID</span>
              <strong>{order.razorpayOrderId || "-"}</strong>
            </div>

            {order.couponCode && (
              <div className="seller-detail-row">
                <span>Coupon Applied</span>
                <strong>{order.couponCode}</strong>
              </div>
            )}
          </section>
        </div>

        <section className="seller-detail-card seller-products-card">
          <div className="seller-detail-card-title">
            <FaBoxOpen />
            <h2>Products</h2>
          </div>

          <div className="seller-product-list">
            {Array.isArray(order.items) && order.items.length > 0 ? (
              order.items.map((item, index) => {
                const quantity = Number(item.quantity) || 1;
                const itemTotal =
                  (Number(item.price) || 0) * quantity;

                return (
                  <div
                    className="seller-product-item"
                    key={`${item.id || "item"}-${index}`}
                  >
                    <div className="seller-product-image-wrap">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name || "Product"}
                        />
                      ) : (
                        <div className="seller-product-image-placeholder">
                          <FaBoxOpen />
                        </div>
                      )}
                    </div>

                    <div className="seller-product-info">
                      <h3>{item.name || "Product"}</h3>

                      {item.selectedColor && (
                        <p>
                          Color: {item.selectedColor}
                        </p>
                      )}

                      <p>
                        Size: {item.selectedSize || "-"}
                      </p>

                      <p>Quantity: {quantity}</p>

                      {item.customization && (
                        <span className="seller-customized-badge">
                          Customized T-Shirt
                        </span>
                      )}
                    </div>

                    <strong>
                      ₹{itemTotal.toLocaleString("en-IN")}
                    </strong>
                  </div>
                );
              })
            ) : (
              <div className="seller-no-products">
                <FaBoxOpen />
                <p>No product information available.</p>
              </div>
            )}
          </div>
        </section>

        <section className="seller-total-card">
          <div>
            <span>Subtotal</span>
            <strong>
              ₹
              {Number(order.subtotal || 0).toLocaleString("en-IN")}
            </strong>
          </div>

          <div>
            <span>Discount</span>
            <strong className="seller-discount">
              - ₹
              {Number(order.discount || 0).toLocaleString("en-IN")}
            </strong>
          </div>

          {order.couponCode && (
            <div>
              <span>Coupon</span>
              <strong>{order.couponCode}</strong>
            </div>
          )}

          <div className="seller-final-total">
            <span>Total Paid</span>
            <strong>
              ₹{Number(order.total || 0).toLocaleString("en-IN")}
            </strong>
          </div>
        </section>

        <section className="seller-invoice-note">
          <FaFileInvoice />

          <div>
            <strong>Invoice Generated</strong>
            <span>
              A PDF invoice was generated for this order.
              The customer receipt is sent to the registered
              email address after successful payment.
            </span>
          </div>
        </section>
      </main>
    </div>
  );
}

export default SellerOrderDetails;
