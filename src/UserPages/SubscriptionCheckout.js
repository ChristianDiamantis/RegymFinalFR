import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "../styles/UserPages.css";
import API_BASE_URL from "../config";

const SubscriptionCheckout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { planName } = location.state || {};

  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "USA",
  });

  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const userId = sessionStorage.getItem("userId");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/rentable-items`);
        const data = await res.json();
        setItems(data);
      } catch (err) {
        console.error("Failed to load rentable items", err);
      }
    };
    fetchItems();
  }, []);

  const handleChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handleItemSelect = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  const getMaxItemsAllowed = () => {
    if (planName === "Starter") return 1;
    if (planName === "Fitness Plus") return 3;
    if (planName === "Strength Max") return 5;
    if (planName === "Elite Home Gym") return items.length;
    return 1;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!planName) {
      alert("Missing plan information. Please select a subscription plan first.");
      return navigate("/business-plans");
    }

    if (selectedItems.length > getMaxItemsAllowed()) {
      alert(`You can only select up to ${getMaxItemsAllowed()} item(s) for the ${planName} plan.`);
      return;
    }

    let planPrice = 0;
    if (planName === "Starter") planPrice = 19;
    else if (planName === "Fitness Plus") planPrice = 39;
    else if (planName === "Strength Max") planPrice = 69;
    else if (planName === "Elite Home Gym") planPrice = 99;

    try {
      const estimatedDelivery = new Date();
      estimatedDelivery.setDate(estimatedDelivery.getDate() + Math.floor(Math.random() * 5) + 3);

      await fetch(`${API_BASE_URL}/api/subscriptions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          planName,
          planPrice,
          shippingInfo,
          selectedItems, 
          estimatedDelivery,
        }),
      });

      navigate("/subscription-confirmed");
    } catch (err) {
      console.error("Error subscribing:", err);
      alert("Failed to complete subscription.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="page-wrapper">
        <h2 className="page-title">🏋️ Subscription Checkout</h2>
        <p className="page-subtitle">
          Complete your shipping info and pick your gym equipment!
        </p>

        <form onSubmit={handleSubmit} className="checkout-form">
          <input 
            type="text" 
            name="fullName" 
            placeholder="Full Name" 
            value={shippingInfo.fullName}
            onChange={handleChange}
            required
          />
          <input 
            type="text" 
            name="address" 
            placeholder="Address" 
            value={shippingInfo.address}
            onChange={handleChange}
            required
          />
          <input 
            type="text" 
            name="city" 
            placeholder="City" 
            value={shippingInfo.city}
            onChange={handleChange}
            required
          />
          <input 
            type="text" 
            name="state" 
            placeholder="State" 
            value={shippingInfo.state}
            onChange={handleChange}
            required
          />
          <input 
            type="text" 
            name="zip" 
            placeholder="ZIP Code" 
            value={shippingInfo.zip}
            onChange={handleChange}
            required
          />

          <div className="equipment-selection">
            <h3>🛒 Select Your Equipment ({selectedItems.length}/{getMaxItemsAllowed()} selected)</h3>
            <div className="items-grid">
              {items.map((item) => (
                <div 
                  key={item.id} 
                  className={`item-card ${selectedItems.includes(item.id) ? "selected" : ""}`}
                  onClick={() => handleItemSelect(item.id)}
                >
                  {item.name}
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="subscribe-btn" style={{ marginTop: "25px" }}>
            Confirm Subscription
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default SubscriptionCheckout;
