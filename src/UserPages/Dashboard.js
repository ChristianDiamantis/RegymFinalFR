import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar"; 
import Footer from "../Components/Footer"; 
import API_BASE_URL from "../config"; 
import "../styles/UserPages.css"; 
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from "recharts"; // Chart components for visual data

// Functional component for the dashboard view
const Dashboard = () => {
  const navigate = useNavigate();// Hook to programmatically navigate
  const userId = sessionStorage.getItem("userId");// Retrieve user ID from session storage

 // State variables for managing dashboard data
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [chartMode, setChartMode] = useState("daily");
  const [lastPayoutDate, setLastPayoutDate] = useState("");
  const [salesData, setSalesData] = useState([]);
  const [topItems, setTopItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [payout, setPayout] = useState(0);

  // Fetch dashboard data from API
  const fetchDashboardData = async () => {
    if (!userId) return;
    setLoading(true);

    try { // Fetch sales summary data
      
      const salesRes = await fetch(`${API_BASE_URL}/api/sales-summary/${userId}?mode=${chartMode}`);
      const salesJson = await salesRes.json();
      setSalesData(salesJson);

     // Fetch top-selling items data
      const itemsRes = await fetch(`${API_BASE_URL}/api/top-items/${userId}`);
      const itemsJson = await itemsRes.json();
      setTopItems(itemsJson);

      // Calculate total payout from sales data
      const total = salesJson.reduce((sum, row) => sum + parseFloat(row.earnings || 0), 0);
      setPayout(total);

      // Fetch last payout date
      const userRes = await fetch(`${API_BASE_URL}/api/users/${userId}`);
      const userJson = await userRes.json();
      setLastPayoutDate(userJson.last_payout ? new Date(userJson.last_payout).toLocaleDateString() : "N/A");

    } catch (err) {
      console.error("Error loading dashboard data:", err);
    }

    setLoading(false);
  };

  // Handle payout requests
  const handlePayout = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/payout/${userId}`, {
        method: "POST"
      });
  
      const data = await res.json();
  
      if (res.ok) {
        alert(`✅ Payout successful!\nYou received $${(data.total * 0.95).toFixed(2)} after fees.`);
        setPayout(0); 
        setLastPayoutDate(new Date().toLocaleDateString()); 
      } else {
        alert("❌ Payout failed: " + (data.message || "Unknown error."));
      }
    } catch (err) {
      console.error("Payout error:", err);
      alert("❌ Network error during payout.");
    }
  };
  
  const exportToCSV = () => {
    const rows = [["Date", "Earnings"], ...salesData.map((d) => [d.date, d.earnings])];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sales_data.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    fetchDashboardData();
  }, [chartMode]);

  const totalEarnings = payout.toFixed(2);
  const fee = (payout * 0.05).toFixed(2);
  const netEarnings = (payout * 0.95).toFixed(2);


 
  return (
    <div className="dashboard-wrapper">
      <Navbar />
      <div className="dashboard-layout">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <h3 className="sidebar-title">Quick Panel</h3>
          <div className="quick-buttons">
            <h4 className="sidebar-subtitle">Seller Pages</h4>
            <button onClick={() => navigate("/create-listing")} className="sidebar-btn">Create Listing</button>
            <button onClick={() => navigate("/my-listings")} className="sidebar-btn">My Listings</button>
            <h4 className="sidebar-subtitle">Buyer Pages</h4>
            <button onClick={() => navigate("/all-listings")} className="sidebar-btn">View All Listings</button>
            <button onClick={() => navigate("/my-orders")} className="sidebar-btn">My Orders</button>
            <button onClick={() => navigate("/favorites")} className="sidebar-btn">Favorites</button>
            <button onClick={() => navigate("/business-plans")} className="sidebar-btn">Regym Subscriptions</button>
            <button onClick={() => navigate("/View-Subscriptions")} className="sidebar-btn">My Subscriptions</button>
            <h4 className="sidebar-subtitle">User Pages</h4>
            <button onClick={() => navigate("/faq")} className="sidebar-btn">FAQ</button>
            <button onClick={() => navigate("/rate-user")} className="sidebar-btn">Rate Users</button>
            <button onClick={() => navigate("/notifications")} className="sidebar-btn">Notifications</button>
            <button onClick={() => navigate("/contact-us")} className="sidebar-btn">Contact Us</button>
          </div>
        </aside>

        {/* Main Dashboard */}
        <main className="dashboard-main">
          <div className="dashboard-header">
            <h2>Welcome to Your Dashboard</h2>
            <div className="dashboard-actions">
              <button onClick={() => navigate("/edit-profile")} className="secondary-btn">Edit Profile</button>
            </div>
          </div>

          {/* Filters */}
          <div className="dashboard-filters">
            <label>From: <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} /></label>
            <label>To: <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} /></label>
            <button className="primary-btn" onClick={fetchDashboardData}>Refresh</button>
            <button className="secondary-btn" onClick={exportToCSV}>Export CSV</button>

            <div className="toggle-group">
              <span>Chart Mode:</span>
              <button className={`toggle-btn ${chartMode === "daily" ? "active" : ""}`} onClick={() => setChartMode("daily")}>Daily</button>
              <button className={`toggle-btn ${chartMode === "weekly" ? "active" : ""}`} onClick={() => setChartMode("weekly")}>Weekly</button>
            </div>
          </div>

          {loading ? (
            <p>Loading charts...</p>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
              {/* Line Chart */}
              <div className="chart-box">
                <h4>Sales Over Time</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="earnings" stroke="#007bff" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Top Items */}
              <div className="chart-box">
                <h4>Top-Selling Items</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={topItems}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sold" fill="#28a745" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Earnings Summary */}
              <div className="earnings-summary">
                <h4>Total Earnings</h4>
                <p><strong>Gross:</strong> ${totalEarnings}</p>
                <p><strong>Platform Fee (5%):</strong> -${fee}</p>
                <p><strong>Net Payout:</strong> <span className="net-amount">${netEarnings}</span></p>
                <p><strong>Last Payout:</strong> {lastPayoutDate}</p>
                <button onClick={handlePayout}>Payout Now</button>
              </div>
            </div>
            
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
