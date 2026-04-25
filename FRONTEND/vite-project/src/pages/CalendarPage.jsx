import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import API from "../api/axios";
import StatusBadge from "../components/StatusBadge";

function CalendarPage() {
  const [date, setDate] = useState(new Date());
  const [sessions, setSessions] = useState([]);

  //  Fetch sessions on mount
  useEffect(() => {
    fetchSessions();
  }, []);

  //  API CALL
  const fetchSessions = async () => {
    try {
      const res = await API.get("/sessions/my");
      const data = res.data?.sessions || [];

      setSessions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching sessions:", err);
      setSessions([]);
    }
  };

  //  FILTER sessions by selected date
  const selectedDateSessions = sessions.filter(session => {
    const sessionDate = new Date(session.date);

    return (
      sessionDate.getFullYear() === date.getFullYear() &&
      sessionDate.getMonth() === date.getMonth() &&
      sessionDate.getDate() === date.getDate()
    );
  });

  return (
    <div className="p-6 bg-[var(--bg)] text-[var(--text)]">
      {" "}
      {/* 🔥 CHANGE */}
      <h1 className="text-2xl font-bold text-blue-600 mb-6">My Schedule</h1>
      <div className="grid grid-cols-2 gap-6">
        <div className="card p-4">
          <Calendar
            onChange={setDate}
            value={date}
            tileClassName={({ date: tileDate }) => {
              const hasSession = sessions.some(session => {
                return new Date(session.date).toDateString() === tileDate.toDateString();
              });

              return hasSession ? "bg-blue-500 text-white rounded-full" : null;
            }}
          />
        </div>

        <div className="card p-4">
          <h2 className="text-lg font-semibold mb-4">Sessions on {date.toDateString()}</h2>

          {selectedDateSessions.length === 0 ? (
            <p className="text-[var(--text)] opacity-60">No sessions</p>
          ) : (
            selectedDateSessions.map(session => (
              <div
                key={session._id}
                className="border border-[var(--border)] p-3 rounded-lg mb-3 hover:shadow transition bg-[var(--card)]" // 🔥 CHANGE
              >
                <h3 className="font-bold text-lg">{session.skill?.skillName}</h3>

                <p className="text-sm opacity-70">👤 {session.mentor?.username}</p>

                <p className="text-sm">⏰ {session.time}</p>

                <div className="mt-2">
                  <StatusBadge status={session.status} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default CalendarPage;
