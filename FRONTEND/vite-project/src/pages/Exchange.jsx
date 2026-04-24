import { useEffect, useState } from "react";
import API from "../api/axios";

function Exchange() {
  const [exchanges, setExchanges] = useState([]);
  const [activeTab, setActiveTab] = useState("incoming");

  const fetchExchanges = async () => {
    const res = await API.get("/exchange");
    setExchanges(res.data.exchanges || []);
  };

  useEffect(() => {
    fetchExchanges();
  }, []);

  // 🔥 SPLIT LOGIC (UNCHANGED)
  const incoming = exchanges.filter(
    (ex) => ex.receiver?._id === getUserId()
  );

  const outgoing = exchanges.filter(
    (ex) => ex.requester?._id === getUserId()
  );

  const handleAction = async (id, status) => {
    await API.patch(`/exchange/${id}`, { status });
    fetchExchanges();
  };

  return (
    // 🔥 CHANGE: add theme-aware background
    <div className="p-6 bg-[var(--bg)] text-[var(--text)] min-h-screen">
      
      <h2 className="text-xl font-bold mb-4">Exchange Requests</h2>

      {/* 🔥 TABS */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("incoming")}
          // 🔥 CHANGE: dark-friendly inactive state
          className={`px-4 py-1 rounded ${
            activeTab === "incoming"
              ? "bg-blue-500 text-white"
              : "bg-[var(--card)] text-[var(--text)] border border-[var(--border)]"
          }`}
        >
          Incoming
        </button>

        <button
          onClick={() => setActiveTab("outgoing")}
          // 🔥 CHANGE: same here
          className={`px-4 py-1 rounded ${
            activeTab === "outgoing"
              ? "bg-blue-500 text-white"
              : "bg-[var(--card)] text-[var(--text)] border border-[var(--border)]"
          }`}
        >
          Outgoing
        </button>
      </div>

      {/* 🔥 LIST */}
      {(activeTab === "incoming" ? incoming : outgoing).map((ex) => (
        <div
          key={ex._id}
          // 🔥 CHANGE: use card system
          className="card p-4 mb-4"
        >
          <p className="font-semibold">
            {activeTab === "incoming"
              ? ex.requester?.username
              : ex.receiver?.username}
          </p>

          <p className="text-sm">
            Learn: {ex.requestedSkill?.skillName}
          </p>

          <p className="text-sm">
            Offer: {ex.offeredSkill?.skillName}
          </p>

          {/* 🔥 CHANGE: adaptive text color */}
          <p className="text-sm opacity-70">
            Status: {ex.status}
          </p>

          {/* 🔥 ACTION BUTTONS */}
          {activeTab === "incoming" && ex.status === "Pending" && (
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleAction(ex._id, "Accepted")}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Accept
              </button>

              <button
                onClick={() => handleAction(ex._id, "Rejected")}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Exchange;

// 🔥 HELPER FUNCTION (UNCHANGED)
function getUserId() {
  const token = localStorage.getItem("token");

  if (!token) return null;

  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload?._id;
}