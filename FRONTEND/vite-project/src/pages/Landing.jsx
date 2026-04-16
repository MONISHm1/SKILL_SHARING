import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Landing() {
  const navigate = useNavigate();

  // Redirect if logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 px-4">

      {/* Glass Card */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl p-10 max-w-2xl w-full text-center text-white">

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          Learn & Share Skills <br />
          <span className="text-yellow-300">Within Your Neighborhood</span>
        </h1>

        {/* Subtext */}
        <p className="text-gray-200 text-lg mb-8">
          Connect with people around you, teach what you know, and learn what you love — all in one place.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">

          <Link
            to="/login"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Sign In
          </Link>

          <Link
            to="/register"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Get Started
          </Link>

        </div>

      </div>
    </div>
  );
}

export default Landing;