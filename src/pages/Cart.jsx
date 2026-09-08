import { Link } from "react-router-dom";
import {
  FaTrash,
  FaMinus,
  FaPlus,
  FaMagic,
} from "react-icons/fa";

import { useCart } from "../context/CartContext";

function getTextColorName(color) {
  switch (color) {
    case "#ffffff":
      return "White";
    case "#111111":
      return "Black";
    case "#d4a72c":
      return "Gold";
    case "#e96b9a":
      return "Pink";
    default:
      return color || "Default";
  }
}

function Cart() {
  const {
    cartItems,
    cartTotal,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  /* =========================================================
     EMPTY CART
  ========================================================= */

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <div className="empty-cart-icon">
          <FaMagic />
        </div>

        <h1>Your Cart is Empty</h1>

        <p>
          Looks like you haven't added anything yet.
        </p>

        <Link to="/shop">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">

      {/* ================= BACK ================= */}

      <Link
        to="/"
        className="back-home"
      >
        ← Back to Home
      </Link>

      {/* ================= HEADER ================= */}

      <div className="cart-header">

        <p>
          STYLEAI SHOPPING BAG
        </p>

        <h1>
          Your Cart
        </h1>

        <span className="cart-item-count">
          {cartItems.length}{" "}
          {cartItems.length === 1
            ? "item"
            : "items"}{" "}
          in your bag
        </span>

      </div>

      {/* ================= MAIN LAYOUT ================= */}

      <div className="cart-layout">

        {/* ================= CART ITEMS ================= */}

        <div className="cart-items">

          {cartItems.map((item) => {

            const customization =
              item.customization;

            const isCustomized =
              Boolean(customization);

            return (
              <div
                className={`cart-item ${
                  isCustomized
                    ? "customized-cart-item"
                    : ""
                }`}
                key={`${item.id}-${item.selectedColor}-${item.selectedSize}-${customization?.text || ""}-${customization?.uploadedImageName || ""}`}
              >

                {/* =========================================
                    PRODUCT IMAGE
                ========================================= */}

                <div className="cart-item-image-wrap">

                 <img
                  src={
                    item.customization?.uploadedImage ||
                    item.image
                  }
                  alt={item.name}
                />

                  {isCustomized && (
                    <span className="cart-custom-badge">
                      <FaMagic />
                      Custom
                    </span>
                  )}

                </div>


                {/* =========================================
                    PRODUCT INFORMATION
                ========================================= */}

                <div className="cart-item-info">

                  <p className="cart-category">
                    {item.category}
                  </p>

                  <h2>
                    {item.name}
                  </h2>

                  <div className="cart-basic-details">

                    <span>
                      Colour:{" "}
                      {item.selectedColor ||
                        "Default"}
                    </span>

                    <span>
                      Size:{" "}
                      {item.selectedSize ||
                        "Standard"}
                    </span>

                  </div>


                  {/* =====================================
                      CUSTOMIZATION
                  ===================================== */}

                  {isCustomized && (
                    <div className="cart-customization">

                      <div className="cart-customization-title">
                        <FaMagic />
                        3D Customization
                      </div>

                      <div className="cart-customization-details">

                        <span>
                          Pattern:
                          <strong>
                            {customization.pattern ===
                            "stripes"
                              ? " Stripes"
                              : " Plain"}
                          </strong>
                        </span>

                        {customization.text && (
                          <span>
                            Text:
                            <strong>
                              {" "}
                              "{customization.text}"
                            </strong>
                          </span>
                        )}

                        {customization.textColor && (
                          <span>
                            Text Colour:
                            <strong>
                              {" "}
                              {getTextColorName(
                                customization.textColor
                              )}
                            </strong>
                          </span>
                        )}

                        {customization.uploadedImageName && (
                          <span>
                            Photo:
                            <strong>
                              {" "}
                              {customization.uploadedImageName}
                            </strong>
                          </span>
                        )}

                      </div>

                    </div>
                  )}


                  {/* =====================================
                      PRICE
                  ===================================== */}

                  <strong className="cart-item-price">
                    ₹{item.price}
                  </strong>

                </div>


                {/* =========================================
                    QUANTITY + REMOVE
                ========================================= */}

                <div className="cart-item-actions">

                  <div className="quantity-control">

                    <button
                      type="button"
                      onClick={() =>
                        decreaseQuantity(
                          item.id,
                          item.selectedColor,
                          item.selectedSize,
                          item.customization
                        )
                      }
                      aria-label="Decrease quantity"
                    >
                      <FaMinus />
                    </button>

                    <span>
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        increaseQuantity(
                          item.id,
                          item.selectedColor,
                          item.selectedSize,
                          item.customization
                        )
                      }
                      aria-label="Increase quantity"
                    >
                      <FaPlus />
                    </button>

                  </div>

                  <button
                    type="button"
                    className="remove-cart-btn"
                    onClick={() =>
                      removeFromCart(
                        item.id,
                        item.selectedColor,
                        item.selectedSize,
                        item.customization
                      )
                    }
                    title="Remove from cart"
                    aria-label="Remove from cart"
                  >
                    <FaTrash />
                  </button>

                </div>

              </div>
            );
          })}

        </div>


        {/* ================================================
            ORDER SUMMARY
        ================================================ */}

        <div className="cart-summary">

          <h2>
            Order Summary
          </h2>

          <div className="summary-row">

            <span>
              Items
            </span>

            <strong>
              {cartItems.reduce(
                (total, item) =>
                  total + item.quantity,
                0
              )}
            </strong>

          </div>

          <div className="summary-row">

            <span>
              Subtotal
            </span>

            <strong>
              ₹{cartTotal}
            </strong>

          </div>

          <div className="summary-row">

            <span>
              Delivery
            </span>

            <strong className="free-delivery">
              FREE
            </strong>

          </div>

          <hr />

          <div className="summary-total">

            <span>
              Total
            </span>

            <strong>
              ₹{cartTotal}
            </strong>

          </div>

          <Link
            to="/checkout"
            className="checkout-link"
          >
            Proceed to Checkout
          </Link>

          <Link
            to="/shop"
            className="continue-shopping"
          >
            Continue Shopping
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Cart;