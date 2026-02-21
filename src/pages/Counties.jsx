import { useEffect, useState } from "react";
import { fetchCounties } from "../api/client";

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
        {counties.map((county) => (
          <li key={`${county.name}-${county.stateAbbreviation}`}>
            {county.name}, {county.state} ({county.stateAbbreviation}) - Seat:{" "}
            {county.seat}
          </li>
        ))}
      </ul>
    </main>
  );
}

export default Counties;
