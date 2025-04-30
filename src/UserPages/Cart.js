import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "../App.css";
import API_BASE_URL from "../config";

// Functional component for the user's cart
const Cart = () => {
  const userId = sessionStorage.getItem("userId"); // Retrieve user ID from session storage
  const [cartItems, setCartItems] = useState([]); // Items in the user's cart
  const [users, setUsers] = useState([]); // All users (to get seller names)
  const [shippingOption, setShippingOption] = useState("standard"); // Selected shipping option
  const [pickupLocation, setPickupLocation] = useState(""); // Selected pickup location
  const [showMap, setShowMap] = useState(false); // Whether to display map
  const navigate = useNavigate(); // Hook for navigation

   // Static list of pickup locations
  const pickupLocations = [
            "Walmart Parking Lot, 123 Main St, Greenwood, SC 29646",
            "Planet Fitness, 45 Fit Ln, Greenwood, SC 29649",
            "Starbucks Drive-Thru, 88 Brew Ave, Greenwood, SC 29648",
            "Lowe’s Parking, 300 Tool Rd, Greenwood, SC 29647",
            "Target Curbside, 950 Bullseye Blvd, Greenwood, SC 29650",
            "CVS Pharmacy, 411 Wellness Way, Greenwood, SC 29646",
            "Publix Lot, 920 Fresh Market Rd, Greenwood, SC 29648",
            "Chick-fil-A Parking, 102 Chick Blvd, Greenwood, SC 29649",
            "Greenwood Mall Entrance 3, 620 Retail Dr, Greenwood, SC 29647",
            "Kroger Pickup Zone, 303 Grocery Ave, Greenwood, SC 29648",
            "UPS Store Lot, 77 Parcel Pkwy, Greenwood, SC 29649",
            "Goodwill Loading Zone, 198 Donation Ln, Greenwood, SC 29646",
            "O’Reilly Auto Parts, 101 Torque Dr, Greenwood, SC 29649",
            "Bojangles Parking, 456 Biscuit Blvd, Greenwood, SC 29650",
            "Home Depot Loading, 721 Hardware St, Greenwood, SC 29646",
            "Dollar Tree Lot, 155 Value Ave, Greenwood, SC 29649",
            "Verizon Storefront, 360 Signal Rd, Greenwood, SC 29647",
            "PetSmart Pickup, 202 Pet Plz, Greenwood, SC 29650",
            "Books-A-Million, 690 Booktown Dr, Greenwood, SC 29648",
            "GameStop Lot, 800 Console Ct, Greenwood, SC 29646",
            "Greenwood YMCA, 44 Healthy Ln, Greenwood, SC 29647",
            "Sonic Drive-In, 505 Roller Way, Greenwood, SC 29649",
            "Walgreens Lot, 210 Wellness Blvd, Greenwood, SC 29650",
            "Domino’s Pickup Spot, 99 Pizza Pkwy, Greenwood, SC 29648",
            "Advance Auto Parts, 433 Fix-It Rd, Greenwood, SC 29646",
            "Taco Bell Lot, 666 Crunchwrap Ave, Greenwood, SC 29649",
            "Cook Out Lot, 707 Tray Ln, Greenwood, SC 29647",
            "Chili’s Curbside, 588 Grill Rd, Greenwood, SC 29650",
            "Arby’s Side Lot, 322 Meats Blvd, Greenwood, SC 29646",
            "Waffle House Back Lot, 211 Breakfast Rd, Greenwood, SC 29648",
            "Ingles Curb Pickup, 159 Grocery Rd, Greenwood, SC 29649",
            "Ross Parking, 430 Fashion Ave, Greenwood, SC 29647",
            "TJ Maxx Lot, 301 Style Ct, Greenwood, SC 29650",
            "Greenwood Library Lot, 600 Book Dr, Greenwood, SC 29648",
            "Dunkin’ Drive-Thru, 102 Coffee Blvd, Greenwood, SC 29646",
            "Greenwood High School Visitor Lot, 120 School Ln, Greenwood, SC 29649",
            "Sherwin-Williams Pickup, 210 Paint Plz, Greenwood, SC 29647",
            "Harbor Freight Lot, 480 Tool Ln, Greenwood, SC 29650",
            "AutoZone Lot, 123 Repair St, Greenwood, SC 29648",
            "Olive Garden Curbside, 588 Pasta Rd, Greenwood, SC 29646",
            "JCPenney Parking, 455 Apparel Ave, Greenwood, SC 29649",
            "Chick-fil-A Overflow, 212 Nugget Blvd, Greenwood, SC 29650",
            "Smoothie King Lot, 87 Blend St, Greenwood, SC 29647",
            "Panera Bread Pickup, 399 Soup Ave, Greenwood, SC 29648",
            "Five Below Lot, 512 Deal Blvd, Greenwood, SC 29649",
            "Aldi Parking, 104 Save Ln, Greenwood, SC 29646",
            "Chipotle Front Lot, 777 Burrito Blvd, Greenwood, SC 29650",
            "Cici’s Pizza Curbside, 299 Buffet St, Greenwood, SC 29648",
            "Big Lots Front Lot, 266 Budget Dr, Greenwood, SC 29646"
  ];

  // Fetch user's cart and users list when page loads
  useEffect(() => {
    if (userId) {
      fetch(`${API_BASE_URL}/api/cart/user/${userId}`)
        .then((res) => res.json())
        .then(setCartItems)
        .catch((err) => console.error("Error loading cart:", err));

      fetch(`${API_BASE_URL}/api/users`)
        .then((res) => res.json())
        .then(setUsers)
        .catch((err) => console.error("Error loading users:", err));
    }
  }, [userId]);

  // If pickup is selected, generate or load a random pickup location
  useEffect(() => {
    if (shippingOption === "pickup") {
      const saved = sessionStorage.getItem("pickupLocation");
      if (saved) {
        setPickupLocation(saved);
      } else {
        generatePickupLocation();
      }
    } else {
      setPickupLocation("");
      sessionStorage.removeItem("pickupLocation");
    }
  }, [shippingOption]);
// Pick a random location for pickup
  const generatePickupLocation = () => {
    const random = Math.floor(Math.random() * pickupLocations.length);
    const location = pickupLocations[random];
    setPickupLocation(location);
    sessionStorage.setItem("pickupLocation", location);
  };
// Get seller username from users list
  const getSeller = (user_id) => {
    const user = users.find((u) => u.id === user_id);
    return user ? user.username : "Unknown";
  };
// Remove an item from the cart
  const removeFromCart = async (listingId) => {
    const confirm = window.confirm("Remove this item from your cart?");
    if (!confirm) return;

    const res = await fetch(`${API_BASE_URL}/api/cart`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, listing_id: listingId }),
    });

    if (res.ok) {
      setCartItems((prev) => prev.filter((item) => item.listing_id !== listingId));
    } else {
      alert("Failed to remove item.");
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + parseFloat(item.price), 0);

  // Calculate subtotal and shipping
  const getShippingCost = () => {
    if (shippingOption === "standard") return 30;
    if (shippingOption === "express") return 112;
    return 0;
  };

  const total = subtotal + getShippingCost();

   
  return (
    <div className="dashboard-wrapper" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <main className="cart-container" style={{ flex: 1 }}>
        <div className="cart-left">
          <h2>My Cart</h2>
          {cartItems.length === 0 ? (
            <p>No items in cart.</p>
          ) : (
            cartItems.map((item, idx) => (
              <div key={idx} className="cart-item">
                <img src={item.image} alt={item.title} className="cart-thumb" />
                <div className="cart-details">
                  <h4 className="cart-title">{item.title}</h4>
                  <p><strong>Description:</strong> {item.description}</p>
                  <p><strong>Price:</strong> ${parseFloat(item.price).toFixed(2)}</p>
                  <p><strong>Condition:</strong> {item.condition}</p>
                  <p><strong>Category:</strong> {item.category}</p>
                  <p><strong>Seller:</strong> {getSeller(item.user_id)}</p>
                  <button className="remove-btn" onClick={() => removeFromCart(item.listing_id)}>
                    ❌ Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>

          <div className="shipping-options" style={{ marginBottom: "16px" }}>
            <p><strong>Choose Shipping:</strong></p>
            <label>
              <input
                type="radio"
                name="shipping"
                value="standard"
                checked={shippingOption === "standard"}
                onChange={(e) => setShippingOption(e.target.value)}
              />
              Standard – $30
            </label>
            <br />
            <label>
              <input
                type="radio"
                name="shipping"
                value="express"
                checked={shippingOption === "express"}
                onChange={(e) => setShippingOption(e.target.value)}
              />
              Express – $112
            </label>
            <br />
            <label>
              <input
                type="radio"
                name="shipping"
                value="pickup"
                checked={shippingOption === "pickup"}
                onChange={(e) => setShippingOption(e.target.value)}
              />
              Pickup – Free
            </label>

            {shippingOption === "pickup" && pickupLocation && (
             <div style={{ marginTop: "8px" }}>
                 <p style={{ fontStyle: "italic" }}>
                     Pickup Location: <strong>{pickupLocation}</strong>
                </p>
             <div className="pickup-buttons">
              <button onClick={generatePickupLocation}>
              🔄 Change
             </button>
              <button onClick={() => setShowMap(true)}>
              📍 View on Map
            </button>
          </div>
        </div>
        )}

          </div>

          <p><strong>Subtotal:</strong> ${subtotal.toFixed(2)}</p>
          <p><strong>Shipping:</strong> ${getShippingCost().toFixed(2)}</p>
          <p><strong>Total:</strong> ${total.toFixed(2)}</p>

          <button
  className="checkout-btn"
  onClick={() =>
    navigate("/checkout", {
      state: {
        cartItems: cartItems.map(item => ({
          listing_id: item.listing_id || item.id, 
          title: item.title,
          description: item.description,
          price: item.price,
          condition: item.condition,
          category: item.category,
          image: item.image,
          user_id: item.user_id
        })),
        
        subtotal,
        shippingOption,
        shippingCost: getShippingCost(),
        total,
        pickupLocation: shippingOption === "pickup" ? pickupLocation : null,
      },
    })
  }
>
  Checkout
</button>


          <button className="gpay-btn">G Pay</button>
          <p className="secure-text">🔒 Secure Checkout</p>
        </div>
      </main>

      {showMap && pickupLocation && (
        <div className="map-popup">
          <div className="map-content">
            <h3>Pickup Location</h3>
            <iframe
              title="Map"
              width="100%"
              height="300"
              frameBorder="0"
              style={{ border: 0 }}
              src={`https://www.google.com/maps?q=${encodeURIComponent(pickupLocation)}&output=embed`}
              allowFullScreen
            ></iframe>
            <button onClick={() => setShowMap(false)} style={{ marginTop: "10px" }}>
              Close Map
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Cart;
