import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../api/axios";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", form);

      //  store token
      localStorage.setItem("token", res.data.data.accessToken);

      //  store correct user
      localStorage.setItem("user", JSON.stringify(res.data.data.user));

      navigate("/dashboard");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-100 to-blue-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-2 text-center">Login</h2>

        <p className="text-gray-500 text-center mb-6">Enter your details to continue</p>

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        <button className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:scale-105 transition">
          Login
        </button>

        {/*  REGISTER LINK */}
        <p className="text-sm mt-4 text-center">
          New user?{" "}
          <Link to="/register" className="text-blue-600 font-semibold">
            Create account
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
