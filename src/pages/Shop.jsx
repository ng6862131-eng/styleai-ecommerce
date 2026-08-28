import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaSlidersH,
  FaChevronDown,
  FaArrowRight,
} from "react-icons/fa";

import ProductCard from "../components/ProductCard";
import products from "../data/products";

function Shop() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState(3000);
  const [sort, setSort] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    "All",
    "Men",
    "Women",
    "Shoes",
    "Accessories",
  ];

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (category !== "All") {
      result = result.filter(
        (product) => product.category === category
      );
    }

    if (search.trim()) {
      const searchText = search.toLowerCase();

      result = result.filter((product) =>
        `${product.name} ${product.category}`
          .toLowerCase()
          .includes(searchText)
      );
    }

    result = result.filter(
      (product) => product.price <= maxPrice
    );

    if (sort === "price-low") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sort === "price-high") {
      result.sort((a, b) => b.price - a.price);
    }

    if (sort === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [category, search, maxPrice, sort]);

  return (
    <div className="shop-page">

      {/* TOP BAR */}

      <div className="shop-topbar">

        <Link to="/" className="shop-back">
          ← Back to Home
        </Link>

        <span className="shop-top-label">
          STYLEAI / COLLECTION
        </span>

      </div>

      {/* HERO */}

      <section className="shop-hero">

        <div className="shop-hero-content">

          <span className="shop-eyebrow">
            THE STYLEAI EDIT
          </span>

          <h1>
            Find your
            <br />
            <span>signature style.</span>
          </h1>

          <p>
            Discover carefully selected pieces
            designed for every mood, moment
            and budget.
          </p>

          <div className="shop-hero-line">
            <span></span>

            <small>
              {products.length} curated pieces
            </small>
          </div>

        </div>

        <div className="shop-hero-side">

          <div className="hero-circle">
            <span>STYLE</span>
            <strong>AI</strong>
          </div>

        </div>

      </section>

      {/* SEARCH */}

      <section className="shop-controls">

        <div className="shop-search">

          <FaSearch />

          <input
            type="text"
            placeholder="Search shirts, dresses, shoes..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          {search && (
            <button
              onClick={() => setSearch("")}
            >
              ×
            </button>
          )}

        </div>

        {/* FILTER */}

        <button
          className="filter-toggle"
          onClick={() =>
            setShowFilters(!showFilters)
          }
        >
          <FaSlidersH />
          Filters
        </button>

        {/* SORT */}

        <div className="sort-wrapper">

          <FaChevronDown />

          <select
            value={sort}
            onChange={(e) =>
              setSort(e.target.value)
            }
          >
            <option value="featured">
              Featured
            </option>

            <option value="price-low">
              Price: Low to High
            </option>

            <option value="price-high">
              Price: High to Low
            </option>

            <option value="rating">
              Highest Rated
            </option>

          </select>

        </div>

      </section>

      {/* PRICE FILTER */}

      {showFilters && (

        <section className="shop-filter-panel">

          <div className="filter-title">

            <span>
              Maximum Price
            </span>

            <strong>
              ₹{maxPrice}
            </strong>

          </div>

          <input
            type="range"
            min="399"
            max="3000"
            step="100"
            value={maxPrice}
            onChange={(e) =>
              setMaxPrice(
                Number(e.target.value)
              )
            }
          />

          <div className="price-labels">
            <span>₹399</span>
            <span>₹3000</span>
          </div>

        </section>

      )}

      {/* CATEGORIES */}

      <section className="shop-categories">

        <div className="category-heading">

          <div>

            <span>
              EXPLORE
            </span>

            <h2>
              Shop by category
            </h2>

          </div>

          <p>
            {filteredProducts.length} products found
          </p>

        </div>

        <div className="category-pills">

          {categories.map((item) => (

            <button
              key={item}
              className={
                category === item
                  ? "category-pill active"
                  : "category-pill"
              }
              onClick={() =>
                setCategory(item)
              }
            >

              {item}

              {category === item && (
                <FaArrowRight />
              )}

            </button>

          ))}

        </div>

      </section>

      {/* PRODUCTS */}

      <section className="shop-products">

        {filteredProducts.length > 0 ? (

          <div className="products-grid">

            {filteredProducts.map(
              (product, index) => (

                <div
                  className="shop-product-item"
                  key={product.id}
                  style={{
                    animationDelay:
                      `${index * 0.05}s`,
                  }}
                >

                  <ProductCard
                    product={product}
                  />

                </div>

              )
            )}

          </div>

        ) : (

          <div className="no-products">

            <div>0</div>

            <h2>
              No styles found
            </h2>

            <p>
              Try another search or increase
              your price range.
            </p>

            <button
              onClick={() => {
                setSearch("");
                setCategory("All");
                setMaxPrice(3000);
              }}
            >
              Clear Filters
            </button>

          </div>

        )}

      </section>

    </div>
  );
}

export default Shop;