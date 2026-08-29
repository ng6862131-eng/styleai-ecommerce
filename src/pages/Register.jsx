import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FaArrowLeft,
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState("");

  const handleRegister = (event) => {
    event.preventDefault();

    setError("");

    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const existingUser = localStorage.getItem(
      "styleai-user"
    );

    if (existingUser) {
      const user = JSON.parse(existingUser);

      if (user.email === email) {
        setError(
          "An account with this email already exists."
        );
        return;
      }
    }

    const newUser = {
      name,
      email,
      password,
    };

  localStorage.setItem(
  "styleai-user",
  JSON.stringify(newUser)
);

localStorage.removeItem("styleai-logged-in");

navigate("/login");
  };

  return (
    <div className="login-page">

      {/* BACK */}

      <Link
        to="/login"
        className="login-back"
      >
        <FaArrowLeft />
        Back to Login
      </Link>

      {/* LEFT SIDE */}

      <div className="login-visual">

        <div className="login-visual-content">

          <span className="login-eyebrow">
            STYLE • AI • FASHION
          </span>

          <h1>
            Create your
            <br />
            <span>style story.</span>
          </h1>

          <p>
            Join StyleAI and discover fashion
            designed around you.
          </p>

          <div className="login-circle">

            <small>
              STYLE
            </small>

            <strong>
              AI
            </strong>

          </div>

        </div>

      </div>

      {/* RIGHT SIDE */}

      <div className="login-form-section">

        <div className="login-form-container">

          <div className="login-logo">
            STYLE<span>AI</span>
          </div>

          <p className="login-label">
            NEW TO STYLEAI?
          </p>

          <h2>
            Create your account
          </h2>

          <p className="login-subtitle">
            Start your personalized fashion journey.
          </p>

          <form onSubmit={handleRegister}>

            {/* NAME */}

            <div className="login-field">

              <label>
                Full Name
              </label>

              <div className="login-input">

                <FaUser />

                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                />

              </div>

            </div>

            {/* EMAIL */}

            <div className="login-field">

              <label>
                Email Address
              </label>

              <div className="login-input">

                <FaEnvelope />

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                />

              </div>

            </div>

            {/* PASSWORD */}

            <div className="login-field">

              <label>
                Password
              </label>

              <div className="login-input">

                <FaLock />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Create a password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                >
                  {showPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>

              </div>

            </div>

            {/* CONFIRM PASSWORD */}

            <div className="login-field">

              <label>
                Confirm Password
              </label>

              <div className="login-input">

                <FaLock />

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value
                    )
                  }
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>

              </div>

            </div>

            {/* ERROR */}

            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            {/* REGISTER */}

            <button
              type="submit"
              className="login-submit"
            >
              Create Account
            </button>

          </form>

          {/* LOGIN */}

          <div className="login-register">

            <span>
              Already have an account?
            </span>

            <Link to="/login">
              Sign in
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;