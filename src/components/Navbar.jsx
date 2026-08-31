import {
  FaSearch,
  FaShoppingBag,
  FaUser,
  FaHeart,
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

  const [isLoggedIn, setIsLoggedIn] =
    useState(false);

  /* ================= CHECK LOGIN ================= */

  useEffect(() => {
    const checkLogin = () => {
      const loggedIn =
        localStorage.getItem(
          "styleai-logged-in"
        ) === "true";

      setIsLoggedIn(loggedIn);
    };

    checkLogin();
  }, [location]);

  /* ================= NAVBAR ================= */

  return (
    <nav className="navbar">

      {/* ================= LOGO ================= */}

      <Link
        to="/"
        className="logo"
      >
        STYLE<span>AI</span>
      </Link>

      {/* ================= NAVIGATION ================= */}

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

      {/* ================= ACTIONS ================= */}

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

        <Link
          to={
            isLoggedIn
              ? "/profile"
              : "/login"
          }
          className="icon-btn"
          title={
            isLoggedIn
              ? "My Account"
              : "Login"
          }
        >
          <FaUser />
        </Link>

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