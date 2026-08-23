import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { FaStar, FaArrowLeft } from "react-icons/fa";

import products from "../data/products";
import { useCart } from "../context/CartContext";

function ProductDetails() {
  const { id } = useParams();

  const { addToCart } = useCart();

  const product = products.find(
    (item) => item.id === Number(id)
  );

  const [selectedColor, setSelectedColor] = useState(
    product?.colors[0]
  );

  const [selectedSize, setSelectedSize] = useState(
    product?.sizes[0]
  );

  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="not-found">
        <h2>Product Not Found</h2>
<div className="details-navigation">

  <Link to="/" className="back-home">
    ← Back to Home
  </Link>

  <Link to="/shop" className="back-shop">
    <FaArrowLeft />
    Back to Shop
  </Link>

</div>
      </div>
    );
  }

  const increaseQuantity = () => {
    setQuantity((previousQuantity) => previousQuantity + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((previousQuantity) =>
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

    alert("Product added to cart!");
  };

  return (
    <div className="product-details-page">

      <Link to="/shop" className="back-shop">
        <FaArrowLeft />
        Back to Shop
      </Link>

      <div className="product-details">

        {/* PRODUCT IMAGE */}

        <div className="details-image-section">

          <img
            src={product.image}
            alt={product.name}
            className="details-image"
          />

        </div>

        {/* PRODUCT INFORMATION */}

        <div className="details-info">

          <p className="details-category">
            {product.category}
          </p>

          <h1>{product.name}</h1>

          <div className="details-rating">

            <FaStar />

            <span>
              {product.rating}
            </span>

            <span className="reviews">
              (120 Reviews)
            </span>

          </div>

          <h2 className="details-price">
            ₹{product.price}
          </h2>

          <p className="details-description">
            Elevate your everyday wardrobe with this
            stylish and comfortable fashion piece.
            Designed for modern looks and everyday
            confidence.
          </p>

          {/* COLOUR */}

          <div className="option-section">

            <h3>
              Colour:
              <span>{selectedColor}</span>
            </h3>

            <div className="color-options">

              {product.colors.map((color) => (
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
                </button>
              ))}

            </div>

          </div>

          {/* SIZE */}

          <div className="option-section">

            <h3>
              Size:
              <span>{selectedSize}</span>
            </h3>

            <div className="size-options">

              {product.sizes.map((size) => (
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
              ))}

            </div>

          </div>

          {/* QUANTITY */}

          <div className="quantity-section">

            <h3>Quantity</h3>

            <div className="quantity-control">

              <button onClick={decreaseQuantity}>
                −
              </button>

              <span>{quantity}</span>

              <button onClick={increaseQuantity}>
                +
              </button>

            </div>

          </div>

          {/* BUTTONS */}

          <div className="details-buttons">

            <button
              className="add-cart-large"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>

            <button className="buy-now-btn">
              Buy Now
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ProductDetails;