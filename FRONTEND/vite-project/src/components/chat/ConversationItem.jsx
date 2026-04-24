const ConversationItem = ({ conv, currentUser, onSelect }) => {
  const otherUser = conv.members.find(
    (m) => m._id !== currentUser._id
  );

  return (
    <div
      onClick={() => onSelect(conv)}
      className="flex items-center gap-3 p-3 hover:bg-[var(--card)] rounded-xl transition cursor-pointer"
    >
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white">
        {otherUser?.username?.[0]?.toUpperCase()}
      </div>

      {/* Info */}
      <div>
        <p className="font-medium">{otherUser?.username}</p>
        <p className="text-xs text-gray-400 truncate">
          {conv.lastMessage || "Start chatting..."}
        </p>
      </div>
    </div>
  );
};

export default ConversationItem;