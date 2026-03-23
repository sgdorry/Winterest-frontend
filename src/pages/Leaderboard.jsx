import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchLeaderboard } from "../api/scores";
import "./Rules.css";
import "./Leaderboard.css";

export default function Leaderboard() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetchLeaderboard()
      .then((data) => {
        if (!cancelled) setScores(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="rules-page">
      <div className="rules-shell">
        <header className="rules-header">
          <p className="rules-eyebrow">Winpoint</p>
          <h1 className="rules-title">Leaderboard</h1>
          <p className="rules-subtitle">
            Top scores from all players across every game mode.
          </p>
          <div className="rules-actions">
            <Link to="/play" className="rules-btn rules-btn-primary">
              Play
            </Link>
            <Link to="/" className="rules-btn rules-btn-secondary">
              Back to Home
            </Link>
          </div>
        </header>

        <section className="rules-section" aria-labelledby="lb-table">
          <h2 id="lb-table">Rankings</h2>

          {loading && (
            <p className="leaderboard-loading">Loading scores…</p>
          )}

          {error && (
            <p className="leaderboard-error">{error}</p>
          )}

          {!loading && !error && scores.length === 0 && (
            <p className="leaderboard-loading">
              No scores yet. Play a game to get on the board!
            </p>
          )}

          {!loading && !error && scores.length > 0 && (
            <div className="rules-table-wrap">
              <table className="rules-table">
                <thead>
                  <tr>
                    <th scope="col">Rank</th>
                    <th scope="col">Player</th>
                    <th scope="col">Score</th>
                    <th scope="col">Guesses Used</th>
                    <th scope="col">Game Type</th>
                  </tr>
                </thead>
                <tbody>
                  {scores.map((entry, i) => (
                    <tr key={entry.id ?? i}>
                      <td className="leaderboard-rank">{i + 1}</td>
                      <td>{entry.player ?? entry.username ?? "Anonymous"}</td>
                      <td>{entry.score}</td>
                      <td>{entry.guesses_used}</td>
                      <td className="leaderboard-game-type">
                        {entry.entity_type}
                      </td>
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
