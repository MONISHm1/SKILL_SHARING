import { useEffect, useState } from "react";
import API from "../api/axios";
import LocationAutocomplete from "../components/LocationAutocomplete";
import VideoUpload from "../components/video/VideoUploader.jsx";

function Skills() {
  const [form, setForm] = useState({
    skillName: "",
    category: "",
    description: "",
    experienceLevel: "Beginner",
    mode: "Online",
    location: "",
  });

  const [coordinates, setCoordinates] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/users/me");
        const user = res.data.data;

        setForm(prev => ({
          ...prev,
          location: user.location || "",
        }));

        
        if (user.geoLocation?.coordinates?.length === 2) {
          setCoordinates(user.geoLocation.coordinates);
        }

      } catch (err) {
        console.log("User fetch error:", err);
      }
    };

    fetchUser();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUseLocation = () => {
    navigator.geolocation.getCurrentPosition(
      pos => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;


        setCoordinates([lng, lat]);

        setForm(prev => ({
          ...prev,
          location: "Current Location 📍",
        }));
      },
      err => {
        console.log(err);
        alert("Unable to fetch location");
      }
    );
  };

  const handleSubmit = async () => {
    if (!form.skillName || !form.category || !form.description) {
      alert("Please fill all required fields");
      return;
    }

    if (isUploading) {
      alert("Please wait for video upload to finish");
      return;
    }

    
    if (!coordinates || coordinates.length !== 2) {
      alert("Please select a valid location (autocomplete or GPS)");
      return;
    }

    try {
      const payload = {
        skillName: form.skillName,
        category: form.category,
        description: form.description,
        experienceLevel: form.experienceLevel,
        mode: form.mode,
        location: form.location,

        
        coordinates: {
          type: "Point",
          coordinates: coordinates, 
        },

        videoUrl: videoUrl || "",
      };

      console.log("FINAL PAYLOAD:", payload);

      await API.post("/skills", payload);

      alert("✅ Skill Added Successfully");

      setForm({
        skillName: "",
        category: "",
        description: "",
        experienceLevel: "Beginner",
        mode: "Online",
        location: "",
      });

      setCoordinates(null);
      setVideoUrl("");

    } catch (err) {
      console.log(err.response?.data || err);
      alert(err.response?.data?.message || "❌ Error adding skill");
    }
  };

  return (
    <div className="grid grid-cols-2 gap-6">

      <div className="card p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-blue-600">Add Skill</h2>

        <input
          name="skillName"
          placeholder="Skill Name"
          value={form.skillName}
          onChange={handleChange}
          className="input"
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full p-2 rounded border border-[var(--border)] bg-[var(--card)] text-[var(--text)]"
        >
          <option value="">Select Category</option>
          <option value="Tech">Tech</option>
          <option value="Cooking">Cooking</option>
          <option value="Art">Art</option>
          <option value="Fitness">Fitness</option>
          <option value="Academic">Academic</option>
        </select>

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="input"
        />

        <select
          name="experienceLevel"
          value={form.experienceLevel}
          onChange={handleChange}
          className="input"
        >
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Expert</option>
        </select>

        <select
          name="mode"
          value={form.mode}
          onChange={handleChange}
          className="input"
        >
          <option>Online</option>
          <option>Offline</option>
          <option>Both</option>
        </select>

        <LocationAutocomplete
          value={form.location}
          onSelect={(loc, coords) => {
            setForm({ ...form, location: loc });

            
            if (coords && coords.length === 2) {
              setCoordinates(coords);
            }
          }}
        />

        <button
          type="button"
          onClick={handleUseLocation}
          className="mt-2 bg-green-500 text-white px-3 py-1 rounded"
        >
          Use My Location 📍
        </button>

        <button
          onClick={handleSubmit}
          className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white p-2 rounded-lg"
        >
          Add Skill
        </button>
      </div>

      <div className="card p-6 shadow-lg flex items-center justify-center">
        <VideoUpload
          setVideoUrl={setVideoUrl}
          setIsUploading={setIsUploading}
        />
      </div>

    </div>
  );
}

export default Skills;