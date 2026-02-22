import { API_BASE } from "./client";

async function getJson(path, errorMsg) {
  const res = await fetch(`${API_BASE}${path}`);

  if (!res.ok) {
    let detail = "";
    try {
      const text = await res.text();
      detail = text ? ` (${text})` : "";
    } catch {}
    throw new Error(`${errorMsg} [${res.status}]${detail}`);
  }

  return res.json();
}

export async function fetchCountries() {
  const data = await getJson(
    "/countries",
    "Country list could not be loaded."
  );
  return data.countries;
}

export async function fetchStates() {
  const data = await getJson(
    "/states",
    "State list could not be loaded."
  );
  return data.states;
}

export async function fetchCities() {
  const data = await getJson(
    "/cities",
    "City list could not be loaded."
  );
  return data.cities;
}

export async function fetchCounties() {
  const data = await getJson(
    "/counties",
    "County list could not be loaded."
  );
  return data.counties;
}