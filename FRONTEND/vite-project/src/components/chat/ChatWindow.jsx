import { useEffect, useState, useRef } from "react";
import { getSocket } from "../../socket/socket";
import API from "../../api/axios";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";

const ChatWindow = ({ user, selectedChat, onRefreshChats }) => {
  const socket = getSocket();

  //  GET OTHER USER
  const selectedUser = (() => {
    if (!selectedChat) return null;

    //  Case 1: backend gives otherUser
    if (selectedChat.otherUser?._id) {
      return selectedChat.otherUser;
    }

    // Case 2: members array
    if (selectedChat.members && user?._id) {
      const other = selectedChat.members.find(m => {
        const id = typeof m === "object" ? m._id : m;
        return String(id) !== String(user._id);
      });

      if (other) {
        return typeof other === "object" ? other : { _id: other, username: "User" };
      }
    }

    return null;
  })();

  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [loading, setLoading] = useState(false);

  const scrollRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  
  useEffect(() => {
    const loadChat = async () => {
      if (!selectedChat?._id || !user?._id) {
        return;
      }

      setLoading(true);

      try {
        const convId = selectedChat._id;

        setConversationId(convId);

        const msgRes = await API.get(`/chat/messages/${convId}`);

        const msgs = msgRes.data?.data || msgRes.data || [];

        const normalized = msgs.map(msg => {
          let senderId;

          if (msg.sender && typeof msg.sender === "object") {
            senderId = msg.sender._id;
          } else if (typeof msg.sender === "string") {
            senderId = msg.sender;
          } else if (msg.senderId) {
            senderId = msg.senderId;
          }

          return {
            ...msg,
            senderId: String(senderId),
          };
        });

        setMessages(normalized);
      } catch (err) {
        console.error("❌ ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    loadChat();

    return () => {
      setMessages([]);
      setConversationId(null);
      setTyping(false);
    };
  }, [selectedChat?._id, user?._id]);

  
  useEffect(() => {
    if (!conversationId || !socket) return;

    const handleReceiveMessage = data => {
      if (!data?.text) return;

      if (String(data.conversationId) !== String(conversationId)) return;

      setMessages(prev => {
        const exists = prev.some(msg => msg._id === data._id);
        if (exists) return prev;
        return [...prev, data];
      });
    };

    socket.on("getMessage", handleReceiveMessage);

    return () => {
      socket.off("getMessage", handleReceiveMessage);
    };
  }, [conversationId, socket]);


  useEffect(() => {
    if (!conversationId || !socket) return;

    const handleTyping = ({ senderId, conversationId: convId }) => {
      if (senderId !== selectedUser?._id || convId !== conversationId) return;

      setTyping(true);

      clearTimeout(typingTimeoutRef.current);

      typingTimeoutRef.current = setTimeout(() => {
        setTyping(false);
      }, 1500);
    };

    socket.on("typing", handleTyping);

    return () => {
      socket.off("typing", handleTyping);
      clearTimeout(typingTimeoutRef.current);
    };
  }, [selectedUser?._id, conversationId, socket]);

 
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);


  const handleSend = async text => {
    console.log("TEXT:", text);
console.log("CONVERSATION ID:", conversationId);
    if (!text.trim() || !conversationId) return;

    const tempId = Date.now();

    const tempMessage = {
      _id: tempId,
      text,
      senderId: user._id,
      conversationId,
      createdAt: new Date().toISOString(),
    };

    try {
      setMessages(prev => [...prev, tempMessage]);

      const res = await API.post("/chat/message", {
        conversationId,
        text,
      });

      const saved = res.data?.data || res.data;

      const savedMsg = {
        ...saved,
        senderId: saved.sender?._id || saved.sender,
      };

      setMessages(prev => prev.map(msg => (msg._id === tempId ? savedMsg : msg)));

      socket.emit("sendMessage", {
        ...savedMsg,
        receiverId: selectedUser._id,
        conversationId,
      });
      if (onRefreshChats) {
        onRefreshChats();
      }
      
    } catch (err) {
      console.error("Send message error:", err);

      setMessages(prev => prev.filter(msg => msg._id !== tempId));
    }
  };

  return (
    <div className="flex flex-col h-full bg-[var(--bg)]">
      {/* HEADER */}
      {selectedUser && (
        <div className="flex items-center gap-3 p-4 border-b bg-[var(--card)]">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white">
            {selectedUser.username?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-semibold">{selectedUser.username}</p>
            <p className="text-xs text-gray-400">{typing ? "Typing..." : "Online"}</p>
          </div>
        </div>
      )}

      {!selectedUser ? (
        <div className="flex flex-1 items-center justify-center text-gray-400">
          Select a chat to start messaging 💬
        </div>
      ) : loading ? (
        <div className="flex flex-1 items-center justify-center text-gray-400">
          Loading messages...
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map(msg => {
              const isOwn = String(msg.senderId) === String(user._id);

              return (
                <div key={msg._id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
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

                    <p className="text-[10px] mt-1 opacity-70 text-right">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })}

            {typing && <TypingIndicator />}
            <div ref={scrollRef} />
          </div>

          <ChatInput onSend={handleSend} />
        </>
      )}
    </div>
  );
};

export default ChatWindow;
