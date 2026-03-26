import { Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import FlagQuiz from './pages/FlagQuiz.jsx';
import Title from './pages/Title.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Rules from './pages/Rules.jsx';
import Leaderboard from './pages/Leaderboard.jsx';
import GamePage from './pages/GamePage.jsx';
import Profile from './pages/Profile.jsx';

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Title />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="*"
          element={
            <>
              <Navbar />
              <Routes>
                <Route path="/home" element={<Title />} />
                <Route path="/play" element={<GamePage />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/how-to-play" element={<Rules />} />
                <Route path="/flag-quiz" element={<FlagQuiz />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
