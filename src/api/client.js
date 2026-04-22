const DEFAULT_API_BASE = import.meta.env.DEV
  ? "http://127.0.0.1:8000"
  : window.location.origin;

export const API_BASE =
  (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE).trim();