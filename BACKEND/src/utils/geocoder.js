import axios from "axios";

export const getCoordinates = async (location) => {
  try {
    const cleanLocation = location.trim();

    console.log("📍 LOCATION:", cleanLocation);

    const res = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(cleanLocation)}&countrycode=in&key=${process.env.OPENCAGE_API_KEY}`
    );

    console.log("🌍 API RESPONSE:", res.data);

    if (!res.data.results || res.data.results.length === 0) {
      throw new Error("Location not found. Try full name like 'Bangalore, India'");
    }

    
    const result = res.data.results[0];

    if (result.components.country_code !== "in") {
      throw new Error("Location must be in India");
    }


    const { lat, lng } = result.geometry;

    return [lng, lat];

  } catch (error) {
    console.log("❌ GEOCODING ERROR:", error.response?.data || error.message);

    throw new Error("Unable to fetch coordinates from location");
  }
};