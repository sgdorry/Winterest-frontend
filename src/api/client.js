const STATES_URL = "/api/states/states.json";

export async function fetchStates() {
  const res = await fetch(STATES_URL);

  if (!res.ok) {
    throw new Error("State list could not be loaded.");
  }

  return res.json();
}
