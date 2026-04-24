import API from "./axios";

/**
 * 📩 Send Message
 */
export const sendMessageApi = async (data) => {
  try {
    const res = await API.post("/chat/message", data);
    return res.data; // ✅ always return clean data
  } catch (error) {
    console.error("Send Message API Error:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 📥 Get Messages of a Conversation
 */
export const getMessagesApi = async (conversationId) => {
  try {
    const res = await API.get(`/chat/messages/${conversationId}`);
    return res.data; // ✅ clean data
  } catch (error) {
    console.error("Get Messages API Error:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 💬 Get All Conversations of User
 */
export const getConversationsApi = async () => {
  try {
    const res = await API.get("/chat/conversations");
    return res.data; // ✅ clean data
  } catch (error) {
    console.error("Get Conversations API Error:", error.response?.data || error.message);
    throw error;
  }
};