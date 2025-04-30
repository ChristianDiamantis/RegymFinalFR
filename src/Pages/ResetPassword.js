import React, { useState } from "react";
import Navbar from "../Components/Navbar"; 
import "../styles/LoginRegister.css";
import API_BASE_URL from "../config"; 

// Functional component for resetting user password
const ResetPassword = () => {
  // Form fields: username and newPassword
  const [form, setForm] = useState({ username: "", newPassword: "" });

  // Feedback message to the user
  const [message, setMessage] = useState("");

  // Flag to track if the message is an error
  const [isError, setIsError] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle password reset form submission
  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("Updating password...");
    setIsError(false);

    try {
      const res = await fetch(`${API_BASE_URL}/api/users/reset-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          newPassword: form.newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setIsError(true);
      }

      setMessage(data.message || "Password updated.");
    } catch (err) {
      console.error("Reset error:", err);
      setMessage("Something went wrong.");
      setIsError(true);
    }
  };

  
  return (
    <>
      <Navbar />

      {/* Main reset password form */}
      <div className="auth-wrapper">
        <form className="auth-form" onSubmit={handleReset}>
          <h2>Reset Password</h2>

          {/* Show feedback message */}
          {message && (
            <p
              className="auth-message"
              style={{
                color: isError ? "red" : "green",
                fontWeight: "500",
                marginBottom: "10px",
              }}
            >
              {message}
            </p>
          )}

          {/* Username input */}
          <input
            type="text"
            name="username"
            placeholder="Enter your username"
            value={form.username}
            onChange={handleChange}
            required
          />

          {/* New password input */}
          <input
            type="password"
            name="newPassword"
            placeholder="Enter new password"
            value={form.newPassword}
            onChange={handleChange}
            required
          />

          {/* Submit button */}
          <button type="submit">Update Password</button>
        </form>
      </div>
    </>
  );
};

export default ResetPassword;
