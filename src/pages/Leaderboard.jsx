import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { /* fetchAggregatedLeaderboard, */ fetchAggregatedFriendsLeaderboard /* , fetchLeaderboardFilters */ } from "../api/scores";
import { addFriend, removeFriend, fetchFriends } from "../api/friends";
import { useAuth } from "../context/AuthContext";
import "./Rules.css";
import "./Leaderboard.css";

export default function Leaderboard() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [filter, setFilter] = useState("all");
  // const [filterOptions, setFilterOptions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [friendEmail, setFriendEmail] = useState("");
  const [friends, setFriends] = useState([]);
  const [modalMsg, setModalMsg] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const { user } = useAuth();

  const loadScores = useCallback(() => {
    if (!user) return;
    setLoading(true);
    setError(null);

    fetchAggregatedFriendsLeaderboard(user.id)
      .then((data) => setScores(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

    // Global leaderboard (commented out):
    // const promise =
    //   selectedFilter === "friends" && user
    //     ? fetchAggregatedFriendsLeaderboard(user.id)
    //     : fetchAggregatedLeaderboard();
    // promise
    //   .then((data) => setScores(Array.isArray(data) ? data : []))
    //   .catch((err) => setError(err.message))
    //   .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    loadScores();
  }, [loadScores]);

  // Global leaderboard filters (commented out):
  // useEffect(() => {
  //   if (!user) return;
  //   fetchLeaderboardFilters()
  //     .then((options) => setFilterOptions(options))
  //     .catch(() => setFilterOptions([]));
  // }, [user]);

  // const handleFilterChange = (e) => {
  //   setFilter(e.target.value);
  // };

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
      loadScores();
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
      setModalMsg({ type: "success", text: "Unfollowed" });
      loadScores();
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
            {/* Global leaderboard filter (commented out):
            <select
              className="leaderboard-filter"
              value={filter}
              onChange={handleFilterChange}
            >
              {filterOptions.length === 0 && (
                <option value="all">Loading filters...</option>
              )}
              {filterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            */}
            <button
              className="rules-btn rules-btn-primary"
              onClick={openModal}
            >
              Friends
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
              No scores yet. Add friends and play some games!
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
                    <th scope="col">Games Played</th>
                  </tr>
                </thead>
                <tbody>
                  {scores.map((entry, i) => (
                    <tr key={entry.user_id ?? i}>
                      <td className="leaderboard-rank">{i + 1}</td>
                      <td>{entry.username ?? "Unknown"}</td>
                      <td>{entry.score}</td>
                      <td>{entry.guesses_used}</td>
                      <td>{entry.games_played}</td>
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
            <h3>Manage Following</h3>

            <div className="leaderboard-modal-add">
              <input
                className="leaderboard-modal-input"
                type="email"
                placeholder="Enter user's email"
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
                <h4>People You Follow</h4>
                {friends.map((f) => (
                  <div key={f.id} className="leaderboard-friend-item">
                    <span>{f.email}</span>
                    <button
                      className="rules-btn rules-btn-secondary leaderboard-remove-btn"
                      onClick={() => handleRemoveFriend(f.id)}
                      disabled={modalLoading}
                    >
                      Unfollow
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
