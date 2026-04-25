import { Link, useLocation } from "react-router-dom";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const menu = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "My Skills", path: "/my-skills" },
  { name: "My Learning", path: "/my-requests" },
  { name: "Skills", path: "/skills" },
  { name: "Explore", path: "/explore" },

  { name: "Manage Sessions", path: "/manage-sessions" },

  { name: "Nearby", path: "/nearby" },
  { name: "Exchange", path: "/exchange" },
  { name: "Calendar", path: "/calendar" },

  { name: "💬 Chats", path: "/chat" },
];

function Sidebar() {
  const location = useLocation();

  return (
    <div className="fixed top-0 left-0 w-60 h-screen bg-[var(--card)] text-[var(--text)] border-r border-[var(--border)] shadow-lg p-4 overflow-y-auto">
      {/* Logo */}
      <h1 className="text-lg font-bold mb-6">NSSN</h1>

      {menu.map(item => {
        const isActive =
          location.pathname === item.path || location.pathname.startsWith(item.path + "/");

        return (
          <Link
            key={item.name}
            to={item.path}
            className={`block p-3 rounded-lg mb-2 transition duration-200
          
          ${
            isActive
              ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
              : "hover:bg-[var(--border)]"
          }
        `}
          >
            {item.name}
          </Link>
        );
      })}
    </div>
  );
}

export default Sidebar;
