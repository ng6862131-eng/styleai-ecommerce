import { Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaHeart,
  FaTrash,
  FaShoppingBag,
} from "react-icons/fa";

import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

function Wishlist() {
  const {
    wishlistItems,
    removeFromWishlist,
  } = useWishlist();

  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    const selectedColor =
      product.colors?.[0] || "Default";

    const selectedSize =
      product.sizes?.[0] || "Standard";

    addToCart(
      product,
      selectedColor,
      selectedSize,
      1
    );
  };

  return (
    <div className="wishlist-page">

      <div className="wishlist-header">

        <Link
          to="/"
          className="wishlist-back"
        >
          <FaArrowLeft />
          Back to Home
        </Link>

        <Link
          to="/"
          className="wishlist-logo"
        >
          STYLE<span>AI</span>
        </Link>

      </div>

      <main className="wishlist-container">

        <div className="wishlist-title">

          <p>
            YOUR SAVED STYLE
          </p>

          <h1>
            My Wishlist
          </h1>

          <span>
            {wishlistItems.length === 0
              ? "Your favourite products will appear here."
              : `${wishlistItems.length} ${
                  wishlistItems.length === 1
                    ? "item"
                    : "items"
                } saved`}
          </span>

        </div>

        {wishlistItems.length === 0 ? (

          <div className="wishlist-empty">

            <div className="wishlist-empty-icon">
              <FaHeart />
            </div>

            <h2>
              Your wishlist is empty
            </h2>

            <p>
              Save the styles you love and
              find them here anytime.
            </p>

            <Link
              to="/shop"
              className="wishlist-shop-btn"
            >
              Explore Collection
            </Link>

          </div>

        ) : (

          <div className="wishlist-grid">

            {wishlistItems.map((product) => (

              <div
                className="wishlist-card"
                key={product.id}
              >

                <div className="wishlist-image">

                  <Link
                    to={`/product/${product.id}`}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                    />
                  </Link>

                  <button
                    className="wishlist-remove"
                    onClick={() =>
                      removeFromWishlist(
                        product.id
                      )
                    }
                    title="Remove from wishlist"
                  >
                    <FaTrash />
                  </button>

                </div>

                <div className="wishlist-info">

                  <p>
                    {product.category}
                  </p>

                  <Link
                    to={`/product/${product.id}`}
                  >
                    <h3>
                      {product.name}
                    </h3>
                  </Link>

                  <div className="wishlist-bottom">

                    <strong>
                      ₹{product.price}
                    </strong>

                    <button
                      className="wishlist-cart-btn"
                      onClick={() =>
                        handleAddToCart(product)
                      }
                      title="Add to cart"
                    >
                      <FaShoppingBag />
                    </button>

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

export default Wishlist;