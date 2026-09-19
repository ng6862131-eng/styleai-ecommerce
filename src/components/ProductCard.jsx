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

  // Selected product options
  const [selectedColor, setSelectedColor] = useState(
    product.colors?.[0] || "Default"
  );

  const [selectedSize, setSelectedSize] = useState(
    product.sizes?.[0] || "Standard"
  );

  /* ================= STOCK ================= */

  const stock =
    product.stock !== undefined
      ? Number(product.stock)
      : null;

  const isOutOfStock =
    stock !== null && stock <= 0;

  const isLowStock =
    stock !== null &&
    stock > 0 &&
    stock <= 5;

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
    if (isOutOfStock) {
      return;
    }

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

  /* ================= COLOR DOT ================= */

  const getColorValue = (color) => {
    const colorName = String(color).toLowerCase();

    const colorMap = {
      black: "#111111",
      white: "#ffffff",
      blue: "#2563eb",
      red: "#dc2626",
      green: "#16a34a",
      beige: "#d8c3a5",
      yellow: "#eab308",
      pink: "#ec4899",
      purple: "#8b5cf6",
      grey: "#6b7280",
      gray: "#6b7280",
      brown: "#92400e",
      orange: "#f97316",
      navy: "#1e3a8a",
    };

    return (
      colorMap[colorName] || color
    );
  };

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

        {/* CATEGORY */}

        <span className="product-badge">
          {product.category}
        </span>

        {/* WISHLIST */}

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

        {/* ================= STOCK ================= */}

        {stock !== null && (
          <div
            className={`product-stock ${
              isOutOfStock
                ? "out-of-stock"
                : isLowStock
                ? "low-stock"
                : "in-stock"
            }`}
          >
            {isOutOfStock
              ? "Out of Stock"
              : isLowStock
              ? `Only ${stock} left`
              : `${stock} in stock`}
          </div>
        )}

        {/* ================= COLOR OPTIONS ================= */}

        {product.colors?.length > 0 && (
          <div className="product-color-section">

            <div className="product-color-title">
              <span>Color</span>

              <strong>
                {selectedColor}
              </strong>
            </div>

            <div className="product-color-options">

              {product.colors.map(
                (color, index) => (
                  <button
                    key={`${color}-${index}`}
                    type="button"
                    className={`product-color-option ${
                      selectedColor === color
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      setSelectedColor(color)
                    }
                    title={color}
                    aria-label={`Select ${color}`}
                  >
                    <span
                      className="product-color-dot"
                      style={{
                        backgroundColor:
                          getColorValue(color),
                      }}
                    />
                  </button>
                )
              )}

            </div>

          </div>
        )}

        {/* ================= SIZE OPTIONS ================= */}

        {product.sizes?.length > 0 && (
          <div className="product-size-section">

            <div className="product-size-title">
              <span>Size</span>

              <strong>
                {selectedSize}
              </strong>
            </div>

            <div className="product-size-options">

              {product.sizes.map(
                (size, index) => (
                  <button
                    key={`${size}-${index}`}
                    type="button"
                    className={`product-size-option ${
                      selectedSize === size
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      setSelectedSize(size)
                    }
                  >
                    {size}
                  </button>
                )
              )}

            </div>

          </div>
        )}

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
            } ${
              isOutOfStock
                ? "disabled"
                : ""
            }`}
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            title={
              isOutOfStock
                ? "Out of stock"
                : added
                ? "Added to cart"
                : "Add to cart"
            }
            aria-label={
              isOutOfStock
                ? "Out of stock"
                : added
                ? "Added to cart"
                : "Add to cart"
            }
          >
            {isOutOfStock ? (
              <span>×</span>
            ) : added ? (
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