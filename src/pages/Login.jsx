import { Link, useNavigate} from "react-router-dom";
import {useState} from "react";
import { login as apiLogin } from "../api/users";
import { useAuth } from "../context/AuthContext";
import "./Title.css";
import "./Auth.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const data = await apiLogin(email, password);
      setMessage(data.message || "Login successful");

      login(data.user);

      setTimeout(() => {
        navigate("/home");
      }, 1000);
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }
  return (
      <div className="landing">
        <div className="landing-content">
          <Link to="/" className="auth-back-link">
            ← Back
          </Link>

          <h1 className="landing-title">Winpoint</h1>
          <hr className="landing-divider" />

          <p className="auth-subtitle">Welcome back</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label">Email</label>
              <input
                className="auth-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="auth-field">
              <label className="auth-label">Password</label>
              <input
                className="auth-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-play" disabled={loading}>
              {loading ? "Logging In..." : "Log In"}
            </button>
          </form>

          {error && <p className="auth-error">{error}</p>}
          {message && <p className="auth-success">{message}</p>}

          <p className="auth-footer">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>
    );
  }