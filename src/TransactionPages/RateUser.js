import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import API_BASE_URL from "../config";
import "../styles/TransactionPages.css";

const RateUser = () => {
  const [usersToRate, setUsersToRate] = useState([]);
  const [filter, setFilter] = useState("");
  const [error, setError] = useState("");

  const userId = sessionStorage.getItem("userId");

  useEffect(() => {
    const fetchUsers = async () => {
      if (!userId) return;

      try {
        const res = await fetch(`${API_BASE_URL}/api/ratings/partners/${userId}`);
        const data = await res.json();

        if (!Array.isArray(data)) {
          setError("Invalid data received from server.");
          return;
        }

        setUsersToRate(data);
      } catch (err) {
        console.error("Failed to fetch users to rate:", err);
        setError("Something went wrong. Please try again later.");
      }
    };

    fetchUsers();
  }, [userId]);

  const handleRate = async (ratedUserId, rating) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/ratings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rater_id: userId,
          rated_id: ratedUserId,
          rating,
        }),
      });

      if (res.ok) {
        alert("Thank you for your rating!");
        setUsersToRate(prev => prev.filter(user => user.id !== ratedUserId));
      } else if (res.status === 400) {
        const result = await res.json();
        alert(result.message || "You've already rated this user.");
        setUsersToRate(prev => prev.filter(user => user.id !== ratedUserId));
      } else {
        alert("Failed to submit your rating. Try again.");
      }
    } catch (err) {
      console.error("Error submitting rating:", err);
      alert("An error occurred. Please try again later.");
    }
  };

  const filteredUsers = usersToRate.filter((user) =>
    user.username.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="rate-user-page">
      <Navbar />
      <main className="rate-user-wrapper">
        <h2>Rate a User</h2>
        <input
          type="text"
          placeholder="Search by username..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="filter-input"
        />

        {error && <p className="error-text">{error}</p>}

        {!error && filteredUsers.length === 0 ? (
          <p>No users available for rating.</p>
        ) : (
          filteredUsers.map((user) => (
            <div key={user.id} className="rate-card">
              <h4>{user.username}</h4>
              <p>{user.email}</p>
              <p>
                <strong>Avg. Rating:</strong>{" "}
                {!isNaN(user.average_rating) ? Number(user.average_rating).toFixed(1) : "Not rated yet"}

              </p>
              <div className="rating-buttons">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button key={num} onClick={() => handleRate(user.id, num)}>
                    {num} ⭐
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </main>
      <Footer />
    </div>
  );
};

export default RateUser;
