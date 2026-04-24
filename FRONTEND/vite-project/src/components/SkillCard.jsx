function SkillCard({ skill, isActive, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`p-4 mb-3 rounded-xl shadow cursor-pointer transition-all 
      ${isActive ? "bg-blue-100 border-blue-500 border" : "bg-white hover:bg-gray-100"}`}
    >
      <h3 className="font-bold text-lg text-gray-800">
        {skill.skillName}
      </h3>

      <p className="text-sm text-gray-500">{skill.category}</p>

      <p className="text-sm text-purple-600 font-semibold mt-1">
        📏 {skill.distance.toFixed(2)} km
      </p>

      <p className="text-xs text-gray-400 mt-1">
        👤 {skill.mentor?.username}
      </p>
    </div>
  );
}

export default SkillCard;