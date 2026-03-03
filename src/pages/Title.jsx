import { Link } from "react-router-dom";
import "./Title.css";

export default function Title() {
  const images = {
    logo: "/landing/winpoint-logo.png",
    leaderboard: "/landing/leaderboard-button.png",
    play: "/landing/play-button.png",
    howToPlay: "/landing/how-to-play-button.png",
    plane: "/landing/plane.png",
  };

  return (
    <div className="landing">
      <div className="landing-content">
        <img className="landing-plane" src={images.plane} alt="" aria-hidden="true" />
        <img className="landing-logo-image" src={images.logo} alt="Winpoint" />

        <div className="landing-actions-image-row">
          <Link to="/home" className="img-link img-link-leaderboard" aria-label="Leaderboard">
            <img src={images.leaderboard} alt="Leaderboard" />
          </Link>
          <Link to="/home" className="img-link img-link-play" aria-label="Play">
            <img src={images.play} alt="Play" />
          </Link>
          <Link to="/home" className="img-link img-link-howto" aria-label="How to play">
            <img src={images.howToPlay} alt="How to play" />
          </Link>
        </div>

        <div className="landing-auth-links">
          <Link to="/login" className="auth-button auth-button-signin">Sign in</Link>
          <Link to="/signup" className="auth-button auth-button-create">Create account</Link>
        </div>
      </div>
    </div>
  );
}
