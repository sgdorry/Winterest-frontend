import { Link } from "react-router-dom";
import "./Title.css";

export default function Title() {
  const today = new Date();
  const formatted = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="landing">

      <div className="landing-content">
        

        <h1 className="landing-title">Winpoint</h1>

        <hr className="landing-divider" />

        <p className="landing-tagline">
          Guess the place in 6 tries using geography hints.
        </p>


        <div className="landing-actions">
          <Link to="/home" className="btn-play">
            Play
          </Link>
          <Link to="/home" className="btn-secondary">
            How to Play
          </Link>
        </div>

        <div className="landing-categories">
          <span className="category-pill">Flags</span>
          <span className="category-pill">Countries</span>
          <span className="category-pill">States</span>
          <span className="category-pill">Counties</span>
        </div>
      </div>
    </div>
  );
}