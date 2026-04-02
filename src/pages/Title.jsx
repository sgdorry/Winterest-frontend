import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Title.css";

export default function Title() {
  const images = {
    logo: "/landing/winpoint-logo.png",
    leaderboard: "/landing/leaderboard-button.png",
    play: "/landing/play-button.png",
    howToPlay: "/landing/how-to-play-button.png",
    signIn: "/landing/sign-in.png",
    createAccount: "/landing/create-account.png",
    plane: "/landing/plane.png",
    profilePic: "/landing/profile-pic.png",
  };
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="landing">
      <Link to={user ? "/profile" : "/login"} className="landing-profile-link" aria-label="Profile">
        <img src={images.profilePic} alt="Profile" className="landing-profile-pic" />
      </Link>
      <div className="landing-content">
        <img className="landing-plane" src={images.plane} alt="" aria-hidden="true" />
        <img className="landing-logo-image" src={images.logo} alt="Winpoint" />

        <div className="landing-actions-image-row">
          <Link to="/leaderboard" className="img-link img-link-leaderboard" aria-label="Leaderboard">
            <img src={images.leaderboard} alt="Leaderboard" />
          </Link>
          <Link to="/play" className="img-link img-link-play" aria-label="Play">
            <img src={images.play} alt="Play" />
          </Link>
          <Link to="/how-to-play" className="img-link img-link-howto" aria-label="How to play">
            <img src={images.howToPlay} alt="How to play" />
          </Link>
        </div>

        <div className="landing-auth-links">
          <Link to="/login" className="img-link img-link-auth" aria-label="Sign in">
            <img src={images.signIn} alt="Sign in" />
          </Link>
          <Link to="/signup" className="img-link img-link-auth" aria-label="Create account">
            <img src={images.createAccount} alt="Create account" />
          </Link>
        </div>
      </div>
    </div>
  );
}
