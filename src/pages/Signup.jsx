import { Link } from "react-router-dom";
import "./Title.css";
import "./Auth.css";

export default function Signup() {
  return (
    <div className="landing">
      <div className="landing-content">

        <Link to="/" style={{ alignSelf: 'flex-start', fontSize: '0.95rem', color: '#9a8b76', textDecoration: 'none', fontWeight: 500 }}>
          ← Back
        </Link>

        <h1 className="landing-title">Winpoint</h1>
        <hr className="landing-divider" />

        <p className="auth-subtitle">Create your account</p>

        <form className="auth-form">

          <div className="auth-field">
            <label className="auth-label">Email</label>
            <input className="auth-input" type="email" placeholder="you@example.com" />
          </div>

          <div className="auth-field">
            <label className="auth-label">Password</label>
            <input className="auth-input" type="password" placeholder="••••••••" />
          </div>

          <div className="auth-field">
            <label className="auth-label">Confirm Password</label>
            <input className="auth-input" type="password" placeholder="••••••••" />
          </div>

          <button type="submit" className="btn-play">Create Account</button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>

      </div>
    </div>
  );
}
