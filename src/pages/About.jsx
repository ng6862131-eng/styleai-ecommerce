import { Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaMagic,
  FaShoppingBag,
  FaTshirt,
  FaHeart,
} from "react-icons/fa";

function About() {
  return (
    <main className="about-page">

      {/* BACK TO HOME */}
      <Link to="/" className="about-back-home">
        <FaArrowLeft />
        Back to Home
      </Link>

      {/* HERO */}
      <section className="about-hero">
        <span className="about-eyebrow">
          ABOUT STYLEAI
        </span>

        <h1>
          Fashion shopping,
          <span> made personal.</span>
        </h1>

        <p>
          StyleAI is a modern fashion e-commerce platform that
          combines online shopping with AI-powered styling
          recommendations and personalized experiences.
        </p>
      </section>

      {/* FEATURES */}
      <section className="about-features">

        <div className="about-feature-card">
          <div className="about-feature-icon">
            <FaMagic />
          </div>

          <h2>AI-Powered Styling</h2>

          <p>
            Get personalized outfit recommendations based on
            your budget, occasion, colour and fashion preference.
          </p>
        </div>

        <div className="about-feature-card">
          <div className="about-feature-icon">
            <FaShoppingBag />
          </div>

          <h2>Easy Shopping</h2>

          <p>
            Browse products, manage your cart and wishlist,
            and complete your purchases through a simple interface.
          </p>
        </div>

        <div className="about-feature-card">
          <div className="about-feature-icon">
            <FaTshirt />
          </div>

          <h2>3D Customization</h2>

          <p>
            Personalize T-shirts using our interactive 3D
            customization studio with colours, patterns, text
            and uploaded images.
          </p>
        </div>

        <div className="about-feature-card">
          <div className="about-feature-icon">
            <FaHeart />
          </div>

          <h2>Personal Experience</h2>

          <p>
            StyleAI is designed to make fashion discovery
            easier, more personalized and more engaging.
          </p>
        </div>

      </section>

      {/* MISSION */}
      <section className="about-mission">

        <span>OUR MISSION</span>

        <h2>
          Helping everyone
          <em> discover their style.</em>
        </h2>

        <p>
          StyleAI brings fashion discovery, intelligent
          recommendations and personalization together in
          one platform. The goal is to help users find products
          and outfits that match their individual style and needs.
        </p>

        <Link to="/shop" className="about-shop-btn">
          Explore Collection
        </Link>

      </section>

    </main>
  );
}

export default About;