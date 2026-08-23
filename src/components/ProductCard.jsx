import {
  FaStar,
  FaHeart,
  FaShoppingBag,
} from "react-icons/fa";

import { Link } from "react-router-dom";

function ProductCard({ product }) {
  return (
    <div className="product-card">

      <div className="product-image-container">

        <Link to={`/product/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="product-image"
          />
        </Link>

        <button className="wishlist-btn">
          <FaHeart />
        </button>

      </div>

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

        <div className="product-rating">

          <FaStar />

          <span>
            {product.rating}
          </span>

        </div>

        <div className="product-bottom">

          <strong>
            ₹{product.price}
          </strong>

          <Link
            to={`/product/${product.id}`}
            className="add-cart-btn"
          >
            <FaShoppingBag />
          </Link>

        </div>

      </div>

    </div>
  );
}

export default ProductCard;