import { API_BASE } from "./client";

async function getJson(path, errorMsg) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${errorMsg}${text ? ` (${text})` : ""}`);
  }
  return res.json();
}

export async function createPrompt(payload) {
  const res = await fetch(`${API_BASE}/prompts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Prompt could not be created.${
      text ? ` (${text})` : ""
      }
    `);
  }

  return res.json();
}

export async function fetchQuizQuestions(type, count = 5) {
  const data = await getJson(
    `/quiz/questions?type=${encodeURIComponent(type)}&count=${count}`,
    "Quiz questions could not be loaded."
  );
  return data.questions;
}