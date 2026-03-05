import { API_BASE } from "./client";

async function getJson(path, errorMsg) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${errorMsg} [${res.status}] ${text}`);
  }
  return res.json();
}

export async function fetchPuzzle(entityType = "country") {
  const data = await getJson(
    `/puzzle/quiz?entity_type=${encodeURIComponent(entityType)}&count=1`,
    "Puzzle could not be loaded."
  );
  return (data.puzzles && data.puzzles[0]) || null;
}