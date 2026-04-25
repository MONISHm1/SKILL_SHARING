import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import VideoUpload from "../components/video/VideoUploader.jsx";

function EditSkill() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    skillName: "",
    category: "",
    description: "",
    experienceLevel: "",
    mode: "",
    location: "",
    videoUrl: "",
  });

  const [isUploading, setIsUploading] = useState(false);

  // ================= FETCH =================
  useEffect(() => {
    const fetchSkill = async () => {
      try {
        const res = await API.get(`/skills/${id}`);
        const data = res.data?.data || res.data;

        setForm({
          skillName: data.skillName || "",
          category: data.category || "",
          description: data.description || "",
          experienceLevel: data.experienceLevel || "",
          mode: data.mode || "",
          location: data.location || "",
          videoUrl: data.video?.url || "",
        });
      } catch (err) {
        console.log(err);
      }
    };

    fetchSkill();
  }, [id]);

  // ================= INPUT =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= UPDATE =================
  const handleUpdate = async () => {
    try {
      if (isUploading) {
        alert("Please wait for video upload to finish");
        return;
      }

      await API.put(`/skills/${id}`, form);

      alert("Skill Updated!");
      navigate("/my-skills");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8 space-y-6">

        {/* HEADER */}
        <h2 className="text-2xl font-bold text-center text-blue-600">
          ✏️ Edit Skill
        </h2>

        {/* ================= VIDEO SECTION ================= */}
        <div className="space-y-3">
          <label className="font-bold text-gray-700">
            Skill Video
          </label>

          {form.videoUrl && (
            <video
              src={form.videoUrl}
              controls
              className="w-full h-48 object-cover rounded-lg border"
            />
          )}

          <VideoUpload
            setVideoUrl={(url) =>
              setForm((prev) => ({ ...prev, videoUrl: url }))
            }
            setIsUploading={setIsUploading}
          />
        </div>

        {/* ================= FORM SECTION ================= */}
        <div className="space-y-4">

          {/* Skill Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Skill Name
            </label>
            <input
              name="skillName"
              value={form.skillName}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Category
            </label>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Experience Level */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Experience Level
            </label>
            <select
              name="experienceLevel"
              value={form.experienceLevel}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            >
              <option value="">Select Level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Expert">Expert</option>
            </select>
          </div>

          {/* Mode */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Mode
            </label>
            <select
              name="mode"
              value={form.mode}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
            >
              <option value="">Select Mode</option>
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
              <option value="Both">Both</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Location
            </label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
            />
          </div>

        </div>

        {/* BUTTON */}
        <button
          onClick={handleUpdate}
          disabled={isUploading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:scale-[1.02] transition disabled:opacity-50"
        >
          {isUploading ? "Uploading Video..." : "Update Skill"}
        </button>

      </div>
    </div>
  );
}

export default EditSkill;