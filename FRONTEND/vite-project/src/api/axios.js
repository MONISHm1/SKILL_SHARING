// import axios from "axios";

// const API = axios.create({
//   baseURL: "/api"
// });

// // 🔐 Attach token automatically
// API.interceptors.request.use((req) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     req.headers.Authorization = `Bearer ${token}`;
//   }

//   return req;
// });

// export default API;


import axios from "axios";

// ✅ Use env variable OR fallback
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true, // ✅ important for cookies (future safe)
});

// 🔐 Attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

// ❌ OPTIONAL BUT VERY USEFUL (ERROR HANDLING)
API.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API Error:", err?.response?.data || err.message);
    return Promise.reject(err);
  }
);

export default API;