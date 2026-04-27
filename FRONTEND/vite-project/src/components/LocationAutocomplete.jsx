import { useState } from "react";
import axios from "axios";

function LocationAutocomplete({ value, onSelect }) {
  const API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

  const [suggestions, setSuggestions] = useState([]);

  const fetchLocations = async (query) => {
    if (!query) return;

    try {
      const res = await axios.get(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
          query
        )}&filter=countrycode:in&limit=5&apiKey=${API_KEY}`
      );

      const results = res.data.features;

      setSuggestions(results);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    const input = e.target.value;

    onSelect(input, null); 
    fetchLocations(input);
  };

  const handleSelect = (place) => {
    const formatted = place.properties.formatted;
    const [lng, lat] = place.geometry.coordinates;

    onSelect(formatted, [lng, lat]); // IMPORTANT: [lng, lat]

    setSuggestions([]);
  };

  return (
    <div className="relative w-full">
      {/* INPUT */}
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Search location..."
        className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* DROPDOWN */}
      {suggestions.length > 0 && (
        <div className="absolute bg-white w-full shadow-lg rounded-lg mt-1 z-50 max-h-60 overflow-y-auto">
          {suggestions.map((place, index) => (
            <div
              key={index}
              onClick={() => handleSelect(place)}
              className="p-2 hover:bg-blue-100 cursor-pointer text-sm"
            >
              📍 {place.properties.formatted}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LocationAutocomplete;