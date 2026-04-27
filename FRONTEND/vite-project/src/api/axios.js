// import axios from "axios";

// const API = axios.create({
//   baseURL: "/api"
// });

// //  Attach token automatically
// API.interceptors.request.use((req) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     req.headers.Authorization = `Bearer ${token}`;
//   }

//   return req;
// });

// export default API;


import axios from "axios";

//  Base API instance 
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
});

//  Attach JWT automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

//  Global error handler
API.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API Error:", err?.response?.data || err.message);
    return Promise.reject(err);
  }
);

// Geoapify API Key 
export const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

export default API;