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

  const handleLogin = async (event) => {
    event.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    let databaseUnavailable = false;
    let apiError = "Email or password is incorrect.";

    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const result = await response.json();

      if (response.ok && result.success) {
        localStorage.setItem("styleai-user", JSON.stringify(result.user));
        localStorage.setItem("styleai-user-token", result.token);
        localStorage.setItem("styleai-logged-in", "true");
        window.dispatchEvent(new Event("styleai-auth-changed"));
        navigate(location.state?.from || "/");
        return;
      }

      apiError = result.message || apiError;
      if (response.status === 401) {
        const savedUser = JSON.parse(localStorage.getItem("styleai-user") || "null");
        const isLegacyAccount = savedUser?.password &&
          savedUser.email?.toLowerCase() === email.trim().toLowerCase() &&
          savedUser.password === password;

        if (isLegacyAccount) {
          const migrationResponse = await fetch("http://localhost:5000/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: savedUser.name, email: savedUser.email, password }),
          });
          const migrationResult = await migrationResponse.json();

          if (migrationResponse.ok || migrationResponse.status === 409) {
            const retryResponse = await fetch("http://localhost:5000/auth/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: savedUser.email, password }),
            });
            const retryResult = await retryResponse.json();
            if (retryResponse.ok && retryResult.success) {
              localStorage.setItem("styleai-user", JSON.stringify(retryResult.user));
              localStorage.setItem("styleai-user-token", retryResult.token);
              localStorage.setItem("styleai-logged-in", "true");
              window.dispatchEvent(new Event("styleai-auth-changed"));
              navigate(location.state?.from || "/");
              return;
            }
            apiError = retryResult.message || apiError;
          } else {
            apiError = migrationResult.message || apiError;
          }
        }

        setError(apiError);
        return;
      }

      if (response.status === 503) {
        databaseUnavailable = true;
      } else {
        setError(apiError);
        return;
      }
    } catch {
      databaseUnavailable = true;
    }

    if (databaseUnavailable) {
      let savedUser = null;
      try {
        savedUser = JSON.parse(localStorage.getItem("styleai-user") || "null");
      } catch {
        savedUser = null;
      }

      if (savedUser?.email?.toLowerCase() === email.trim().toLowerCase() && savedUser.password === password) {
        localStorage.setItem("styleai-logged-in", "true");
        window.dispatchEvent(new Event("styleai-auth-changed"));
        navigate(location.state?.from || "/");
        return;
      }

      setError(savedUser ? "Incorrect email or password." : "Unable to connect to the StyleAI backend. Please try again.");
    }
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
