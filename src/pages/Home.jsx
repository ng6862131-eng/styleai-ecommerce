import { Link } from "react-router-dom";

import {
  FaArrowRight,
  FaStar,
  FaMagic,
  FaShoppingBag,
  FaChevronRight,
} from "react-icons/fa";

import Navbar from "../components/Navbar";
import AiChatbot from "../components/AiChatbot";

function Home() {
  const categories = [
    {
      name: "Men",
      description: "Sharp, relaxed and modern.",
      icon: "👔",
      className: "men",
      image: "/products/oversized-tshirt-blue.jpeg",
    },
    {
      name: "Women",
      description: "Elegant looks for every mood.",
      icon: "👗",
      className: "women",
      image: "/products/blazer-women-beige.png",
    },
    {
      name: "Shoes",
      description: "Finish every outfit perfectly.",
      icon: "👟",
      className: "shoes",
      image: "/products/shoe-runner-black.jpg",
    },
    {
      name: "Accessories",
      description: "The details make the difference.",
      icon: "👜",
      className: "accessories",
      image: "/products/jewelry-earrings-gold.jpg",
    },
  ];

  return (
    <>
      <Navbar />

      <main>

        {/* =================================================
            HERO
        ================================================= */}

        <section className="home-hero">

          <div className="home-hero-orb orb-one"></div>
          <div className="home-hero-orb orb-two"></div>

          <div className="home-hero-content">

            <div className="home-eyebrow">
              <span></span>
              STYLE • AI • FASHION
            </div>

            <h1>
              Find your next
              <span>
                favourite look.
              </span>
            </h1>

            <p>
              Explore clothing, shoes and accessories. Find products by
              colour, occasion or budget, then create a custom T-shirt in
              the 3D studio.
            </p>

            <div className="home-hero-buttons">

              <Link
                to="/shop"
                className="home-primary-btn"
              >
                Explore Collection
                <FaArrowRight />
              </Link>

              <Link
                to="/ai"
                className="home-secondary-btn"
              >
                <FaMagic />
                Ask StyleAI
              </Link>

            </div>

            <div className="home-trust-row">

              <div className="home-trust-item">
                <strong>4</strong>
                <span>Collections</span>
              </div>

              <div className="home-trust-divider"></div>

              <div className="home-trust-item">
                <strong>Style</strong>
                <span>Product matches</span>
              </div>

              <div className="home-trust-divider"></div>

              <div className="home-trust-item">
                <strong>3D</strong>
                <span>T-shirt studio</span>
              </div>

            </div>

          </div>

          <div className="home-hero-visual">

            <div className="home-visual-glow"></div>

            <div className="home-fashion-frame">

              <div className="home-fashion-image">

                <img
                  src="/products/casual-denim-jacket-black.webp"
                  alt="Model wearing a black denim jacket"
                />

                <div className="home-image-overlay"></div>

              </div>

              <div className="home-fashion-caption">

                <span>
                  STYLEAI EDIT
                </span>

                <strong>
                  Wear Your
                  <br />
                  Confidence.
                </strong>

                <small>
                  Everyday pieces, your way
                </small>

              </div>

            </div>

            <div className="home-floating-card home-curation-card">

              <div className="floating-icon">
                <FaShoppingBag />
              </div>

              <div>

                <strong>
                  Shop your way
                </strong>

                <span>
                  Filter by colour or occasion
                </span>

              </div>

            </div>

            <div className="home-floating-card ai-mini-card">

              <div className="floating-ai-icon">
                <FaMagic />
              </div>

              <div>

                <strong>
                  StyleAI
                </strong>

                <span>
                  Product suggestions
                </span>

              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            SHOP BY CATEGORY
        ================================================= */}

        <section className="home-categories">

          <div className="home-section-heading">

            <div>

              <span>
                EXPLORE
              </span>

              <h2>
                Find your style
              </h2>

            </div>

            <p>
              Discover fashion collections
              made for every version of you.
            </p>

          </div>

          <div className="home-category-grid">

            {categories.map((category) => (

              <Link
                key={category.name}
                to={`/shop?category=${category.name}`}
                className={`home-category-card ${category.className}`}
              >

                <img
                  className="home-category-image"
                  src={category.image}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                />

                <div className="home-category-top">

                  <span className="home-category-icon">
                    {category.icon}
                  </span>

                  <span className="home-category-arrow">
                    <FaArrowRight />
                  </span>

                </div>

                <div className="home-category-content">

                  <span>
                    COLLECTION
                  </span>

                  <h3>
                    {category.name}
                  </h3>

                  <p>
                    {category.description}
                  </p>

                </div>

                <div className="home-category-line"></div>

              </Link>

            ))}

          </div>

        </section>

        {/* =================================================
            WHY STYLEAI
        ================================================= */}

        <section className="home-features">

          <div className="home-feature-heading">

            <span>
              WHY STYLEAI
            </span>

            <h2>
              Fashion shopping,
              <br />
              <em>made personal.</em>
            </h2>

          </div>

          <div className="home-feature-grid">

            <div className="home-feature">

              <div className="feature-number">
                01
              </div>

              <div className="feature-icon">
                <FaMagic />
              </div>

              <h3>
                Personalised Picks
              </h3>

              <p>
                Find matching products using your colour,
                occasion and budget choices.
              </p>

            </div>

            <div className="home-feature">

              <div className="feature-number">
                02
              </div>

              <div className="feature-icon">
                <FaShoppingBag />
              </div>

              <h3>
                Easy Shopping
              </h3>

              <p>
                Discover products, manage your
                wishlist and build your perfect cart.
              </p>

            </div>

            <div className="home-feature">

              <div className="feature-number">
                03
              </div>

              <div className="feature-icon">
                <FaStar />
              </div>

              <h3>
                Fashion in One Place
              </h3>

              <p>
                Browse clothing, shoes and accessories
                together in one collection.
              </p>

            </div>

          </div>

        </section>

        {/* =================================================
            3D T-SHIRT CUSTOM STUDIO
        ================================================= */}

        <section className="home-3d-section">

          <div className="home-3d-visual">

            <div className="home-3d-glow"></div>

            <div className="home-3d-card">

              <div className="home-3d-card-top">

                <span>
                  3D T-SHIRT STUDIO
                </span>

                <span className="home-3d-dot"></span>

              </div>

              <div className="home-3d-shirt">

                <div className="shirt-body">

                  <div className="shirt-neck"></div>

                  <div className="shirt-sleeve left"></div>

                  <div className="shirt-sleeve right"></div>

                  <span>
                    STYLEAI
                  </span>

                </div>

              </div>

              <div className="home-3d-rotate">
                Interactive 3D customization
              </div>

            </div>

          </div>

          <div className="home-3d-content">

            <span className="home-3d-label">
              ✨ STYLEAI CUSTOM STUDIO
            </span>

            <h2>
              Design your
              <em> T-shirt.</em>
            </h2>

            <p>
              Create a personalized T-shirt using
              interactive 3D customization. Choose
              your colour, pattern, custom text and
              text colour, then preview your design
              before adding it to your cart.
            </p>

            <div className="home-3d-features">

              <span>
                🎨 Custom Colours
              </span>

              <span>
                ✦ Patterns
              </span>

              <span>
                ✍ Custom Text
              </span>

              <span>
                ↻ 3D Rotation
              </span>

              <span>
                📏 Size Selection
              </span>

            </div>

            <div className="home-3d-buttons">

              <Link
                to="/customize/1"
                className="home-3d-primary"
              >
                Customize T-Shirt
                <FaArrowRight />
              </Link>

            </div>

          </div>

        </section>

        {/* =================================================
            AI STYLIST
        ================================================= */}

        <section className="home-ai-section">

          <div className="home-ai-background-circle"></div>

          <div className="home-ai-copy">

            <span className="home-ai-label">
              <FaMagic />
              YOUR PERSONAL STYLIST
            </span>

            <h2>
              Don't know what
              <span>
                to wear?
              </span>
            </h2>

            <p>
              Share an occasion, colour, category or budget.
              StyleAI filters the catalogue and suggests
              matching products and outfit combinations.
            </p>

            <Link
              to="/ai"
              className="home-ai-btn"
            >
              Try StyleAI
              <FaArrowRight />
            </Link>

          </div>

          <div className="home-ai-chat-preview">

            <div className="home-ai-chat-header">

              <div className="home-ai-status"></div>

              <div>

                <strong>
                  StyleAI Stylist
                </strong>

                <span>
                  Online • Ready to help
                </span>

              </div>

            </div>

            <div className="home-ai-chat-message user-message">
              Suggest me a party outfit
              under ₹3000
            </div>

            <div className="home-ai-chat-message bot-message">

              <span>
                ✨
              </span>

              I've got a few looks
              in mind for you.

            </div>

            <div className="home-ai-suggestion-row">

              <span>
                Party
              </span>

              <span>
                Under ₹3000
              </span>

              <span>
                Trending
              </span>

            </div>

            <div className="home-ai-input">

              <span>
                Ask your stylist...
              </span>

              <button type="button">
                <FaArrowRight />
              </button>

            </div>

          </div>

        </section>

        {/* =================================================
            FINAL CTA
        ================================================= */}

        <section className="home-final-cta">

          <div>

            <span>
              READY TO FIND YOUR STYLE?
            </span>

            <h2>
              Your next favourite
              <br />
              <em>look starts here.</em>
            </h2>

            <Link
              to="/shop"
              className="home-cta-btn"
            >
              Shop the Collection
              <FaChevronRight />
            </Link>

          </div>

        </section>

        <AiChatbot />

      </main>
    </>
  );
}

export default Home;
