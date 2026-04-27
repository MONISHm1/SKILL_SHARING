import { useEffect, useRef, useState } from "react";
import { connectSocket, getSocket } from "../socket/socket";
import API from "../api/axios";

const Chat = ({ selectedChat: propSelectedChat, user }) => {
  console.log(" Chat.jsx RENDERED");
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [selectedChat, setSelectedChat] = useState(propSelectedChat || null);

  const messagesEndRef = useRef(null);

  const currentUserId = user?._id;
  const conversationId = selectedChat?._id;

  useEffect(() => {
    if (propSelectedChat) {
      setSelectedChat(propSelectedChat);
      return;
    }

    const stored = localStorage.getItem("activeChat");

    if (stored) {
      try {
        setSelectedChat(JSON.parse(stored));
      } catch (err) {
        console.error("Invalid stored chat:", err);
      }
    }
  }, [propSelectedChat]);

  useEffect(() => {
    if (!user?._id) return;
    connectSocket(user);
  }, [user]);

  const isValidId = id => typeof id === "string" && id.length === 24;

  useEffect(() => {
    if (!isValidId(conversationId)) return;

    const fetchMessages = async () => {
      try {
        const res = await API.get(`/chat/messages/${conversationId}`);

        const msgs = res?.data?.data || res?.data || [];

        setMessages(msgs);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();
  }, [conversationId, currentUserId]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !conversationId) return;

    const handleMessage = data => {
      if (String(data.conversationId) !== String(conversationId)) return;

      
      if (String(data.senderId) === String(currentUserId)) return;

      setMessages(prev => {
        const exists = prev.some(
          m =>
            String(m._id) === String(data._id) ||
            (m.text === data.text && String(m.senderId || m.sender?._id) === String(data.senderId))
        );

        if (exists) return prev;

        return [...prev, data];
      });
    };

    socket.on("receiveMessage", handleMessage);

    return () => {
      socket.off("receiveMessage", handleMessage);
    };
  }, [conversationId, currentUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim() || !conversationId) return;

    try {
      const res = await API.post("/chat/message", {
        conversationId,
        text,
      });

      const newMsg = res.data?.data;

      setMessages(prev => [...prev, newMsg]);
      setText("");
    } catch (err) {
      console.error("Send message error:", err);
    }
  };

  const otherUser = selectedChat?.otherUser;

  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Select a conversation to start chatting
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[var(--bg)] text-[var(--text)] h-full">
      {/* HEADER */}
      <div className="p-4 border-b border-[var(--border)] flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
          {otherUser?.username?.charAt(0)?.toUpperCase() || "U"}
        </div>

        <div>
          <p className="font-semibold">{otherUser?.username || "Unknown"}</p>
          <p className="text-xs text-gray-400">Online</p>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <p className="text-sm opacity-60 text-center">No messages yet</p>
        ) : (
          messages.map((msg, i) => {
            const isOwn =
              String(msg.sender?._id || msg.senderId || msg.sender) === String(currentUserId);

            return (
              <div
                key={msg._id || `${msg.senderId || msg.sender}-${msg.createdAt}`}
                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`
                    max-w-[65%] px-4 py-2 rounded-2xl shadow-sm
                    ${
                      isOwn
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-gray-200 text-black rounded-bl-none"
                    }
                  `}
                >
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            );
          })
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <div className="p-3 border-t border-[var(--border)] flex gap-2">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 input"
        />

        <button onClick={handleSend} className="btn btn-primary" disabled={!conversationId}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
