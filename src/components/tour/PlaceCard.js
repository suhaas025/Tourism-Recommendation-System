// PlaceCard.js
import React from 'react';
import './PlaceCard.css';

const PlaceCard = ({ place }) => {


  return (
    <div className="place-card">
      <img src={place.Image} alt={place.Name} />
      <p class = "para">{place.Name} - {Math.floor(place.distance)} km</p>
      <div className="place-card-content">
      <p>{place.Description}</p>
      </div>
    </div>
  );
};

export default PlaceCard;