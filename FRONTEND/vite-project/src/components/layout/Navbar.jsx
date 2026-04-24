import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react"; 
import API from "../../api/axios";

// 🔥 ADD THIS (UNCHANGED)
import { useTheme } from "../../context/ThemeContext";

function Navbar() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  // 🔥 ADD (UNCHANGED)
  const { setTheme } = useTheme();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/users/me");
        setUser(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  // 🔥 CLOSE ON OUTSIDE CLICK (UNCHANGED)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const initial = user?.username?.charAt(0)?.toUpperCase() || "U";

  return (
    <div 
      // 🔥 CHANGE: removed bg-white → use theme variables
      className="sticky top-0 z-50 backdrop-blur-lg border-b shadow-sm px-6 py-3 flex justify-between items-center bg-[var(--card)] text-[var(--text)] border-[var(--border)]"
    >
      
      <h1 className="text-xl font-bold text-blue-600 tracking-wide">
        Neighbourhood Skill Sharing
      </h1>

      <div className="relative" ref={dropdownRef}>

        <button
          onClick={() => setOpen(!open)}
          // 🔥 CHANGE: removed bg-white/gray → theme safe
          className="flex items-center gap-2 px-3 py-1 rounded-full border shadow-sm hover:shadow-md transition bg-[var(--card)] text-[var(--text)] border-[var(--border)]"
        >
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold">
            {initial}
          </div>

          {/* 🔥 CHANGE: removed text-gray */}
          <span className="text-sm font-medium">
            {user?.username || "User"}
          </span>
        </button>

        {open && (
          <div 
            // 🔥 CHANGE: removed bg-white → theme safe
            className="absolute right-0 mt-3 w-56 backdrop-blur-xl shadow-xl rounded-xl p-3 animate-dropdown bg-[var(--card)] text-[var(--text)] border border-[var(--border)]"
          >

            {/* USER INFO */}
            <div className="mb-2 border-b pb-2 border-[var(--border)]">
              {/* 🔥 CHANGE: removed gray text */}
              <p className="font-semibold">
                {user?.username}
              </p>
              <p className="text-xs opacity-70">
                {user?.email}
              </p>
            </div>

            {/* PROFILE */}
            <button
              onClick={() => navigate(`/profile/${user?._id}`)}
              // 🔥 CHANGE: hover color theme-safe
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-[var(--bg)] transition text-sm"
            >
              👤 Profile
            </button>

            {/* LOGOUT */}
            <button
              onClick={handleLogout}
              // 🔥 KEEP RED but safer hover
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-100 text-red-500 transition text-sm"
            >
              🚪 Logout
            </button>

            {/* 🔥 THEME SECTION (UNCHANGED LOGIC, SMALL STYLE FIX) */}
            <div className="border-t mt-2 pt-2 border-[var(--border)]">

              <p className="text-xs opacity-70 px-2 mb-1">Theme</p>

              <button
                onClick={() => setTheme("light")}
                className="block w-full text-left px-2 py-1 hover:bg-[var(--bg)] rounded text-sm"
              >
                ☀️ Light
              </button>

              <button
                onClick={() => setTheme("dark")}
                className="block w-full text-left px-2 py-1 hover:bg-[var(--bg)] rounded text-sm"
              >
                🌙 Dark
              </button>

              <button
                onClick={() => setTheme("dark-plus")}
                className="block w-full text-left px-2 py-1 hover:bg-[var(--bg)] rounded text-sm"
              >
                🌑 Dark+
              </button>

              <button
                onClick={() => setTheme("dark-pro")}
                className="block w-full text-left px-2 py-1 hover:bg-[var(--bg)] rounded text-sm"
              >
                🖤 Dark++
              </button>

            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;