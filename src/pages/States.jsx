import { useEffect, useState } from "react";
import { fetchStates } from "../api/client";

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
          <li key={state.abbreviation}>
            {state.name} ({state.abbreviation}) - Capital: {state.capital} - Region:{" "}
            {state.region}
          </li>
        ))}
      </ul>
    </main>
  );
}

export default States;
