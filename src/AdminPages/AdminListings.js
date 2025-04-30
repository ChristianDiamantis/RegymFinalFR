// Import necessary React hooks and components
import React, { useEffect, useState } from "react";
import AdminNavbar from "../Components/AdminNavbar"; // Admin navigation bar
import Footer from "../Components/Footer"; // Footer component
import API_BASE_URL from "../config"; // API base URL
import "../styles/AdminPages.css"; // Admin page styling

// Functional component for viewing and managing active listings
const AdminListings = () => {
  // State to hold all active listings
  const [listings, setListings] = useState([]);

  // Fetch active listings from server on page load
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/admin/active-listings`)
      .then((res) => res.json())
      .then((data) => setListings(data))
      .catch((err) => console.error("Failed to fetch active listings:", err));
  }, []);

  // Handle removing a listing
  const removeListing = async (id) => {
    const confirm = window.confirm("Are you sure you want to remove this listing?");
    if (!confirm) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/listings/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // Remove the deleted listing from local state
        setListings(listings.filter((item) => item.id !== id));
        alert("Listing removed successfully.");
      } else {
        alert("Failed to remove listing.");
      }
    } catch (err) {
      console.error("Error removing listing:", err);
      alert("An error occurred while removing the listing.");
    }
  };

  // JSX rendering the admin listings page
  return (
    <div className="dashboard-wrapper" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AdminNavbar />

      {/* Main content section */}
      <main className="dashboard-main" style={{ flex: 1, padding: "40px" }}>
        <h2 style={{ marginBottom: "20px" }}>All Active Listings</h2>

        {/* If no listings are available */}
        {listings.length === 0 ? (
          <p>No active listings available.</p>
        ) : (
          <div className="listings-grid">
            {/* Display all listings */}
            {listings.map((item) => (
              <div className="listing-card" key={item.id}>
                <img src={item.image} alt={item.title} className="listing-image" />
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <p><strong>Price:</strong> ${item.price}</p>
                <p><strong>Condition:</strong> {item.condition}</p>
                <p><strong>Category:</strong> {item.category}</p>

                {/* Remove button */}
                <button className="delete-btn" onClick={() => removeListing(item.id)}>
                  Remove Listing
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

// Export the component
export default AdminListings;
