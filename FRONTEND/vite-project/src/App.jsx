import Layout from "./components/layout/Layout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import Skills from "./pages/Skills";
import Explore from "./pages/Explore";
import MentorSessions from "./pages/MentorSessions";
import MySkills from "./pages/MySkills";
import EditSkill from "./pages/EditSkill";
import MyRequests from "./pages/MyRequests";
import { Routes, Route, Navigate } from "react-router-dom";
import Profile from "./pages/Profile";
import Nearby from "./pages/Nearby";
import CalendarPage from "./pages/CalendarPage";
import Exchange from "./pages/Exchange";
import Chat from "./pages/Chat";
import { NotificationProvider } from "./context/NotificationContext.jsx";
import ChatLayout from "./components/chat/ChatLayout";
import { Toaster } from "react-hot-toast";

function App() {


  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <NotificationProvider user={user}>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "var(--card)",
            color: "var(--text)",
            border: "1px solid var(--border)",
          },
        }}
        reverseOrder={false}
      />
    <Routes>

      
      <Route path="/" element={<Navigate to="/login" />} />

      
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      
      <Route
        path="/dashboard"
        element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>}
      />

      <Route
        path="/skills"
        element={<ProtectedRoute><Layout><Skills /></Layout></ProtectedRoute>}
      />

      <Route
        path="/explore"
        element={<ProtectedRoute><Layout><Explore /></Layout></ProtectedRoute>}
      />

      <Route
        path="/profile/:id"
        element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>}
      />

      <Route
        path="/mentor-sessions"
        element={<ProtectedRoute><Layout><MentorSessions /></Layout></ProtectedRoute>}
      />

      <Route
        path="/my-skills"
        element={<ProtectedRoute><Layout><MySkills /></Layout></ProtectedRoute>}
      />

      <Route
        path="/edit-skill/:id"
        element={<ProtectedRoute><Layout><EditSkill /></Layout></ProtectedRoute>}
      />

      <Route
        path="/my-requests"
        element={<ProtectedRoute><Layout><MyRequests /></Layout></ProtectedRoute>}
      />

      <Route
        path="/nearby"
        element={<ProtectedRoute><Layout><Nearby /></Layout></ProtectedRoute>}
      />

      <Route
        path="/calendar"
        element={<ProtectedRoute><Layout><CalendarPage /></Layout></ProtectedRoute>}
      />

      <Route
        path="/manage-sessions"
        element={<ProtectedRoute><Layout><MentorSessions /></Layout></ProtectedRoute>}
      />

      <Route
        path="/exchange"
        element={<ProtectedRoute><Layout><Exchange /></Layout></ProtectedRoute>}
      />

   
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <Layout>
              <ChatLayout user={user} />
            </Layout>
          </ProtectedRoute>
        }
      />

      
      <Route
        path="/chat/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <ChatLayout user={user} />
            </Layout>
          </ProtectedRoute>
        }
      />

    </Routes>
    </NotificationProvider>
  );
}

export default App;