import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchLeaderboard } from "../api/scores";
import { addFriend, removeFriend, fetchFriends } from "../api/friends";
import { updateUsername } from "../api/users";
import "./Rules.css";
import "./Leaderboard.css";
import "./Profile.css";

const USERNAME_REGEX = /^[A-Za-z0-9_]+$/;

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [scores, setScores] = useState(null);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [friendEmail, setFriendEmail] = useState("");
  const [friends, setFriends] = useState([]);
  const [modalMsg, setModalMsg] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [usernameDraft, setUsernameDraft] = useState("");
  const [usernameSaving, setUsernameSaving] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState(null);
  const [usernameEditing, setUsernameEditing] = useState(false);

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

  useEffect(() => {
    if (!user) {
      setUsernameDraft("");
      return;
    }
    const currentUsername =
      user.username ||
      (user.email && user.email.includes("@") ? user.email.split("@")[0] : "");
    setUsernameDraft(currentUsername);
  }, [user]);

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
    } catch (err) {
      setModalMsg({ type: "error", text: err.message });
    } finally {
      setModalLoading(false);
    }
  };

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.id) return;

    const nextUsername = usernameDraft.trim();
    if (!nextUsername) {
      setUsernameStatus({ type: "error", text: "Username is required." });
      return;
    }
    if (!USERNAME_REGEX.test(nextUsername)) {
      setUsernameStatus({
        type: "error",
        text: "Username can only include letters, numbers, and underscores.",
      });
      return;
    }
    if (nextUsername.toLowerCase() === (user.username || "").toLowerCase()) {
      setUsernameStatus({ type: "success", text: "Username is unchanged." });
      setUsernameEditing(false);
      return;
    }

    setUsernameSaving(true);
    setUsernameStatus(null);
    try {
      const data = await updateUsername(user.id, nextUsername);
      if (data?.user) {
        updateUser(data.user);
      }
      setUsernameStatus({ type: "success", text: "Username updated." });
      setUsernameEditing(false);
    } catch (err) {
      setUsernameStatus({
        type: "error",
        text: err.message || "Failed to update username.",
      });
    } finally {
      setUsernameSaving(false);
    }
  };

  const startEditingUsername = () => {
    setUsernameDraft(username || "");
    setUsernameStatus(null);
    setUsernameEditing(true);
  };

  const cancelEditingUsername = () => {
    setUsernameDraft(username || "");
    setUsernameEditing(false);
  };

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

          <section
            className="profile-section"
            aria-labelledby="profile-user-info"
          >
            <h2 id="profile-user-info">User Info</h2>
            <div className="profile-info-grid">
              <div className="profile-info-row">
                <span className="profile-info-label">Username</span>
                <span className="profile-info-value profile-info-value-with-action">
                  <span>{username || "-"}</span>
                  <button
                    type="button"
                    className="profile-username-edit-btn"
                    onClick={startEditingUsername}
                    disabled={usernameSaving || usernameEditing}
                  >
                    Edit
                  </button>
                </span>
              </div>
              {usernameEditing && (
                <form className="profile-username-form" onSubmit={handleUsernameSubmit}>
                  <label className="profile-info-label" htmlFor="profile-username-input">
                    New Username
                  </label>
                  <div className="profile-username-controls">
                    <input
                      id="profile-username-input"
                      className="profile-username-input"
                      type="text"
                      value={usernameDraft}
                      onChange={(e) => setUsernameDraft(e.target.value)}
                      pattern="[A-Za-z0-9_]+"
                      title="Use letters, numbers, and underscores only"
                      placeholder="new_username"
                      disabled={usernameSaving}
                      required
                    />
                    <button
                      type="submit"
                      className="rules-btn rules-btn-primary profile-username-btn"
                      disabled={usernameSaving}
                    >
                      {usernameSaving ? "Saving..." : "Save"}
                    </button>
                    <button
                      type="button"
                      className="rules-btn rules-btn-secondary profile-username-btn"
                      onClick={cancelEditingUsername}
                      disabled={usernameSaving}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
              {usernameStatus && (
                <p
                  className={`profile-username-status profile-username-status--${usernameStatus.type}`}
                >
                  {usernameStatus.text}
                </p>
              )}
              <div className="profile-info-row">
                <span className="profile-info-label">Email</span>
                <span className="profile-info-value">
                  {user.email || "-"}
                </span>
              </div>
            </div>
          </section>

          <section
            className="profile-section profile-friends-section"
            aria-labelledby="profile-friends"
          >
            <div className="profile-section-header">
              <h2 id="profile-friends">Friends</h2>
              <button
                className="rules-btn rules-btn-primary profile-friends-btn"
                onClick={openModal}
              >
                Manage Friends
              </button>
            </div>
            <p className="profile-section-hint">
              Follow other players to see them on your leaderboard.
            </p>
          </section>

          {loading && (
            <p className="profile-status">Loading scores…</p>
          )}
          {error && (
            <p className="profile-status profile-status-error">{error}</p>
          )}

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
