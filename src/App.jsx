import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Navbar from "./components/Navbar/Navbar";
import Cities from "./pages/Cities";
import Counties from "./pages/Counties";
import Countries from "./pages/Countries";
import States from "./pages/States";
import Game_Home from './pages/Game_Home';

function App() {
  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/" element={<Game_Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/countries" element={<Countries />} />
        <Route path="/states" element={<States />} />
        <Route path="/cities" element={<Cities />} />
        <Route path="/counties" element={<Counties />} />
      </Routes>
    </div>
  );
}

export default App;