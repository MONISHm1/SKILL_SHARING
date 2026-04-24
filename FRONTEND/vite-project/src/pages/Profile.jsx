import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";

function Profile() {
  const { id } = useParams();

  const [mentor, setMentor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [editingReview, setEditingReview] = useState(null);

  const fetchData = async () => {
    try {
      const userRes = await API.get(`/users/${id}`);
      setMentor(userRes.data.data.user);

      const reviewRes = await API.get(`/reviews/mentor/${id}`);
      setReviews(reviewRes.data?.reviews || reviewRes.data?.data?.reviews || []);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this review?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/reviews/${id}`);
      alert("Review deleted ✅");
      fetchData();
    } catch (err) {
      console.log(err);
      alert("Error deleting review");
    }
  };

  const handleUpdate = async () => {
    try {
      await API.patch(`/reviews/${editingReview._id}`, {
        rating: editingReview.rating,
        review: editingReview.review
      });

      alert("Review updated ✅");
      setEditingReview(null);
      fetchData();
    } catch (err) {
      console.log(err);
      alert("Error updating review");
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/users/me");
        setCurrentUser(res.data.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUser();
  }, []);

  if (!mentor) return <p>Loading...</p>;

  return (
    <div className="p-6 bg-[var(--bg)] text-[var(--text)]"> 

      
      <div className="card p-6 mb-6"> {/* 🔥 CHANGE */}
        <h2 className="text-2xl font-bold">{mentor.username}</h2>
        <p className="text-gray-500 dark:text-gray-400">📍 {mentor.location}</p> 
        <p className="text-yellow-500 mt-2">
          ⭐ {mentor.averageRating?.toFixed(1) || 0} ({mentor.totalReviews} reviews)
        </p>
      </div>

      
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-3">Skills Offered</h3>

        <div className="grid grid-cols-3 gap-4">
          {mentor.skillsOffered?.map((skill) => (
            <div key={skill._id} className="card p-4"> 
              <h4 className="font-semibold">{skill.skillName}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400"> 
                {skill.category}
              </p>
            </div>
          ))}
        </div>
      </div>

     
      <div>
        <h3 className="text-xl font-bold mb-3">Reviews</h3>

        {reviews?.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No reviews yet</p> 
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => {
              return (
                <div key={rev._id} className="card p-4"> 
                  <p className="font-semibold">{rev.reviewer?.username}</p>
                  <p className="text-yellow-500">⭐ {rev.rating}</p>
                  <p className="text-sm text-gray-400">Skill: {rev.skill?.skillName}</p>
                  <p className="text-gray-600 dark:text-gray-300"> 
                    {rev.review}
                  </p>

                  
                  {rev.reviewer?._id?.toString() === currentUser?._id?.toString() && (
                    <div className="flex gap-2 mt-3">

                      <button
                        onClick={() => handleDelete(rev._id)}
                        className="inline-flex items-center gap-2 px-4 py-2
                        text-sm font-semibold text-red-600
                        bg-red-50 border border-red-200 rounded-lg
                        hover:bg-red-100 hover:scale-105 transition"
                      >
                        🗑 Delete
                      </button>

                      <button
                        onClick={() => setEditingReview(rev)}
                        className="inline-flex items-center gap-2 px-4 py-2
                        text-sm font-semibold text-white
                        bg-gradient-to-r from-blue-500 to-indigo-500
                        rounded-lg hover:scale-105 transition"
                      >
                        ✏️ Edit
                      </button>

                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </div>

      
      {editingReview && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          
          <div className="card p-6 w-96"> 

            <h2 className="text-lg font-bold mb-4">Edit Review</h2>

            <div className="flex gap-2 mb-3">
              {[1,2,3,4,5].map((star) => (
                <span
                  key={star}
                  onClick={() =>
                    setEditingReview({ ...editingReview, rating: star })
                  }
                  className={`cursor-pointer text-2xl 
                  ${editingReview.rating >= star ? "text-yellow-400" : "text-gray-300"}`}
                >
                  ★
                </span>
              ))}
            </div>

            <textarea
              value={editingReview.review}
              onChange={(e) =>
                setEditingReview({ ...editingReview, review: e.target.value })
              }
              className="w-full p-2 rounded mb-4 border border-[var(--border)] bg-[var(--card)] text-[var(--text)]" 
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingReview(null)}
                className="px-4 py-1 bg-gray-200 dark:bg-gray-700 rounded" 
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="px-4 py-1 bg-blue-500 text-white rounded"
              >
                Save
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default Profile;