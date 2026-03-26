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

export async function submitScore({ entityType, score, guessesUsed }) {
  const body = {
    entity_type: entityType,
    score,
    guesses_used: guessesUsed,
  };

  try {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (stored && stored.id) {
      body.user_id = stored.id;
    }
  } catch {
    // This comment should fix "Empty block statement" error
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
