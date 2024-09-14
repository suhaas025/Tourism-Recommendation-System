// PlaceCard.js
import React from 'react';
import './PlaceCard.css';

const PlaceCard1 = ({ place }) => {


  return (
    <div className="place-card">
      <img src={place.Image} alt={place.Name} />
      <p class = "para">{place.Name}</p>
      <div className="place-card-content">
      <p>{place.Description}</p>
      </div>
    </div>
  );
};

export default PlaceCard1;