import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar"; 
import Footer from "../Components/Footer"; 
import API_BASE_URL from "../config"; 
import "./MyListings.css"; 

// Functional component to display user's listings
const MyListings = () => {
  // Hook to programmatically navigate between routes
  const navigate = useNavigate();
  // Retrieve user ID from session storage
  const userId = sessionStorage.getItem("userId");

  // State to store listings data
  const [listings, setListings] = useState([]);

  // useEffect hook to fetch listings data on component mount
  useEffect(() => {
    if (userId) {
      // Fetch listings associated with the logged-in user
      fetch(`${API_BASE_URL}/api/listings/user/${userId}`)
        .then((res) => res.json())
        .then((data) => setListings(data))
        .catch((err) => console.error("Error fetching listings:", err));
    }
  }, [userId]);

  // Function to handle listing deletion
  const deleteListing = async (listingId) => {
    // Confirmation before deleting the listing
    const confirm = window.confirm("Are you sure you want to delete this listing?");
    if (!confirm) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/listings/${listingId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // Remove the deleted listing from state
        setListings(listings.filter((l) => l.id !== listingId));
      } else {
        alert("Failed to delete listing.");
      }
    } catch (error) {
      console.error("Error deleting listing:", error);
      alert("An error occurred.");
    }
  };

  
  return (
    <div className="dashboard-wrapper">
      <Navbar />
      <main className="dashboard-main">
        <h2>My Listings</h2>

        {/* Action Buttons */}
        <div className="page-actions">
          <button className="page-btn create-btn" onClick={() => navigate("/create-listing")}>
            ➕ Create Listing
          </button>
          <button className="page-btn dashboard-btn" onClick={() => navigate("/dashboard")}>
            ← Back to Dashboard
          </button>
        </div>

        <div className="favorites-grid">
          {listings.length === 0 ? (
            <p>You haven’t listed any items yet.</p>
          ) : (
            listings.map((item) => (
              <div className="favorite-card" key={item.id}>
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                )}
                <h4 style={{ color: "#2563eb" }}>{item.title}</h4>
                <p>{item.description}</p>
                <p><strong>Condition:</strong> {item.condition}</p>
                <p><strong>Price:</strong> ${item.price}</p>
                <p><strong>Status:</strong> {item.sold ? "Sold" : "Available"}</p>



                <div className="item-actions">
                  <button className="edit-btn" onClick={() => navigate(`/edit-listing/${item.id}`)}>
                    Edit
                  </button>
                  <button className="delete-btn" onClick={() => deleteListing(item.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};


export default MyListings;
