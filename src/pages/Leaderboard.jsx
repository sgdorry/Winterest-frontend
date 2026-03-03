import { Link } from "react-router-dom";
import "./Rules.css";

export default function Leaderboard() {
  return (
    <main className="rules-page">
      <div className="rules-shell">
        <header className="rules-header">
          <p className="rules-eyebrow">Winpoint</p>
          <h1 className="rules-title">Leaderboard</h1>
          <p className="rules-subtitle">
            Leaderboard integration is in progress. Scores and rankings will appear here.
          </p>
          <div className="rules-actions">
            <Link to="/home" className="rules-btn rules-btn-primary">
              Play
            </Link>
            <Link to="/" className="rules-btn rules-btn-secondary">
              Back to Home
            </Link>
          </div>
        </header>
      </div>
    </main>
  );
}
