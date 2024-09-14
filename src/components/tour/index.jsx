import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get } from 'firebase/database';
import { app } from '../../firebase/firebase';
import './tourStyles.css';
import PlaceCard from './PlaceCard';
import PlaceCard1 from './PlaceCard1';



const getLatLng = async (placeName) => {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(placeName)}`);
    const data = await response.json();

    if (data.length > 0) {
      const location = data[0];
      return {
        latitude: parseFloat(location.lat),
        longitude: parseFloat(location.lon)
      };
    } else {
      throw new Error('Place not found');
    }
  } catch (error) {
    console.error('Error fetching location:', error);
    throw error;
  }
};


// Firebase Realtime Database instance
const database = getDatabase(app);

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 3963.0; // Earth radius in miles
  const lat1Rad = toRadians(lat1);
  const lon1Rad = toRadians(lon1);
  const lat2Rad = toRadians(lat2);
  const lon2Rad = toRadians(lon2);
  const dLon = lon2Rad - lon1Rad;
  const d = Math.acos(Math.sin(lat1Rad) * Math.sin(lat2Rad) + Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon));
  return R * d * 1.609;
};

// Function to convert degrees to radians
const toRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};
const fetchPlaces1 = async (userLatitude, userLongitude) => {
  try {
    const placesRef = ref(database, 'Places');
    const snapshot = await get(placesRef);
    const places = [];

    if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
        const place = childSnapshot.val();
        const distance = calculateDistance(userLatitude, userLongitude, place.Latitude, place.Longitude);
        places.push({ ...place, distance }); // Include distance in the place object
      });

      // Sort places based on distance (ascending order)
      places.sort((a, b) => a.distance - b.distance);
    }

    return places.slice(0, 5); // Return top 5 closest places
  } catch (error) {
    console.error('Error fetching places:', error);
    throw error;
  }
};

// Function to fetch places from Firebase Realtime Database
const fetchPlaces = async (locationType) => {
  try {
    const placesRef = ref(database, 'Places');
    const snapshot = await get(placesRef);
    const places = [];
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
      const place = childSnapshot.val();
      if (place.Type === locationType) { // Filter places based on location type
        places.push(place);
      }
      });
    }

    return places;
  } catch (error) {
    console.error('Error fetching places:', error);
    throw error;
  }
};





// Tourism Recommendation component
const Tour = () => {
  const [locationPreference, setLocationPreference] = useState('proximity');
  const [selectedType, setSelectedType] = useState('');
  const [places, setPlaces] = useState([]);
  const [location, setLocation] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [but,setBut]=useState(false)
  const handleLocationPreferenceChange = (preference) => {
    setLocationPreference(preference);
  };
// Function to get user location
const getUserLocation = () => {
  setBut(true)
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
      },
      (error) => {
        console.error('Error getting user location:', error);
      }
    );
  } else {
    console.error('Geolocation is not supported by this browser.');
  }
  findRecommendations()
};

  const handleTypeChange = (type) => {
    setSelectedType(type);
  };

  const findRecommendations = async () => {
    if (locationPreference === 'proximity') {
      try {
        if(but){
          const fetchedPlaces = await fetchPlaces1(userLocation.latitude,userLocation.longitude);
          setPlaces(fetchedPlaces);
        }
        else{
        const a=await getLatLng(location);
        const fetchedPlaces = await fetchPlaces1(a.latitude,a.longitude);
        setPlaces(fetchedPlaces);}
      } catch (error) {
        console.error('Error fetching places:', error);
      }
    } else {
      try {
        const fetchedPlaces = await fetchPlaces(selectedType);
        setPlaces(fetchedPlaces);
      } catch (error) {
        console.error('Error fetching places:', error);
      }
    }
  };

  return (
    <div class = "main">
      <div class = "cont1">
      <p class = "head">Choose Location Preference</p><br />
        <div class = "choice">
        <label>
          <input
            type="radio"
            value="proximity"
            checked={locationPreference === 'proximity'}
            onChange={() => handleLocationPreferenceChange('proximity')}
          />
          Based on Duration
        </label>
        <label>
          <input
            type="radio"
            value="terrain"
            checked={locationPreference === 'terrain'}
            onChange={() => handleLocationPreferenceChange('terrain')}
          />
          Based on Terrain
        </label>
        <label>
          <input
            type="radio"
            value="experience"
            checked={locationPreference === 'experience'}
            onChange={() => handleLocationPreferenceChange('experience')}
          />
          Based on Experience
        </label>
        </div>
      
      {locationPreference === 'proximity' && (
        <div>
          <input class = "loc" type="text" value={location} onChange={(e) => { setLocation(e.target.value) }} placeholder="Enter a Location"/>
          <button class = "button2" onClick={getUserLocation}>Get my location</button>
        </div>
      )}
      {locationPreference === 'experience' && (
        <div>
          <select value={selectedType} onChange={(e) => handleTypeChange(e.target.value)}>
            <option value="">Select Type</option>
            <option value="Historical">Historical</option>
            <option value="Religious">Religious</option>
            <option value="Educational">Educational</option>
            {/* Add more options as needed */}
          </select>
        </div>
      )}
      {locationPreference === 'terrain' && (
        <div>
          <select value={selectedType} onChange={(e) => handleTypeChange(e.target.value)}>
            <option value="">Select Type</option>
            <option value="Beach">Beach</option>
            <option value="Hill Station">Hill Station</option>
            <option value="Desert">Desert</option>
            <option value="Island">Island</option>
            {/* Add more options as needed */}
          </select>
        </div>
      )}

      <button class = "button1" onClick={findRecommendations}>Find Recommendations</button>

      </div>
      <div class = "content">
      {places.length > 0 && locationPreference === 'proximity' && (
        <div className="place-list">
        {places.map((place, index) => (
          <PlaceCard key={index} place={place} />
        ))}
        </div>
        
      )}
      

      {places.length > 0 && locationPreference === ('terrain')  && (
        <div className="place-list">
        {places.map((place, index) => (
          <PlaceCard1 key={index} place={place} />
        ))}
        </div>
      )}

      {places.length > 0 && locationPreference === ('experience')  && (
        <div className="place-list">
        {places.map((place, index) => (
          <PlaceCard1 key={index} place={place} />
        ))}
        </div>
      )}
      </div>
    </div>
  );
};

export default Tour;
