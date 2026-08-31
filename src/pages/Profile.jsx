import { Link, useNavigate } from "react-router-dom";

import {
  FaArrowLeft,
  FaUser,
  FaEnvelope,
  FaShoppingBag,
  FaHeart,
  FaSignOutAlt,
  FaBoxOpen,
  FaChevronRight,
} from "react-icons/fa";

import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

function Profile() {
  const navigate = useNavigate();

  const { cartCount } = useCart();

  const { wishlistCount } = useWishlist();

  const savedUser = localStorage.getItem(
    "styleai-user"
  );

  const user = savedUser
    ? JSON.parse(savedUser)
    : null;

  const savedOrders = localStorage.getItem(
    "styleai-orders"
  );

  const orders = savedOrders
    ? JSON.parse(savedOrders)
    : [];

  /* ================= LOGOUT ================= */

  const handleLogout = () => {
    localStorage.removeItem(
      "styleai-logged-in"
    );

    navigate("/login");
  };

  /* ================= NOT LOGGED IN ================= */

  if (!user) {
    return (
      <div className="profile-page">

        <div className="profile-empty">

          <div className="profile-empty-icon">
            <FaUser />
          </div>

          <h1>
            Please Login
          </h1>

          <p>
            Login to view your StyleAI account.
          </p>

          <Link
            to="/login"
            className="profile-button"
          >
            Go to Login
          </Link>

        </div>

      </div>
    );
  }

  return (
    <div className="profile-page">

      {/* ================= HEADER ================= */}

      <div className="profile-header">

        <Link
          to="/"
          className="profile-back"
        >
          <FaArrowLeft />
          Back to Home
        </Link>

        <Link
          to="/"
          className="profile-logo"
        >
          STYLE<span>AI</span>
        </Link>

      </div>

      {/* ================= MAIN ================= */}

      <main className="profile-content">

        {/* ================= TITLE ================= */}

        <div className="profile-title">

          <p>
            MY ACCOUNT
          </p>

          <h1>
            Welcome, {user.name}
          </h1>

          <span>
            Manage your StyleAI account and
            shopping activity.
          </span>

        </div>

        {/* ================= ACCOUNT CARD ================= */}

        <section className="profile-card">

          <div className="profile-avatar">
            <FaUser />
          </div>

          <div className="profile-details">

            <div className="profile-detail">

              <span>
                Full Name
              </span>

              <strong>
                {user.name}
              </strong>

            </div>

            <div className="profile-detail">

              <span>
                Email Address
              </span>

              <strong>
                {user.email}
              </strong>

            </div>

          </div>

        </section>

        {/* ================= STATISTICS ================= */}

        <div className="profile-stats">

          <div className="profile-stat">

            <div className="profile-stat-icon">
              <FaBoxOpen />
            </div>

            <div>

              <strong>
                {orders.length}
              </strong>

              <span>
                Orders
              </span>

            </div>

          </div>

          <div className="profile-stat">

            <div className="profile-stat-icon">
              <FaHeart />
            </div>

            <div>

              <strong>
                {wishlistCount}
              </strong>

              <span>
                Wishlist
              </span>

            </div>

          </div>

          <div className="profile-stat">

            <div className="profile-stat-icon">
              <FaShoppingBag />
            </div>

            <div>

              <strong>
                {cartCount}
              </strong>

              <span>
                Cart Items
              </span>

            </div>

          </div>

        </div>

        {/* ================= OPTIONS ================= */}

        <div className="profile-options">

          {/* ORDERS */}

          <Link
            to="/order"
            className="profile-option"
          >

            <div className="profile-option-icon">
              <FaShoppingBag />
            </div>

            <div className="profile-option-content">

              <strong>
                My Orders
              </strong>

              <span>
                View your orders and purchases
              </span>

            </div>

            <FaChevronRight
              className="profile-option-arrow"
            />

          </Link>

          {/* WISHLIST */}

          <Link
            to="/wishlist"
            className="profile-option"
          >

            <div className="profile-option-icon">
              <FaHeart />
            </div>

            <div className="profile-option-content">

              <strong>
                Wishlist
              </strong>

              <span>
                View your saved fashion items
              </span>

            </div>

            <FaChevronRight
              className="profile-option-arrow"
            />

          </Link>

          {/* CART */}

          <Link
            to="/cart"
            className="profile-option"
          >

            <div className="profile-option-icon">
              <FaShoppingBag />
            </div>

            <div className="profile-option-content">

              <strong>
                Shopping Cart
              </strong>

              <span>
                Continue with your shopping
              </span>

            </div>

            <FaChevronRight
              className="profile-option-arrow"
            />

          </Link>

          {/* EMAIL */}

          <div className="profile-option">

            <div className="profile-option-icon">
              <FaEnvelope />
            </div>

            <div className="profile-option-content">

              <strong>
                Account Email
              </strong>

              <span>
                {user.email}
              </span>

            </div>

          </div>

        </div>

        {/* ================= LOGOUT ================= */}

        <button
          className="profile-logout"
          onClick={handleLogout}
        >
          <FaSignOutAlt />
          Logout
        </button>

      </main>

    </div>
  );
}

export default Profile;