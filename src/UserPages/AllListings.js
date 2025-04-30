import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import API_BASE_URL from "../config";
import "../styles/UserPages.css";

const AllListings = () => {
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("userId");
  const [allListings, setAllListings] = useState([]);
  const [listings, setListings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [users, setUsers] = useState([]);
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportUsername, setReportUsername] = useState("");
  const [reportReason, setReportReason] = useState("");
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const [conditionFilter, setConditionFilter] = useState(() => localStorage.getItem("conditionFilter") || "all");
  const [categoryFilter, setCategoryFilter] = useState(() => localStorage.getItem("categoryFilter") || "all");
  const [priceFilter, setPriceFilter] = useState(() => localStorage.getItem("priceFilter") || "all");

  useEffect(() => {
    const fetchAllData = async () => {
      const userRes = await fetch(`${API_BASE_URL}/api/users`);
      const userData = await userRes.json();
      setUsers(userData);

      const listingRes = await fetch(`${API_BASE_URL}/api/listings`);
      const listingsData = await listingRes.json();

      const listingsWithUsernames = listingsData
        .filter(item => String(item.user_id) !== String(userId) && !item.sold)
        .map(item => {
          const user = userData.find(u => u.id === item.user_id);
          return { ...item, username: user ? user.username : "Unknown" };
        });

      setAllListings(listingsWithUsernames);
      applyFilters(listingsWithUsernames);
    };

    if (userId) {
      fetch(`${API_BASE_URL}/api/favorites/user/${userId}`)
        .then((res) => res.json())
        .then((data) => setFavorites(data.map((fav) => fav.id)));

      fetchAllData();
    }
  }, [userId]);

  const applyFilters = (data = allListings) => {
    let result = [...data]; 
    if (conditionFilter !== "all") {
      result = result.filter(item => item.condition?.toLowerCase() === conditionFilter.toLowerCase());
    }
    if (categoryFilter !== "all") {
      result = result.filter(item => item.category?.toLowerCase() === categoryFilter.toLowerCase());
    }
    if (priceFilter !== "all") {
      const [min, max] = priceFilter.split("-").map(Number);
      result = result.filter(item => parseFloat(item.price) >= min && parseFloat(item.price) <= max);
    }
    setListings(result); 
  };
  

  const handleFilterChange = (setter, key) => (e) => {
    const val = e.target.value;
    setter(val);
    localStorage.setItem(key, val);
  
   
    setTimeout(() => {
      applyFilters([...allListings]); 
    }, 0);
  };
  

  const handleResetFilters = () => {
    setConditionFilter("all");
    setCategoryFilter("all");
    setPriceFilter("all");
    localStorage.removeItem("conditionFilter");
    localStorage.removeItem("categoryFilter");
    localStorage.removeItem("priceFilter");
    applyFilters(allListings);
  };

  const handleBuy = async (item) => {
    const res = await fetch(`${API_BASE_URL}/api/cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,           
        listing_id: item.id,       
        title: item.title,
        description: item.description,
        price: item.price,
        condition: item.condition,
        category: item.category,
        image: item.image,
        seller_id: item.user_id    
      }),
    });
  
    if (res.ok) {
      alert("Item added to cart!");
      const updatedListings = allListings.filter(l => l.id !== item.id);
      setAllListings(updatedListings);
      applyFilters(updatedListings);
    } else {
      alert("Failed to add to cart.");
    }
  };
  

  const handleAddFavorite = async (itemId) => {
    const res = await fetch(`${API_BASE_URL}/api/favorites`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, listing_id: itemId }),
    });
    if (res.ok) {
      setFavorites(prev => [...prev, itemId]);
      alert("Favorited!");
    }
  };

  const handleFlag = async (listingId) => {
    const reason = prompt("Why are you flagging this listing?");
    await fetch(`${API_BASE_URL}/api/listings/flag`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, listing_id: listingId, reason }),
    });
    alert("Listing flagged.");
  };

  const submitReport = async () => {
    if (!reportUsername || !reportReason) return alert("Fill in both fields.");
    if (!users.find(user => user.username === reportUsername)) {
      return alert("Username does not exist.");
    }
    const res = await fetch(`${API_BASE_URL}/api/users/report`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: reportUsername, reason: reportReason, reporter_id: userId }),
    });
    if (res.ok) {
      setReportSubmitted(true);
      setReportUsername("");
      setReportReason("");
      setTimeout(() => {
        setReportSubmitted(false);
        setShowReportForm(false);
      }, 2000);
    } else {
      alert("Failed to submit report.");
    }
  };

  return (
    <div className="dashboard-wrapper" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <main className="dashboard-main" style={{ flex: 1, padding: "32px 48px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2>Explore All Listings</h2>
          <div>
            <button onClick={() => setShowReportForm(true)} className="toggle-btn">🚨 Report User</button>
            <button onClick={() => navigate("/dashboard")} className="toggle-btn" style={{ marginLeft: "10px" }}>← Back to Dashboard</button>
          </div>
        </div>

        <div className="filter-section" style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginBottom: "20px" }}>
          {[{
            label: "Condition", id: "conditionFilter", value: conditionFilter,
            onChange: handleFilterChange(setConditionFilter, "conditionFilter"),
            options: ["-- Select --", "New", "Fair", "Used"]
          }, {
            label: "Category", id: "categoryFilter", value: categoryFilter,
            onChange: handleFilterChange(setCategoryFilter, "categoryFilter"),
            options: ["-- Select --", "Weights", "Cardio", "Accessories"]
          }, {
            label: "Price Range", id: "priceFilter", value: priceFilter,
            onChange: handleFilterChange(setPriceFilter, "priceFilter"),
            options: ["-- Select --", "0-25", "25-50", "50-100", "100-10000"]
          }].map(({ label, id, value, onChange, options }) => (
            <div key={id} style={{ display: "flex", flexDirection: "column" }}>
              <label htmlFor={id} style={{ fontWeight: 600, marginBottom: 4 }}>{label}:</label>
              <select
                id={id}
                value={value}
                onChange={onChange}
                style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #ccc", minWidth: "150px" }}
              >
                {options.map((opt, index) => (
                  <option key={index} value={opt.includes("Select") ? "all" : opt}>{opt}</option>
                ))}
              </select>
            </div>
          ))}

          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <button
              onClick={handleResetFilters}
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                background: "#f3f4f6",
                border: "1px solid #ccc",
                cursor: "pointer",
                fontWeight: 500
              }}
            >
              Reset Filters
            </button>
          </div>
        </div>

        {showReportForm && (
          <div className="report-form" style={{ background: "#f9fafb", padding: "20px", borderRadius: "8px", border: "1px solid #ddd", maxWidth: "500px", margin: "0 auto 40px" }}>
            <h4 style={{ marginBottom: "16px", fontSize: "18px" }}>🚨 Report a User</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <select
                value={reportUsername}
                onChange={(e) => setReportUsername(e.target.value)}
                style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
              >
                <option value="">-- Select a User --</option>
                {users.map((user) => (
                  <option key={user.id} value={user.username}>{user.username}</option>
                ))}
              </select>
              <textarea
                placeholder="Reason for report"
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc", minHeight: "100px" }}
              />
              <button className="submit-btn" onClick={submitReport} style={{ padding: "12px", backgroundColor: "#ef4444", border: "none", borderRadius: "6px", color: "white", fontWeight: "bold", cursor: "pointer" }}>
                Submit Report
              </button>
              <button className="cancel-btn" onClick={() => setShowReportForm(false)} style={{ padding: "12px", backgroundColor: "#dc2626", border: "none", borderRadius: "6px", color: "white", fontWeight: "bold", cursor: "pointer" }}>
                Cancel
              </button>
              {reportSubmitted && <p style={{ color: "green" }}>Report submitted successfully!</p>}
            </div>
          </div>
        )}

        <div className="item-grid">
          {listings.length > 0 ? (
            listings.map((item) => (
              <div className="item-card" key={item.id}>
                <div className="image-placeholder">
                  {item.image ? <img src={item.image} alt={item.title} /> : <span>No Image</span>}
                </div>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
                <p><strong>Seller:</strong> {item.username}</p>
                <p><strong>Condition:</strong> {item.condition}</p>
                <p><strong>Category:</strong> {item.category}</p>
                <p><strong>Price:</strong> ${parseFloat(item.price).toFixed(2)}</p>
                <div className="listing-actions">
                  <button onClick={() => handleBuy(item)}>Buy</button>
                  <button onClick={() => handleAddFavorite(item.id)} disabled={favorites.includes(item.id)}>
                    {favorites.includes(item.id) ? "❤️ Favorited" : "🤍 Favorite"}
                  </button>
                  <button onClick={() => handleFlag(item.id)}>🏴 Flag</button>
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: "center" }}>No listings available from other users.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AllListings;
