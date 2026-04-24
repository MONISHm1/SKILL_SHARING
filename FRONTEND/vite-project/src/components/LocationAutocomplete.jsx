import { useState } from "react";
import axios from "axios";

function LocationAutocomplete({ value, onSelect }) {
    console.log(import.meta.env.VITE_OPENCAGE_API_KEY);
  const [suggestions, setSuggestions] = useState([]);

  const fetchLocations = async (query) => {
    if (!query) return;

    try {
      const res = await axios.get(
  `https://api.opencagedata.com/geocode/v1/json?q=${query}&countrycode=in&key=${import.meta.env.VITE_OPENCAGE_API_KEY}`
);

      const results = res.data.results.slice(0, 5);

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
    const { formatted, geometry } = place;

    onSelect(formatted, [geometry.lng, geometry.lat]);

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
              📍 {place.formatted}
            </div>
          ))}

        </div>
      )}
    </div>
  );
}

export default LocationAutocomplete;