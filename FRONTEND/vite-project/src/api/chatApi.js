import API from "./axios";


export const sendMessageApi = async (data) => {
  try {
    const res = await API.post("/chat/message", data);
    return res.data; 
  } catch (error) {
    console.error("Send Message API Error:", error.response?.data || error.message);
    throw error;
  }
};


export const getMessagesApi = async (conversationId) => {
  try {
    const res = await API.get(`/chat/messages/${conversationId}`);
    return res.data; 
  } catch (error) {
    console.error("Get Messages API Error:", error.response?.data || error.message);
    throw error;
  }
};


export const getConversationsApi = async () => {
  try {
    const res = await API.get("/chat/conversations");
    return res.data; 
  } catch (error) {
    console.error("Get Conversations API Error:", error.response?.data || error.message);
    throw error;
  }
};