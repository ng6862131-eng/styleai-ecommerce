import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  FaSearch,
  FaSlidersH,
  FaChevronDown,
  FaArrowRight,
  FaTshirt,
  FaShoppingBag,
  FaShoePrints,
  FaStar,
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
    {
      name: "Men",
      description: "Modern styles for men",
      icon: <FaTshirt />,
      className: "men",
    },
    {
      name: "Women",
      description: "Trending fashion for women",
      icon: <FaTshirt />,
      className: "women",
    },
    {
      name: "Shoes",
      description: "Step into your style",
      icon: <FaShoePrints />,
      className: "shoes",
    },
    {
      name: "Accessories",
      description: "Complete your look",
      icon: <FaShoppingBag />,
      className: "accessories",
    },
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

  const clearFilters = () => {
    setCategory("All");
    setSearch("");
    setMaxPrice(3000);
    setSort("featured");
  };

  return (
    <div className="shop-page">

      {/* ================= TOP BAR ================= */}

      <div className="shop-topbar">

        <Link to="/" className="shop-back">
          ← Back to Home
        </Link>

        <span className="shop-top-label">
          STYLEAI / COLLECTION
        </span>

      </div>

      {/* ================= HERO ================= */}

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

        {/* HERO CIRCLE */}

        <div className="shop-hero-side">

          <div className="hero-circle">

            <div className="hero-circle-ring"></div>

            <span>
              STYLE
            </span>

            <strong>
              AI
            </strong>

          </div>

        </div>

      </section>

      {/* ================= SEARCH / CONTROLS ================= */}

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
              type="button"
              className="clear-search"
              onClick={() =>
                setSearch("")
              }
            >
              ×
            </button>
          )}

        </div>

        <button
          type="button"
          className={`filter-toggle ${
            showFilters ? "active" : ""
          }`}
          onClick={() =>
            setShowFilters(!showFilters)
          }
        >
          <FaSlidersH />
          Filters
        </button>

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

      {/* ================= FILTER PANEL ================= */}

      {showFilters && (
        <section className="shop-filter-panel">

          <div className="filter-title">

            <div>
              <span>
                Price Range
              </span>

              <small>
                Set your maximum budget
              </small>
            </div>

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

            <span>
              ₹399
            </span>

            <span>
              ₹3000
            </span>

          </div>

        </section>
      )}

      {/* ================= CATEGORIES ================= */}

      <section className="shop-categories">

        <div className="category-heading">

          <div>

            <span>
              EXPLORE
            </span>

            <h2>
              Shop by category
            </h2>

            <p>
              Find pieces that match your
              personality and everyday style.
            </p>

          </div>

          <div className="category-result">

            <strong>
              {filteredProducts.length}
            </strong>

            <span>
              products found
            </span>

          </div>

        </div>

        <div className="category-cards">

          {/* ALL */}

          <button
            type="button"
            className={`category-card all ${
              category === "All"
                ? "selected"
                : ""
            }`}
            onClick={() =>
              setCategory("All")
            }
          >

            <div className="category-card-icon">
              <FaStar />
            </div>

            <div className="category-card-content">

              <span>
                COLLECTION
              </span>

              <h3>
                All Styles
              </h3>

              <p>
                Explore the full StyleAI collection
              </p>

            </div>

            <div className="category-card-arrow">
              <FaArrowRight />
            </div>

          </button>

          {/* OTHER CATEGORIES */}

          {categories.map((item) => (

            <button
              type="button"
              key={item.name}
              className={`category-card ${item.className} ${
                category === item.name
                  ? "selected"
                  : ""
              }`}
              onClick={() =>
                setCategory(item.name)
              }
            >

              <div className="category-card-icon">
                {item.icon}
              </div>

              <div className="category-card-content">

                <span>
                  {item.name}
                </span>

                <h3>
                  {item.name}
                </h3>

                <p>
                  {item.description}
                </p>

              </div>

              <div className="category-card-arrow">
                <FaArrowRight />
              </div>

            </button>

          ))}

        </div>

      </section>

      {/* ================= ACTIVE FILTER ================= */}

      {(category !== "All" ||
        search ||
        maxPrice < 3000) && (

        <div className="active-filter-bar">

          <div>

            <span>
              Showing:
            </span>

            <strong>
              {category === "All"
                ? "All styles"
                : category}
            </strong>

            {search && (
              <>
                <span>
                  for
                </span>

                <strong>
                  "{search}"
                </strong>
              </>
            )}

          </div>

          <button
            type="button"
            onClick={clearFilters}
          >
            Clear all
          </button>

        </div>

      )}

      {/* ================= PRODUCTS ================= */}

      <section className="shop-products">

        <div className="products-section-header">

          <div>

            <span>
              STYLEAI COLLECTION
            </span>

            <h2>
              {category === "All"
                ? "Featured pieces"
                : `${category} collection`}
            </h2>

          </div>

          <small>
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1
              ? "item"
              : "items"}
          </small>

        </div>

        {filteredProducts.length > 0 ? (

          <div className="products-grid">

            {filteredProducts.map(
              (product, index) => (

                <div
                  className="shop-product-item"
                  key={product.id}
                  style={{
                    animationDelay:
                      `${index * 0.06}s`,
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

            <div className="no-products-number">
              0
            </div>

            <h2>
              No styles found
            </h2>

            <p>
              Try another search,
              category or price range.
            </p>

            <button
              type="button"
              onClick={clearFilters}
            >
              Explore All Styles
            </button>

          </div>

        )}

      </section>

    </div>
  );
}

export default Shop;