import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchFriends, fetchFriendsLeaderboard } from "../api/friends";
import "./Rules.css";
import "./Profile.css";

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }

    const baseProfile = {
      id: user.id,
      username: user.username || "",
      email: user.email || "",
      score: Number.isFinite(user.score) ? user.score : 0,
      games_played: Number.isFinite(user.games_played)
        ? user.games_played
        : 0,
      friends: Array.isArray(user.friends) ? user.friends : [],
    };

    if (!baseProfile.username && baseProfile.email.includes("@")) {
      baseProfile.username = baseProfile.email.split("@", 1)[0];
    }

    setProfile(baseProfile);

    const needsFriends = !Array.isArray(user.friends);
    const needsStats =
      !Number.isFinite(user.score) ||
      !Number.isFinite(user.games_played);

    if (!needsFriends && !needsStats) {
      return;
    }

    setLoading(true);
    setError("");

    const requests = [];
    if (needsFriends) {
      requests.push(fetchFriends(user.id));
    }
    if (needsStats) {
      requests.push(fetchFriendsLeaderboard(user.id));
    }

    Promise.all(requests)
      .then((results) => {
        let nextFriends = baseProfile.friends;
        let nextScore = baseProfile.score;
        let nextGamesPlayed = baseProfile.games_played;
        let idx = 0;

        if (needsFriends) {
          nextFriends = Array.isArray(results[idx]) ? results[idx] : [];
          idx += 1;
        }

        if (needsStats) {
          const leaderboard = Array.isArray(results[idx]) ? results[idx] : [];
          const mine = leaderboard.filter(
            (entry) =>
              entry.user_id === user.id ||
              entry.player === (user.email || "")
          );
          nextGamesPlayed = mine.length;
          nextScore = mine.reduce((sum, entry) => sum + (entry.score || 0), 0);
        }

        const mergedProfile = {
          ...baseProfile,
          friends: nextFriends,
          score: nextScore,
          games_played: nextGamesPlayed,
        };

        setProfile(mergedProfile);
      })
      .catch((err) => {
        setError(err.message || "Failed to load profile details");
      })
      .finally(() => setLoading(false));
  }, [user]);

  if (!profile) {
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

  return (
    <main className="rules-page">
      <div className="rules-shell profile-shell">
        <section className="rules-section profile-card" aria-labelledby="profile-title">
          <h1 id="profile-title" className="rules-title profile-title">Your Profile</h1>

          {loading && <p className="profile-status">Loading profile...</p>}
          {error && <p className="profile-status profile-status-error">{error}</p>}

          <section className="profile-section" aria-labelledby="profile-user-info">
            <h2 id="profile-user-info">User Info</h2>
            <div className="profile-info-grid">
              <div className="profile-info-row">
                <span className="profile-info-label">Username</span>
                <span className="profile-info-value">{profile.username || "-"}</span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Email</span>
                <span className="profile-info-value">{profile.email || "-"}</span>
              </div>
            </div>
          </section>

          <section className="profile-section" aria-labelledby="profile-stats">
            <h2 id="profile-stats">Stats</h2>
            <div className="profile-stats-grid">
              <div className="profile-stat">
                <span className="profile-stat-value">{profile.score || 0}</span>
                <span className="profile-stat-label">Score</span>
              </div>
              <div className="profile-stat">
                <span className="profile-stat-value">{profile.games_played || 0}</span>
                <span className="profile-stat-label">Games Played</span>
              </div>
            </div>
          </section>

          <section className="profile-section" aria-labelledby="profile-friends">
            <h2 id="profile-friends">Friends</h2>
            {Array.isArray(profile.friends) && profile.friends.length > 0 ? (
              <ul className="profile-friends-list">
                {profile.friends.map((friend, idx) => {
                  const friendName =
                    typeof friend === "string"
                      ? friend
                      : friend.email || friend.id || `Friend ${idx + 1}`;
                  return <li key={friend.id || friend.email || idx}>{friendName}</li>;
                })}
              </ul>
            ) : (
              <p className="profile-empty-friends">No friends added yet.</p>
            )}
          </section>
        </section>
      </div>
    </main>
  );
}
