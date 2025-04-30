import React from "react";
import { Link } from "react-router-dom";
import "../styles/NavbarFooter.css";

const Navbar = () => {
  const isLoggedIn = sessionStorage.getItem("logged") === "1";
  const isAdmin = sessionStorage.getItem("isAdmin") === "1";

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = "/";
  };

  return (
    <header className="navbar">
      <h1>ReGym</h1>
      <nav>
        <Link to="/" className="nav-link">Home</Link>

        {!isLoggedIn ? (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        ) : isAdmin ? (
          <>
            <Link to="/admin" className="nav-link">Admin Dashboard</Link>
            <div className="dropdown">
              <span className="nav-link dropdown-toggle">Admin ▾</span>
              <div className="dropdown-menu">
                <Link to="/admin/users" className="dropdown-item">Users</Link>
                <Link to="/admin/reports" className="dropdown-item">Reports</Link>
                <Link to="/admin/flagged" className="dropdown-item">Flagged Listings</Link>
              </div>
            </div>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </>
        ) : (
          <>
            <Link to="/dashboard" className="nav-link">My Dashboard</Link>
            <Link to="/cart" className="nav-link">Cart</Link>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
