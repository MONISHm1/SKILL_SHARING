import { useState } from "react";

const ChatSidebar = ({
  conversations = [],
  selectedChat,
  onSelectChat,
  onlineUsers = [],
  user,
}) => {
  const [search, setSearch] = useState("");

  const chatList = conversations;

  //  USER EXTRACTION
  const getUser = (chat) => {
    if (chat.otherUser && chat.otherUser._id) {
      return chat.otherUser;
    }

    if (chat.members && user?._id) {
      const other = chat.members.find((m) => {
        const memberId = typeof m === "object" ? m._id : m;
        return String(memberId) !== String(user._id);
      });

      if (other) {
        return typeof other === "object"
          ? other
          : { _id: other, username: "User" };
      }
    }

    if (chat.user && chat.user._id) {
      return chat.user;
    }

    return null;
  };

  //  FILTER
  const filteredChats = chatList.filter((chat) => {
    const userObj = getUser(chat);

    const name =
      userObj?.username ||
      userObj?.name ||
      userObj?.email?.split("@")[0] ||
      "";

    return name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="border-r border-[var(--border)] h-full flex flex-col bg-[var(--bg)]">
      {/* HEADER */}
      <div className="p-4 border-b border-[var(--border)]">
        <h2 className="text-lg font-semibold text-[var(--text)] mb-3">
          Chats
        </h2>

        <input
          type="text"
          placeholder="Search chats..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input w-full"
        />
      </div>

      {/* CHAT LIST */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredChats.length === 0 ? (
          <p className="text-gray-400 text-center mt-5">
            No chats found
          </p>
        ) : (
          filteredChats.map((chat) => {
            const userObj = getUser(chat);

            const username =
              userObj?.username ||
              userObj?.name ||
              (userObj?.email
                ? userObj.email.split("@")[0]
                : null) ||
              (typeof userObj?._id === "string"
                ? userObj._id.slice(-4)
                : "User");

            const isSelected = selectedChat?._id === chat._id;

            const isOnline =
              userObj?._id &&
              onlineUsers?.some((u) => {
                const onlineId =
                  typeof u === "object" ? u.userId || u._id : u;
                return String(onlineId) === String(userObj._id);
              });

            return (
              <div
                key={chat._id}
                onClick={() => onSelectChat && onSelectChat(chat)}
                className={`
                  flex items-center justify-between gap-3
                  p-3 rounded-xl cursor-pointer
                  transition-all duration-200
                  ${
                    isSelected
                      ? "bg-[var(--card)] border border-[var(--border)] shadow-sm"
                      : "hover:bg-[var(--card)]"
                  }
                `}
              >
                {/* LEFT */}
                <div className="flex items-center gap-3 min-w-0">
                  {/* AVATAR */}
                  <div className="relative shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                      {username.charAt(0).toUpperCase()}
                    </div>

                    {/* ONLINE DOT */}
                    {isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[var(--bg)] rounded-full"></span>
                    )}
                  </div>

                  {/* TEXT */}
                  <div className="min-w-0">
                    <p className="font-medium text-[var(--text)] truncate">
                      {username}
                    </p>

                    <p className="text-xs text-gray-400 truncate">
                      {typeof chat.lastMessage === "object"
                        ? chat.lastMessage?.text
                        : chat.lastMessage || "Start chatting..."}
                    </p>
                  </div>
                </div>

                {/* UNREAD */}
                {chat?.unread > 0 && (
                  <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full shrink-0">
                    {chat.unread}
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;