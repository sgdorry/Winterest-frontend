import { Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Cities from "./pages/Cities";
import Counties from "./pages/Counties";
import Countries from "./pages/Countries";
import States from "./pages/States";
import Game_Home from './pages/Game_Home';
import FlagQuiz from './pages/FlagQuiz.jsx';


function App() {
  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/" element={<Game_Home />} />
        <Route path="/home" element={<Game_Home />} />
        <Route path="/flag-quiz" element={<FlagQuiz />} />
        <Route path="/countries" element={<Countries />} />
        <Route path="/states" element={<States />} />
        <Route path="/cities" element={<Cities />} />
        <Route path="/counties" element={<Counties />} />
      </Routes>
    </div>
  );
}

export default App;