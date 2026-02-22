import { useEffect, useState } from "react";
import { fetchCountries } from "../api/geo";

function Countries() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getCountries = async () => {
      try {
        const data = await fetchCountries();
        setCountries(data || []);
      } catch {
        setError("Country list could not be loaded.");
      }
      setLoading(false);
    };

    getCountries();
  }, []);

  return (
    <main>
      <h1>Countries</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <ul>
        {countries.map((country) => (
          <li key={country.country_id}>
          {country.name} - Continent: {country.continent}
          </li>
        ))}
      </ul>
    </main>
  );
}

export default Countries;
