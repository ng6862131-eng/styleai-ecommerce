import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaStore,
  FaRupeeSign,
  FaShoppingBag,
  FaUsers,
  FaBoxOpen,
  FaSignOutAlt,
  FaEye,
  FaArrowLeft,
} from "react-icons/fa";

function SellerDashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  const retryDashboard = () => {
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
    const loadDashboard = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/seller/dashboard"
        );
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load dashboard.");
        }

        if (active) {
          setError("");
          setDashboard(data);
        }
      } catch (err) {
        console.error("Seller dashboard error:", err);
        if (active) {
          setError("Unable to connect to the StyleAI backend.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadDashboard();
    return () => {
      active = false;
    };
  }, [navigate, retryCount]);
  const logout = () => {
    localStorage.removeItem("styleai-seller");
    navigate("/seller/login");
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="seller-dashboard-page">
        <div className="seller-loading">
          <FaStore />
          <h2>Loading Seller Dashboard...</h2>
          <p>Please wait while your store data loads.</p>
        </div>
      </div>
    );
  }

  /* ================= ERROR ================= */

  if (error) {
    return (
      <div className="seller-dashboard-page">
        <div className="seller-error-card">
          <FaStore />

          <h2>Dashboard Error</h2>

          <p>{error}</p>

          <button
            className="seller-refresh-btn"
            onClick={retryDashboard}
          >
            Try Again
          </button>

          <button
            className="seller-back-home-btn"
            onClick={() => navigate("/")}
          >
            <FaArrowLeft />
            Back to StyleAI
          </button>
        </div>
      </div>
    );
  }

  const summary = dashboard?.summary || {};
  const recentOrders = dashboard?.recentOrders || [];

  return (
    <div className="seller-dashboard-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="seller-dashboard-header">

        <div
          className="seller-dashboard-logo"
          onClick={() => navigate("/seller/dashboard")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              navigate("/seller/dashboard");
            }
          }}
        >
          <FaStore />
          STYLE<span>AI</span>
        </div>

        <div className="seller-dashboard-header-right">

          <button
            className="seller-back-home-btn"
            onClick={() => navigate("/")}
            title="Back to StyleAI"
          >
            <FaArrowLeft />
            <span>Back to StyleAI</span>
          </button>

          <div className="seller-account-name">
            <strong>Seller Account</strong>
            <span>Store Manager</span>
          </div>

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

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="seller-dashboard-container">

        {/* PAGE HEADING */}

        <div className="seller-dashboard-heading">

          <div>
            <p>STYLEAI STORE MANAGEMENT</p>

            <h1>Seller Dashboard</h1>

            <span>
              Monitor orders, customers and store revenue.
            </span>
          </div>

          <button
            className="seller-refresh-btn"
            onClick={retryDashboard}
          >
            Refresh Data
          </button>

        </div>

        {/* =================================================
            STAT CARDS
        ================================================= */}

        <section className="seller-stat-grid">

          {/* REVENUE */}

          <div className="seller-stat-card">

            <div className="seller-stat-icon revenue">
              <FaRupeeSign />
            </div>

            <div>
              <span>Total Revenue</span>

              <strong>
                ₹
                {Number(
                  summary.revenue || 0
                ).toLocaleString("en-IN")}
              </strong>
            </div>

          </div>

          {/* ORDERS */}

          <div className="seller-stat-card">

            <div className="seller-stat-icon orders">
              <FaShoppingBag />
            </div>

            <div>
              <span>Total Orders</span>

              <strong>
                {Number(
                  summary.totalOrders || 0
                ).toLocaleString("en-IN")}
              </strong>
            </div>

          </div>

          {/* CUSTOMERS */}

          <div className="seller-stat-card">

            <div className="seller-stat-icon customers">
              <FaUsers />
            </div>

            <div>
              <span>Customers</span>

              <strong>
                {Number(
                  summary.uniqueCustomers || 0
                ).toLocaleString("en-IN")}
              </strong>
            </div>

          </div>

          {/* ITEMS */}

          <div className="seller-stat-card">

            <div className="seller-stat-icon products">
              <FaBoxOpen />
            </div>

            <div>
              <span>Items Sold</span>

              <strong>
                {Number(
                  summary.totalItems || 0
                ).toLocaleString("en-IN")}
              </strong>
            </div>

          </div>

        </section>

        {/* =================================================
            RECENT ORDERS
        ================================================= */}

        <section className="seller-orders-section">

          <div className="seller-section-heading">

            <div>
              <p>ORDER MANAGEMENT</p>

              <h2>Recent Orders</h2>
            </div>

            <button
              onClick={() =>
                navigate("/seller/orders")
              }
            >
              View All Orders
            </button>

          </div>

          {recentOrders.length === 0 ? (

            /* NO ORDERS */

            <div className="seller-empty-orders">

              <FaShoppingBag />

              <h3>No orders yet</h3>

              <p>
                Completed StyleAI purchases will appear
                here.
              </p>

            </div>

          ) : (

            /* ORDERS TABLE */

            <div className="seller-orders-table-wrap">

              <table className="seller-orders-table">

                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Payment</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {recentOrders.map((order) => (

                    <tr key={order.id}>

                      {/* ORDER ID */}

                      <td>
                        <strong>
                          {order.id}
                        </strong>
                      </td>

                      {/* CUSTOMER */}

                      <td>

                        <div className="seller-customer-cell">

                          <strong>
                            {order.customer?.name ||
                              "Customer"}
                          </strong>

                          <span>
                            {order.customer?.email ||
                              "-"}
                          </span>

                        </div>

                      </td>

                      {/* DATE */}

                      <td>
                        {order.date || "-"}
                      </td>

                      {/* PAYMENT */}

                      <td>

                        <span className="seller-paid-badge">
                          {order.paymentStatus ||
                            "Paid"}
                        </span>

                      </td>

                      {/* TOTAL */}

                      <td>

                        <strong>
                          ₹
                          {Number(
                            order.total || 0
                          ).toLocaleString("en-IN")}
                        </strong>

                      </td>

                      {/* VIEW */}

                      <td>

                        <button
                          className="seller-view-btn"
                          onClick={() =>
                            navigate(
                              `/seller/orders/${encodeURIComponent(
                                order.id
                              )}`
                            )
                          }
                          title="View Order"
                        >
                          <FaEye />
                          View
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </section>

        {/* =================================================
            REVENUE INFORMATION
        ================================================= */}

        <section className="seller-revenue-section">

          {/* GROSS SALES */}

          <div className="seller-revenue-card">

            <span>Gross Sales</span>

            <strong>
              ₹
              {Number(
                summary.grossSubtotal || 0
              ).toLocaleString("en-IN")}
            </strong>

          </div>

          {/* DISCOUNT */}

          <div className="seller-revenue-card">

            <span>Discount Given</span>

            <strong>
              ₹
              {Number(
                summary.discountGiven || 0
              ).toLocaleString("en-IN")}
            </strong>

          </div>

          {/* NET REVENUE */}

          <div className="seller-revenue-card">

            <span>Net Revenue</span>

            <strong>
              ₹
              {Number(
                summary.revenue || 0
              ).toLocaleString("en-IN")}
            </strong>

          </div>

        </section>

      </main>

    </div>
  );
}

export default SellerDashboard;