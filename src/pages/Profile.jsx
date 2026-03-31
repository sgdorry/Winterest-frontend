import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchLeaderboard } from "../api/scores";
import "./Rules.css";
import "./Profile.css";

function computeStats(scores) {
  if (scores.length === 0) return null;

  const best = scores.reduce((a, b) => (b.score > a.score ? b : a));
  const totalScore = scores.reduce((sum, s) => sum + s.score, 0);

  const typeCounts = {};
  for (const s of scores) {
    typeCounts[s.entity_type] = (typeCounts[s.entity_type] || 0) + 1;
  }
  const favoriteType = Object.entries(typeCounts).reduce((a, b) =>
    b[1] > a[1] ? b : a
  )[0];

  return {
    gamesPlayed: scores.length,
    totalScore,
    bestScore: best.score,
    bestGame: best.entity_type,
    favoriteType,
  };
}

export default function Profile() {
  const { user } = useAuth();
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    setError(null);

    fetchLeaderboard()
      .then((all) => {
        const mine = (all || []).filter(
          (s) => s.user_id === user.id || s.player === user.email
        );
        setScores(mine);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
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

  const stats = computeStats(scores);

  return (
    <main className="rules-page">
      <div className="rules-shell">
        <header className="rules-header">
          <p className="rules-eyebrow">Winpoint</p>
          <h1 className="rules-title">Your Profile</h1>
          <p className="rules-subtitle">{user.email}</p>
        </header>

        {stats && (
          <section className="rules-section" aria-labelledby="profile-stats">
            <h2 id="profile-stats">Stats</h2>
            <div className="profile-stats-grid">
              <div className="profile-stat">
                <span className="profile-stat-value">{stats.gamesPlayed}</span>
                <span className="profile-stat-label">Games Played</span>
              </div>
              <div className="profile-stat">
                <span className="profile-stat-value">{stats.totalScore}</span>
                <span className="profile-stat-label">Total Score</span>
              </div>
              <div className="profile-stat">
                <span className="profile-stat-value">{stats.bestScore}</span>
                <span className="profile-stat-label">Best Score</span>
              </div>
              <div className="profile-stat">
                <span className="profile-stat-value profile-stat-capitalize">
                  {stats.favoriteType}
                </span>
                <span className="profile-stat-label">Favorite Mode</span>
              </div>
            </div>
          </section>
        )}

        <section className="rules-section" aria-labelledby="profile-scores">
          <h2 id="profile-scores">Your Scores</h2>

          {loading && <p className="profile-status">Loading scores…</p>}

          {error && <p className="profile-status profile-status-error">{error}</p>}

          {!loading && !error && scores.length === 0 && (
            <div className="profile-empty-scores">
              <p>No games played yet.</p>
              <Link to="/play" className="rules-btn rules-btn-primary">
                Play Now
              </Link>
            </div>
          )}

          {!loading && !error && scores.length > 0 && (
            <div className="rules-table-wrap">
              <table className="rules-table">
                <thead>
                  <tr>
                    <th scope="col">Game Type</th>
                    <th scope="col">Score</th>
                    <th scope="col">Guesses Used</th>
                  </tr>
                </thead>
                <tbody>
                  {scores.map((entry, i) => (
                    <tr key={entry.id ?? i}>
                      <td className="profile-game-type">{entry.entity_type}</td>
                      <td>{entry.score}</td>
                      <td>{entry.guesses_used}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
