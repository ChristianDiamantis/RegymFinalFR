
import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar"; 
import Footer from "../Components/Footer"; 
import API_BASE_URL from "../config"; 
import "../styles/TransactionPages.css"; 

// Functional component for the user's favorites page
const Favorites = () => {
  const userId = sessionStorage.getItem("userId"); // Retrieve user ID from session storage
  const [favorites, setFavorites] = useState([]); // List of user's favorite listings

  // Fetch user's favorites when the page loads
  useEffect(() => {
    if (userId) {
      fetch(`${API_BASE_URL}/api/favorites/user/${userId}`)
        .then((res) => res.json())
        .then((data) => setFavorites(data))
        .catch((err) => console.error("Failed to load favorites:", err));
    }
  }, [userId]);

  // Handle adding a favorite item to the cart
  const handleBuy = async (item) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          listing_id: item.id,
          title: item.title,
          price: item.price,
          condition: item.condition,
          description: item.description,
          image: item.image,
        }),
      });

      if (response.ok) {
        alert("Item added to cart!");
      } else {
        alert("Failed to add to cart.");
      }
    } catch (err) {
      console.error("Buy error:", err);
      alert("Something went wrong.");
    }
  };

  // Handle removing an item from favorites
  const handleDisfavorite = async (listingId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/favorites/remove`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, listing_id: listingId }),
      });

      if (response.ok) {
        setFavorites((prev) => prev.filter((fav) => fav.id !== listingId));
        alert("Removed from favorites.");
      } else {
        alert("Failed to remove from favorites.");
      }
    } catch (err) {
      console.error("Disfavorite error:", err);
    }
  };

  
  return (
    <div className="dashboard-wrapper">
      <Navbar />

      {/* Main Favorites Content */}
      <main className="dashboard-main">
        <h2 style={{ textAlign: "center", marginBottom: "32px" }}>Your Favorites</h2>

        {/* Display favorite items */}
        <div className="item-grid">
          {favorites.length > 0 ? (
            favorites.map((item) => (
              <div className="item-card" key={item.id}>
                <div className="image-placeholder">
                  {item.image ? <img src={item.image} alt={item.title} /> : <span>No Image</span>}
                </div>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
                <p><strong>Condition:</strong> {item.condition}</p>
                <p><strong>Price:</strong> ${parseFloat(item.price).toFixed(2)}</p>

                {/* Action buttons */}
                <div className="item-actions" style={{ marginTop: "12px", display: "flex", gap: "10px" }}>
                  <button className="buy-btn" onClick={() => handleBuy(item)}>Buy</button>
                  <button className="secondary-btn" onClick={() => handleDisfavorite(item.id)}>Remove</button>
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: "center" }}>You haven't favorited anything yet.</p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};


export default Favorites;
