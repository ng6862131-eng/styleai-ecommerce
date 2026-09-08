import {
  FaStar,
  FaHeart,
  FaShoppingBag,
  FaArrowRight,
  FaTshirt,
  FaShoePrints,
  FaShoppingBag as FaBag,
} from "react-icons/fa";

import { Link } from "react-router-dom";
import { useState } from "react";

import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

function ProductCard({ product }) {
  const { addToCart } = useCart();

  const {
    toggleWishlist,
    isInWishlist,
  } = useWishlist();

  const [added, setAdded] = useState(false);
  const [imageError, setImageError] = useState(false);

  /* ================= CATEGORY ICON ================= */

  const getCategoryIcon = () => {
    if (product.category === "Shoes") {
      return <FaShoePrints />;
    }

    if (product.category === "Accessories") {
      return <FaBag />;
    }

    return <FaTshirt />;
  };

  /* ================= ADD TO CART ================= */

  const handleAddToCart = () => {
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

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  /* ================= WISHLIST ================= */

  const handleWishlist = (event) => {
    event.preventDefault();
    event.stopPropagation();

    toggleWishlist(product);
  };

  const liked = isInWishlist(product.id);

  return (
    <div className="product-card">

      {/* ================= IMAGE ================= */}

      <div className="product-image-container">

        <Link
          to={`/product/${product.id}`}
          className="product-image-link"
        >

          {imageError ? (

            <div className="product-image-fallback">

              <div className="product-fallback-icon">
                {getCategoryIcon()}
              </div>

              <span>
                {product.category}
              </span>

              <small>
                Image unavailable
              </small>

            </div>

          ) : (

            <img
              src={product.image}
              alt={product.name}
              className="product-image"
              loading="lazy"
              onError={() =>
                setImageError(true)
              }
            />

          )}

        </Link>

        {/* ================= CATEGORY ================= */}

        <span className="product-badge">
          {product.category}
        </span>

        {/* ================= WISHLIST ================= */}

        <button
          type="button"
          className={`wishlist-btn ${
            liked ? "liked" : ""
          }`}
          onClick={handleWishlist}
          aria-label={
            liked
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
          title={
            liked
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
        >
          <FaHeart />
        </button>

      </div>

      {/* ================= PRODUCT INFO ================= */}

      <div className="product-info">

        <p className="product-category">
          {product.category}
        </p>

        <Link
          to={`/product/${product.id}`}
          className="product-name-link"
        >
          <h3>
            {product.name}
          </h3>
        </Link>

        {/* ================= RATING ================= */}

        <div className="product-rating">

          <span className="stars">
            <FaStar />
          </span>

          <span className="rating-number">
            {product.rating}
          </span>

          <span className="rating-text">
            / 5
          </span>

        </div>

        {/* ================= PRICE + CART ================= */}

        <div className="product-bottom">

          <div className="product-price">

            <strong>
              ₹{product.price}
            </strong>

            <span>
              Free Delivery
            </span>

          </div>

          <button
            type="button"
            className={`add-cart-btn ${
              added ? "added" : ""
            }`}
            onClick={handleAddToCart}
            title={
              added
                ? "Added to cart"
                : "Add to cart"
            }
            aria-label={
              added
                ? "Added to cart"
                : "Add to cart"
            }
          >
            {added ? (
              <span>✓</span>
            ) : (
              <FaShoppingBag />
            )}
          </button>

        </div>

        {/* ================= VIEW DETAILS ================= */}

        <Link
          to={`/product/${product.id}`}
          className="view-product-btn"
        >
          <span>
            View Details
          </span>

          <FaArrowRight />
        </Link>

      </div>

    </div>
  );
}

export default ProductCard;