import { Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaMagic,
  FaShoppingBag,
  FaTshirt,
  FaHeart,
  FaStore,
  FaUsers,
} from "react-icons/fa";
import Footer from "../components/Footer";

function About() {
  return (
    <>
      <main className="about-page">
        <Link to="/" className="about-back-home">
          <FaArrowLeft />
          Back to Home
        </Link>

        <section className="about-hero">
          <span className="about-eyebrow">ABOUT STYLEAI</span>
          <h1>
            Fashion shopping,
            <span> made personal.</span>
          </h1>
          <p>
            StyleAI brings clothing, shoes and accessories together with
            helpful outfit suggestions and simple customization tools.
            It helps shoppers find a look that fits their taste, occasion
            and budget.
          </p>
        </section>

        <section className="about-story">
          <span className="about-section-eyebrow">WHAT IS STYLEAI?</span>
          <h2>One place to find a look and make it your own.</h2>
          <p>
            A large catalogue can make choosing an outfit difficult.
            StyleAI makes that choice easier by letting people browse
            products, filter by details such as colour, save favourites,
            and ask the AI Stylist for suggestions. When someone wants
            something more personal, the 3D T-shirt studio lets them
            choose a colour, add text or a picture, and preview the design.
          </p>
          <p>
            The website also includes a seller portal where sellers can
            manage their store and review orders. These features bring the
            shopping and selling parts of fashion into one project.
          </p>
        </section>

        <section className="about-features">
          <div className="about-feature-card">
            <div className="about-feature-icon"><FaMagic /></div>
            <h2>AI-Powered Styling</h2>
            <p>
              Ask for ideas based on an occasion, colour, clothing choice
              or budget, then explore matching products.
            </p>
          </div>

          <div className="about-feature-card">
            <div className="about-feature-icon"><FaShoppingBag /></div>
            <h2>Easy Shopping</h2>
            <p>
              Browse products, save favourites to a wishlist, and collect
              selected items in a shopping cart.
            </p>
          </div>

          <div className="about-feature-card">
            <div className="about-feature-icon"><FaTshirt /></div>
            <h2>3D Customization</h2>
            <p>
              Create a personal T-shirt design with colour, pattern,
              custom text and an optional uploaded picture.
            </p>
          </div>

          <div className="about-feature-card">
            <div className="about-feature-icon"><FaHeart /></div>
            <h2>Made for Your Style</h2>
            <p>
              Find everyday clothing, shoes and accessories in one
              catalogue, with details to help compare your choices.
            </p>
          </div>
        </section>

        <section className="about-steps">
          <div className="about-section-heading">
            <span className="about-section-eyebrow">HOW IT WORKS</span>
            <h2>Three simple steps to a better find.</h2>
          </div>

          <div className="about-step-grid">
            <article className="about-step-card">
              <span>01</span>
              <h3>Tell us what you need</h3>
              <p>
                Choose a category or tell the AI Stylist your occasion,
                preferred colour and budget.
              </p>
            </article>
            <article className="about-step-card">
              <span>02</span>
              <h3>Explore and compare</h3>
              <p>
                Browse product photos, colours, sizes and prices. Save
                items you like or add them to your cart.
              </p>
            </article>
            <article className="about-step-card">
              <span>03</span>
              <h3>Personalize your choice</h3>
              <p>
                Use the 3D studio to customize a T-shirt and preview your
                design before adding it to your cart.
              </p>
            </article>
          </div>
        </section>

        <section className="about-audiences">
          <article className="about-audience-card">
            <div className="about-feature-icon"><FaUsers /></div>
            <span className="about-section-eyebrow">FOR SHOPPERS</span>
            <h2>Find pieces that feel right for you.</h2>
            <p>
              Use one place to discover products, get outfit ideas, save
              favourites and personalize a T-shirt.
            </p>
          </article>
          <article className="about-audience-card">
            <div className="about-feature-icon"><FaStore /></div>
            <span className="about-section-eyebrow">FOR SELLERS</span>
            <h2>Keep store tasks together.</h2>
            <p>
              The seller portal gives sellers a place to manage store
              information, view orders and review sales activity.
            </p>
          </article>
        </section>

        <section className="about-mission">
          <span>OUR MISSION</span>
          <h2>
            Helping everyone
            <em> discover their style.</em>
          </h2>
          <p>
            StyleAI aims to make fashion discovery clearer and more
            enjoyable. It combines product browsing, helpful suggestions
            and simple personalization so people can make choices with
            more confidence.
          </p>
          <Link to="/shop" className="about-shop-btn">
            Explore Collection
          </Link>
        </section>

        <section className="about-contact-cta">
          <div>
            <span className="about-section-eyebrow">NEED A HAND?</span>
            <h2>We’re here to help.</h2>
            <p>
              Send us a question about shopping, your account, an order or
              the seller portal.
            </p>
          </div>
          <Link to="/contact" className="about-shop-btn">
            Contact us
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default About;