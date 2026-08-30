import { Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaShoppingBag,
  FaCheckCircle,
} from "react-icons/fa";

function Order() {
  const savedOrders = localStorage.getItem(
    "styleai-orders"
  );

  const orders = savedOrders
    ? JSON.parse(savedOrders)
    : [];

  return (
    <div className="orders-page">

      {/* HEADER */}

      <div className="orders-header">

        <Link
          to="/profile"
          className="orders-back"
        >
          <FaArrowLeft />
          Back to Account
        </Link>

        <div className="orders-logo">
          STYLE<span>AI</span>
        </div>

      </div>

      {/* CONTENT */}

      <main className="orders-container">

        <div className="orders-title">

          <p>YOUR SHOPPING HISTORY</p>

          <h1>My Orders</h1>

          <span>
            View your StyleAI purchases and
            payment details.
          </span>

        </div>

        {/* NO ORDERS */}

        {orders.length === 0 ? (

          <div className="no-orders">

            <div className="no-orders-icon">
              <FaShoppingBag />
            </div>

            <h2>
              No orders yet
            </h2>

            <p>
              Your completed purchases will
              appear here.
            </p>

            <Link
              to="/shop"
              className="orders-shop-btn"
            >
              Start Shopping
            </Link>

          </div>

        ) : (

          <div className="orders-list">

            {orders
              .slice()
              .reverse()
              .map((order) => (

                <div
                  className="order-card"
                  key={order.id}
                >

                  {/* ORDER HEADER */}

                  <div className="order-card-header">

                    <div>

                      <span>
                        ORDER ID
                      </span>

                      <strong>
                        {order.id}
                      </strong>

                    </div>

                    <div className="order-status">

                      <FaCheckCircle />

                      Payment Successful

                    </div>

                  </div>

                  {/* PRODUCTS */}

                  <div className="order-products">

                    {order.items.map(
                      (item, index) => (

                        <div
                          className="order-product"
                          key={`${item.id}-${index}`}
                        >

                          <img
                            src={item.image}
                            alt={item.name}
                          />

                          <div className="order-product-info">

                            <h3>
                              {item.name}
                            </h3>

                            <p>
                              {item.selectedColor}
                              {" / "}
                              {item.selectedSize}
                            </p>

                            <span>
                              Qty: {item.quantity}
                            </span>

                          </div>

                          <strong>
                            ₹
                            {item.price *
                              item.quantity}
                          </strong>

                        </div>

                      )
                    )}

                  </div>

                  {/* ORDER DETAILS */}

                  <div className="order-details">

                    <div>

                      <span>
                        Order Date
                      </span>

                      <strong>
                        {order.date}
                      </strong>

                    </div>

                    <div>

                      <span>
                        Payment ID
                      </span>

                      <strong>
                        {order.paymentId}
                      </strong>

                    </div>

                    <div>

                      <span>
                        Total
                      </span>

                      <strong>
                        ₹{order.total}
                      </strong>

                    </div>

                  </div>

                </div>

              ))}

          </div>

        )}

      </main>

    </div>
  );
}

export default Order;