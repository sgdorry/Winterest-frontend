import { Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Cities from "./pages/Cities";
import Counties from "./pages/Counties";
import Countries from "./pages/Countries";
import States from "./pages/States";
import Game_Home from './pages/Game_Home';
import FlagQuiz from './pages/FlagQuiz.jsx';
import Title from './pages/Title.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';


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
                <Route path="/home" element={<Game_Home />} />
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