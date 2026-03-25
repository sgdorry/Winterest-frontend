import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { fetchLeaderboard } from "../api/scores";
import { fetchFriendsLeaderboard, addFriend, removeFriend, fetchFriends } from "../api/friends";
import "./Rules.css";
import "./Leaderboard.css";

function getUser() {
  try {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (stored && stored.id) return stored;
  } catch { /* not logged in */ }
  return null;
}

export default function Leaderboard() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [friendEmail, setFriendEmail] = useState("");
  const [friends, setFriends] = useState([]);
  const [modalMsg, setModalMsg] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const user = getUser();

  const loadScores = useCallback((selectedFilter) => {
    setLoading(true);
    setError(null);

    const promise =
      selectedFilter === "friends" && user
        ? fetchFriendsLeaderboard(user.id)
        : fetchLeaderboard();

    promise
      .then((data) => setScores(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    loadScores(filter);
  }, [filter]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const openModal = () => {
    setShowModal(true);
    setFriendEmail("");
    setModalMsg(null);
    if (user) {
      fetchFriends(user.id)
        .then(setFriends)
        .catch(() => setFriends([]));
    }
  };

  const handleAddFriend = async () => {
    if (!friendEmail.trim() || !user) return;
    setModalLoading(true);
    setModalMsg(null);
    try {
      const data = await addFriend(user.id, friendEmail.trim());
      setModalMsg({ type: "success", text: `Added ${data.friend.email}` });
      setFriendEmail("");
      const updated = await fetchFriends(user.id);
      setFriends(updated);
      if (filter === "friends") loadScores("friends");
    } catch (err) {
      setModalMsg({ type: "error", text: err.message });
    } finally {
      setModalLoading(false);
    }
  };

  const handleRemoveFriend = async (friendId) => {
    if (!user) return;
    setModalLoading(true);
    setModalMsg(null);
    try {
      await removeFriend(user.id, friendId);
      const updated = await fetchFriends(user.id);
      setFriends(updated);
      setModalMsg({ type: "success", text: "Friend removed" });
      if (filter === "friends") loadScores("friends");
    } catch (err) {
      setModalMsg({ type: "error", text: err.message });
    } finally {
      setModalLoading(false);
    }
  };

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

        {user && (
          <div className="leaderboard-controls">
            <select
              className="leaderboard-filter"
              value={filter}
              onChange={handleFilterChange}
            >
              <option value="all">All Players</option>
              <option value="friends">Friends Only</option>
            </select>
            <button
              className="rules-btn rules-btn-primary"
              onClick={openModal}
            >
              Add Friend
            </button>
          </div>
        )}

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
              {filter === "friends"
                ? "No friend scores yet. Add friends and play some games!"
                : "No scores yet. Play a game to get on the board!"}
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

      {showModal && (
        <div className="leaderboard-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="leaderboard-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Manage Friends</h3>

            <div className="leaderboard-modal-add">
              <input
                className="leaderboard-modal-input"
                type="email"
                placeholder="Enter friend's email"
                value={friendEmail}
                onChange={(e) => setFriendEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddFriend()}
              />
              <button
                className="rules-btn rules-btn-primary"
                onClick={handleAddFriend}
                disabled={modalLoading}
              >
                Add
              </button>
            </div>

            {modalMsg && (
              <p className={`leaderboard-modal-msg leaderboard-modal-msg--${modalMsg.type}`}>
                {modalMsg.text}
              </p>
            )}

            {friends.length > 0 && (
              <div className="leaderboard-friends-list">
                <h4>Your Friends</h4>
                {friends.map((f) => (
                  <div key={f.id} className="leaderboard-friend-item">
                    <span>{f.email}</span>
                    <button
                      className="rules-btn rules-btn-secondary leaderboard-remove-btn"
                      onClick={() => handleRemoveFriend(f.id)}
                      disabled={modalLoading}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              className="rules-btn rules-btn-secondary leaderboard-modal-close"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
