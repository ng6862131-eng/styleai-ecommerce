import {
  FaSearch,
  FaShoppingBag,
  FaUser,
  FaHeart,
} from "react-icons/fa";

import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Navbar() {
  const { cartCount } = useCart();

  return (
    <nav className="navbar">

      <Link to="/" className="logo">
        STYLE<span>AI</span>
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>

        <Link to="/shop">Shop</Link>

        <Link to="/ai">AI Stylist</Link>

        <Link to="/about">About</Link>
      </div>

      <div className="nav-actions">

        <Link
          to="/shop"
          className="icon-btn"
          title="Search"
        >
          <FaSearch />
        </Link>

        <Link
          to="/wishlist"
          className="icon-btn"
          title="Wishlist"
        >
          <FaHeart />
        </Link>

        <Link
          to="/login"
          className="icon-btn"
          title="Login"
        >
          <FaUser />
        </Link>

        <Link
          to="/cart"
          className="cart-btn"
          title="Cart"
        >
          <FaShoppingBag />

          <span>{cartCount}</span>
        </Link>

      </div>

    </nav>
  );
}

export default Navbar;