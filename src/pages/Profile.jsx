import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchLeaderboard } from "../api/scores";
import "./Rules.css";
import "./Profile.css";

export default function Profile() {
  const { user } = useAuth();
  const [scores, setScores] = useState(null);
  const [error, setError] = useState("");

  const loading = !!user && scores === null && !error;

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    fetchLeaderboard()
      .then((allScores) => {
        if (cancelled) return;
        const mine = (allScores || []).filter(
          (entry) => entry.user_id === user.id
        );
        setScores(mine);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message || "Failed to load scores");
      });

    return () => { cancelled = true; };
  }, [user]);

  if (!user) {
    return (
      <main className="rules-page">
        <div className="rules-shell">
          <div className="profile-empty">
            <h1>Profile</h1>
            <p>You need to be logged in to view your profile.</p>
            <div className="rules-actions">
              <Link to="/login" className="rules-btn rules-btn-primary">
                Log In
              </Link>
              <Link to="/signup" className="rules-btn rules-btn-secondary">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const username =
    user.username ||
    (user.email && user.email.includes("@") ? user.email.split("@")[0] : "");

  const totalScore = scores
    ? scores.reduce((sum, s) => sum + (s.score || 0), 0)
    : 0;
  const bestScore =
    scores && scores.length > 0
      ? Math.max(...scores.map((s) => s.score || 0))
      : 0;
  const gamesPlayed = scores ? scores.length : 0;

  return (
    <main className="rules-page">
      <div className="rules-shell profile-shell">
        <section
          className="rules-section profile-card"
          aria-labelledby="profile-title"
        >
          <h1 id="profile-title" className="rules-title profile-title">
            Your Profile
          </h1>

          {loading && (
            <p className="profile-status">Loading scores…</p>
          )}
          {error && (
            <p className="profile-status profile-status-error">{error}</p>
          )}

          <section
            className="profile-section"
            aria-labelledby="profile-user-info"
          >
            <h2 id="profile-user-info">User Info</h2>
            <div className="profile-info-grid">
              <div className="profile-info-row">
                <span className="profile-info-label">Username</span>
                <span className="profile-info-value">
                  {username || "-"}
                </span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Email</span>
                <span className="profile-info-value">
                  {user.email || "-"}
                </span>
              </div>
            </div>
          </section>

          {!loading && !error && scores && scores.length === 0 && (
            <div className="profile-empty-scores">
              <p>No games played yet.</p>
              <div className="rules-actions">
                <Link to="/play" className="rules-btn rules-btn-primary">
                  Play Now
                </Link>
              </div>
            </div>
          )}

          {scores && scores.length > 0 && (
            <>
              <section
                className="profile-section"
                aria-labelledby="profile-stats"
              >
                <h2 id="profile-stats">Stats</h2>
                <div className="profile-stats-grid">
                  <div className="profile-stat">
                    <span className="profile-stat-value">{totalScore}</span>
                    <span className="profile-stat-label">Score</span>
                  </div>
                  <div className="profile-stat">
                    <span className="profile-stat-value">{gamesPlayed}</span>
                    <span className="profile-stat-label">Games Played</span>
                  </div>
                  <div className="profile-stat">
                    <span className="profile-stat-value">{bestScore}</span>
                    <span className="profile-stat-label">Best Score</span>
                  </div>
                </div>
              </section>

              <section
                className="profile-section"
                aria-labelledby="profile-scores"
              >
                <h2 id="profile-scores">Your Scores</h2>
                <table className="profile-scores-table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Score</th>
                      <th>Guesses</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scores.map((entry) => (
                      <tr key={entry.id}>
                        <td className="profile-game-type">
                          {entry.entity_type}
                        </td>
                        <td>{entry.score}</td>
                        <td>{entry.guesses_used}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
