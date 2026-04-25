import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

function MySkills() {
  const [skills, setSkills] = useState([]);
  const navigate = useNavigate();

  const fetchSkills = async () => {
    const res = await API.get("/skills/my");
    setSkills(res.data.data);
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this skill?")) return;

    await API.delete(`/skills/${id}`);
    fetchSkills();
  };

  return (
    <div className="bg-[var(--bg)] text-[var(--text)]">

      <h2 className="text-2xl font-bold mb-6 text-blue-600">
        My Skills
      </h2>

      <div className="grid grid-cols-3 gap-6">

        {skills.map((skill) => (
          <div
            key={skill._id}
            className="card p-5 hover:shadow-lg transition"
          >

            
            {skill.video?.url ? (
              <video
                src={skill.video.url}
                controls
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
            ) : (
              <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-lg mb-3 text-sm text-gray-500">
                No Video Available
              </div>
            )}

            <h3 className="font-bold text-lg">
              {skill.skillName}
            </h3>

            <p className="text-sm text-[var(--text)] opacity-70">
              {skill.category} • {skill.mode}
            </p>

            <p className="text-sm mt-2">
              {skill.description}
            </p>

            <p className="text-sm mt-1">
              📍 {skill.location}
            </p>

            <p className="text-sm">
              Level: {skill.experienceLevel}
            </p>

            <div className="flex gap-2 mt-4">

              <button
                onClick={() => navigate(`/edit-skill/${skill._id}`)}
                className="w-1/2 bg-blue-500 text-white py-1 rounded-lg hover:bg-blue-600 transition"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(skill._id)}
                className="w-1/2 bg-red-500 text-white py-1 rounded-lg hover:bg-red-600 transition"
              >
                Delete
              </button>

            </div>

          </div>
        ))}

      </div>
    </div>
  );
}

export default MySkills;