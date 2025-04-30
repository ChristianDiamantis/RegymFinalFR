import React, { useEffect, useState } from "react";
import AdminNavbar from "../Components/AdminNavbar";
import Footer from "../Components/Footer";
import "../styles/AdminPages.css";
import API_BASE_URL from "../config";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from "recharts";

const SubscriptionSales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gym Equipment List 
  const rentableItems = [
    { id: 1, name: "Adjustable Dumbbell Set (5-50 lbs)" },
    { id: 2, name: "Olympic Barbell (45 lbs)" },
    { id: 3, name: "Weight Plate Set (300 lbs)" },
    { id: 4, name: "Power Rack with Pull-Up Bar" },
    { id: 5, name: "Adjustable Workout Bench" },
    { id: 6, name: "Kettlebell Set (15-40 lbs)" },
    { id: 7, name: "Resistance Bands Kit" },
    { id: 8, name: "Rowing Machine" },
    { id: 9, name: "Stationary Exercise Bike" },
    { id: 10, name: "Treadmill (Foldable)" },
    { id: 11, name: "Medicine Ball (20 lbs)" },
    { id: 12, name: "Yoga Mat (Non-Slip)" },
    { id: 13, name: "Battle Ropes (30 ft)" },
    { id: 14, name: "Plyometric Jump Box (20/24/30 inch)" },
    { id: 15, name: "Trap Bar (Hex Bar for Deadlifts)" }
  ];

  const fetchSales = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/subscription-sales`);
      const data = await res.json();
      setSales(data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to load subscription sales:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to remove this subscription?")) return;

    try {
      await fetch(`${API_BASE_URL}/api/subscriptions/user/${userId}`, {
        method: "DELETE",
      });
      fetchSales(); 
    } catch (err) {
      console.error("Failed to remove subscription:", err);
    }
  };

  const totalRevenue = sales.reduce((sum, sale) => sum + parseFloat(sale.price || 0), 0);

  const salesByDate = sales.map((sale) => ({
    date: new Date(sale.created_at).toLocaleDateString(),
    revenue: parseFloat(sale.price || 0),
  }));

  const salesByPlan = Object.values(
    sales.reduce((acc, sale) => {
      acc[sale.plan_name] = acc[sale.plan_name] || { plan: sale.plan_name, total: 0 };
      acc[sale.plan_name].total += parseFloat(sale.price || 0);
      return acc;
    }, {})
  );

  return (
    <div className="dashboard-wrapper" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AdminNavbar />
      <main className="dashboard-main" style={{ flex: 1, padding: "40px" }}>
        <h2 style={{ marginBottom: "30px" }}>Subscription Sales Dashboard</h2>

        {loading ? (
          <p>Loading subscription sales...</p>
        ) : (
          <>
            {/* Section: Revenue Overview */}
            <section style={{ marginBottom: "60px" }}>
              <h3 style={{ fontSize: "1.8rem", marginBottom: "10px" }}>📊 Subscription Revenue Overview</h3>
              <p style={{ fontSize: "1.1rem", marginBottom: "30px" }}>
                Track monthly performance and top plans subscribed.
              </p>

              {/* Total Revenue */}
              <div style={{ marginBottom: "40px", fontSize: "1.5rem", fontWeight: "bold" }}>
                Total Subscription Revenue: <span style={{ color: "#16a34a" }}>${totalRevenue.toFixed(2)}</span>
              </div>

              {/* Charts */}
              <div style={{ display: "grid", gap: "60px" }}>
                <div style={{ width: "100%", height: 300 }}>
                  <h4>Revenue Over Time</h4>
                  <ResponsiveContainer>
                    <LineChart data={salesByDate}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Revenue by Plan Type */}
                <div style={{ width: "100%", height: 300 }}>
                  <h4>Revenue by Plan Type</h4>
                  <ResponsiveContainer>
                    <BarChart data={salesByPlan}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="plan" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="total" fill="#22c55e" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </section>

            {/* Section: Active Subscriptions */}
            <section>
              <h3 style={{ fontSize: "1.8rem", marginBottom: "20px" }}>📦 Active Subscriptions</h3>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "30px",
              }}>
                {sales.map((sale) => (
                  <div 
                    key={sale.id} 
                    style={{ 
                      border: "1px solid #ddd",
                      borderRadius: "12px",
                      padding: "20px",
                      background: "#f9fafb",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <h4 style={{ marginBottom: "8px" }}>
                        User: <span style={{ color: "#4f46e5" }}>{sale.username || "User #" + sale.user_id}</span>
                      </h4>
                      <p><strong>Plan:</strong> {sale.plan_name}</p>
                      <p><strong>Price:</strong> ${parseFloat(sale.price || 0).toFixed(2)}</p>
                      <p><strong>Subscribed On:</strong> {new Date(sale.created_at).toLocaleString()}</p>

                      {/* Show Selected Items if available */}
                      {sale.selected_items && sale.selected_items.length > 0 && (
                        <div style={{ marginTop: "10px" }}>
                          <p><strong>Selected Equipment:</strong></p>
                          <ul style={{ paddingLeft: "20px", marginTop: "5px" }}>
                            {sale.selected_items.map((itemId, idx) => {
                              const matchedItem = rentableItems.find(item => item.id === parseInt(itemId));
                              return (
                                <li key={idx} style={{ fontSize: "0.95rem" }}>
                                  {matchedItem ? matchedItem.name : `Unknown Item #${itemId}`}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Remove Subscription Button */}
                    <button 
                      onClick={() => handleDelete(sale.user_id)} 
                      style={{
                        marginTop: "15px",
                        backgroundColor: "#ef4444",
                        color: "white",
                        border: "none",
                        padding: "10px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "bold"
                      }}
                    >
                      Remove Subscription
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default SubscriptionSales;
