import { useEffect, useState, useRef } from "react";
import HintCard from "../components/HintCard";
import "./Game.css";

const TOTAL_GUESSES = 5;

const SINGULAR_LABELS = {
  cities: "city",
  states: "state",
  countries: "country",
};

export default function Game({ entityType, targetEntity, allEntities = [], onReset, onGameEnd }) {
  const [guesses, setGuesses] = useState(Array(TOTAL_GUESSES).fill(""));
  const [currentGuess, setCurrentGuess] = useState(0);
  const [gameStatus, setGameStatus] = useState("idle");
  const gameEndFired = useRef(false);

  const label = SINGULAR_LABELS[entityType] || entityType;
  const hints = targetEntity?.hints || [];
  const useDropdown = (
    entityType === "cities"
    || entityType === "countries"
    || entityType === "states"
  )
    && allEntities.length > 0;
  const sortedNames = useDropdown
    ? [...new Set(allEntities.map((e) => e.name))].sort()
    : [];

  useEffect(() => {
    if (gameEndFired.current) return;
    if (gameStatus !== "won" && gameStatus !== "lost") return;
    gameEndFired.current = true;

    const score = gameStatus === "won"
      ? (TOTAL_GUESSES - currentGuess) * 100
      : 0;
    const selectedValues = guesses
      .map((guess) => guess.trim())
      .filter(Boolean);

    if (onGameEnd) {
      onGameEnd({ score, guessesUsed: currentGuess + 1, selectedValues });
    }
  }, [gameStatus, currentGuess, guesses, onGameEnd]);

  if (!targetEntity) return null;

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
    if (!targetEntity || gameStatus !== "playing") return;

    const guess = guesses[currentGuess].trim();
    if (!guess) return;

    if (guess.toLowerCase() === targetEntity.name.toLowerCase()) {
      setGameStatus("won");
    } else if (currentGuess >= TOTAL_GUESSES - 1) {
      setGameStatus("lost");
    } else {
      setCurrentGuess((prev) => prev + 1);
    }
  };

  const gameOver = gameStatus !== "playing";
  const score = gameStatus === "won"
    ? (TOTAL_GUESSES - currentGuess) * 100
    : 0;

  return (
    <main className="game-page">
      <div className="game-shell">

        {entityType === "countries" ? (
          <img
            src="/guess-the-country.png"
            alt="Guess the Country"
            className="game-header-img"
          />
        ) : entityType === "states" ? (
          <img
            src="/guess-the-state.png"
            alt="Guess the State"
            className="game-header-img"
          />
        ) : entityType === "cities" ? (
          <img
            src="/guess-the-city.png"
            alt="Guess the City"
            className="game-header-img"
          />
        ) : (
          <header className="game-header">
            <p className="game-eyebrow">Winpoint</p>
            <h1 className="game-title">Guess the {label}</h1>
            <p className="game-subtitle">
              You have {TOTAL_GUESSES} guesses to name the mystery {label}.
              {useDropdown
                ? " Select your answer from the dropdown below."
                : " Type your answer in each row below."}
            </p>
          </header>
        )}

        {gameStatus === "idle" && (
          <div className="game-actions">
            <button type="button" className="game-submit" onClick={handlePlay}>
              Play
            </button>
          </div>
        )}

        {gameStatus !== "idle" && (
          <>
            {hints.length > 0 && (
              <div className="game-hints">
                {hints.slice(0, currentGuess + 1).map((hint, i) => (
                  <HintCard key={i} hint={hint} />
                ))}
              </div>
            )}

            {gameStatus === "lost" && hints.length > currentGuess + 1 && (
              <div className="game-hints">
                {hints.slice(currentGuess + 1).map((hint, i) => (
                  <HintCard key={`final-${i}`} hint={hint} />
                ))}
              </div>
            )}

            <form className="game-board" onSubmit={handleSubmit}>
              {guesses.map((value, index) => (
                <div
                  className={`game-guess-row${index === currentGuess && !gameOver ? " game-guess-row--active" : ""}`}
                  key={index}
                >
                  <span className="game-row-number">{index + 1}</span>
                  {useDropdown ? (
                    <select
                      className="game-input"
                      value={value}
                      onChange={(e) => handleChange(index, e.target.value)}
                      aria-label={`Guess ${index + 1}`}
                      disabled={index !== currentGuess || gameOver}
                    >
                      <option value="">Select a {label}</option>
                      {sortedNames.map((name) => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      className="game-input"
                      type="text"
                      value={value}
                      onChange={(e) => handleChange(index, e.target.value)}
                      placeholder={`Guess ${index + 1}`}
                      autoComplete="off"
                      aria-label={`Guess ${index + 1}`}
                      disabled={index !== currentGuess || gameOver}
                    />
                  )}
                </div>
              ))}

              {!gameOver && (
                <div className="game-actions">
                  <button type="submit" className="game-submit">
                    Submit Guess
                  </button>
                </div>
              )}
            </form>
          </>
        )}

        {gameStatus === "won" && (
          <div className="game-message game-message--won">
            You won! The {label} was <strong>{targetEntity.name}</strong>.
            {" "}You scored <strong>{score}</strong> points!
          </div>
        )}

        {gameStatus === "lost" && (
          <div className="game-message game-message--lost">
            The answer was <strong>{targetEntity.name}</strong>
            {targetEntity.state && <>, {targetEntity.state}</>}.
            {" "}You scored <strong>0</strong> points.
          </div>
        )}

        {(gameStatus === "won" || gameStatus === "lost") && (
          <div className="game-actions">
            <button className="game-submit" onClick={onReset}>
              Play Again
            </button>
          </div>
        )}

      </div>
    </main>
  );
}
