import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import {
  FaStar,
  FaArrowLeft,
  FaHeart,
  FaShoppingBag,
  FaTruck,
  FaUndo,
  FaShieldAlt,
  FaCheck,
} from "react-icons/fa";

import products from "../data/products";
import { useCart } from "../context/CartContext";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart();

  const product = products.find(
    (item) => item.id === Number(id)
  );

  const [selectedColor, setSelectedColor] =
    useState(product?.colors?.[0] || "Default");

  const [selectedSize, setSelectedSize] =
    useState(product?.sizes?.[0] || "Standard");

  const [quantity, setQuantity] = useState(1);

  const [liked, setLiked] = useState(false);

  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="not-found">

        <div className="not-found-content">

          <span>STYLEAI</span>

          <h2>
            Product Not Found
          </h2>

          <p>
            Sorry, we couldn't find the product
            you're looking for.
          </p>

          <Link
            to="/shop"
            className="not-found-button"
          >
            <FaArrowLeft />
            Back to Shop
          </Link>

        </div>

      </div>
    );
  }

  const increaseQuantity = () => {
    setQuantity(
      (previousQuantity) =>
        previousQuantity + 1
    );
  };

  const decreaseQuantity = () => {
    setQuantity(
      (previousQuantity) =>
        previousQuantity > 1
          ? previousQuantity - 1
          : 1
    );
  };

  const handleAddToCart = () => {
    addToCart(
      product,
      selectedColor,
      selectedSize,
      quantity
    );

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 1800);
  };

  const handleBuyNow = () => {
    addToCart(
      product,
      selectedColor,
      selectedSize,
      quantity
    );

    navigate("/checkout");
  };

  return (
    <div className="product-details-page">

      {/* ================= TOP NAVIGATION ================= */}

      <div className="details-navigation">

        <Link
          to="/shop"
          className="details-back"
        >
          <FaArrowLeft />
          Back to Shop
        </Link>

        <Link
          to="/"
          className="details-home"
        >
          STYLEAI
        </Link>

      </div>

      {/* ================= BREADCRUMB ================= */}

      <div className="details-breadcrumb">

        <Link to="/">
          Home
        </Link>

        <span>/</span>

        <Link to="/shop">
          Shop
        </Link>

        <span>/</span>

        <span>
          {product.category}
        </span>

      </div>

      {/* ================= PRODUCT ================= */}

      <main className="product-details">

        {/* ================= IMAGE ================= */}

        <section className="details-image-section">

          <div className="details-image-wrapper">

            <img
              src={product.image}
              alt={product.name}
              className="details-image"
            />

            {/* CATEGORY */}

            <span className="details-badge">
              {product.category}
            </span>

            {/* WISHLIST */}

            <button
              className={`details-wishlist ${
                liked ? "liked" : ""
              }`}
              onClick={() =>
                setLiked(!liked)
              }
              aria-label="Add to wishlist"
            >
              <FaHeart />
            </button>

          </div>

          {/* IMAGE INFO */}

          <div className="image-caption">

            <span>
              STYLEAI EDIT
            </span>

            <span>
              Premium Collection
            </span>

          </div>

        </section>

        {/* ================= INFORMATION ================= */}

        <section className="details-info">

          <p className="details-category">
            {product.category}
          </p>

          <h1>
            {product.name}
          </h1>

          {/* RATING */}

          <div className="details-rating">

            <div className="details-stars">

              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />

            </div>

            <strong>
              {product.rating}
            </strong>

            <span>
              120 Reviews
            </span>

          </div>

          {/* PRICE */}

          <div className="details-price-box">

            <h2>
              ₹{product.price}
            </h2>

            <span>
              Inclusive of all taxes
            </span>

          </div>

          {/* DESCRIPTION */}

          <div className="details-description">

            <p>
              Elevate your everyday wardrobe
              with this stylish and comfortable
              fashion piece. Designed for modern
              looks, effortless styling and
              everyday confidence.
            </p>

          </div>

          {/* COLOR */}

          <div className="option-section">

            <div className="option-heading">

              <h3>
                Colour
              </h3>

              <span>
                {selectedColor}
              </span>

            </div>

            <div className="color-options">

              {product.colors?.map(
                (color) => (

                  <button
                    key={color}
                    className={
                      selectedColor === color
                        ? "color-option selected"
                        : "color-option"
                    }
                    onClick={() =>
                      setSelectedColor(color)
                    }
                  >
                    {color}

                    {selectedColor === color && (
                      <FaCheck />
                    )}

                  </button>

                )
              )}

            </div>

          </div>

          {/* SIZE */}

          <div className="option-section">

            <div className="option-heading">

              <h3>
                Size
              </h3>

              <span>
                {selectedSize}
              </span>

            </div>

            <div className="size-options">

              {product.sizes?.map(
                (size) => (

                  <button
                    key={size}
                    className={
                      selectedSize === size
                        ? "size-option selected"
                        : "size-option"
                    }
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

          {/* QUANTITY */}

          <div className="quantity-section">

            <h3>
              Quantity
            </h3>

            <div className="quantity-control">

              <button
                onClick={decreaseQuantity}
              >
                −
              </button>

              <span>
                {quantity}
              </span>

              <button
                onClick={increaseQuantity}
              >
                +
              </button>

            </div>

          </div>

          {/* ACTIONS */}

          <div className="details-buttons">

            <button
              className={`add-cart-large ${
                added ? "added" : ""
              }`}
              onClick={handleAddToCart}
            >

              {added ? (
                <>
                  <FaCheck />
                  Added to Cart
                </>
              ) : (
                <>
                  <FaShoppingBag />
                  Add to Cart
                </>
              )}

            </button>

            <button
              className="buy-now-btn"
              onClick={handleBuyNow}
            >
              Buy Now
            </button>

          </div>

          {/* BENEFITS */}

          <div className="product-benefits">

            <div className="benefit-item">

              <div className="benefit-icon">
                <FaTruck />
              </div>

              <div>
                <strong>
                  Free Delivery
                </strong>

                <span>
                  On orders above ₹999
                </span>
              </div>

            </div>

            <div className="benefit-item">

              <div className="benefit-icon">
                <FaUndo />
              </div>

              <div>
                <strong>
                  Easy Returns
                </strong>

                <span>
                  7 day return policy
                </span>
              </div>

            </div>

            <div className="benefit-item">

              <div className="benefit-icon">
                <FaShieldAlt />
              </div>

              <div>
                <strong>
                  Secure Payment
                </strong>

                <span>
                  Safe & protected checkout
                </span>
              </div>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default ProductDetails;