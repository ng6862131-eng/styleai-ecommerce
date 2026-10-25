import {
  FaSearch,
  FaShoppingBag,
  FaUser,
  FaHeart,
  FaStore,
} from "react-icons/fa";

import {
  Link,
  useLocation,
} from "react-router-dom";

import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

function Navbar() {
  const { cartCount } = useCart();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLogin = () => {
      const loggedIn =
        localStorage.getItem("styleai-logged-in") === "true";

      setIsLoggedIn(loggedIn);
    };

    checkLogin();
  }, [location]);

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
        <Link to="/contact">Contact</Link>
      </div>

      <div className="nav-actions">
        <Link to="/shop" className="icon-btn" title="Search">
          <FaSearch />
        </Link>

        <Link to="/wishlist" className="icon-btn" title="Wishlist">
          <FaHeart />
        </Link>

        <Link
          to={isLoggedIn ? "/profile" : "/login"}
          className="icon-btn"
          title={isLoggedIn ? "My Account" : "Login"}
        >
          <FaUser />
        </Link>

        <Link to="/seller/login" className="seller-nav-btn" title="Seller Account">
          <FaStore />
          <span>Seller</span>
        </Link>

        <Link to="/cart" className="cart-btn" title="Shopping Cart">
          <FaShoppingBag />
          <span>{cartCount}</span>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;