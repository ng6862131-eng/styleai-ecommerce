import { useState } from "react";
import { Link } from "react-router-dom";

import ProductCard from "../components/ProductCard";
import products from "../data/products";

function Shop() {
  const [category, setCategory] = useState("All");

  const categories = [
    "All",
    "Men",
    "Women",
    "Shoes",
    "Accessories",
  ];

  const filteredProducts =
    category === "All"
      ? products
      : products.filter(
          (product) => product.category === category
        );

  return (
    <div className="shop-page">

      {/* BACK TO HOME */}

      <Link to="/" className="back-home">
        ← Back to Home
      </Link>

      <div className="shop-header">

        <p>STYLEAI COLLECTION</p>

        <h1>Shop Your Style</h1>

        <span>
          Discover fashion selected for your lifestyle.
        </span>

      </div>

      <div className="category-filter">

        {categories.map((item) => (
          <button
            key={item}
            className={
              category === item ? "active" : ""
            }
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}

      </div>

      <div className="products-grid">

        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}

      </div>

    </div>
  );
}

export default Shop;