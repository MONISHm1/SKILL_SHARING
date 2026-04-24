import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";
import API from "../../api/axios";
import { connectSocket } from "../../socket/socket";

const ChatLayout = ({ user }) => {
  const { id } = useParams();

  const [selectedChat, setSelectedChat] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [refresh, setRefresh] = useState(false);

  //  CONNECT SOCKET
  useEffect(() => {
    if (!user?._id) return;
    connectSocket(user);
  }, [user]);

  
  useEffect(() => {
    if (!user) {
      console.log("❌ USER NOT READY");
      return;
    }

    const fetchChats = async () => {
      try {
        const res = await API.get("/chat/conversations");

        const chats = Array.isArray(res.data?.conversations) ? res.data.conversations : [];

        setConversations(chats);

        
        if (selectedChat) {
          const updated = chats.find(c => c._id === selectedChat._id);
          if (updated) {
            setSelectedChat(updated);
            return;
          }
        }

        // //  AUTO SELECT FIRST CHAT
        // if (!id && chats.length > 0) {
        //   setSelectedChat(chats[0]);
        // }
      } catch (err) {
        console.error("Error fetching chats:", err);
      }
    };

    fetchChats();
  }, [user, refresh]);

  //  HANDLE URL CHAT
  useEffect(() => {
    if (!id || !conversations.length) return;

    const chat = conversations.find(c => c._id === id);
    if (chat) setSelectedChat(chat);
  }, [id, conversations]);

  return (
    <div className="flex h-[calc(100vh-70px)] bg-[var(--bg)] overflow-hidden">
      {/* SIDEBAR */}
      <div className="w-[25%] border-r border-[var(--border)]">
        <ChatSidebar
          conversations={conversations}
          selectedChat={selectedChat}
          onSelectChat={setSelectedChat}
          user={user}
        />
      </div>

      {/* CHAT WINDOW */}
      <div className="flex-1">
        <ChatWindow
          key={selectedChat?._id}
          selectedChat={selectedChat} 
          user={user}
          onRefreshChats={() => setRefresh(prev => !prev)}
        />
      </div>
    </div>
  );
};

export default ChatLayout;
