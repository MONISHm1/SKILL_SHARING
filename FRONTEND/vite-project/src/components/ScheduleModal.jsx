import { useState } from "react";
import API from "../api/axios";

function ScheduleModal({ skill, onClose }) {
  const [form, setForm] = useState({
    date: "",
    time: "",
    mode: "Online",
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await API.post("/sessions", {
        mentorId: skill.mentor._id,
        skillId: skill._id,
        date: form.date,
        time: form.time,
        mode: form.mode,
      });

      alert("✅ Session Booked!");
      onClose();
    } catch (err) {
      console.log(err);
      alert("❌ Error booking session");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
        <h2 className="text-lg font-bold mb-4">Schedule Session</h2>

        <p className="mb-2 font-semibold">{skill.skillName}</p>

        <input
          type="date"
          name="date"
          min={new Date().toISOString().split("T")[0]}
          onChange={handleChange}
          className="input"
        />

        <input type="time" name="time" onChange={handleChange} className="input" />

        <select name="mode" onChange={handleChange} className="input">
          <option>Online</option>
          <option>Offline</option>
        </select>

        <div className="flex justify-between mt-4">
          <button onClick={onClose} className="px-4 py-1 border rounded-lg">
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default ScheduleModal;
