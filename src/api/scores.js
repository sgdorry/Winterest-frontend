import { API_BASE } from "./client";

export async function fetchLeaderboard() {
  const res = await fetch(`${API_BASE}/scores`);

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Leaderboard could not be loaded. [${res.status}] ${text}`);
  }

  const data = await res.json();
  return data.scores;
}

export async function fetchLeaderboardFilters() {
  const res = await fetch(`${API_BASE}/leaderboard/filters`);

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Leaderboard filters could not be loaded. [${res.status}] ${text}`);
  }

  const data = await res.json();
  return Array.isArray(data.filters) ? data.filters : [];
}

export async function fetchAggregatedLeaderboard() {
  const res = await fetch(`${API_BASE}/scores/aggregated`);

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Leaderboard could not be loaded. [${res.status}] ${text}`);
  }

  const data = await res.json();
  return data.scores;
}

export async function fetchAggregatedFriendsLeaderboard(userId, period = "all") {
  const params = new URLSearchParams({ user_id: userId, period });
  const res = await fetch(`${API_BASE}/scores/friends/aggregated?${params}`);

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Leaderboard could not be loaded. [${res.status}] ${text}`);
  }

  const data = await res.json();
  return data.scores;
}

export async function submitScore({ entityType, score, guessesUsed, userId, selectedValues = [] }) {
  const body = {
    entity_type: entityType,
    score,
    guesses_used: guessesUsed,
    selected_values: selectedValues,
  };

  if (userId) {
    body.user_id = userId;
  }

  const res = await fetch(`${API_BASE}/scores`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Score could not be submitted. [${res.status}] ${text}`);
  }

  return res.json();
}
