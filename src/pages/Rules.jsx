import { Link } from "react-router-dom";
import "./Rules.css";

export default function Rules() {
  return (
    <main className="rules-page">
      <div className="rules-shell">
        <header className="rules-header">
          <p className="rules-eyebrow">Winpoint</p>
          <h1 className="rules-title">How to Play</h1>
          <p className="rules-subtitle">
            Choose a mode and guess the location in 5 tries using hints that
            get more specific after each wrong guess.
          </p>

          <div className="rules-actions">
            <Link to="/" className="rules-btn rules-btn-secondary">
              Back
            </Link>
            <Link to="/home" className="rules-btn rules-btn-primary">
              Play
            </Link>
          </div>
        </header>

        <section className="rules-section" aria-labelledby="rules-flow">
          <h2 id="rules-flow">Quick Start</h2>
          <ol className="rules-list rules-list-numbered">
            <li>
              Choose a game version: Countries, States, Cities, or Counties.
            </li>
            <li>Start a new game and read the first hint.</li>
            <li>Make your guess for the location.</li>
            <li>
              If your guess is wrong, a more specific hint is revealed and you
              guess again.
            </li>
            <li>You get 5 total guesses for each game.</li>
          </ol>
        </section>

        <section className="rules-section" aria-labelledby="rules-outcomes">
          <h2 id="rules-outcomes">Win or Lose</h2>
          <ul className="rules-list">
            <li>
              Guess the correct location within 5 guesses to win the game.
            </li>
            <li>
              If all 5 guesses are incorrect, you lose and receive 0 points.
            </li>
          </ul>
        </section>

        <section className="rules-section" aria-labelledby="rules-scoring">
          <h2 id="rules-scoring">Scoring</h2>
          <div className="rules-table-wrap">
            <table className="rules-table">
              <thead>
                <tr>
                  <th scope="col">Correct On Guess</th>
                  <th scope="col">Points</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1st guess</td>
                  <td>500</td>
                </tr>
                <tr>
                  <td>2nd guess</td>
                  <td>400</td>
                </tr>
                <tr>
                  <td>3rd guess</td>
                  <td>300</td>
                </tr>
                <tr>
                  <td>4th guess</td>
                  <td>200</td>
                </tr>
                <tr>
                  <td>5th guess</td>
                  <td>100</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="rules-note">
            Points from each completed game are added to your total score.
          </p>
        </section>

        <section className="rules-section" aria-labelledby="rules-account">
          <h2 id="rules-account">Accounts and Leaderboard</h2>
          <ul className="rules-list">
            <li>An account is required to play and save your total points.</li>
            <li>
              Players are ranked on the leaderboard by highest total points
              accumulated.
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
