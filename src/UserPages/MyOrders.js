import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import API_BASE_URL from "../config";
import "../styles/MyOrders.css";

const MyOrders = () => {
  const userId = sessionStorage.getItem("userId");
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (userId) {
      fetch(`${API_BASE_URL}/api/orders/user/${userId}`)
        .then((res) => res.json())
        .then(setOrders)
        .catch((err) => console.error("Failed to load orders", err));

      fetch(`${API_BASE_URL}/api/users`)
        .then((res) => res.json())
        .then(setUsers)
        .catch((err) => console.error("Failed to load users", err));
    }
  }, [userId]);

  const cancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setOrders(orders.filter((order) => order.id !== orderId));
    } else {
      alert("Failed to cancel order");
    }
  };

  const getSellerUsername = (user_id) => {
    const user = users.find((u) => u.id === user_id);
    return user ? user.username : "Unknown";
  };

  
  const getOrderStatus = (createdAt) => {
    const createdDate = new Date(createdAt);
    const now = new Date();
    const diffInHours = (now - createdDate) / 36e5; // milliseconds to hours

    if (diffInHours < 6) return "Processing";
    if (diffInHours < 24) return "Shipped";
    return "Delivered";
  };

  return (
    <div className="orders-wrapper">
      <Navbar />
      <div className="orders-main">
        <h2>📦 My Orders</h2>
        {orders.length === 0 ? (
          <p>No orders placed yet.</p>
        ) : (
          orders.map((order) => {
            const items = Array.isArray(order.items) ? order.items : JSON.parse(order.items);
            const shipping = typeof order.shipping_info === "string"
              ? JSON.parse(order.shipping_info)
              : order.shipping_info;

            return (
              <div className="order-card" key={order.id}>
                <div>
                  <strong>Order #{order.id}</strong> • {new Date(order.created_at).toLocaleString()}
                </div>
                <div><strong>Status:</strong> {getOrderStatus(order.created_at)}</div>
                <div>Buyer: {order.buyer_name}</div>
                <div>Total: ${parseFloat(order.total).toFixed(2)}</div>
                <div>
                  <strong>Shipping:</strong> {shipping.address1}, {shipping.city}, {shipping.state} {shipping.zip}
                </div>
                <ul>
                  {items.map((item, i) => (
                    <li key={i}>
                      Listing #{item.listing_id} – ${parseFloat(item.price).toFixed(2)}<br />
                      <span style={{ fontStyle: "italic", fontSize: "14px" }}>
                        Seller: {getSellerUsername(item.user_id)}
                      </span>
                    </li>
                  ))}
                </ul>
                <button className="cancel-btn" onClick={() => cancelOrder(order.id)}>
                  Cancel Order
                </button>
              </div>
            );
          })
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MyOrders;
