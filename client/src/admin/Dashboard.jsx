import { useEffect, useState } from "react";
import axios from "axios";
import { Package, AlertCircle, Activity, TrendingUp, X } from "lucide-react";
import Navbara from "./Navbara"; // Import the Navbara component
import "./Dashboard.css";

const Dashboard = () => {
  const [totalProducts, setTotalProducts] = useState(0);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [productsRes, lowStockRes, activitiesRes] = await Promise.all([
        axios.get("http://localhost:5000/api/inventory"),
        axios.get("http://localhost:5000/api/inventory/low-stock"),
        axios.get("http://localhost:5000/api/inventory/recent-activities"),
      ]);

      setTotalProducts(productsRes.data.length);
      setLowStockProducts(lowStockRes.data);
      setRecentActivities(activitiesRes.data);
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Failed to fetch dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-body">
      <Navbara /> {/* Include the Navbara component */}
      <div className="dashboard-container">
        <h2>
          <Activity className="inline-icon" size={32} />
          Admin Dashboard
        </h2>

        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError(null)}>
              <X size={16} />
            </button>
          </div>
        )}

        <div className="dashboard-metrics">
          <div className="metric-card">
            <div className="metric-icon">
              <Package size={24} />
            </div>
            <div className="metric-content">
              <h3>Total Products</h3>
              <p>{totalProducts}</p>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">
              <AlertCircle size={24} />
            </div>
            <div className="metric-content">
              <h3>Low Stock Products</h3>
              <p>{lowStockProducts.length}</p>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">
              <TrendingUp size={24} />
            </div>
            <div className="metric-content">
              <h3>Recent Activities</h3>
              <p>{recentActivities.length}</p>
            </div>
          </div>
        </div>

        <div className="dashboard-sections">
          <div className="low-stock-section">
            <h3>Low Stock Products</h3>
            {loading ? (
              <div className="loading-container">
                <span className="loading-spinner" />
                <p>Loading low stock products...</p>
              </div>
            ) : lowStockProducts.length === 0 ? (
              <div className="empty-state">
                <Package size={48} />
                <p>No low stock products found.</p>
              </div>
            ) : (
              <ul>
                {lowStockProducts.map((product) => (
                  <li key={product._id}>
                    <span>{product.name}</span>
                    <span>{product.quantity} left</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="recent-activities-section">
            <h3>Recent Activities</h3>
            {loading ? (
              <div className="loading-container">
                <span className="loading-spinner" />
                <p>Loading recent activities...</p>
              </div>
            ) : recentActivities.length === 0 ? (
              <div className="empty-state">
                <Activity size={48} />
                <p>No recent activities found.</p>
              </div>
            ) : (
              <ul>
                {recentActivities.map((activity) => (
                  <li key={activity._id}>
                    <span>{activity.description}</span>
                    <span>{new Date(activity.timestamp).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;