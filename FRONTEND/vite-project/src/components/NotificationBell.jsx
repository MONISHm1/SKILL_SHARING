import { useNotifications } from "../context/NotificationContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { markAllNotificationsRead } from "../api/notificationAPI";

const NotificationBell = () => {
  const { notifications, markAsReadServer, setNotifications } = useNotifications();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const unreadNotifications = notifications.filter(n => !n.isRead);

  const handleClick = async notification => {
    if (!notification.isRead) {
      await markAsReadServer(notification._id);
    }

    if (notification.link) {
      navigate(notification.link);
    }

    setOpen(false);
  };

  const handleMarkAll = async () => {
    await markAllNotificationsRead();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  // ICON BASED ON TYPE
  const getIcon = type => {
    switch (type) {
      case "message":
        return "💬";
      case "exchange":
        return "🔄";
      case "session":
        return "📅";
      default:
        return "🔔";
    }
  };

  // FORMAT TIME
  const formatTime = date => {
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="relative">
      
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.08)] transition"
      >
        <span className="text-xl">🔔</span>

        
        {unreadNotifications.length > 0 && (
          <span className="absolute top-0 right-0 text-xs bg-red-500 text-white px-1 rounded">
            {unreadNotifications.length}
          </span>
        )}
      </button>

      
      {open && (
        <div className="absolute right-0 mt-3 w-96 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-xl overflow-hidden animate-fadeIn">
          
          <div className="flex justify-between items-center px-4 py-3 border-b border-[var(--border)]">
            <h3 className="font-semibold text-[var(--text)]">Notifications</h3>

            {notifications.length > 0 && (
              <button onClick={handleMarkAll} className="text-xs text-blue-400 hover:underline">
                Mark all as read
              </button>
            )}
          </div>

          
          <div className="max-h-80 overflow-y-auto">
            
            {unreadNotifications.length === 0 ? (
              <p className="p-4">No new notifications</p>
            ) : (
              unreadNotifications.map(n => (
                <div
                  key={n._id}
                  onClick={() => handleClick(n)}
                  className={`flex gap-3 items-start px-4 py-3 cursor-pointer transition-all duration-200 border-b border-[var(--border)]
                  
                  ${!n.isRead ? "bg-[rgba(59,130,246,0.08)]" : "hover:bg-[rgba(255,255,255,0.05)]"}
                  `}
                >
                  
                  <div className="text-xl mt-1">{getIcon(n.type)}</div>

                  
                  <div className="flex-1">
                    <p className="text-sm text-[var(--text)] leading-snug">{n.message}</p>

                    <span className="text-xs opacity-50">{formatTime(n.createdAt)}</span>
                  </div>

                  
                  {!n.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
