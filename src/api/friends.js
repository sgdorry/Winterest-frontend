import { API_BASE } from "./client";

export async function addFriend(userId, friendEmail) {
  const res = await fetch(`${API_BASE}/friends`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId, friend_email: friendEmail }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to add friend");
  }
  return data;
}

export async function removeFriend(userId, friendId) {
  const res = await fetch(`${API_BASE}/friends`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId, friend_id: friendId }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to remove friend");
  }
  return data;
}

export async function fetchFriends(userId) {
  const res = await fetch(`${API_BASE}/friends?user_id=${encodeURIComponent(userId)}`);

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to fetch friends");
  }
  return data.friends;
}

export async function fetchFriendsLeaderboard(userId) {
  const res = await fetch(`${API_BASE}/scores/friends?user_id=${encodeURIComponent(userId)}`);

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to fetch friends leaderboard");
  }
  return data.scores;
}
