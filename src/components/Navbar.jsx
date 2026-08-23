import {
  FaSearch,
  FaShoppingBag,
  FaUser,
} from "react-icons/fa";

import { Link } from "react-router-dom";

import { useCart } from "../context/CartContext";

function Navbar() {
  const { cartCount } = useCart();

  return (
    <nav className="navbar">

      {/* LOGO */}

      <Link to="/" className="logo">
        STYLE<span>AI</span>
      </Link>

      {/* NAVIGATION */}

      <div className="nav-links">

        <Link to="/">
          Home
        </Link>

        <Link to="/shop">
          Shop
        </Link>

        <Link to="/ai">
          AI Stylist
        </Link>

        <Link to="/about">
          About
        </Link>

      </div>

      {/* ACTIONS */}

      <div className="nav-actions">

        <button className="icon-btn">
          <FaSearch />
        </button>

        <button className="icon-btn">
          <FaUser />
        </button>

        <Link
          to="/cart"
          className="cart-btn"
        >
          <FaShoppingBag />

          <span>
            {cartCount}
          </span>

        </Link>

      </div>

    </nav>
  );
}

export default Navbar;