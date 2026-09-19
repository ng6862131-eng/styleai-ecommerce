import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaLock,
  FaUser,
  FaStore,
  FaArrowLeft,
  FaEnvelope,
  FaUserPlus,
} from "react-icons/fa";

function SellerLogin() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const sellers = JSON.parse(
      localStorage.getItem("styleai-sellers") || "[]"
    );

    const seller = sellers.find(
      (item) =>
        item.email.toLowerCase() ===
          email.trim().toLowerCase() &&
        item.password === password
    );

    if (!seller) {
      setError("Seller ID or password is incorrect.");
      return;
    }

    localStorage.setItem("styleai-seller", "true");
    localStorage.setItem(
      "styleai-current-seller",
      JSON.stringify(seller)
    );

    navigate("/seller/dashboard");
  };

  const handleRegister = (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const sellers = JSON.parse(
      localStorage.getItem("styleai-sellers") || "[]"
    );

    const emailExists = sellers.some(
      (item) =>
        item.email.toLowerCase() ===
        email.trim().toLowerCase()
    );

    if (emailExists) {
      setError(
        "This seller email is already registered. Please login."
      );
      return;
    }

    const newSeller = {
      id: `SELLER-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      createdAt: new Date().toISOString(),
    };

    sellers.push(newSeller);

    localStorage.setItem(
      "styleai-sellers",
      JSON.stringify(sellers)
    );

    localStorage.setItem("styleai-seller", "true");

    localStorage.setItem(
      "styleai-current-seller",
      JSON.stringify(newSeller)
    );

    setSuccess(
      "Seller account created successfully."
    );

    setTimeout(() => {
      navigate("/seller/dashboard");
    }, 700);
  };

  const switchMode = () => {
    setMode(
      mode === "login"
        ? "register"
        : "login"
    );

    setName("");
    setEmail("");
    setPassword("");
    setError("");
    setSuccess("");
  };

  return (
    <div className="seller-login-page">

      <div className="seller-login-card">

        {/* ICON */}

        <div className="seller-login-icon">
          {mode === "login" ? (
            <FaStore />
          ) : (
            <FaUserPlus />
          )}
        </div>

        {/* BRAND */}

        <div className="seller-login-brand">
          STYLE<span>AI</span>
        </div>

        <p className="seller-login-label">
          SELLER PORTAL
        </p>

        <h1>
          {mode === "login"
            ? "Seller Login"
            : "Create Seller ID"}
        </h1>

        <p className="seller-login-subtitle">
          {mode === "login"
            ? "Manage your StyleAI store, orders and revenue."
            : "Create your seller account to manage your StyleAI store."}
        </p>

        <form
          onSubmit={
            mode === "login"
              ? handleLogin
              : handleRegister
          }
        >

          {/* NAME - REGISTER ONLY */}

          {mode === "register" && (
            <div className="seller-input-group">

              <label>
                Seller Name
              </label>

              <div className="seller-input-wrap">
                <FaUser />

                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  required
                />
              </div>

            </div>
          )}

          {/* EMAIL */}

          <div className="seller-input-group">

            <label>
              Email Address
            </label>

            <div className="seller-input-wrap">
              <FaEnvelope />

              <input
                type="email"
                placeholder="Enter seller email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />
            </div>

          </div>

          {/* PASSWORD */}

          <div className="seller-input-group">

            <label>
              Password
            </label>

            <div className="seller-input-wrap">
              <FaLock />

              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />
            </div>

          </div>

          {/* ERROR */}

          {error && (
            <div className="seller-login-error">
              {error}
            </div>
          )}

          {/* SUCCESS */}

          {success && (
            <div className="seller-login-success">
              {success}
            </div>
          )}

          {/* SUBMIT */}

          <button
            type="submit"
            className="seller-login-btn"
          >
            {mode === "login"
              ? "Login to Seller Dashboard"
              : "Create Seller Account"}
          </button>

        </form>

        {/* SWITCH */}

        <button
          type="button"
          className="seller-switch-btn"
          onClick={switchMode}
        >
          {mode === "login"
            ? "Create New Seller ID"
            : "Already have a Seller ID? Login"}
        </button>

        {/* BACK */}

        <button
          type="button"
          className="seller-back-btn"
          onClick={() => navigate("/")}
        >
          <FaArrowLeft />
          Back to StyleAI
        </button>

      </div>

    </div>
  );
}

export default SellerLogin;