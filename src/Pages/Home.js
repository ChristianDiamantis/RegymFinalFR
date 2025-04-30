import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "../App.css";
import ChatBox from "../Components/ChatBox";


const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />

      {/* Hero Section */}
      <main className="hero">
        <h2>🏋️‍♂️ Buy & Sell Gym Gear Locally 💪</h2>
        <p>
          ReGym helps you find affordable gym equipment or sell your own — fast,
          easy, and with zero hassle. 🛒
        </p>
        <button onClick={() => navigate("/login")}>🔥 Explore Listings</button>
      </main>

      {/* Features Section */}
      <section className="features">
        <div className="feature-card">
          <h4>👤 1. Sign Up</h4>
          <p>Create your free account and set your preferences. 📝</p>
        </div>
        <div className="feature-card">
          <h4>🔍 2. Browse or Post</h4>
          <p>List your equipment 🏋️‍♀️ or shop what others are offering. 🛍️</p>
        </div>
        <div className="feature-card">
          <h4>🤝 3. Make the Deal</h4>
          <p>Connect, chat, and meet up or arrange safe shipping. 🚚</p>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="info-section">
        <h3>🏆 Popular Categories</h3>
        <div className="card-grid">
          <div className="info-card">
            🏋️‍♂️ <br />
            <strong>Dumbbells & Kettlebells</strong>
            <p>Perfect for strength training and home workouts. Choose from various weights and materials.</p>
          </div>
          <div className="info-card">
            🏃‍♀️ <br />
            <strong>Treadmills & Cardio Machines</strong>
            <p>Stay in shape with deals on treadmills, spin bikes, and ellipticals from nearby sellers.</p>
          </div>
          <div className="info-card">
            🏋️‍♀️ <br />
            <strong>Weight Plates & Bars</strong>
            <p>Grab Olympic plates, barbells, and specialty bars to level up your lifting game.</p>
          </div>
          <div className="info-card">
            🏗️ <br />
            <strong>Power Racks & Benches</strong>
            <p>Find adjustable benches and sturdy squat racks for serious workouts at home.</p>
          </div>
          
        </div>
      </section>

      {/* Why Choose ReGym */}
      <section className="info-section">
        <h3>💥 Why Choose ReGym?</h3>
        <div className="card-grid">
          <div className="info-card">
            💸 <br />
            <strong>Save Big</strong>
            <p>Get up to 70% off compared to buying brand new gym gear.</p>
          </div>
          <div className="info-card">
            📍 <br />
            <strong>Local Deals</strong>
            <p>Shop from people in your area and skip costly shipping.</p>
          </div>
          <div className="info-card">
            🌎 <br />
            <strong>Eco Friendly</strong>
            <p>Reduce waste by reusing and reselling high-quality fitness equipment.</p>
          </div>
          <div className="info-card">
            🤝 <br />
            <strong>Built for Community</strong>
            <p>Buy, sell, and connect with other fitness lovers near you.</p>
          </div>
        </div>
      </section>


      {/* Testimonials */}
      <section className="testimonials">
        <h3>🌟 What Our Users Say</h3>
        <div className="testimonial-card">
          <p>"💰 I saved over $300 furnishing my gym with ReGym!"</p>
          <span>- Alex J.</span>
        </div>
        <div className="testimonial-card">
          <p>"⚡ Super easy to use, and I sold my squat rack in a day!"</p>
          <span>- Brittany S.</span>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <h3>🚀 Ready to ReGym?</h3>
        <p>Join thousands of users finding the best local gym deals. Start buying and selling today!</p>
        <button onClick={() => navigate("/login")}>💥 Get Started</button>
      </section>
      
      <ChatBox />  

      <Footer />
    </div>
  );
};

export default Home;
