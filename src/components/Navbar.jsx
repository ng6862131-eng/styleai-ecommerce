import {
  FaSearch,
  FaShoppingBag,
  FaUser,
  FaHeart,
} from "react-icons/fa";

import { Link } from "react-router-dom";
import { useState } from "react";

import { useCart } from "../context/CartContext";

function Navbar() {
  const { cartCount } = useCart();

  const [isLoggedIn, setIsLoggedIn] = useState(
    () =>
      localStorage.getItem(
        "styleai-logged-in"
      ) === "true"
  );

  const handleAccountClick = () => {
    const loggedIn =
      localStorage.getItem(
        "styleai-logged-in"
      ) === "true";

    setIsLoggedIn(loggedIn);
  };

  return (
    <nav className="navbar">

      {/* LOGO */}

      <Link
        to="/"
        className="logo"
      >
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

        {/* SEARCH */}

        <Link
          to="/shop"
          className="icon-btn"
          title="Search"
        >
          <FaSearch />
        </Link>

        {/* WISHLIST */}

        <Link
          to="/wishlist"
          className="icon-btn"
          title="Wishlist"
        >
          <FaHeart />
        </Link>

        {/* ACCOUNT */}

        {isLoggedIn ? (
          <Link
            to="/profile"
            className="icon-btn"
            title="My Account"
            onClick={handleAccountClick}
          >
            <FaUser />
          </Link>
        ) : (
          <Link
            to="/login"
            className="icon-btn"
            title="Login"
          >
            <FaUser />
          </Link>
        )}

        {/* CART */}

        <Link
          to="/cart"
          className="cart-btn"
          title="Shopping Cart"
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