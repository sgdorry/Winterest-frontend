import { useEffect, useState } from "react";
import HintCard from "../components/HintCard";
import "./Game.css";

const TOTAL_GUESSES = 5;

export default function game(props) {
    const {entityType, targetEntity} = props; 
    const [guesses, setGuesses] = useState(Array(TOTAL_GUESSES).fill(""));
    const [currentGuess, setCurrentGuess] = useState(0);
    const [gameStatus, setGameStatus] = useState("idle"); 

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

  return (
    <main className="game-page">
      <div className="game-shell">

        <header className="game-header">
          <p className="game-eyebrow">Winpoint</p>
          <h1 className="game-title">Guess the {entityType}</h1>
          <p className="game-subtitle">
            You have 5 guesses to name the mystery city.
            Type your answer in each row below.
          </p>
        </header>

        {gameStatus === "idle" && (
          <div className="game-actions">
            <button type="button" className="game-submit" onClick={handlePlay}>
              Play
            </button>
          </div>
        )}

        {gameStatus !== "idle" && (
          <>
            {targetEntity && (
              <div className="game-hints">
                {targetEntity.hints.slice(0, currentGuess + 1).map((hint, i) => (
                  <HintCard key={i} hint={hint} />
                ))}
              </div>
            )}

            {gameStatus === "lost" && targetEntity && (
              <div className="game-hints">
                {targetEntity.hints.slice(currentGuess + 1).map((hint, i) => (
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
            You won! The city was <strong>{targetEntity.name}</strong>.
          </div>
        )}

        {gameStatus === "lost" && (
          <div className="game-message game-message--lost">
            The answer was <strong>{targetEntity.name}</strong>, {targetEntity.state}.
          </div>
        )}
        {gameStatus === "won" || gameStatus === "lost" ? (
            <div className="game-actions">
                <button className="game-submit" onClick={props.onReset}>
                Play Again
                </button>
            </div>
        ) : null}

      </div>
    </main>
  );
}
