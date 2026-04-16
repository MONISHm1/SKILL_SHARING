import Navbar from "../../components/Navbar";

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <div className="p-6 max-w-6xl mx-auto">

        {/* Welcome */}
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <h1 className="text-2xl font-bold">Welcome 👋</h1>
          <p className="text-gray-600">
            Explore and share skills in your neighborhood.
          </p>
        </div>

        {/* Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">

          <div className="bg-blue-500 text-white p-6 rounded-xl hover:bg-blue-600">
            <h2 className="text-xl font-semibold">➕ Add Skill</h2>
          </div>

          <div className="bg-green-500 text-white p-6 rounded-xl hover:bg-green-600">
            <h2 className="text-xl font-semibold">🔍 Explore Skills</h2>
          </div>

        </div>

        {/* Categories */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Categories</h2>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {["Tech", "Cooking", "Art", "Fitness", "Academic"].map((cat) => (
              <div key={cat} className="bg-gray-100 p-4 rounded-lg text-center">
                {cat}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;