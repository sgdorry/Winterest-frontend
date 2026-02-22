import { Link } from "react-router-dom";
import "./Game_Home.css";

export default function Game_Home() {
  return (
    <div className="home">
      <section className="titlebox">
        <h1 className="title">Geography Guessing Game</h1>
        <p className="subtitle">
          Test your geography knowledge with a fun game! 
        </p>

        <div className="cta-buttons">
          <Link to="/game" className="primary-btn">
            Start New Game
          </Link>
        </div>
      </section>
    </div>
  );
} 