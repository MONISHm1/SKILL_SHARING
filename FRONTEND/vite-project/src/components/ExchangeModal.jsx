import { useEffect, useState } from "react";
import API from "../api/axios";

function ExchangeModal({ skill, onClose }) {
  const [mySkills, setMySkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [message, setMessage] = useState("");

  //  GET MY SKILLS
  useEffect(() => {
    const fetchMySkills = async () => {
      const res = await API.get("/skills/my"); 
      setMySkills(res.data.data || []);
    };

    fetchMySkills();
  }, []);

  
  const handleExchange = async () => {
    try {
      await API.post("/exchange", {
        requestedSkillId: skill._id,
        offeredSkillId: selectedSkill,
        message,
      });

      alert("Exchange request sent ✅");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error sending request ❌");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl w-96">
        <h2 className="text-lg font-bold mb-3">
          Exchange for {skill.skillName}
        </h2>

       
        <select
          value={selectedSkill}
          onChange={(e) => setSelectedSkill(e.target.value)}
          className="w-full border p-2 mb-3 rounded"
        >
          <option value="">Select your skill</option>
          {mySkills.map((s) => (
            <option key={s._id} value={s._id}>
              {s.skillName}
            </option>
          ))}
        </select>

        {/* MESSAGE */}
        <textarea
          placeholder="Optional message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border p-2 mb-3 rounded"
        />

        {/* BUTTONS */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1 border rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleExchange}
            className="bg-yellow-500 text-white px-3 py-1 rounded"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExchangeModal;