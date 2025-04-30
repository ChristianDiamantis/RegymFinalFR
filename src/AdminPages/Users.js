import React, { useState, useEffect } from "react";
import AdminNavbar from "../Components/AdminNavbar";
import Footer from "../Components/Footer";
import "../styles/AdminPages.css";
import API_BASE_URL from "../config";

// Functional component for Admin - Managing Users
const Users = () => {
  // State to hold all registered users
  const [users, setUsers] = useState([]);

  // Fetch all users from the server on page load
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/admin/users`)
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Failed to fetch users:", err));
  }, []);

  // Handle banning/deleting a user
  const banUser = async (id) => {
    const confirmBan = window.confirm("Are you sure you want to ban/delete this user?");
    if (!confirmBan) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // Remove user from local state after deletion
        setUsers(users.filter((user) => user.id !== id));
        alert("User deleted.");
      } else {
        alert("Failed to delete user.");
      }
    } catch (err) {
      console.error("Failed to delete user:", err);
      alert("An error occurred while trying to delete the user.");
    }
  };

 
  return (
    <div>
      <AdminNavbar />

      {/* Main Admin Users Content */}
      <main className="favorites-wrapper">
        <h2>All Registered Users</h2>

        {/* If no users found */}
        <div className="favorites-grid">
          {users.length === 0 ? (
            <p>No users found.</p>
          ) : (
            users.map((user) => (
              <div className="favorite-card" key={user.id}>
                <h4>{user.username || user.name}</h4>
                <p>Email: {user.email}</p>

                {/* Button to ban/delete the user */}
                <button className="remove-btn" onClick={() => banUser(user.id)}>
                  Ban/Delete User
                </button>
              </div>
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

// Export the component
export default Users;