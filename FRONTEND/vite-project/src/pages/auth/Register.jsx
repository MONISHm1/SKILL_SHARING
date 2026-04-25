import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../api/axios";
import LocationAutocomplete from "../../components/LocationAutocomplete";

function Register() {
  const navigate = useNavigate();


  const [coordinates, setCoordinates] = useState(null); // ✅ KEEP ONLY ONE

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    location: "",
  });

  //  HANDLE INPUT CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /*
  const handleLocationChange = (e) => {
    setForm({ ...form, location: e.target.value });
  };
  */

  //  USE GPS LOCATION
  const handleUseLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        const coords = [lng, lat];

        setCoordinates(coords);

        
        setForm((prev) => ({
          ...prev,
          location: "Current Location",
        }));
      },
      (err) => {
        alert("Unable to fetch location");
        console.log(err);
      }
    );
  };

  //  SUBMIT FORM
  const handleSubmit = async (e) => {
    e.preventDefault();

    
    if (!coordinates && !form.location) {
      alert("Please select location from suggestions or use current location");
      return;
    }

    try {
      await API.post("/auth/register", {
        ...form,
        coordinates: coordinates
          ? {
              type: "Point",
              coordinates: coordinates, // [lng, lat]
            }
          : undefined, // backend fallback
      });

      alert("Registered Successfully");
      navigate("/login");
    } catch (err) {
      console.error("REGISTER ERROR:", err.response?.data || err);
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-100 to-blue-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Create Account
        </h2>

        <input
          name="username"
          placeholder="Full Name"
          onChange={handleChange}
          className="w-full p-3 mb-3 border rounded-lg"
        />

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-3 mb-3 border rounded-lg"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-3 mb-3 border rounded-lg"
        />

        
        <LocationAutocomplete
          value={form.location}
          onSelect={(loc, coords) => {
            setForm({ ...form, location: loc });
            setCoordinates(coords); 
          }}
        />

        
        <button
          type="button"
          onClick={handleUseLocation}
          className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
        >
          Use My Location 📍
        </button>

        <button className="w-full py-3 mt-4 rounded-lg bg-gradient-to-r from-green-400 to-blue-500 text-white">
          Register
        </button>

        <p className="text-sm mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;