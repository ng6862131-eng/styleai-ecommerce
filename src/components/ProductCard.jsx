import {
  FaStar,
  FaHeart,
  FaShoppingBag,
  FaArrowRight,
  FaTshirt,
  FaShoePrints,
  FaCheck,
  FaShoppingBag as FaBag,
} from "react-icons/fa";

import { Link } from "react-router-dom";
import { useState } from "react";

import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

/* =========================================================
   COLOUR VALUES
========================================================= */

const COLOR_MAP = {
  black: "#111111",
  white: "#ffffff",
  blue: "#2563eb",
  "dark blue": "#1e3a8a",
  navy: "#1e3a8a",
  "navy blue": "#1e3a8a",
  "light blue": "#93c5fd",
  red: "#dc2626",
  green: "#16a34a",
  olive: "#556b2f",
  "olive green": "#556b2f",
  beige: "#d8c3a5",
  maroon: "#7f1d1d",
  wine: "#6d1f3b",
  grey: "#6b7280",
  gray: "#6b7280",
  brown: "#92400e",
  yellow: "#eab308",
  pink: "#ec4899",
  purple: "#8b5cf6",
  orange: "#f97316",
  gold: "#d4af37",
  silver: "#cbd5e1",
  cream: "#f5efe1",
};

/* =========================================================
   GET COLOUR DOT
========================================================= */

const getColorValue = (color) => {
  return (
    COLOR_MAP[
      String(color || "")
        .trim()
        .toLowerCase()
    ] || "#9b5cff"
  );
};

/* =========================================================
   GET LOCAL CLOTHING IMAGE
========================================================= */

const getLocalColorImage = (
  product,
  selectedColor
) => {
  const color =
    String(selectedColor || "")
      .trim()
      .toLowerCase();

  const variantImage = Object.entries(product?.colorImages || {}).find(
    ([variantColor]) => variantColor.trim().toLowerCase() === color
  )?.[1];

  if (variantImage) {
    return variantImage;
  }
  return product?.image || "";
};

/* =========================================================
   COMPONENT
========================================================= */

function ProductCard({ product }) {
  const { addToCart } = useCart();

  const {
    toggleWishlist,
    isInWishlist,
  } = useWishlist();

  const [added, setAdded] =
    useState(false);

  const [imageError, setImageError] =
    useState(false);

  const [selectedColor, setSelectedColor] =
    useState(
      product?.colors?.[0] ||
        ""
    );

  const [selectedSize, setSelectedSize] =
    useState(
      product?.sizes?.[0] ||
        "Standard"
    );

  /* STOCK */

  const stock =
    product?.stock !== undefined &&
    product?.stock !== null
      ? Math.max(
          0,
          Number(product.stock) || 0
        )
      : null;

  const isOutOfStock =
    stock !== null &&
    stock <= 0;

  const isLowStock =
    stock !== null &&
    stock > 0 &&
    stock <= 5;

  /* IMAGE */

  const currentImage =
    getLocalColorImage(
      product,
      selectedColor
    );

  /* CATEGORY ICON */

  const getCategoryIcon = () => {
    if (
      product?.category === "Shoes"
    ) {
      return <FaShoePrints />;
    }

    if (
      product?.category ===
      "Accessories"
    ) {
      return <FaBag />;
    }

    return <FaTshirt />;
  };

  /* COLOUR CHANGE */

  const handleColorChange = (
    color
  ) => {
    setSelectedColor(color);
    setImageError(false);
  };

  /* ADD TO CART */

  const handleAddToCart = () => {
    if (isOutOfStock) return;

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

  /* WISHLIST */

  const handleWishlist = (
    event
  ) => {
    event.preventDefault();
    event.stopPropagation();

    toggleWishlist(product);
  };

  const liked =
    isInWishlist(product.id);

  return (
    <div className="product-card">

      {/* IMAGE */}

      <div className="product-image-container">

        <Link
          to={`/product/${product.id}`}
          className="product-image-link"
        >

          {imageError ||
          !currentImage ? (

            <div className="product-image-fallback">

              <div className="product-fallback-icon">
                {getCategoryIcon()}
              </div>

              <span>
                {product?.category ||
                  "Product"}
              </span>

              <small>
                Product image unavailable
              </small>

            </div>

          ) : (

            <img
              key={`${product.id}-${selectedColor}`}
              src={currentImage}
              alt={`${product.name} - ${selectedColor}`}
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
          {product?.category}
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
        >
          <FaHeart />
        </button>

      </div>

      {/* PRODUCT INFO */}

      <div className="product-info">

        <p className="product-category">
          {product?.category}
        </p>

        <Link
          to={`/product/${product.id}`}
          className="product-name-link"
        >
          <h3>
            {product?.name}
          </h3>
        </Link>

        {/* RATING */}

        <div className="product-rating">

          <span className="stars">
            <FaStar />
          </span>

          <span className="rating-number">
            {product?.rating ?? 0}
          </span>

          <span className="rating-text">
            / 5
          </span>

        </div>

        {/* STOCK */}

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

        {/* COLOUR */}

        {product?.colors?.length >
          0 && (

          <div className="product-color-section">

            <div className="product-color-title">

              <span>
                Colour
              </span>

              <strong>
                {selectedColor}
              </strong>

            </div>

            <div className="product-color-options">

              {product.colors.map(
                (
                  color,
                  index
                ) => (

                  <button
                    key={`${color}-${index}`}
                    type="button"
                    className={`product-color-option ${
                      selectedColor ===
                      color
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      handleColorChange(
                        color
                      )
                    }
                    title={`Select ${color}`}
                    aria-label={`Select ${color}`}
                  >

                    <span
                      className="product-color-dot"
                      style={{
                        backgroundColor:
                          getColorValue(
                            color
                          ),
                      }}
                    />

                    <span className="product-color-name">
                      {color}
                    </span>

                    {selectedColor ===
                      color && (
                      <FaCheck className="product-color-check" />
                    )}

                  </button>

                )
              )}

            </div>

          </div>

        )}

        {/* SIZE */}

        {product?.sizes?.length >
          0 && (

          <div className="product-size-section">

            <div className="product-size-title">

              <span>
                Size
              </span>

              <strong>
                {selectedSize}
              </strong>

            </div>

            <div className="product-size-options">

              {product.sizes.map(
                (
                  size,
                  index
                ) => (

                  <button
                    key={`${size}-${index}`}
                    type="button"
                    className={`product-size-option ${
                      selectedSize ===
                      size
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      setSelectedSize(
                        size
                      )
                    }
                  >
                    {size}
                  </button>

                )
              )}

            </div>

          </div>

        )}

        {/* PRICE */}

        <div className="product-bottom">

          <div className="product-price">

            <strong>
              ₹{product?.price ?? 0}
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
            onClick={
              handleAddToCart
            }
            disabled={
              isOutOfStock
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

        {/* DETAILS */}

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
