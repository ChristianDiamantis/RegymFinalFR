import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar"; 
import Footer from "../Components/Footer"; 
import ListingModal from "../Components/ListingModal"; 
import API_BASE_URL from "../config"; 
import "../styles/AdminPages.css"; 

// Functional component to display user's flagged listings
const MyFlaggedListings = () => {
  // State to store flagged listings data
  const [flagged, setFlagged] = useState([]);
  // State for currently selected listing to view details
  const [selectedListing, setSelectedListing] = useState(null);
  // Retrieve user ID from session storage
  const userId = sessionStorage.getItem("userId");
  // Hook to programmatically navigate between routes
  const navigate = useNavigate();

  // useEffect hook to fetch flagged listings data on component mount
  useEffect(() => {
    if (!userId) return;

    fetch(`${API_BASE_URL}/api/listings/flagged/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Flagged listings:", data);
        setFlagged(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error("Error loading flagged listings:", err));
  }, [userId]);

  // Function to handle unflagging a listing
  const unflagListing = async (listingId) => {
    const res = await fetch(`${API_BASE_URL}/api/listings/flagged/${userId}/${listingId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      // Remove the unflagged listing from state
      setFlagged(flagged.filter((item) => item.listing_id !== listingId));
    } else {
      alert("Failed to unflag listing.");
    }
  };

  
  return (
    <div>
      <Navbar />
      <main className="favorites-wrapper">
        <h2>My Flagged Listings</h2>

        {/* Navigation Buttons */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
          <button className="listing-btn" onClick={() => navigate("/create-listing")}>
            ➕ Create Listing
          </button>
          <button className="remove-btn" onClick={() => navigate("/dashboard")}>
            ← Back to Dashboard
          </button>
        </div>

        <div className="favorites-grid">
          {flagged.length === 0 ? (
            <p>You haven’t flagged any listings yet.</p>
          ) : (
            flagged.map((item) => {
              const {
                listing_id,
                title,
                description,
                condition,
                price,
                image,
                created_at,
                reason,
              } = item;

              return (
                <div className="favorite-card" key={listing_id}>
                  {image && (
                    <img
                      src={image}
                      alt={title || "Listing Image"}
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  )}
                  <h4 style={{ color: "#2563eb" }}>{title || "No Title"}</h4>
                  <p>{description || "No description provided."}</p>
                  <p><strong>Condition:</strong> {condition || "N/A"}</p>
                  <p><strong>Price:</strong> ${price || "0.00"}</p>
                  <p><strong>Flag Reason:</strong> {reason || "N/A"}</p>
                  <p><strong>Listed On:</strong> {created_at ? new Date(created_at).toLocaleDateString() : "N/A"}</p>

                  <button className="listing-btn" onClick={() => setSelectedListing(item)}>
                    View Details
                  </button>
                  <button className="remove-btn" onClick={() => unflagListing(listing_id)}>
                    Unflag
                  </button>
                </div>
              );
            })
          )}
        </div>
      </main>

      {selectedListing && (
        <ListingModal item={selectedListing} onClose={() => setSelectedListing(null)} />
      )}

      <Footer />
    </div>
  );
};


export default MyFlaggedListings;