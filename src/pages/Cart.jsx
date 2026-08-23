import { Link } from "react-router-dom";
import { FaTrash, FaMinus, FaPlus } from "react-icons/fa";

import { useCart } from "../context/CartContext";

function Cart() {
  const {
    cartItems,
    cartTotal,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
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
        <Link to="/" className="back-home">
  ← Back to Home
</Link>

      <div className="cart-header">
        <p>STYLEAI SHOPPING BAG</p>

        <h1>Your Cart</h1>
      </div>

      <div className="cart-layout">

        <div className="cart-items">

          {cartItems.map((item) => (

            <div
              className="cart-item"
              key={`${item.id}-${item.selectedColor}-${item.selectedSize}`}
            >

              <img
                src={item.image}
                alt={item.name}
              />

              <div className="cart-item-info">

                <p>{item.category}</p>

                <h2>{item.name}</h2>

                <span>
                  Colour: {item.selectedColor}
                </span>

                <span>
                  Size: {item.selectedSize}
                </span>

                <strong>
                  ₹{item.price}
                </strong>

              </div>

              <div className="cart-item-actions">

                <div className="quantity-control">

                  <button
                    onClick={() =>
                      decreaseQuantity(
                        item.id,
                        item.selectedColor,
                        item.selectedSize
                      )
                    }
                  >
                    <FaMinus />
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() =>
                      increaseQuantity(
                        item.id,
                        item.selectedColor,
                        item.selectedSize
                      )
                    }
                  >
                    <FaPlus />
                  </button>

                </div>

                <button
                  className="remove-cart-btn"
                  onClick={() =>
                    removeFromCart(
                      item.id,
                      item.selectedColor,
                      item.selectedSize
                    )
                  }
                >
                  <FaTrash />
                </button>

              </div>

            </div>

          ))}

        </div>

        <div className="cart-summary">

          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Subtotal</span>
            <strong>₹{cartTotal}</strong>
          </div>

          <div className="summary-row">
            <span>Delivery</span>
            <strong>FREE</strong>
          </div>

          <hr />

          <div className="summary-total">
            <span>Total</span>
            <strong>₹{cartTotal}</strong>
          </div>

         <Link to="/checkout">
  <button className="checkout-btn">
    Proceed to Checkout
  </button>
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