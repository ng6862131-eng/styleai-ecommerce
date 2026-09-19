import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function SellerOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const sellerLoggedIn =
      localStorage.getItem("styleai-seller") === "true";

    if (!sellerLoggedIn) {
      navigate("/seller/login");
      return;
    }

    loadOrders();
  }, [navigate]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/seller/orders"
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to load orders."
        );
      }

      setOrders(data.orders || []);
    } catch (err) {
      console.error(err);
      setError(
        err.message ||
          "Unable to connect to the backend."
      );
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("styleai-seller");
    navigate("/seller/login");
  };

  if (loading) {
    return (
      <div className="seller-orders-page">
        <div className="seller-orders-loading">
          Loading Orders...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="seller-orders-page">
        <div className="seller-orders-error">
          <h2>Unable to Load Orders</h2>
          <p>{error}</p>

          <button onClick={loadOrders}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="seller-orders-page">

      {/* HEADER */}
      <header className="seller-dashboard-header">
        <div className="seller-dashboard-logo">
          STYLE<span>AI</span>
        </div>

       <div className="seller-header-right">

        <button
            className="seller-back-home-btn"
            onClick={() => navigate("/")}
        >
            ← Back to StyleAI
        </button>

        <button
            className="seller-back-dashboard-btn"
            onClick={() =>
            navigate("/seller/dashboard")
            }
        >
            Dashboard
        </button>

        <button
            className="seller-logout-btn"
            onClick={logout}
        >
            Logout
        </button>

        </div>
      </header>

      {/* CONTENT */}
      <main className="seller-orders-container">

        <div className="seller-orders-heading">
          <div>
            <p>STYLEAI STORE MANAGEMENT</p>
            <h1>All Orders</h1>
            <span>
              View and manage all completed customer
              purchases.
            </span>
          </div>

          <button
            className="seller-refresh-btn"
            onClick={loadOrders}
          >
            Refresh
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="seller-empty-orders-full">
            <h2>No orders yet</h2>
            <p>
              Completed purchases will appear here.
            </p>
          </div>
        ) : (
          <div className="seller-all-orders-card">

            <div className="seller-orders-count">
              {orders.length}{" "}
              {orders.length === 1
                ? "Order"
                : "Orders"}
            </div>

            <div className="seller-orders-table-container">

              <table className="seller-orders-table">

                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Payment</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => (

                    <tr key={order.id}>

                      <td>
                        <strong>
                          {order.id}
                        </strong>
                      </td>

                      <td>
                        <div className="seller-customer-cell">
                          <strong>
                            {order.customer?.name ||
                              "Customer"}
                          </strong>

                          <small>
                            {order.customer?.email ||
                              "-"}
                          </small>
                        </div>
                      </td>

                      <td>
                        {order.date}
                      </td>

                      <td>
                        <span className="seller-paid">
                          {order.paymentStatus ||
                            "Paid"}
                        </span>
                      </td>

                      <td>
                        {Array.isArray(order.items)
                          ? order.items.reduce(
                              (total, item) =>
                                total +
                                (Number(
                                  item.quantity
                                ) || 0),
                              0
                            )
                          : 0}
                      </td>

                      <td>
                        <strong>
                          ₹
                          {Number(
                            order.total || 0
                          ).toLocaleString("en-IN")}
                        </strong>
                      </td>

                      <td>
                        <button
                          onClick={() =>
                            navigate(
                              `/seller/orders/${order.id}`
                            )
                          }
                        >
                          View Details
                        </button>
                      </td>

                    </tr>

                  ))}
                </tbody>

              </table>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default SellerOrders;