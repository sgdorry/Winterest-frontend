import { useEffect, useState } from "react";
import { fetchCities } from "../api/geo";
import HintCard from "../components/HintCard";
import "./Cities.css";

const TOTAL_GUESSES = 5;

export default function Cities() {
  const [guesses, setGuesses] = useState(Array(TOTAL_GUESSES).fill(""));
  const [cities, setCities] = useState([]);
  const [targetCity, setTargetCity] = useState(null);
  const [currentGuess, setCurrentGuess] = useState(0);
  const [gameStatus, setGameStatus] = useState("idle"); // "idle" | "playing" | "won" | "lost"
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCities = async () => {
      try {
        const data = await fetchCities();
        const cityList = data || [];
        setCities(cityList);
        if (cityList.length > 0) {
          const random = cityList[Math.floor(Math.random() * cityList.length)];
          setTargetCity(random);
        }
      } catch {
        setError("City list could not be loaded.");
      }
      setLoading(false);
    };
    loadCities();
  }, []);

  const handlePlay = () => {
    setGameStatus("playing");
  };

  const handleChange = (index, value) => {
    if (index !== currentGuess || gameStatus !== "playing") return;
    setGuesses((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!targetCity || gameStatus !== "playing") return;

    const guess = guesses[currentGuess].trim();
    if (!guess) return;

    if (guess.toLowerCase() === targetCity.name.toLowerCase()) {
      setGameStatus("won");
    } else if (currentGuess >= TOTAL_GUESSES - 1) {
      setGameStatus("lost");
    } else {
      setCurrentGuess((prev) => prev + 1);
    }
  };

  if (loading) {
    return (
      <main className="cities-page">
        <div className="cities-shell">
          <p className="cities-loading">Loading...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="cities-page">
        <div className="cities-shell">
          <p className="cities-error">{error}</p>
        </div>
      </main>
    );
  }

  const gameOver = gameStatus !== "playing";

  return (
    <main className="cities-page">
      <div className="cities-shell">

        <header className="cities-header">
          <p className="cities-eyebrow">Winpoint</p>
          <h1 className="cities-title">Guess the City</h1>
          <p className="cities-subtitle">
            You have 5 guesses to name the mystery city.
            Type your answer in each row below.
          </p>
        </header>

        {gameStatus === "idle" && (
          <div className="cities-actions">
            <button type="button" className="cities-submit" onClick={handlePlay}>
              Play
            </button>
          </div>
        )}

        {gameStatus !== "idle" && (
          <>
            {targetCity && (
              <div className="cities-hints">
                {targetCity.hints.slice(0, currentGuess + 1).map((hint, i) => (
                  <HintCard key={i} hint={hint} />
                ))}
              </div>
            )}

            {gameStatus === "lost" && targetCity && (
              <div className="cities-hints">
                {targetCity.hints.slice(currentGuess + 1).map((hint, i) => (
                  <HintCard key={`final-${i}`} hint={hint} />
                ))}
              </div>
            )}

            <form className="cities-board" onSubmit={handleSubmit}>
              {guesses.map((value, index) => (
                <div
                  className={`cities-guess-row${index === currentGuess && !gameOver ? " cities-guess-row--active" : ""}`}
                  key={index}
                >
                  <span className="cities-row-number">{index + 1}</span>
                  <input
                    className="cities-input"
                    type="text"
                    value={value}
                    onChange={(e) => handleChange(index, e.target.value)}
                    placeholder={`Guess ${index + 1}`}
                    autoComplete="off"
                    aria-label={`Guess ${index + 1}`}
                    disabled={index !== currentGuess || gameOver}
                  />
                </div>
              ))}

              {!gameOver && (
                <div className="cities-actions">
                  <button type="submit" className="cities-submit">
                    Submit Guess
                  </button>
                </div>
              )}
            </form>
          </>
        )}

        
        {gameStatus === "won" && (
          <div className="cities-message cities-message--won">
            You won! The city was <strong>{targetCity.name}</strong>.
          </div>
        )}

        {gameStatus === "lost" && (
          <div className="cities-message cities-message--lost">
            The answer was <strong>{targetCity.name}</strong>, {targetCity.state}.
          </div>
        )}

      </div>
    </main>
  );
}
