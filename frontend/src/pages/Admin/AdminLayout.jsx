
import React from "react";
import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";

import {
  FaChartPie,
  FaGem,
  FaShoppingBag,
  FaStore,
  FaSignOutAlt,
} from "react-icons/fa";

import { useAdminAuth } from "../../Context/AdminAuthContext";
import "./Admin.css";

const AdminLayout = () => {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleAdminLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <Link to="/admin" className="admin-brand">
          AURELIA
          <span>ADMIN STUDIO</span>
        </Link>

        <p className="admin-nav-label">WORKSPACE</p>

        <nav className="admin-nav">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `admin-nav-link ${isActive ? "active" : ""}`
            }
          >
            <FaChartPie />
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `admin-nav-link ${isActive ? "active" : ""}`
            }
          >
            <FaGem />
            Products
          </NavLink>

          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              `admin-nav-link ${isActive ? "active" : ""}`
            }
          >
            <FaShoppingBag />
            Orders
          </NavLink>
        </nav>

        <div className="admin-sidebar-bottom">
          <Link to="/" className="admin-store-link">
            <FaStore />
            View Store
          </Link>

          <button
            type="button"
            className="admin-logout-button"
            onClick={handleAdminLogout}
          >
            <FaSignOutAlt />
            Logout
          </button>

          <p>© {new Date().getFullYear()} Aurelia Jewellery</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <p className="admin-topbar-label">
              AURELIA / MANAGEMENT
            </p>
            <h2>Store Administration</h2>
          </div>

          <div className="admin-profile">
            <div className="admin-avatar">A</div>

            <div>
              <strong>Store Admin</strong>
              <span>Administrator</span>
            </div>
          </div>
        </header>

        <section className="admin-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default AdminLayout;
