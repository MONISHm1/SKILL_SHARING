import { useEffect, useState } from "react";
import API from "../api/axios";
import StatusBadge from "../components/StatusBadge";

function MentorSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await API.get("/sessions/mentor");
      setSessions(res.data.sessions || res.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.patch(`/sessions/status/${id}`, { status });
      fetchSessions();
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddLink = async id => {
    const link = prompt("Paste Google Meet link (https://meet.google.com/...)");
    if (!link) return;

    try {
      await API.patch(`/sessions/add-link/${id}`, {
        meetingLink: link,
      });
      fetchSessions();
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddLocation = async id => {
    const loc = prompt("Enter location or paste Google Maps link");
    if (!loc) return;

    try {
      await API.patch(`/sessions/add-location/${id}`, {
        location: loc.trim(),
      });
      fetchSessions();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async id => {
    const confirmDelete = confirm("Are you sure you want to delete this session?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/sessions/${id}`);
      fetchSessions();
    } catch (err) {
      console.log(err);
    }
  };

  const markCompleted = sessionId => {
    updateStatus(sessionId, "Completed");
  };

  const filteredSessions =
    filter === "All" ? sessions : sessions.filter(s => s.status === filter);

  if (loading) {
    return <p className="text-center mt-10">Loading requests...</p>;
  }

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

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Manage Sessions</h2>

    
      <div className="flex gap-3 mb-4">
        {["All", "Pending", "Accepted", "Completed", "Rejected"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-full border ${
              filter === f
                ? "bg-blue-500 text-white"
                : "border-[var(--border)] text-[var(--text)]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {filteredSessions.length === 0 ? (
        <div className="card p-6 text-center">
         
          No requests found 📭
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {filteredSessions.map(session => (
            <div
              key={session._id}
              className="card p-5 hover:shadow-lg transition" 
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">
                    {session.skill.skillName}
                  </h3>

                  <p className="text-sm text-[var(--text)] opacity-70">
                    Category: {session.skill.category}
                  </p>

                  <p className="mt-2 text-sm">
                    👤 {session.learner.username}
                  </p>

                  <p className="text-sm opacity-70">
                    📍 {session.learner.location}
                  </p>

                  <p className="mt-2 text-sm">
                    📅 {new Date(session.date).toLocaleDateString()}
                  </p>

                  <p className="text-sm">⏰ {session.time}</p>

                  <p className="text-sm">💻 {session.mode}</p>
                </div>

                <StatusBadge status={session.status} />
              </div>

          
              <div className="mt-2 text-sm">
                {session.mode === "Offline" && session.location && (
                  <p className="text-orange-500">
                    Location Added 📍
                  </p>
                )}
              </div>

           
              <div className="mt-4 flex gap-2 flex-wrap">
                {session.status === "Pending" && (
                  <>
                    <button
                      onClick={() => updateStatus(session._id, "Accepted")}
                      className="px-3 py-1 bg-green-500 text-white rounded"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() => updateStatus(session._id, "Rejected")}
                      className="px-3 py-1 bg-red-500 text-white rounded"
                    >
                      Reject
                    </button>
                  </>
                )}

                {session.status === "Accepted" && (
                  <>
                    <button
                      onClick={() => markCompleted(session._id)}
                      className="px-3 py-1 bg-blue-500 text-white rounded"
                    >
                      Mark Completed
                    </button>

                    {session.mode === "Online" && !session.meetingLink && (
                      <button
                        onClick={() => handleAddLink(session._id)}
                        className="bg-purple-500 text-white px-3 py-1 rounded"
                      >
                        Add Link
                      </button>
                    )}

                    {session.mode === "Offline" && !session.location && (
                      <button
                        onClick={() => handleAddLocation(session._id)}
                        className="bg-orange-500 text-white px-3 py-1 rounded"
                      >
                        Add Location
                      </button>
                    )}

                    {((session.mode === "Online" && session.meetingLink) ||
                      (session.mode === "Offline" && session.location)) && (
                      <button
                        onClick={() => handleJoin(session)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                      >
                        {session.mode === "Online"
                          ? "Join Meeting"
                          : "View Location"}
                      </button>
                    )}
                  </>
                )}

                {session.status === "Completed" && (
                  <button
                    onClick={() => handleDelete(session._id)}
                    className="bg-gray-700 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MentorSessions;