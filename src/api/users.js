import { API_BASE } from "./client";
async function postJson(path, body, errorMsg) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || errorMsg);
  }

  return data;
}

async function putJson(path, body, errorMsg) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || errorMsg);
  }

  return data;
}

export async function signup(email, username, password) {
  return postJson("/signup", { email, username, password }, "Signup failed");
}

export async function login(email, password) {
  return postJson("/login", { email, password }, "Login failed");
}

export async function updateUsername(userId, username) {
  return putJson(
    "/users/username",
    { user_id: userId, username },
    "Failed to update username"
  );
}