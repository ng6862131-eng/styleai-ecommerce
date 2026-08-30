import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FaArrowLeft,
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCheck,
  FaTimes,
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

  /* ================= PASSWORD RULES ================= */

  const passwordRules = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const passedRules = Object.values(passwordRules).filter(
    Boolean
  ).length;

  let passwordStrength = "";

  if (password.length === 0) {
    passwordStrength = "";
  } else if (passedRules <= 2) {
    passwordStrength = "Weak";
  } else if (passedRules <= 4) {
    passwordStrength = "Medium";
  } else {
    passwordStrength = "Strong";
  }

  /* ================= REGISTER ================= */

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

    if (passedRules < 5) {
      setError(
        "Please create a strong password that meets all requirements."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const savedUser = localStorage.getItem(
      "styleai-user"
    );

    if (savedUser) {
      const existingUser = JSON.parse(savedUser);

      if (
        existingUser.email.toLowerCase() ===
        email.toLowerCase()
      ) {
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

    /*
      User is NOT automatically logged in.
      They must confirm the new account by
      logging in manually.
    */

    localStorage.removeItem(
      "styleai-logged-in"
    );

    navigate("/login");
  };

  /* ================= RULE COMPONENT ================= */

  const PasswordRule = ({ valid, children }) => (
    <div
      className={
        valid
          ? "password-rule valid"
          : "password-rule"
      }
    >
      <span className="password-rule-icon">
        {valid ? <FaCheck /> : <FaTimes />}
      </span>

      <span>{children}</span>
    </div>
  );

  return (
    <div className="login-page">

      {/* ================= BACK ================= */}

      <Link
        to="/login"
        className="login-back"
      >
        <FaArrowLeft />
        Back to Login
      </Link>

      {/* ================= LEFT SIDE ================= */}

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

      {/* ================= RIGHT SIDE ================= */}

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

            {/* ================= NAME ================= */}

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

            {/* ================= EMAIL ================= */}

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

            {/* ================= PASSWORD ================= */}

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
                  placeholder="Create a strong password"
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

              {/* ================= STRENGTH ================= */}

              {password.length > 0 && (
                <div className="password-strength">

                  <div className="strength-header">

                    <span>
                      Password strength
                    </span>

                    <strong
                      className={`strength-${passwordStrength.toLowerCase()}`}
                    >
                      {passwordStrength}
                    </strong>

                  </div>

                  <div className="strength-bars">

                    {[1, 2, 3, 4, 5].map(
                      (bar) => (
                        <span
                          key={bar}
                          className={
                            bar <= passedRules
                              ? `strength-bar active strength-${passwordStrength.toLowerCase()}`
                              : "strength-bar"
                          }
                        />
                      )
                    )}

                  </div>

                </div>
              )}

              {/* ================= REQUIREMENTS ================= */}

              <div className="password-requirements">

                <p>
                  Password must contain:
                </p>

                <div className="password-rules">

                  <PasswordRule
                    valid={passwordRules.length}
                  >
                    At least 8 characters
                  </PasswordRule>

                  <PasswordRule
                    valid={passwordRules.uppercase}
                  >
                    One uppercase letter
                  </PasswordRule>

                  <PasswordRule
                    valid={passwordRules.lowercase}
                  >
                    One lowercase letter
                  </PasswordRule>

                  <PasswordRule
                    valid={passwordRules.number}
                  >
                    One number
                  </PasswordRule>

                  <PasswordRule
                    valid={passwordRules.special}
                  >
                    One special character
                  </PasswordRule>

                </div>

              </div>

            </div>

            {/* ================= CONFIRM PASSWORD ================= */}

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

              {confirmPassword.length > 0 && (
                <div
                  className={
                    password === confirmPassword
                      ? "password-match"
                      : "password-not-match"
                  }
                >
                  {password === confirmPassword
                    ? "✓ Passwords match"
                    : "✕ Passwords do not match"}
                </div>
              )}

            </div>

            {/* ================= ERROR ================= */}

            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            {/* ================= REGISTER ================= */}

            <button
              type="submit"
              className="login-submit"
            >
              Create Account
            </button>

          </form>

          {/* ================= LOGIN ================= */}

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