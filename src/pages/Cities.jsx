import { useEffect, useState } from "react";
import { fetchCountries } from "../api/geo";

function Cities() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getCities = async () => {
      try {
        const data = await fetchCities();
        setCities(data || []);
      } catch {
        setError("City list could not be loaded.");
      }
      setLoading(false);
    };

    getCities();
  }, []);

  return (
    <main>
      <h1>Cities</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <ul>
        {cities.map((city) => (
          <li key={`${city.name}-${city.stateAbbreviation}`}>
            {city.name}, {city.state} ({city.stateAbbreviation}) - Population:{" "}
            {city.population.toLocaleString()}
          </li>
        ))}
      </ul>
    </main>
  );
}

export default Cities;
