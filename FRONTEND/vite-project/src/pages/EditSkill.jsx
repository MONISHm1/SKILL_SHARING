import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

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
  });

  
  useEffect(() => {
    const fetchSkill = async () => {
      try {
        const res = await API.get(`/skills/${id}`);
        setForm(res.data);
        
      } catch (err) {
        console.log(err);
      }
    };

    fetchSkill();
  }, [id]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  //  UPDATE
  const handleUpdate = async () => {
    try {
      await API.put(`/skills/${id}`, form);
      alert("Skill Updated!");
      navigate("/my-skills");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    
    <div className="max-w-lg mx-auto p-6">
      <div className="card p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4 text-blue-600">
          Edit Skill
        </h2>

        <input
          name="skillName"
          value={form.skillName}
          onChange={handleChange}
          className="input"
        />

        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          className="input"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="input"
        />

        <input
          name="experienceLevel"
          value={form.experienceLevel}
          onChange={handleChange}
          className="input"
        />

        <input
          name="mode"
          value={form.mode}
          onChange={handleChange}
          className="input"
        />

        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          className="input"
        />

        <button
          onClick={handleUpdate}
          className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white p-2 rounded-lg"
        >
          Update Skill
        </button>

      </div>
    </div>
  );
}

export default EditSkill;