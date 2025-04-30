import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import API_BASE_URL from "../config";
import "../styles/UserPages.css"; 
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const userId = sessionStorage.getItem("userId");
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      fetch(`${API_BASE_URL}/api/notifications/user/${userId}`)
        .then((res) => res.json())
        .then(setNotifications)
        .catch((err) => console.error("Failed to load notifications", err));
    }
  }, [userId]);

  const deleteNotification = async (notificationId) => {
    const res = await fetch(`${API_BASE_URL}/api/notifications/${notificationId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setNotifications(notifications.filter((n) => n.id !== notificationId));
    } else {
      alert("Failed to delete notification");
    }
  };

  return (
    <>
      <Navbar />

      <main className="user-main">
        <div className="notifications-wrapper" style={{ maxWidth: "900px", margin: "2rem auto", padding: "1rem" }}>
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              cursor: "pointer",
              marginBottom: "1rem",
              fontSize: "0.9rem"
            }}
          >
            ← Back to Dashboard
          </button>

          <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>🔔 Notifications</h2>

          {notifications.length === 0 ? (
            <p style={{ textAlign: "center" }}>No notifications yet.</p>
          ) : (
            notifications.map((note) => (
              <div
                key={note.id}
                style={{
                  backgroundColor: "#f8f9fc",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "1rem",
                  marginBottom: "1rem"
                }}
              >
                <div><strong>{note.title}</strong></div>
                <div style={{ marginTop: "0.5rem", color: "#555" }}>{note.message}</div>
                <div style={{ marginTop: "0.5rem", fontSize: "12px", color: "#888" }}>
                  {new Date(note.created_at).toLocaleString()}
                </div>
                <button
                  onClick={() => deleteNotification(note.id)}
                  style={{
                    backgroundColor: "#ff4d4d",
                    color: "white",
                    border: "none",
                    padding: "0.4rem 0.8rem",
                    borderRadius: "6px",
                    marginTop: "0.8rem",
                    cursor: "pointer",
                    fontSize: "0.8rem"
                  }}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Notifications;
