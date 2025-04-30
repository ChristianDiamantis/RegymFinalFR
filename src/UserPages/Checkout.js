import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import API_BASE_URL from "../config";
import "../App.css";

// Functional component for the checkout page
const Checkout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const cartItems = state?.cartItems || [];
  const subtotal = state?.subtotal || 0;
  const shippingCost = state?.shippingCost || 0;
  const total = state?.total || 0;
  const pickupLocation = state?.pickupLocation || null;
  const shippingOption = state?.shippingOption || "standard";
  const userId = sessionStorage.getItem("userId");

  // State to manage shipping information
  const [shipping, setShipping] = useState({
    fullName: "",
    email: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    country: "USA",
    phone: ""
  });

  // Fetch user info to prefill shipping details
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/users/${userId}`);
        const user = await res.json();

        setShipping({
          fullName: user.name || user.username || "",
          email: user.email || "",
          address1: user.shipping_address1 || "",
          address2: user.shipping_address2 || "",
          city: user.shipping_city || "",
          state: user.shipping_state || "",
          zip: user.shipping_zip || "",
          country: user.shipping_country || "USA",
          phone: user.phone || ""
        });
      } catch (err) {
        console.error("Failed to load user shipping info:", err);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  // Handle shipping form input changes
  const handleChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  // Validate that all required shipping fields are filled
  const isValidForm = () => {
    const { fullName, email, address1, city, state, zip, country } = shipping;
    return fullName && email && address1 && city && state && zip && country;
  };

  // Handle placing an order
  const handlePlaceOrder = async () => {
    if (!isValidForm()) {
      alert("⚠️ Please complete all required shipping fields.");
      return;
    }

    const items = cartItems.map((item) => ({
      listing_id: item.listing_id || item.id,
      price: parseFloat(item.price),
      title: item.title,
      image: item.image
    }));

    try {
      const res = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          items,
          total: subtotal,
          shipping_info: shipping,
          buyer_name: shipping.fullName,
          buyer_email: shipping.email,
          buyer_phone: shipping.phone || ""
        }),
      });

      if (res.ok) {
        // Clear the cart after placing the order
        await fetch(`${API_BASE_URL}/api/cart/clear/${userId}`, {
          method: "DELETE",
        });

        alert("✅ Order placed successfully!");
        navigate("/my-orders"); 
      } else {
        const error = await res.json();
        alert("❌ Failed to place order: " + (error.details || error.message));
      }
    } catch (err) {
      console.error("Order error:", err);
      alert("Something went wrong.");
    }
  };


  return (
    <div className="dashboard-wrapper">
      <Navbar />
      <main className="checkout-container">
        
        {/* Back to Cart button */}
        <button
          className="back-to-cart-btn"
          style={{
            marginBottom: "20px",
            backgroundColor: "#ccc",
            color: "#333",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer",
            alignSelf: "flex-start"
          }}
          onClick={() => navigate("/cart")}
        >
          ⬅️ Back to Cart
        </button>

        <h2>Checkout</h2>

        <div className="checkout-wrapper">
          <div className="checkout-section">
            <h3>Shipping Information</h3>
            <form className="checkout-form">
              <input name="fullName" value={shipping.fullName} onChange={handleChange} placeholder="Full Name" required />
              <input name="email" value={shipping.email} onChange={handleChange} placeholder="Email Address" required />
              <input name="address1" value={shipping.address1} onChange={handleChange} placeholder="Address Line 1" required />
              <input name="address2" value={shipping.address2} onChange={handleChange} placeholder="Address Line 2" />
              <input name="city" value={shipping.city} onChange={handleChange} placeholder="City" required />
              <input name="state" value={shipping.state} onChange={handleChange} placeholder="State" required />
              <input name="zip" value={shipping.zip} onChange={handleChange} placeholder="Zip Code" required />
              <input name="country" value={shipping.country} onChange={handleChange} placeholder="Country" required />
              <input name="phone" value={shipping.phone} onChange={handleChange} placeholder="Phone (Optional)" />
            </form>
          </div>

          <div className="checkout-summary">
            <h3>Payment Summary</h3>
            <p><strong>Subtotal:</strong> ${subtotal.toFixed(2)}</p>
            <p><strong>Delivery:</strong> {shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`}</p>
            <p><strong>Total:</strong> ${subtotal.toFixed(2)}</p>

            {pickupLocation && (
              <p><strong>Pickup Location:</strong> {pickupLocation}</p>
            )}

            <button className="checkout-btn" onClick={handlePlaceOrder}>
              Place Order
            </button>

            <p className="secure-text">🔒 Secure Payment</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
