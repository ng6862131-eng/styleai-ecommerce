import { Link, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaUser,
  FaEnvelope,
  FaShoppingBag,
  FaHeart,
  FaSignOutAlt,
} from "react-icons/fa";

function Profile() {
  const navigate = useNavigate();

  const savedUser = localStorage.getItem(
    "styleai-user"
  );

  const user = savedUser
    ? JSON.parse(savedUser)
    : null;

  const handleLogout = () => {
    localStorage.removeItem(
      "styleai-logged-in"
    );

    navigate("/login");
  };

  if (!user) {
    return (
      <div className="profile-page">

        <div className="profile-empty">

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

      {/* HEADER */}

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

      {/* CONTENT */}

      <main className="profile-content">

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

        {/* ACCOUNT CARD */}

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

        {/* ACCOUNT OPTIONS */}

        <div className="profile-options">

          <Link
            to="/order"
            className="profile-option"
          >

            <div className="profile-option-icon">
              <FaShoppingBag />
            </div>

            <div>
              <strong>
                My Orders
              </strong>

              <span>
                View your orders and purchases
              </span>
            </div>

          </Link>

          <Link
            to="/wishlist"
            className="profile-option"
          >

            <div className="profile-option-icon">
              <FaHeart />
            </div>

            <div>
              <strong>
                Wishlist
              </strong>

              <span>
                View your saved fashion items
              </span>
            </div>

          </Link>

          <div className="profile-option">

            <div className="profile-option-icon">
              <FaEnvelope />
            </div>

            <div>
              <strong>
                Account Email
              </strong>

              <span>
                {user.email}
              </span>
            </div>

          </div>

        </div>

        {/* LOGOUT */}

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