import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import "../styles/LoginRegister.css";
import API_BASE_URL from "../config";

const Login = () => {
  const [form, setForm] = useState({
    username: "",
    password: ""
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    console.log("Attempting login with:", form);

    try {
      const res = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      console.log("Login response:", res.status, data);

      if (res.ok) {
        sessionStorage.setItem("logged", "1");
        sessionStorage.setItem("userId", data.id);
        sessionStorage.setItem("username", data.username);
        sessionStorage.setItem("email", data.email);
        sessionStorage.setItem("role", data.role);

        if (data.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/");
        }

        window.location.reload();
      } else {
        setError(data.message || "Login failed.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="auth-wrapper">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Login</h2>

          {error && <p className="auth-error">{error}</p>}

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button type="submit">Login</button>

          <p className="auth-reset">
            <a href="/reset-password">Forgot Password?</a>
          </p>

          <p className="auth-switch">
            Don't have an account? <a href="/register">Register</a>
          </p>
        </form>
      </div>
    </>
  );
};

export default Login;
