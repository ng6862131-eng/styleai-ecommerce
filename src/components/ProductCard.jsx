import {
  FaStar,
  FaHeart,
  FaShoppingBag,
  FaArrowRight,
} from "react-icons/fa";

import { Link } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
  const { addToCart } = useCart();

  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);

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

  const handleWishlist = () => {
    setLiked(!liked);
  };

  return (
    <div className="product-card">

      {/* ================= IMAGE ================= */}

      <div className="product-image-container">

        <Link
          to={`/product/${product.id}`}
          className="product-image-link"
        >
          <img
            src={product.image}
            alt={product.name}
            className="product-image"
          />
        </Link>

        {/* CATEGORY */}

        <span className="product-badge">
          {product.category}
        </span>

        {/* WISHLIST */}

        <button
          className={`wishlist-btn ${
            liked ? "liked" : ""
          }`}
          onClick={handleWishlist}
          aria-label="Add to wishlist"
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
          <h3>{product.name}</h3>
        </Link>

        {/* RATING */}

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

        {/* PRICE + CART */}

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
            className={`add-cart-btn ${
              added ? "added" : ""
            }`}
            onClick={handleAddToCart}
            title={
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

        {/* VIEW DETAILS */}

        <Link
          to={`/product/${product.id}`}
          className="view-product-btn"
        >
          View Details
          <FaArrowRight />
        </Link>

      </div>

    </div>
  );
}

export default ProductCard;