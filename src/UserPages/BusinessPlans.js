
import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar"; 
import Footer from "../Components/Footer"; 
import "../styles/UserPages.css"; 

// List of available subscription plans
const plans = [
  {
    title: "Starter",
    price: "$19/month",
    features: [
      "🏋️ Rent 1 item/month (dumbbells, mats, etc.)",
      "🚚 Free local delivery within 5 miles",
      "🧼 Sanitized & inspected gear",
    ],
  },
  {
    title: "Fitness Plus",
    price: "$39/month",
    features: [
      "💪 Rent up to 3 items/month",
      "🛠 Equipment swap once/month",
      "🚀 Priority delivery",
    ],
  },
  {
    title: "Strength Max",
    price: "$69/month",
    features: [
      "🏋️‍♂️ Rent up to 5 items/month",
      "🪵 Includes benches, racks & plates",
      "📆 Long-term rental (up to 60 days)",
    ],
  },
  {
    title: "Elite Home Gym",
    price: "$99/month",
    features: [
      "🏠 Full home gym setup",
      "🛠 Monthly service & maintenance",
      "🎁 Free upgrade eligibility every 3 months",
    ],
  },
];

// Functional component for displaying subscription plans
const BusinessPlans = () => {
  const navigate = useNavigate(); // Hook to programmatically navigate

  // Handler function to navigate to subscription checkout with selected plan
  const handleSubscribe = (planName) => {
    navigate("/subscription-checkout", { state: { planName } });
  };

  // JSX rendering all plans
  return (
    <div>
      <Navbar />
      <div className="page-wrapper">
        {/* Page Heading */}
        <h2 className="page-title">📦 ReGym Equipment Subscriptions</h2>
        <p className="page-subtitle">
          Get premium fitness gear delivered and rotated monthly — no hassle.
        </p>

        {/* Subscription Plans Grid */}
        <div className="plans-grid">
          {plans.map((plan) => (
            <div className="plan-card" key={plan.title}>
              <h3>{plan.title}</h3>
              <p className="plan-price">{plan.price}</p>

              {/* Plan Features */}
              <ul>
                {plan.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>

              {/* Subscribe Button */}
              <button
                className="subscribe-btn"
                onClick={() => handleSubscribe(plan.title)}
              >
                Subscribe
              </button>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};


export default BusinessPlans;
