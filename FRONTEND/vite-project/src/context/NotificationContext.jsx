import { createContext, useContext, useEffect, useState } from "react";
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../api/notificationAPI.js";
import { connectSocket, getSocket } from "../socket/socket.js"; 
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import NotificationToast from "../components/NotificationToast";

const NotificationContext = createContext();

export const NotificationProvider = ({ user, children }) => {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    
    connectSocket(user);
    const socket = getSocket();

    loadNotifications();

    socket.on("newNotification", data => {
      setNotifications(prev => {
        
        const exists = prev.some(n => n._id === data._id);
        if (exists) return prev;

        return [data, ...prev];
      });

      
      if (!data.link || !window.location.pathname.startsWith(data.link)) {
        toast.custom(t => <NotificationToast t={t} data={data} />);
      }
    });

    return () => {
      socket.off("newNotification");
    };
  }, [user]);

  const loadNotifications = async () => {
    const res = await fetchNotifications();

    
    const unread = res.data.data.filter(n => !n.isRead);

    setNotifications(unread);
  };

  const markAsReadLocal = id => {
    setNotifications(
      prev => prev.filter(n => n._id !== id) 
    );
  };

  const markAsReadServer = async id => {
    try {
      await markNotificationRead(id);
      markAsReadLocal(id);
    } catch (err) {
      console.error(err);
    }
  };

  const markAllReadServer = async () => {
    try {
      await markAllNotificationsRead();

      setNotifications([]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleNotificationClick = async (notification, navigate) => {
    try {
      
      await markAsReadServer(notification._id);

      
      if (notification.link) {
        navigate(notification.link);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, setNotifications, markAsReadServer, markAllReadServer, handleNotificationClick, }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
