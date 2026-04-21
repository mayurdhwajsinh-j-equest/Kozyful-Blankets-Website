import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout/AdminLayout";
import "./AdminReviews.css";
import { reviewAPI } from "../../services/api";
import api from "../../services/api";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilterRating] = useState("all");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await api.get("/reviews");
      setReviews(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      alert("Error fetching reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await reviewAPI.delete(reviewId);
        alert("Review deleted successfully!");
        fetchReviews();
      } catch (error) {
        console.error("Error deleting review:", error);
        alert("Error deleting review");
      }
    }
  };

  const filteredReviews = reviews.filter((review) => {
    if (filterRating === "all") return true;
    return review.rating === parseInt(filterRating);
  });

  const renderStars = (rating) => {
    return "⭐".repeat(rating) + "☆".repeat(5 - rating);
  };

  return (
    <AdminLayout>
      <div className="admin-reviews">
        <div className="reviews-header">
          <h2 className="page-title">Reviews Management</h2>
          <div className="filter-group">
            <label>Filter by Rating:</label>
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Reviews</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>

        <div className="reviews-stats">
          <div className="review-stat">
            <span className="stat-label">Total Reviews</span>
            <span className="stat-value">{reviews.length}</span>
          </div>
          <div className="review-stat">
            <span className="stat-label">Avg Rating</span>
            <span className="stat-value">
              {reviews.length > 0
                ? (
                    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                  ).toFixed(1)
                : "0"}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading reviews...</div>
        ) : filteredReviews.length === 0 ? (
          <div className="no-reviews">No reviews found</div>
        ) : (
          <div className="reviews-list">
            {filteredReviews.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <div className="review-meta">
                    <h4 className="reviewer-name">{review.user?.name || "Anonymous"}</h4>
                    <p className="review-date">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="review-rating">
                    <span className="stars">{renderStars(review.rating)}</span>
                    <span className="rating-number">({review.rating})</span>
                  </div>
                </div>

                <div className="review-product">
                  <span className="label">Product:</span>
                  <span className="product-name">{review.product?.name || "N/A"}</span>
                </div>

                <div className="review-content">
                  <h5>Review Title:</h5>
                  <p>{review.title || "No title provided"}</p>
                  <h5>Review Comment:</h5>
                  <p>{review.comment || "No comment provided"}</p>
                </div>

                <div className="review-actions">
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteReview(review.id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminReviews;
