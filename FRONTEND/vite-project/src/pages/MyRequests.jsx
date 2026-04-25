import { useEffect, useState } from "react";
import API from "../api/axios";
import ReviewModal from "../components/ReviewModal";
import StatusBadge from "../components/StatusBadge";

function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [filter, setFilter] = useState("All");

  const fetchRequests = async () => {
    try {
      const res = await API.get("/sessions/my");
      setRequests(res.data.sessions || res.data.data || []);
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleJoin = session => {
    if (session.mode === "Online") {
      if (!session.meetingLink) {
        alert("Meeting link not available");
        return;
      }

      window.open(session.meetingLink, "_blank");
    } else {
      if (!session.location) {
        alert("Location not provided");
        return;
      }

      const mapUrl = session.location.startsWith("http")
        ? session.location
        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(session.location)}`;

      window.open(mapUrl, "_blank");
    }
  };

  const filteredRequests =
    filter === "All" ? requests : requests.filter(req => req.status === filter);

  return (
    
    <div className="p-4 bg-[var(--bg)] text-[var(--text)]">
      
      <h2 className="text-2xl font-bold mb-4">My Requests</h2>

     
      <div className="flex gap-3 mb-6 flex-wrap">
        {["All", "Pending", "Accepted", "Completed", "Rejected"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
          
            className={`px-4 py-1 rounded-full border text-sm transition
              ${filter === f 
                ? "bg-blue-500 text-white shadow" 
                : "bg-[var(--card)] text-[var(--text)] border-[var(--border)] hover:opacity-80"}`}
          >
            {f}
          </button>
        ))}
      </div>

    
      <div className="grid grid-cols-3 gap-6">

        {filteredRequests.length === 0 && (
       
          <p className="text-center mt-10 opacity-70">No sessions found</p>
        )}

        {filteredRequests.map(session => (
          <div
            key={session._id}
     
            className="card p-4 rounded-xl hover:shadow-lg transition"
          >
            <div className="flex justify-between items-center">
              
        
              <div>
                <h3 className="font-bold text-lg">
                  {session.skill?.skillName}
                </h3>

              
                <p className="text-sm opacity-70">
                  Mentor: {session.mentor?.username}
                </p>

                <p className="text-sm mt-1">
                  📅 {new Date(session.date).toLocaleDateString()}
                </p>

                <p className="text-sm">⏰ {session.time}</p>
              </div>

              {/* STATUS */}
              <StatusBadge status={session.status} />
            </div>

           
            <div className="mt-3 flex gap-2 flex-wrap">
              
              {session.status === "Pending" && (
                <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition">
                  Cancel
                </button>
              )}

              {session.status === "Accepted" && (
                <button
                  onClick={() => handleJoin(session)}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                >
                  {session.mode === "Online" ? "Join Meeting" : "View Location"}
                </button>
              )}

              {session.status === "Completed" && !session.reviewed && (
                <button
                  onClick={() => setSelectedSession(session)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  Review
                </button>
              )}

              {session.reviewed && (
                <p className="text-green-500 text-sm font-semibold">
                  ⭐ Reviewed
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      
      {selectedSession && (
        <ReviewModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
        />
      )}
    </div>
  );
}

export default MyRequests;