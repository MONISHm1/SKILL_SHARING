import { motion } from "framer-motion";

const MessageBubble = ({ msg, own }) => {
  
  const senderId = msg?.sender?._id || msg?.sender;

 
  const isOwn = own ?? false;

  
  const time = new Date(msg?.createdAt || Date.now()).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className={`flex items-end gap-2 mb-2 ${
        isOwn ? "justify-end" : "justify-start"
      }`}
    >
      
      {!isOwn && (
        <img
          src={msg?.senderAvatar || "https://i.pravatar.cc/30?img=3"}
          alt="avatar"
          className="w-7 h-7 rounded-full object-cover shrink-0"
        />
      )}

     
      <div
        className={`
          group relative max-w-[75%] px-4 py-2 rounded-2xl text-sm
          shadow-sm transition-all duration-200
          ${
            isOwn
              ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-br-md"
              : "bg-[var(--card)] border border-[var(--border)] text-[var(--text)] rounded-bl-md"
          }
        `}
      >
        
        <p className="break-words leading-relaxed whitespace-pre-wrap">
          {msg?.isDeleted ? "🚫 Message deleted" : msg?.text}
        </p>

        
        <div className="flex items-center justify-end gap-1 mt-1">
          <span className="text-[10px] opacity-70">{time}</span>

         
          {isOwn && !msg?.isDeleted && (
            <span className="text-[10px] opacity-80">
              {msg?.read ? "✔✔" : "✔"}
            </span>
          )}
        </div>

      
        {isOwn && !msg?.isDeleted && (
          <button
            className="hidden group-hover:block absolute -top-2 -right-2 
            text-xs bg-red-500 text-white px-1 rounded shadow"
            title="Delete message"
          >
            ×
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default MessageBubble;