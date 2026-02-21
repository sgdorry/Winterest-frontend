const STATES_URL = "/api/states/states.json";
const CITIES_URL = "/api/cities/cities.json";

export async function fetchStates() {
  const res = await fetch(STATES_URL);

  if (!res.ok) {
    throw new Error("State list could not be loaded.");
  }

  return res.json();
}

export async function fetchCities() {
  const res = await fetch(CITIES_URL);

  if (!res.ok) {
    throw new Error("City list could not be loaded.");
  }

  return res.json();
}
