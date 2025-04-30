import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar"; 
import Footer from "../Components/Footer"; 
import "../styles/UserPages.css"; 
import API_BASE_URL from "../config"; 

// Main functional component for viewing subscription details
const ViewSubscription = () => {
  // State to hold subscription details retrieved from the server
  const [subscription, setSubscription] = useState(null);
  // State to manage loading status
  const [loading, setLoading] = useState(true);
  // Hook to programmatically navigate between routes
  const navigate = useNavigate();
  // Retrieve user ID from session storage
  const userId = sessionStorage.getItem("userId");

  // useEffect hook runs on component mount to fetch subscription data
  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        // Make GET request to fetch user's subscription details
        const res = await fetch(`${API_BASE_URL}/api/subscriptions/user/${userId}`);
        const data = await res.json();
        // Update subscription state with retrieved data
        setSubscription(data);
      } catch (err) {
        // Log error if fetch request fails
        console.error("Failed to fetch subscription", err);
      } finally {
        // Set loading state to false after fetch completes
        setLoading(false);
      }
    };

    fetchSubscription(); // Execute the fetch function
  }, [userId]); // Dependence on userId means this runs whenever userId changes

  // Function to handle cancellation of subscription
  const cancelSubscription = async () => {
    // Confirmation prompt before cancellation
    if (!window.confirm("Are you sure you want to cancel your subscription?")) {
      return;
    }

    try {
      // Make PUT request to cancel user's subscription
      const res = await fetch(`${API_BASE_URL}/api/subscriptions/cancel/${userId}`, {
        method: "PUT",
      });

      if (res.ok) {
        // Alert user and navigate back to dashboard if cancellation successful
        alert("Subscription cancelled.");
        navigate("/dashboard");
      } else {
        // Inform user if cancellation failed
        alert("Failed to cancel subscription.");
      }
    } catch (err) {
      // Log error and alert user if request encounters error
      console.error("Error cancelling subscription", err);
      alert("Error cancelling subscription.");
    }
  };

  // Display loading state while fetching subscription data
  if (loading) return <div>Loading...</div>;

  
  return (
    <>
      <Navbar />
      
      <main className="user-main">
        <div className="page-wrapper">
          <h2 className="page-title">📜 Your Subscription Details</h2>

          {subscription && subscription.plan_name ? (
            <div className="subscription-card">
              <h3>📦 {subscription.plan_name}</h3>
              <p><strong>Status:</strong> {subscription.active ? "✅ Active" : "❌ Cancelled"}</p>
              <p><strong>Plan Tier:</strong> {subscription.plan_name}</p>
              <p><strong>Access:</strong> {subscription.plan_name === "Elite Home Gym"
                ? "🏠 Full gym equipment access"
                : subscription.plan_name === "Strength Max"
                ? "🏋️ Heavy equipment + plates"
                : subscription.plan_name === "Fitness Plus"
                ? "💪 3 Items/month swap"
                : "🏋️ 1 Basic Item per month"}
              </p>
              <p><strong>Billing:</strong> Billed Monthly</p>

              {subscription.active && (
                <button className="cancel-btn" onClick={cancelSubscription}>
                  ❌ Cancel Subscription
                </button>
              )}
            </div>
          ) : (
            <p>You don't have an active subscription yet.</p>
          )}

          <button className="subscribe-btn" onClick={() => navigate("/business-plans")}>
            ➕ View Subscription Plans
          </button>
        </div>
      </main>

      <Footer />
    </>
  );
};


export default ViewSubscription;
