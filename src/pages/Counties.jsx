import { useEffect, useState } from "react";
import { fetchCounties } from "../api/geo";

function Counties() {
  const [counties, setCounties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getCounties = async () => {
      try {
        const data = await fetchCounties();
        setCounties(data || []);
      } catch {
        setError("County list could not be loaded.");
      }
      setLoading(false);
    };

    getCounties();
  }, []);

  return (
   <main>
      <h1>Counties</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      <ul>
        {counties.map((county) => {
          const stateCode = county.state_code ?? county.STATE_CODE ?? "";
          return (
            <li key={`${county.name}-${stateCode}`}>
              {county.name}, {county.state}
              {stateCode ? ` (${stateCode})` : ""} — Seat: {county.county_seat} —
              Population:{" "}
              {typeof county.population === "number"
                ? county.population.toLocaleString()
                : county.population}
            </li>
          );
        })}
      </ul>
    </main>
  );
}

export default Counties;
