import React, { useEffect, useState } from "react";
import AdminNavbar from "../Components/AdminNavbar";
import Footer from "../Components/Footer";
import API_BASE_URL from "../config";
import "../styles/AdminPages.css";

const ViewMessages = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/messages`);
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error("Failed to load messages:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/messages/${id}`, {
        method: "DELETE"
      });

      if (res.ok) {
        setMessages((prev) => prev.filter((msg) => msg.id !== id));
        alert("Message deleted successfully!");
      } else {
        alert("Failed to delete message. Please try again.");
      }
    } catch (err) {
      console.error("Error deleting message:", err);
      alert("Server error. Please try again later.");
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="admin-container">
        <h2>Contact Messages</h2>
        <div className="messages-list">
          {messages.length === 0 ? (
            <p>No messages yet.</p>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="message-card">
                <h4>{msg.name} ({msg.email})</h4>
                <p>{msg.message}</p>
                <small>Received on: {new Date(msg.created_at).toLocaleString()}</small>
                <button onClick={() => handleDelete(msg.id)} className="delete-button">
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ViewMessages;
