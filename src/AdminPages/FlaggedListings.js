import React, { useState, useEffect } from "react";
import AdminNavbar from "../Components/AdminNavbar";
import Footer from "../Components/Footer";
import ListingModal from "../Components/ListingModal";
import "../styles/AdminPages.css";
import API_BASE_URL from "../config";

// Functional component for Admin - Managing Flagged Listings
const FlaggedListings = () => {
  // State to hold all flagged listings
  const [flagged, setFlagged] = useState([]);

  // State to control which listing is open in the modal
  const [selectedListing, setSelectedListing] = useState(null);

  // Fetch flagged listings when page loads
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/admin/flagged`)
      .then((res) => res.json())
      .then((data) => setFlagged(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error loading flagged listings:", err));
  }, []);

  // Handle removing a flagged listing
  const removeListing = async (listingId) => {
    const confirm = window.confirm("Are you sure you want to permanently remove this listing?");
    if (!confirm) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/flagged/${listingId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // Refresh the flagged listings after successful deletion
        fetch(`${API_BASE_URL}/api/admin/flagged`)
          .then((res) => res.json())
          .then((data) => {
            setFlagged(Array.isArray(data) ? data : []);
            alert("Flagged Listing Has Been Removed");
            window.location.reload(); // Force a full page reload after alert
          });
      } else {
        alert("Failed to remove listing.");
      }
    } catch (err) {
      console.error("Failed to remove flagged listing:", err);
      alert("An error occurred while removing the listing.");
    }
  };

  return (
    <>
      <AdminNavbar />

      <main className="admin-main">
        <div className="favorites-wrapper">
          <h2>Flagged Listings</h2>

          <div className="favorites-grid">
            {flagged.length === 0 ? (
              <p>No flagged listings found.</p>
            ) : (
              flagged.map((item) => (
                <div className="favorite-card" key={item.id}>
                  <img
                    src={item.image || "https://via.placeholder.com/300x200?text=No+Image"}
                    alt={item.title}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
                    }}
                  />

                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                  <p><strong>Condition:</strong> {item.condition}</p>
                  <p><strong>Price:</strong> ${item.price}</p>
                  <p><strong>Flagged by:</strong> User #{item.user_id}</p>
                  <p><strong>Reason:</strong> {item.reason}</p>
                  <p><strong>Listed On:</strong> {new Date(item.created_at).toLocaleDateString()}</p>

                  <button className="listing-btn" onClick={() => setSelectedListing(item)}>
                    View Details
                  </button>
                  <button className="remove-btn" onClick={() => removeListing(item.listing_id)}>
                    Remove Listing
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {selectedListing && (
        <ListingModal item={selectedListing} onClose={() => setSelectedListing(null)} />
      )}

      <Footer />
    </>
  );
};

export default FlaggedListings;