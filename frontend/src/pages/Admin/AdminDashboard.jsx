import API_BASE_URL from "../../config";

import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaGem,
  FaShoppingBag,
  FaRupeeSign,
  FaArrowRight,
} from "react-icons/fa";

import products from "../../data/products";
import "./Admin.css";

const API_URL = `${API_BASE_URL}/api/admin/orders`;

const formatPrice = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN")}`;

const getOrderStatus = (order) =>
  order.orderStatus || "Processing";

const getOrderDate = (order) => {
  const value = order.createdAt || order.orderDate;

  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getCustomerName = (customer = {}) => {
  const name = [
    customer.firstName,
    customer.lastName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return name || customer.name || customer.email || "Customer";
};

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        throw new Error(
          "Your admin session has expired. Please log in again."
        );
      }

      if (!response.ok) {
        throw new Error(data.message || "Unable to load orders.");
      }

      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch (err) {
      setError(err.message || "Unable to connect to the backend.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const totalRevenue = orders.reduce((total, order) => {
    if (getOrderStatus(order) === "Cancelled") return total;

    return total + Number(order.total ?? order.subtotal ?? 0);
  }, 0);

  const stats = [
    {
      label: "Total Products",
      value: products.length,
      note: "Products in your catalogue",
      icon: <FaGem />,
    },
    {
      label: "Total Orders",
      value: loading ? "—" : orders.length,
      note: "Orders saved in MongoDB",
      icon: <FaShoppingBag />,
    },
    {
      label: "Recorded Revenue",
      value: loading ? "—" : formatPrice(totalRevenue),
      note: "Excludes cancelled orders",
      icon: <FaRupeeSign />,
    },
  ];

  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
    )
    .slice(0, 5);

  return (
    <div className="admin-dashboard">
      <div className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">OVERVIEW</p>
          <h1>Dashboard</h1>
          <p>Welcome back. Here's your store overview.</p>
        </div>

        <Link to="/admin/products" className="admin-primary-button">
          Manage Products <FaArrowRight />
        </Link>
      </div>

      {error && (
        <div className="admin-notice" role="alert">
          <span>{error}</span>
          <button type="button" onClick={fetchOrders}>
            Retry
          </button>
        </div>
      )}

      <div className="admin-stats-grid">
        {stats.map((stat) => (
          <article className="admin-stat-card" key={stat.label}>
            <div className="admin-stat-top">
              <span>{stat.label}</span>
              <div className="admin-stat-icon">{stat.icon}</div>
            </div>

            <h2>{stat.value}</h2>
            <p>{stat.note}</p>
          </article>
        ))}
      </div>

      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <p className="admin-eyebrow">LATEST ACTIVITY</p>
            <h2>Recent Orders</h2>
          </div>

          <Link to="/admin/orders" className="admin-text-link">
            View all <FaArrowRight />
          </Link>
        </div>

        {loading ? (
          <div className="admin-empty-state">
            <p>Loading orders from MongoDB...</p>
          </div>
        ) : error ? (
          <div className="admin-empty-state">
            <p>Orders could not be loaded.</p>
            <button
              type="button"
              className="admin-secondary-button"
              onClick={fetchOrders}
            >
              Try again
            </button>
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="admin-empty-state">
            <div className="admin-empty-icon">
              <FaShoppingBag />
            </div>
            <h3>No orders yet</h3>
            <p>
              Orders will appear here after customers place them
              successfully.
            </p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {recentOrders.map((order) => {
                  const status = getOrderStatus(order);

                  return (
                    <tr
                      key={order._id || order.orderNumber}
                    >
                      <td>{order.orderNumber || "—"}</td>
                      <td>{getCustomerName(order.customer)}</td>
                      <td>{getOrderDate(order)}</td>
                      <td>
                        {formatPrice(order.total ?? order.subtotal)}
                      </td>
                      <td>
                        <span
                          className={`admin-status ${status.toLowerCase()}`}
                        >
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <p className="admin-eyebrow">QUICK ACCESS</p>
            <h2>Store Management</h2>
          </div>
        </div>

        <div className="admin-action-grid">
          <Link to="/admin/products" className="admin-action-card">
            <FaGem />
            <div>
              <h3>Manage Jewellery</h3>
              <p>Review your catalogue and product details.</p>
            </div>
            <FaArrowRight className="admin-action-arrow" />
          </Link>

          <Link to="/admin/orders" className="admin-action-card">
            <FaShoppingBag />
            <div>
              <h3>Manage Orders</h3>
              <p>Review purchases and fulfilment statuses.</p>
            </div>
            <FaArrowRight className="admin-action-arrow" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
