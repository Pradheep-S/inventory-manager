import { Link } from "react-router-dom";
import {Package, Activity, Settings, LogOut } from "lucide-react";
import "./Navbara.css";

const Navbara = () => {
  return (
    <nav className="navbara">
      <div className="navbara-brand">
        <Package size={24} />
        <span>Admin Panel</span>
      </div>

      <div className="navbara-links">
        <Link to="/admin/dashboard" className="navbara-link">
          <Activity size={18} />
          <span>Dashboard</span>
        </Link>
        <Link to="/admin/inventory" className="navbara-link">
          <Package size={18} />
          <span>Inventory</span>
        </Link>
      </div>

      <div className="navbara-footer">
        <Link to="/admin/settings" className="navbara-link">
          <Settings size={18} />
          <span>Settings</span>
        </Link>
        <Link to="/logout" className="navbara-link">
          <LogOut size={18} />
          <span>Logout</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbara;