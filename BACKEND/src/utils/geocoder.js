import axios from "axios";

export const getCoordinates = async (location) => {
  try {
    const cleanLocation = location.trim();

    console.log("📍 LOCATION:", cleanLocation);

    const res = await axios.get(
      `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
        cleanLocation
      )}&filter=countrycode:in&limit=1&apiKey=${process.env.GEOAPIFY_API_KEY}`
    );

    console.log("🌍 GEOAPIFY RESPONSE:", res.data);

    if (!res.data.features || res.data.features.length === 0) {
      throw new Error("Location not found. Try full name like 'Bangalore, India'");
    }

    const result = res.data.features[0];

    // Geoapify uses properties.country_code (lowercase)
    if (result.properties.country_code !== "in") {
      throw new Error("Location must be in India");
    }

    const [lng, lat] = result.geometry.coordinates;

    
    if (!lng || !lat) {
      throw new Error("Invalid coordinates received");
    }

    return [lng, lat]; 

  } catch (error) {
    console.log("❌ GEOCODING ERROR:", error.response?.data || error.message);

    throw new Error("Unable to fetch coordinates from location");
  }
};