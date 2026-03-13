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
  const res = await fetch(`${API_BASE}/scores`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      entity_type: entityType,
      score,
      guesses_used: guessesUsed,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Score could not be submitted. [${res.status}] ${text}`);
  }

  return res.json();
}
