import { useEffect, useState } from "react";
import API from "../api/axios";
import ScheduleModal from "../components/ScheduleModal";
import { Link, useNavigate } from "react-router-dom";
import ExchangeModal from "../components/ExchangeModal";

function Explore() {
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [skills, setSkills] = useState([]);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [selectedSkillForExchange, setSelectedSkillForExchange] = useState(null);

  const [filters, setFilters] = useState({
    category: "",
    mode: "",
  });

  const navigate = useNavigate();
  const [loadingChat, setLoadingChat] = useState(null);

  const fetchSkills = async () => {
    try {
      const res = await API.get("/skills", {
        params: filters,
      });

      const data = res.data?.data || [];

      setSkills(data);
      setFilteredSkills(data);
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, [filters]);

  const handleChat = async (skill) => {
    try {
      if (!skill?.mentor?._id) {
        alert("Mentor not available");
        return;
      }

      setLoadingChat(skill._id);

      const res = await API.post("/chat/conversation", {
        receiverId: skill.mentor._id,
        skillId: skill._id,
      });

      const conversation = res.data?.data || res.data;

      if (!conversation || !conversation._id) {
        throw new Error("Conversation ID missing");
      }

      const updatedConversation = {
        ...conversation,
        otherUser: {
          _id: skill.mentor._id,
          username: skill.mentor.username,
        },
      };

      localStorage.setItem("selectedChatId", conversation._id);

      localStorage.setItem(
        "chatUser",
        JSON.stringify({
          _id: skill.mentor._id,
          username: skill.mentor.username,
        })
      );

      localStorage.setItem(
        "activeChat",
        JSON.stringify(updatedConversation)
      );

      navigate(`/chat/${conversation._id}`);

    } catch (error) {
      console.error("Chat error:", error?.response?.data || error.message);
    } finally {
      setLoadingChat(null);
    }
  };

  return (
    <div className="bg-[var(--bg)] text-[var(--text)] min-h-screen p-4">

      {/* FILTER BAR */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <select
          value={filters.category}
          onChange={e => setFilters({ ...filters, category: e.target.value })}
          className="input"
        >
          <option value="">Category</option>
          <option value="Tech">Tech</option>
          <option value="Cooking">Cooking</option>
          <option value="Art">Art</option>
          <option value="Fitness">Fitness</option>
          <option value="Academic">Academic</option>
        </select>

        <select
          value={filters.mode}
          onChange={e => setFilters({ ...filters, mode: e.target.value })}
          className="input"
        >
          <option value="">Mode</option>
          <option value="Online">Online</option>
          <option value="Offline">Offline</option>
          <option value="Both">Both</option>
        </select>

        <button
          onClick={() => setFilters({ category: "", mode: "" })}
          className="bg-gray-400 text-white px-4 rounded-lg"
        >
          Clear
        </button>

        <button
          onClick={fetchSkills}
          className="bg-blue-500 text-white px-4 rounded-lg"
        >
          Refresh
        </button>
      </div>

      {/* SKILLS GRID */}
      <div className="grid grid-cols-3 gap-6">
        {filteredSkills.length === 0 ? (
          <p className="col-span-3 text-center opacity-60">
            No skills found 😔
          </p>
        ) : (
          filteredSkills.map(skill => (
            <div
              key={skill._id}
              className="card p-4 rounded-xl shadow-md hover:shadow-xl transition duration-200"
            >
             
             {skill.video?.url ? (
                  <video
                    src={skill.video.url}
                    controls
                    className="w-full h-48 object-cover rounded-lg mb-3"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-lg mb-3">
                    <span className="text-gray-500 text-sm">
                      No Video Available
                    </span>
                  </div>
                )}

             
              <h3 className="font-bold text-lg">{skill.skillName}</h3>

            
              <p className="text-sm opacity-70">
                {skill.category} • {skill.mode}
              </p>

             
              <p className="text-sm mt-2">
                📍 {skill.location || "Location not specified"}
              </p>

              
              <Link to={`/profile/${skill.mentor?._id}`}>
                <p className="text-blue-500 hover:underline">
                  {skill.mentor?.username || "Unknown"}
                </p>
              </Link>

              
              <p className="text-yellow-500 text-sm">
                ⭐ {skill.mentor?.averageRating?.toFixed(1) || 0} (
                {skill.mentor?.totalReviews || 0} reviews)
              </p>

              
              <div className="flex gap-2 mt-3">

                <button
                  onClick={() => setSelectedSkill(skill)}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-1 rounded-lg hover:opacity-90"
                >
                  Learn
                </button>

                <button
                  onClick={() => setSelectedSkillForExchange(skill)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Exchange
                </button>

                <button
                  onClick={() => handleChat(skill)}
                  disabled={loadingChat === skill._id}
                  className="px-3 py-1 border rounded-lg hover:bg-[var(--card)] disabled:opacity-50"
                >
                  {loadingChat === skill._id ? "..." : "💬"}
                </button>

              </div>
            </div>
          ))
        )}
      </div>

      
      {selectedSkill && (
        <ScheduleModal
          skill={selectedSkill}
          onClose={() => setSelectedSkill(null)}
        />
      )}

      {selectedSkillForExchange && (
        <ExchangeModal
          skill={selectedSkillForExchange}
          onClose={() => setSelectedSkillForExchange(null)}
        />
      )}
    </div>
  );
}

export default Explore;