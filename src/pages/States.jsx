import { useEffect, useState } from "react";
import { fetchStates } from "../api/geo";

function States() {
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getStates = async () => {
      try {
        const data = await fetchStates();
        setStates(data || []);
      } catch {
        setError("State list could not be loaded.");
      }
      setLoading(false);
    };

    getStates();
  }, []);

  return (
    <main>
      <h1>States</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      <ul>
        {states.map((state) => (
          <li key={state.code ?? state.name}>
            {state.name} ({state.code}) — Capital: {state.capital} — Governor:{" "}
            {state.governor} — Population:{" "}
            {typeof state.population === "number"
              ? state.population.toLocaleString()
              : state.population}
          </li>
        ))}
      </ul>
    </main>
  );
}

export default States;
