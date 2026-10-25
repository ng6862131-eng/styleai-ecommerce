import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  Link,
  useNavigate,
} from "react-router-dom";

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

/* =========================================================
   COLOUR MAP
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

const getColorHex = (color) => {
  return (
    COLOR_MAP[
      String(color || "")
        .trim()
        .toLowerCase()
    ] || "#9b5cff"
  );
};

/* =========================================================
   LOCAL IMAGE FOR SHIRT / T-SHIRT
========================================================= */

const getLocalColorImage = (product, selectedColor) => {
  const color = String(selectedColor || "").trim().toLowerCase();

  const variantImage = Object.entries(product?.colorImages || {}).find(
    ([variantColor]) => variantColor.trim().toLowerCase() === color
  )?.[1];

  if (variantImage) {
    return variantImage;
  }
  return product?.image || "";
};

/* =========================================================
   PRODUCT DETAILS
========================================================= */

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart();

  const product = products.find(
    (item) =>
      item.id === Number(id)
  );

  const [colorSelection, setColorSelection] =
    useState({
      productId: product?.id,
      color: product?.colors?.[0] || "",
    });

  const selectedColor =
    colorSelection.productId === product?.id
      ? colorSelection.color
      : product?.colors?.[0] || "";

  const setSelectedColor = (color) => {
    setColorSelection({
      productId: product?.id,
      color,
    });
  };

  const [selectedSize, setSelectedSize] =
    useState(
      product?.sizes?.[0] ||
        "Standard"
    );

  const [quantity, setQuantity] =
    useState(1);

  const [liked, setLiked] =
    useState(false);

  const [added, setAdded] =
    useState(false);

  const [imageError, setImageError] =
    useState(false);

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

  const currentImage =
    getLocalColorImage(
      product,
      selectedColor
    );

  useEffect(() => {
    setImageError(false);
  }, [
    selectedColor,
    product?.id,
  ]);

  useEffect(() => {
    if (
      stock !== null &&
      stock > 0
    ) {
      setQuantity((current) =>
        Math.min(
          current,
          stock
        )
      );
    }
  }, [stock]);

  if (!product) {
    return (
      <div className="not-found">

        <div className="not-found-content">

          <span>
            STYLEAI
          </span>

          <h2>
            Product Not Found
          </h2>

          <p>
            Sorry, we couldn't find
            the product you're
            looking for.
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
    if (isOutOfStock) return;

    setQuantity((current) => {
      const next =
        current + 1;

      return stock !== null
        ? Math.min(
            next,
            stock
          )
        : Math.min(
            next,
            10
          );
    });
  };

  const decreaseQuantity = () => {
    setQuantity(
      (current) =>
        current > 1
          ? current - 1
          : 1
    );
  };

  const handleAddToCart = () => {
    if (isOutOfStock) {
      alert(
        "This product is currently out of stock."
      );
      return;
    }

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
    if (isOutOfStock) {
      alert(
        "This product is currently out of stock."
      );
      return;
    }

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

      {/* NAVIGATION */}

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

      {/* BREADCRUMB */}

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

      <main className="product-details">

        {/* IMAGE */}

        <section className="details-image-section">

          <div className="details-image-wrapper">

            {imageError ? (
              <div className="product-image-fallback">
                <div className="product-fallback-icon">
                  <FaShoppingBag />
                </div>
                <span>{product.category || "Product"}</span>
                <small>Image unavailable</small>
              </div>
            ) : (
              <img
                key={`${product.id}-${selectedColor}-${currentImage}`}
                src={currentImage}
                alt={`${product.name} in ${selectedColor}`}
                className="details-image"
                onError={() => setImageError(true)}
              />
            )}

            <span className="details-badge">
              {product.category}
            </span>

            <button
              type="button"
              className={`details-wishlist ${
                liked ? "liked" : ""
              }`}
              onClick={() =>
                setLiked(
                  (current) =>
                    !current
                )
              }
              aria-label={
                liked
                  ? "Remove from wishlist"
                  : "Add to wishlist"
              }
            >
              <FaHeart />
            </button>

          </div>

        </section>

        {/* INFORMATION */}

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
              Elevate your everyday
              wardrobe with this
              stylish and comfortable
              fashion piece. Designed
              for modern looks,
              effortless styling and
              everyday confidence.
            </p>

          </div>

          {/* COLOUR */}

          {product.colors?.length > 0 && (
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
                    type="button"
                    key={color}
                    className={`color-option ${
                      selectedColor ===
                      color
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedColor(
                        color
                      );
                      setImageError(false);
                    }}
                  >

                    <span
                      className="color-swatch"
                      style={{
                        backgroundColor:
                          getColorHex(
                            color
                          ),
                      }}
                    />

                    <span className="color-label">
                      {color}
                    </span>

                    {selectedColor ===
                      color && (
                      <FaCheck />
                    )}

                  </button>

                )
              )}

            </div>

          </div>
          )}

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
                    type="button"
                    key={size}
                    className={
                      selectedSize ===
                      size
                        ? "size-option selected"
                        : "size-option"
                    }
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

          {/* STOCK */}

          {stock !== null && (

            <div
              className={`details-stock ${
                isOutOfStock
                  ? "out-of-stock"
                  : stock <= 5
                  ? "low-stock"
                  : "in-stock"
              }`}
            >
              {isOutOfStock
                ? "Out of Stock"
                : stock <= 5
                ? `Only ${stock} left in stock`
                : `${stock} in stock`}
            </div>

          )}

          {/* QUANTITY */}

          <div className="quantity-section">

            <h3>
              Quantity
            </h3>

            <div className="quantity-control">

              <button
                type="button"
                onClick={
                  decreaseQuantity
                }
                disabled={
                  quantity <= 1
                }
              >
                −
              </button>

              <span>
                {quantity}
              </span>

              <button
                type="button"
                onClick={
                  increaseQuantity
                }
                disabled={
                  isOutOfStock ||
                  (
                    stock !== null &&
                    quantity >=
                      stock
                  )
                }
              >
                +
              </button>

            </div>

          </div>

          {/* BUTTONS */}

          <div className="details-buttons">

            <button
              type="button"
              className={`add-cart-large ${
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

              {added ? (
                <>
                  <FaCheck />
                  Added to Cart
                </>
              ) : (
                <>
                  <FaShoppingBag />

                  {isOutOfStock
                    ? "Out of Stock"
                    : "Add to Cart"}
                </>
              )}

            </button>

            <button
              type="button"
              className={`buy-now-btn ${
                isOutOfStock
                  ? "disabled"
                  : ""
              }`}
              onClick={
                handleBuyNow
              }
              disabled={
                isOutOfStock
              }
            >
              Buy Now
            </button>

            <Link
              to={`/customize/${product.id}`}
              className="customize-product-btn"
            >
              ✨ Customize in 3D
            </Link>

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
