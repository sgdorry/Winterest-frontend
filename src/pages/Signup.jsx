import { Link, useNavigate} from "react-router-dom";
import {useState} from "react";
import { signup } from "../api/users";
import "./Title.css";
import "./Auth.css";

const USERNAME_REGEX = /^[A-Za-z0-9_]+$/;

export default function Signup() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
      e.preventDefault();
      setError("");
      setMessage("");
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      if (!USERNAME_REGEX.test(username)) {
        setError("Username can only include letters, numbers, and underscores");
        return;
      }
      setLoading(true);
      try {
        const data = await signup(email, username, password);
        setMessage(data.message || "Account created successfully");

        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } catch (err) {
        setError(err.message || "Signup failed");
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

        <p className="auth-subtitle">Create your account</p>

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
            <label className="auth-label">Username</label>
            <input
              className="auth-input"
              type="text"
              placeholder="your_username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              pattern="[A-Za-z0-9_]+"
              title="Use letters, numbers, and underscores only"
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
          <div className="auth-field">
            <label className="auth-label">Confirm Password</label>
            <input
              className="auth-input"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-play" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
        {error && <p className="auth-error">{error}</p>}
        {message && <p className="auth-success">{message}</p>}
        <p className="auth-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}