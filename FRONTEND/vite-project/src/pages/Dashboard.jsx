import { useEffect, useState } from "react";
import API from "../api/axios";

function Dashboard() {
  const [sessions, setSessions] = useState([]);
  const recentSessions = sessions.slice(0, 3);
  const [selectedSession, setSelectedSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSessions = async () => {
    try {
      const res = await API.get("/sessions/my");
      setSessions(res.data.sessions);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading sessions...</p>;
  }

  return (
    <div className="bg-[var(--bg)] text-[var(--text)]"> {/* 🔥 ADDED */}

      {/* DASHBOARD STATS */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        
        
        <div className="card p-5 rounded-xl shadow">
          <h2>Total Credits</h2>
          <p className="text-2xl font-bold text-blue-500">260</p>
        </div>

     
        <div className="card p-5 rounded-xl shadow">
          <h2>Current Streak</h2>
          <p className="text-2xl font-bold text-purple-500">12 days</p>
        </div>

       
        <div className="card p-5 rounded-xl shadow">
          <h2>Reputation</h2>
          <p className="text-2xl font-bold text-blue-600">92/100</p>
        </div>

      </div>

      
      <div className="card p-6 rounded-xl shadow mb-6">
        <h2 className="mb-4 font-semibold">Quick Actions</h2>

        <div className="grid grid-cols-3 gap-4">

         
          <div className="p-4 bg-[var(--border)] rounded-lg">Update Profile</div>

          
          <div className="p-4 bg-[var(--border)] rounded-lg">Find Nearby</div>

       
          <div className="p-4 bg-[var(--border)] rounded-lg">Book Session</div>

        </div>
      </div>

      {/* MY SESSIONS */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-blue-600">My Sessions</h2>

        {sessions.length > 0 ? (
          <div className="grid grid-cols-3 gap-6">
            {recentSessions.map(session => (
              <div
                key={session._id}
                className="card p-5 rounded-xl shadow hover:shadow-lg transition" // 🔥 CHANGE
              >
                <h3 className="font-bold text-lg">
                  {session.skill?.skillName || "No Skill"}
                </h3>

                
                <p className="text-sm text-[var(--text)] opacity-70">
                  Mentor: {session.mentor?.username || "Unknown"}
                </p>

                <p className="mt-2 text-sm">
                  📅 {session.date ? new Date(session.date).toLocaleDateString() : "No Date"}
                </p>

                <p className="text-sm">⏰ {session.time || "No Time"}</p>

                <p
                  className={`mt-2 text-sm font-semibold 
                  ${
                    session.status === "Pending"
                      ? "text-yellow-500"
                      : session.status === "Accepted"
                        ? "text-green-500"
                        : session.status === "Completed"
                          ? "text-blue-500"
                          : "text-gray-500"
                  }`}
                >
                  Status: {session.status}
                </p>

              </div>
            ))}
          </div>
        ) : (
          
          <div className="card p-6 rounded-xl shadow text-center opacity-70">
            No sessions booked yet 🚀
          </div>
        )}
      </div>

      {/* REVIEW MODAL */}
      {selectedSession && (
        <ReviewModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
        />
      )}
    </div>
  );
}

export default Dashboard;