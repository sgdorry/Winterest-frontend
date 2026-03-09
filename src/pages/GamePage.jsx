import { useEffect, useState, useCallback } from "react";
import Game from "../components/Game";
import { fetchCities, fetchStates, fetchCountries } from "../api/geo";
import { submitScore } from "../api/scores";

const FETCH_BY_TYPE = {
  cities: fetchCities,
  states: fetchStates,
  countries: fetchCountries,
};

export default function GamePage() {
  const [entityType, setEntityType] = useState(null);
  const [targetEntity, setTargetEntity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [scoreError, setScoreError] = useState("");

  const resetGame = () => {
    setEntityType(null);
    setTargetEntity(null);
    setScoreError("");
  };

  useEffect(() => {
    if (!entityType) return;

    const controller = new AbortController();

    const load = async () => {
      const fetchFn = FETCH_BY_TYPE[entityType];
      if (!fetchFn) {
        setError(`Unknown game type: ${entityType}`);
        setLoading(false);
        return;
      }

      try {
        const data = await fetchFn();
        if (controller.signal.aborted) return;

        const entityList = data || [];
        if (entityList.length > 0) {
          const randomEntity = entityList[Math.floor(Math.random() * entityList.length)];
          setTargetEntity(randomEntity);
        } else {
          setError("No data available for this game type.");
        }
      } catch {
        if (!controller.signal.aborted) {
          setError("Data could not be loaded.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    setTargetEntity(null);
    setLoading(true);
    setError("");
    setScoreError("");
    load();

    return () => controller.abort();
  }, [entityType]);

  const handleGameEnd = useCallback(
    async ({ score, guessesUsed }) => {
      try {
        await submitScore({ entityType, score, guessesUsed });
      } catch (err) {
        setScoreError(err.message || "Score could not be submitted.");
      }
    },
    [entityType],
  );

  return (
    <div>
      <div>
        <button onClick={() => setEntityType("cities")}>Cities</button>
        <button onClick={() => setEntityType("states")}>States</button>
        <button onClick={() => setEntityType("countries")}>Countries</button>
      </div>
      {!entityType && <p>Please select an entity type to start the game</p>}
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {scoreError && <p>{scoreError}</p>}
      {targetEntity && !loading && !error && (
        <Game
          entityType={entityType}
          targetEntity={targetEntity}
          onReset={resetGame}
          onGameEnd={handleGameEnd}
        />
      )}
    </div>
  );
}