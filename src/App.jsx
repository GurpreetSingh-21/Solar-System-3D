import React from "react";
import SolarSystem from "./Components/SolarSystem";
import Navbar from "./Components/Navbar";
import "./index.css";

function App() {
  return (
    <div className="canvas-container">
      <Navbar />
      <SolarSystem />
    </div>
  );
}

export default App;
