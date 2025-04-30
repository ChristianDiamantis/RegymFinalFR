import React from "react";
import { Link } from "react-router-dom";
import AdminNavbar from "../Components/AdminNavbar";
import "../styles/AdminDashboard.css"; 

const AdminDashboard = () => {
  return (
    <>
      <AdminNavbar />
      <div className="admin-dashboard-container">
        <h1 className="admin-heading">Welcome, Admin 👋</h1>
        <p className="admin-subtext">Manage everything in one place.</p>

        <div className="admin-cards-container">
          <Link to="/admin/users" className="admin-card">
            <h2>Users</h2>
            <p>View and manage registered users.</p>
          </Link>

          <Link to="/admin/reports" className="admin-card">
            <h2>Reports</h2>
            <p>View submitted reports and feedback.</p>
          </Link>

          <Link to="/admin/flagged-listings" className="admin-card">
            <h2>Flagged Listings</h2>
            <p>Review content flagged by users.</p>
          </Link>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
