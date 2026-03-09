import { Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Cities from "./pages/Cities";
import Counties from "./pages/Counties";
import Countries from "./pages/Countries";
import States from "./pages/States";
import FlagQuiz from './pages/FlagQuiz.jsx';
import Title from './pages/Title.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Rules from './pages/Rules.jsx';
import Leaderboard from './pages/Leaderboard.jsx';
import GamePage from './pages/GamePage.jsx';

console.log(import.meta.env.VITE_API_BASE_URL)

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
                <Route path="/home" element={<Title/>} />
                <Route path="/play" element = {<GamePage/>} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/how-to-play" element={<Rules />} />
                <Route path="/flag-quiz" element={<FlagQuiz />} />
                <Route path="/countries" element={<Countries />} />
                <Route path="/states" element={<States />} />
                <Route path="/cities" element={<Cities />} />
                <Route path="/counties" element={<Counties />} />
              </Routes>
            </>
          }
        />
      </Routes>
    </div>
  );
}


export default App;
