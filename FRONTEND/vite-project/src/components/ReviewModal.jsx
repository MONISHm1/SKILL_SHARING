import { useState } from "react";
import API from "../api/axios";

function ReviewModal({ session, onClose }) {

  const [form, setForm] = useState({
    rating: 5,
    review: ""
  });

 
  const [loading, setLoading] = useState(false);

const handleSubmit = async () => {
  try {
    setLoading(true);

    await API.post("/reviews", {
      mentorId: session.mentor._id,
      sessionId: session._id,
      rating: form.rating,
      review: form.review
    });

    alert("Review Submitted ✅");

    onClose();

  } catch (err) {
    alert("Already reviewed ❌");
  } finally {
    setLoading(false);
  }
};

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center"
      onClick={onClose}
    >

      <div
        className="bg-white p-6 rounded-xl w-96 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Title */}
        <h2 className="text-lg font-bold mb-1">
          Review for {session.mentor.username}
        </h2>

        {/* Skill Name */}
        <p className="text-sm text-gray-500 mb-3">
          Skill: {session.skill?.skillName}
        </p>

        {/*  Star Rating */}
        <div className="flex gap-2 mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setForm({ ...form, rating: star })}
              className={`cursor-pointer text-2xl transition 
                ${form.rating >= star 
                  ? "text-yellow-400" 
                  : "text-gray-300 hover:text-yellow-300"}`}
            >
              ★
            </span>
          ))}
        </div>

        {/* Review Input */}
        <textarea
          placeholder="Write your review..."
          onChange={(e) =>
            setForm({ ...form, review: e.target.value })
          }
          className="input"
        />

        {/* Buttons */}
        <div className="flex justify-between mt-4">

          <button
            onClick={onClose}
            className="px-4 py-1 border rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default ReviewModal;