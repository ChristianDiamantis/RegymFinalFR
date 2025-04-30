import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Public Pages
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ResetPassword from "./Pages/ResetPassword";
import ContactUs from "./Pages/ContactUs";


// User Pages
import Dashboard from "./UserPages/Dashboard";
import CreateListing from "./UserPages/CreateListing";
import EditListing from "./UserPages/EditListing";
import MyListings from "./UserPages/MyListings";
import AllListings from "./UserPages/AllListings";
import Cart from "./UserPages/Cart";
import EditProfile from "./UserPages/EditProfile";
import Filter from "./UserPages/Filter";
import Checkout from "./UserPages/Checkout";
import MyOrders from "./UserPages/MyOrders";
import MyFlaggedListings from "./UserPages/MyFlaggedListings"; 
import BusinessPlans from "./UserPages/BusinessPlans"; 
import ViewSubscriptions from "./UserPages/ViewSubscriptions"; 
import SubscriptionCheckout from "./UserPages/SubscriptionCheckout";
import FAQ from "./UserPages/FAQ";
import Notifications from "./UserPages/Notifications";






// Transaction Pages
import Favorites from "./TransactionPages/Favorites";

import RateUser from "./TransactionPages/RateUser";

// Admin Pages
import AdminDashboard from "./AdminPages/AdminDashboard";
import Users from "./AdminPages/Users";
import Reports from "./AdminPages/Reports";
import FlaggedListings from "./AdminPages/FlaggedListings"; 
import AdminListings from "./AdminPages/AdminListings";
import SubscriptionConfirmed from "./UserPages/SubscriptionConfirmed";
import SubscriptionSales from "./AdminPages/SubscriptionSales";
import ViewMessages from "./AdminPages/ViewMessages";



// Admin Route Protection
const AdminRoute = ({ children }) => {
  const role = sessionStorage.getItem("role");
  return role === "admin" ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        

        {/* User Pages */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-listing" element={<CreateListing />} />
        <Route path="/edit-listing/:id" element={<EditListing />} />
        <Route path="/my-listings" element={<MyListings />} />
        <Route path="/all-listings" element={<AllListings />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/filter" element={<Filter />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/business-plans" element={<BusinessPlans />} />
        <Route path="/view-subscriptions" element={<ViewSubscriptions />} />
        <Route path="/subscription-confirmed" element={<SubscriptionConfirmed />} />
        <Route path="/subscription-checkout" element={<SubscriptionCheckout />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/contact-us" element={<ContactUs />} />

        {/* Transaction Pages */}
        <Route path="/favorites" element={<Favorites />} />
        
        <Route path="/rate-user" element={<RateUser />} />

        {/* Admin Pages */}
        <Route path="/admin-dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><Users /></AdminRoute>} />
        <Route path="/admin/reports" element={<AdminRoute><Reports /></AdminRoute>} />
        <Route path="/admin/flagged-listings" element={<FlaggedListings />} />
        <Route path="/admin/active-listings" element={<AdminListings />} />
        <Route path="/my-flagged-listings" element={<MyFlaggedListings />} />
        <Route path="/admin/subscription-sales" element={<SubscriptionSales />} />
        <Route path="/admin/view-messages" element={<ViewMessages />} />

      </Routes>
    </Router>
  );
}

export default App;
