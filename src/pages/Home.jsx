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
    },
    {
      name: "Women",
      description: "Elegant looks for every mood.",
      icon: "👗",
      className: "women",
    },
    {
      name: "Shoes",
      description: "Finish every outfit perfectly.",
      icon: "👟",
      className: "shoes",
    },
    {
      name: "Accessories",
      description: "The details make the difference.",
      icon: "👜",
      className: "accessories",
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
              Discover the
              <span>
                style that is you.
              </span>
            </h1>

            <p>
              Shop smarter with AI-powered fashion
              recommendations built around your
              occasion, personality and budget.
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
                <strong>60+</strong>
                <span>Curated styles</span>
              </div>

              <div className="home-trust-divider"></div>

              <div className="home-trust-item">
                <strong>AI</strong>
                <span>Personal stylist</span>
              </div>

              <div className="home-trust-divider"></div>

              <div className="home-trust-item">
                <strong>4.8</strong>
                <span>Average rating</span>
              </div>

            </div>

          </div>

          <div className="home-hero-visual">

            <div className="home-visual-glow"></div>

            <div className="home-fashion-frame">

              <div className="home-fashion-image">

                <img
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=85"
                  alt="StyleAI fashion collection"
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
                  AI-powered fashion discovery
                </small>

              </div>

            </div>

            <div className="home-floating-card review-card">

              <div className="floating-icon">
                <FaStar />
              </div>

              <div>

                <strong>
                  4.8 / 5
                </strong>

                <span>
                  Loved by fashion seekers
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
                  Your personal stylist
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
                AI-Powered Styling
              </h3>

              <p>
                Get fashion suggestions based
                on your style, occasion and budget.
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
                Curated Collections
              </h3>

              <p>
                Explore hand-selected fashion pieces
                across categories and occasions.
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
              Tell StyleAI where you're going,
              what you love and how much you want
              to spend. Your personal AI stylist
              will help you find the right look.
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