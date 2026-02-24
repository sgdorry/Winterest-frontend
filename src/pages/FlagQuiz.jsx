import { useEffect, useState } from "react";
import { fetchQuizQuestions } from "../api/quiz";

export default function FlagQuiz() {
  const [questions, setQuestions] = useState([]);
  const [i, setI] = useState(0);
  const [guess, setGuess] = useState("");
  const [score, setScore] = useState(0);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchQuizQuestions("COUNTRY_FLAG", 5)
      .then((qs) => setQuestions(qs || []))
      .catch((e) => setError(e.message || "Could not load quiz"));
  }, []);

  if (error) return <main style={{ padding: 20 }}>{error}</main>;
  if (questions.length === 0)
    return (
      <main style={{ padding: 20 }}>
        No flag prompts yet. Add some first.
      </main>
    );

  const q = questions[i];

  function submit() {
    const correct =
      guess.trim().toLowerCase() === (q.answer || "").trim().toLowerCase();

    setMsg(correct ? "Correct." : `Wrong. Answer: ${q.answer}`);
    if (correct) setScore((s) => s + 20);

    setGuess("");
    if (i < questions.length - 1) setI((x) => x + 1);
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>Flag Quiz</h1>
      <p>
        Question {i + 1} / {questions.length} — Score: {score}
      </p>

      <img
        src={q.asset_url}
        alt="flag"
        style={{ width: 320, height: "auto", border: "1px solid #ddd" }}
      />

      <div style={{ marginTop: 12 }}>
        <input
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Type the country name"
        />
        <button onClick={submit} style={{ marginLeft: 8 }}>
          Submit
        </button>
      </div>

      {msg && <p style={{ marginTop: 12 }}>{msg}</p>}
    </main>
  );
}