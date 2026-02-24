import { Link, useNavigate } from "react-router-dom";
import "./Game_Home.css";

export default function Game_Home() {
  const navigate = useNavigate();
  return (
    <div className="home">
      <section className="titlebox">
        <h1 className="title">Geography Guessing Game</h1>
        <p className="subtitle">
          Test your geography knowledge with a fun game! 
        </p>

        <div className="cta-buttons">
          <Link to="/flag-quiz" className="primary-btn">
            Start New Game
          </Link>
        </div>
      </section>
    </div>
  );
} 