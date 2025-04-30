import React, { useEffect, useState } from "react";
import AdminNavbar from "../Components/AdminNavbar";
import Footer from "../Components/Footer";
import API_BASE_URL from "../config";
import "../styles/AdminPages.css";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [tab, setTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/admin/reports`)
      .then((res) => res.json())
      .then((data) => {
        setReports(data);
        setFilteredReports(data);
      })
      .catch((err) => console.error("Failed to fetch reports:", err));
  }, []);

  useEffect(() => {
    let filtered = [...reports];

    if (tab === "reviewed") {
      filtered = filtered.filter((r) => r.reviewed);
    } else if (tab === "unreviewed") {
      filtered = filtered.filter((r) => !r.reviewed);
    }

    if (searchTerm) {
      filtered = filtered.filter((r) =>
        r.reported_username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredReports(filtered);
  }, [tab, searchTerm, reports]);

  const markAsReviewed = async (id) => {
    const res = await fetch(`${API_BASE_URL}/api/admin/reports/${id}/review`, {
      method: "PUT",
    });
    if (res.ok) {
      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, reviewed: true } : r))
      );
    }
  };

  const deleteReport = async (id) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;
    const res = await fetch(`${API_BASE_URL}/api/admin/reports/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setReports((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const exportToCSV = () => {
    const headers = ["Reported User", "Reason", "Submitted By", "Status", "Submitted On"];
    const rows = filteredReports.map((r) => [
      r.reported_username,
      `"${r.reason}"`,
      r.reporter_username,
      r.reviewed ? "Reviewed" : "Unreviewed",
      new Date(r.created_at).toLocaleString(),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "user_reports.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <>
  <AdminNavbar />
  <main className="admin-main">
    <div className="admin-wrapper">
      <h2 className="admin-title">User Reports</h2>

      {/* Tabs & Search */}
      <div className="filter-controls">
        <div className="tabs">
          <button onClick={() => setTab("all")} className={tab === "all" ? "active" : ""}>All</button>
          <button onClick={() => setTab("reviewed")} className={tab === "reviewed" ? "active" : ""}>Reviewed</button>
          <button onClick={() => setTab("unreviewed")} className={tab === "unreviewed" ? "active" : ""}>Unreviewed</button>
        </div>
        <input
          type="text"
          placeholder="Search by username"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
        <button className="export-btn" onClick={exportToCSV}>⬇ Export CSV</button>
      </div>

      {/* Reports */}
      <div className="reports-grid">
        {filteredReports.length === 0 ? (
          <p>No reports match your filter.</p>
        ) : (
          filteredReports.map((report) => (
            <div key={report.id} className="report-card">
              <div className="report-header">
                <h4>{report.reported_username}</h4>
                <span className={`status-badge ${report.reviewed ? "reviewed" : "unreviewed"}`}>
                  {report.reviewed ? "Reviewed" : "Unreviewed"}
                </span>
              </div>
              <p><strong>Reason:</strong> {report.reason}</p>
              <p><strong>Submitted by:</strong> {report.reporter_username}</p>
              <p><em>{new Date(report.created_at).toLocaleString()}</em></p>
              <div className="report-buttons">
                {!report.reviewed && (
                  <button className="review-btn" onClick={() => markAsReviewed(report.id)}>
                    ✅ Mark as Reviewed
                  </button>
                )}
                <button className="delete-btn" onClick={() => deleteReport(report.id)}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  </main>
  <Footer />
</>

  );
};

export default Reports;
