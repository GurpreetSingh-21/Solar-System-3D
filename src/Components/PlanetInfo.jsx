import React from "react";
import "./PlanetInfo.css";

const PlanetInfo = ({ planet }) => {
  if (!planet) return null;

  return (
    <div className="planet-info">
      <h2>{planet.name}</h2>
      <p>Distance from Sun: {planet.distance} million km</p>
      <p>Size: {planet.size} km</p>
      <p>{planet.description}</p>
    </div>
  );
};

export default PlanetInfo;
