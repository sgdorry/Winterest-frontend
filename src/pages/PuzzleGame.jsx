import { useEffect, useMemo, useState } from "react";
import { fetchPuzzle } from "../api/puzzles";

const HINTS = ["population", "climate", "language", "flag_url"];

function normalize(s) {
  return (s || "").trim().toLowerCase();
}

export default function PuzzleGame() {
  const [entityType, setEntityType] = useState("country");
  const [puzzle, setPuzzle] = useState(null);
  const [hintIndex, setHintIndex] = useState(0);
  const [guess, setGuess] = useState("");
  const [result, setResult] = useState(""); // "", "correct", "wrong"
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const currentHintKey = useMemo(() => HINTS[hintIndex], [hintIndex]);

  async function load() {
    setLoading(true);
    setError("");
    setResult("");
    setGuess("");
    setHintIndex(0);

    try {
      const p = await fetchPuzzle(entityType);
      if (!p) {
        setError("No puzzles available yet.");
        setPuzzle(null);
      } else {
        setPuzzle(p);
      }
    } catch (e) {
      setError(e.message || "Puzzle could not be loaded.");
      setPuzzle(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityType]);

  function onSubmitGuess(e) {
    e.preventDefault();
    if (!puzzle) return;

    if (normalize(guess) === normalize(puzzle.answer)) {
      setResult("correct");
    } else {
      setResult("wrong");
    }
  }

  function revealNextHint() {
    setResult("");
    setHintIndex((i) => Math.min(i + 1, HINTS.length - 1));
  }

  const points = useMemo(() => {
    // 80/60/40/20 based on hint stage
    const scores = [80, 60, 40, 20];
    return scores[hintIndex] ?? 0;
  }, [hintIndex]);

  return (
    <main style={{ padding: 32, maxWidth: 720, margin: "0 auto" }}>
      <h1>Puzzle Game</h1>

      <div style={{ marginTop: 12, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <label>
          Mode:&nbsp;
          <select
            value={entityType}
            onChange={(e) => setEntityType(e.target.value)}
          >
            <option value="country">Countries</option>
            <option value="state">States</option>
            <option value="city">Cities</option>
            <option value="mixed">Mixed</option>
          </select>
        </label>

        <button onClick={load} disabled={loading}>
          New Puzzle
        </button>
      </div>

      {loading && <p style={{ marginTop: 16 }}>Loading...</p>}
      {error && <p style={{ marginTop: 16 }}>{error}</p>}

      {!loading && puzzle && (
        <>
          <div style={{ marginTop: 20, padding: 16, border: "1px solid #ddd" }}>
            <h2 style={{ marginTop: 0 }}>Hint {hintIndex + 1} / 4</h2>

            {currentHintKey !== "flag_url" ? (
              <p style={{ fontSize: 18 }}>
                <strong>{currentHintKey}:</strong> {puzzle[currentHintKey]}
              </p>
            ) : (
              <div>
                <p style={{ marginBottom: 12 }}>
                  <strong>flag:</strong>
                </p>
                <img
                  src={puzzle.flag_url}
                  alt="flag hint"
                  style={{ width: 240, height: "auto", border: "1px solid #ddd" }}
                />
              </div>
            )}

            <p style={{ marginTop: 12 }}>Points if correct now: {points}</p>
          </div>

          <form onSubmit={onSubmitGuess} style={{ marginTop: 16 }}>
            <label>
              Your guess:&nbsp;
              <input
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                placeholder="Type the answer"
                style={{ padding: 8, width: "min(360px, 90%)" }}
              />
            </label>
            <button type="submit" style={{ marginLeft: 10 }}>
              Submit
            </button>
          </form>

          {result === "correct" && (
            <p style={{ marginTop: 12 }}>
                Correct: <strong>{puzzle.answer}</strong>
            </p>
          )}

          {result === "wrong" && (
            <p style={{ marginTop: 12 }}>
                Not quite. Try again, or reveal the next hint.
            </p>
          )}

          <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
            <button
              onClick={revealNextHint}
              disabled={hintIndex >= HINTS.length - 1}
            >
              Reveal Next Hint
            </button>
            <button onClick={() => setGuess("")}>Clear</button>
          </div>

          {hintIndex >= HINTS.length - 1 && result !== "correct" && (
            <p style={{ marginTop: 12 }}>
              Last hint shown. Answer: <strong>{puzzle.answer}</strong>
            </p>
          )}
        </>
      )}
    </main>
  );
}