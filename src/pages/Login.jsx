import { useState } from "react";
import {
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {
  FaArrowLeft,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (event) => {
    event.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    const savedUser = JSON.parse(
      localStorage.getItem("styleai-user")
    );

    if (!savedUser) {
      setError(
        "No account found. Please create an account first."
      );
      return;
    }

    if (
      savedUser.email !== email ||
      savedUser.password !== password
    ) {
      setError("Incorrect email or password.");
      return;
    }

    localStorage.setItem(
      "styleai-logged-in",
      "true"
    );

    navigate(
  location.state?.from || "/"
);
  };

  return (
    <div className="login-page">

      {/* BACK */}

      <Link to="/" className="login-back">
        <FaArrowLeft />
        Back to Home
      </Link>

      {/* LEFT SIDE */}

      <div className="login-visual">

        <div className="login-visual-content">

          <span className="login-eyebrow">
            STYLE • AI • FASHION
          </span>

          <h1>
            Your style.
            <br />
            <span>Your way.</span>
          </h1>

          <p>
            Discover fashion that feels
            uniquely yours.
          </p>

          <div className="login-circle">
            <small>STYLE</small>
            <strong>AI</strong>
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
            WELCOME BACK
          </p>

          <h2>
            Sign in to your account
          </h2>

          <p className="login-subtitle">
            Continue your StyleAI journey.
          </p>

          <form onSubmit={handleLogin}>

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
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
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

            {/* ERROR */}

            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            {/* LOGIN */}

            <button
              type="submit"
              className="login-submit"
            >
              Sign In
            </button>

          </form>

          {/* REGISTER */}

          <div className="login-register">

            <span>
              Don't have an account?
            </span>

            <Link to="/register">
              Create an account
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;