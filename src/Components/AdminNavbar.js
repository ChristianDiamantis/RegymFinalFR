import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/AdminNavbar.css";

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear(); 
    navigate("/"); 
    window.location.reload(); 
  };

  return (
    <nav className="admin-navbar">
      <h1><Link to="/admin-dashboard">ReGym Admin</Link></h1>
      <div className="admin-nav-links">
        <Link to="/admin-dashboard">Dashboard</Link>
        <Link to="/admin/users">Users</Link>
        <Link to="/admin/reports">Reports</Link>
        <Link to="/admin/flagged-listings">Flagged</Link>
        <Link to="/admin/subscription-sales">ReGym Sales</Link>
        <li><a href="/admin/active-listings">Active Listings</a></li>
        <Link to="/admin/view-messages">Messages</Link>


        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
