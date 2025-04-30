import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar"; 
import Footer from "../Components/Footer"; 
import "../styles/UserPages.css"; 

// Functional component to display subscription confirmation message
const SubscriptionConfirmed = () => {
  // Hook to programmatically navigate between routes
  const navigate = useNavigate();


  return (
    <div>
      <Navbar />
      <div className="page-wrapper">
        {/* Main title confirming subscription */}
        <h2 className="page-title">✅ Subscription Confirmed!</h2>

        {/* Subtitle providing additional confirmation and welcoming the user */}
        <p className="page-subtitle">
          You're now subscribed to a ReGym plan. Enjoy your upgraded experience! 💪
        </p>

        {/* Button to navigate back to the dashboard */}
        <button 
          className="subscribe-btn" 
          onClick={() => navigate("/dashboard")}
        >
          Go to Dashboard
        </button>
      </div>
      <Footer />
    </div>
  );
};


export default SubscriptionConfirmed;
