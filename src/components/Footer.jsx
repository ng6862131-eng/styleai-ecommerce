import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-main">
        <div className="site-footer-brand">
          <Link to="/" className="site-footer-logo">
            STYLE<span>AI</span>
          </Link>
          <p>
            Discover clothes, shoes and accessories, get outfit ideas,
            and create a T-shirt that feels like your own.
          </p>
        </div>

        <div className="site-footer-links">
          <h2>Explore</h2>
          <Link to="/shop">Shop the collection</Link>
          <Link to="/ai">AI Stylist</Link>
          <Link to="/customize/1">3D T-shirt studio</Link>
        </div>

        <div className="site-footer-links">
          <h2>StyleAI</h2>
          <Link to="/about">About us</Link>
          <Link to="/contact">Contact us</Link>
          <Link to="/seller/login">Seller portal</Link>
        </div>
      </div>

      <div className="site-footer-bottom">
        <span>© {new Date().getFullYear()} StyleAI</span>
        <span>Fashion discovery, made personal.</span>
      </div>
    </footer>
  );
}

export default Footer;