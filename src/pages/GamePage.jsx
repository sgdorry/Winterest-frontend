import { useEffect, useState, useCallback } from "react";
import Game from "../components/Game";
import { fetchCities, fetchStates, fetchCountries } from "../api/geo";
import { submitScore } from "../api/scores";
import { useAuth } from "../context/AuthContext";
import "./GamePage.css";

const FETCH_BY_TYPE = {
  cities: fetchCities,
  states: fetchStates,
  countries: fetchCountries,
};

const GAME_OPTIONS = [
  {
    id: "countries",
    label: "Countries",
    image: "/game-select/countries-select.png",
  },
  {
    id: "states",
    label: "States",
    image: "/game-select/states-select.png",
  },
  {
    id: "cities",
    label: "Cities",
    image: "/game-select/cities-select.png",
  },
];

export default function GamePage() {
  const { user } = useAuth();
  const [entityType, setEntityType] = useState(null);
  const [targetEntity, setTargetEntity] = useState(null);
  const [allEntities, setAllEntities] = useState([]);
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
          setAllEntities(entityList);
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
    async ({ score, guessesUsed, selectedValues }) => {
      try {
        await submitScore({
          entityType,
          score,
          guessesUsed,
          userId: user?.id,
          selectedValues,
        });
      } catch (err) {
        setScoreError(err.message || "Score could not be submitted.");
      }
    },
    [entityType, user],
  );

  if (targetEntity && !loading && !error) {
    return (
      <Game
        entityType={entityType}
        targetEntity={targetEntity}
        allEntities={allEntities}
        onReset={resetGame}
        onGameEnd={handleGameEnd}
      />
    );
  }

  return (
    <main className="game-select-page">
      <section className="game-select-shell" aria-labelledby="game-select-title">
        <img
          className="game-select-title-image"
          src="/game-select/game-select.png"
          alt="Game Select"
          id="game-select-title"
        />

        <div className="game-select-card-grid" role="group" aria-label="Choose a game type">
          {GAME_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              className="game-select-card"
              onClick={() => setEntityType(option.id)}
              aria-label={option.label}
            >
              <img src={option.image} alt={option.label} />
            </button>
          ))}
        </div>

        {!entityType && (
          <p className="game-select-status">Please select a game mode to start the game.</p>
        )}
        {loading && <p className="game-select-status">Loading...</p>}
        {error && <p className="game-select-status game-select-status-error">{error}</p>}
        {scoreError && <p className="game-select-status game-select-status-error">{scoreError}</p>}
      </section>
    </main>
  );
}
