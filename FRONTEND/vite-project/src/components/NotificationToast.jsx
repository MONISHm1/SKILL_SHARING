import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useNotifications } from "../context/NotificationContext";

const getIcon = type => {
  switch (type) {
    case "message":
      return "💬";
    case "exchange":
      return "🔁";
    case "session":
      return "📅";
    default:
      return "🔔";
  }
};

const NotificationToast = ({ t, data }) => {
  const navigate = useNavigate();
  const { handleNotificationClick } = useNotifications();

  const handleClick = async () => {
    await handleNotificationClick(data, navigate); 
    toast.dismiss(t.id);
  };

  return (
    <div
      onClick={handleClick}
      className={`
        flex items-start gap-3 w-[320px]
        p-4 rounded-xl cursor-pointer
        bg-[var(--card)] text-[var(--text)]
        border border-[var(--border)]
        shadow-lg backdrop-blur-md
        transition-all duration-200
        hover:scale-[1.02] hover:shadow-xl
      `}
    >
      
      <div
        className={`
    text-xl
    ${data.type === "message" && "text-blue-400"}
    ${data.type === "exchange" && "text-yellow-400"}
    ${data.type === "session" && "text-green-400"}
  `}
      >
        {getIcon(data.type)}
      </div>

      
      <div className="flex-1">
        <p className="text-sm font-medium leading-snug">{data.message}</p>

        <p className="text-xs opacity-60 mt-1">{new Date(data.createdAt).toLocaleTimeString()}</p>
      </div>

      
      <button
        onClick={e => {
          e.stopPropagation();
          toast.dismiss(t.id);
        }}
        className="text-xs opacity-50 hover:opacity-100"
      >
        ✕
      </button>
    </div>
  );
};

export default NotificationToast;
