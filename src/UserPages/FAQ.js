import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "../styles/UserPages.css"; 


const FAQ = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <div style={{ maxWidth: "900px", margin: "2rem auto 0", padding: "0 1rem" }}>
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "0.9rem",
            marginBottom: "1rem"
          }}
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="faq-wrapper" style={{ padding: "3rem 2rem", maxWidth: "900px", margin: "0 auto" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "1.5rem", textAlign: "center" }}>🧠 Frequently Asked Questions</h2>

        <div className="faq-section" style={{ marginBottom: "2rem" }}>
          <h3 style={{ color: "#333", borderBottom: "2px solid #e0e0e0", paddingBottom: "0.5rem" }}>🔐 Account & Security</h3>
          <p><strong>Q: How do I reset my password?</strong><br />
            A: Go to the login page, click “Forgot Password,” and follow the steps to reset it.</p>

          <p><strong>Q: Can I change my username or email?</strong><br />
            A: Yes, just go to the <strong>Edit Profile</strong> page and make your updates.</p>
        </div>

        <div className="faq-section" style={{ marginBottom: "2rem" }}>
          <h3 style={{ color: "#333", borderBottom: "2px solid #e0e0e0", paddingBottom: "0.5rem" }}>🛍 Buying & Orders</h3>
          <p><strong>Q: How do I place an order?</strong><br />
            A: Click “Buy” on the item you want, add it to your cart, and proceed to checkout.</p>

          <p><strong>Q: Where can I track my order?</strong><br />
            A: Visit the <strong>My Orders</strong> page to view your order status.</p>

          <p><strong>Q: Can I cancel an order?</strong><br />
            A: You can cancel before the item is shipped. If eligible, a “Cancel” button will appear on the order.</p>
        </div>

        <div className="faq-section" style={{ marginBottom: "2rem" }}>
          <h3 style={{ color: "#333", borderBottom: "2px solid #e0e0e0", paddingBottom: "0.5rem" }}>💸 Selling & Listings</h3>
          <p><strong>Q: How do I list something for sale?</strong><br />
            A: Head to the <strong>Create Listing</strong> page, fill in the details, and submit.</p>

          <p><strong>Q: What happens when I make a sale?</strong><br />
            A: You’ll be notified, and the item will appear under your <strong>My Sales</strong> section.</p>

          <p><strong>Q: How do payouts work?</strong><br />
            A: Sales earnings show in your Dashboard. Click “Payout” once you’re ready to withdraw.</p>
        </div>

        <div className="faq-section" style={{ marginBottom: "2rem" }}>
          <h3 style={{ color: "#333", borderBottom: "2px solid #e0e0e0", paddingBottom: "0.5rem" }}>💬 Support & Policies</h3>
          <p><strong>Q: How can I contact support?</strong><br />
            A: Email us anytime at <a href="mailto:support@regym.com">support@regym.com</a> or visit our Help section.</p>

          <p><strong>Q: What is your return policy?</strong><br />
            A: Buyers have 7 days to request a return if the item wasn’t as described. Sellers must reply within 48 hours.</p>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default FAQ;
