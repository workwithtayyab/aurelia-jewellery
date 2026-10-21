import API_BASE_URL from "../../config";

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FaBoxOpen,
  FaShoppingBag,
  FaArrowRight,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaCreditCard,
  FaEye,
} from "react-icons/fa";

import "./History.css";

const API_URL = `${API_BASE_URL}/api/orders`;

const History = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchOrders = async () => {
      try {
        const response = await fetch(API_URL, {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        if (response.status === 401) {
          navigate("/account", {
            state: { returnTo: "/history" },
            replace: true,
          });
          return;
        }

        if (!response.ok) {
          throw new Error(data.message || "Unable to load orders.");
        }

        if (!cancelled) {
          setOrders(Array.isArray(data.orders) ? data.orders : []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to load your orders.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchOrders();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const formatPrice = (price) =>
    `₹${Number(price || 0).toLocaleString("en-IN")}`;

  const formatDate = (order) => {
    if (order.createdAt) {
      const date = new Date(order.createdAt);

      if (!Number.isNaN(date.getTime())) {
        return date.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      }
    }

    return order.orderDate || "Date unavailable";
  };

  if (loading) {
    return (
      <main className="history-page">
        <section className="history-hero">
          <p className="history-eyebrow">AURELIA</p>
          <h1>My Orders</h1>
          <p>Loading your purchases...</p>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="history-page">
        <section className="history-hero">
          <p className="history-eyebrow">AURELIA</p>
          <h1>My Orders</h1>
          <p>{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </section>
      </main>
    );
  }

  if (orders.length === 0) {
    return (
      <main className="history-page">
        <section className="history-hero">
          <p className="history-eyebrow">AURELIA</p>
          <h1>My Orders</h1>
          <p>Your Aurelia purchases will appear here.</p>
        </section>

        <section className="history-empty">
          <div className="history-empty-icon">
            <FaBoxOpen />
          </div>

          <p className="history-empty-label">ORDER HISTORY</p>
          <h2>No Orders Yet</h2>

          <p>
            You haven't placed an order with Aurelia yet.
            Discover something beautiful for yourself.
          </p>

          <Link to="/shop" className="history-shop-button">
            EXPLORE JEWELLERY <FaArrowRight />
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="history-page">
      <section className="history-hero">
        <p className="history-eyebrow">AURELIA</p>
        <h1>My Orders</h1>
        <p>A collection of your Aurelia purchases.</p>
      </section>

      <section className="history-container">
        <div className="history-heading">
          <div>
            <span>YOUR PURCHASES</span>
            <h2>Order History</h2>
          </div>

          <div className="history-count">
            {orders.length} {orders.length === 1 ? "Order" : "Orders"}
          </div>
        </div>

        <div className="history-list">
          {orders.map((order) => (
            <article className="history-order" key={order._id || order.orderNumber}>
              <div className="history-order-top">
                <div className="history-order-number">
                  <div className="history-order-icon">
                    <FaShoppingBag />
                  </div>

                  <div>
                    <span>ORDER NUMBER</span>
                    <h3>{order.orderNumber}</h3>
                  </div>
                </div>

                <span
                  className={`history-status ${(
                    order.orderStatus || "Processing"
                  ).toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {order.orderStatus || "Processing"}
                </span>
              </div>

              <div className="history-info">
                <div className="history-info-item">
                  <FaCalendarAlt />
                  <div>
                    <span>ORDER DATE</span>
                    <strong>{formatDate(order)}</strong>
                  </div>
                </div>

                <div className="history-info-item">
                  <FaCreditCard />
                  <div>
                    <span>PAYMENT</span>
                    <strong>{order.paymentMethod || "Cash on Delivery"}</strong>
                  </div>
                </div>

                <div className="history-info-item">
                  <FaMapMarkerAlt />
                  <div>
                    <span>DELIVERY</span>
                    <strong>{order.customer?.city || "Address provided"}</strong>
                  </div>
                </div>
              </div>

              <div className="history-products">
                {order.items?.map((item, index) => (
                  <div
                    className="history-product"
                    key={`${item.productId || item.name}-${index}`}
                  >
                    <div className="history-product-image">
                      {item.image && <img src={item.image} alt={item.name} />}
                      <span>{item.quantity}</span>
                    </div>

                    <div className="history-product-details">
                      <h4>{item.name}</h4>
                      <p>{item.category}</p>
                    </div>

                    <strong className="history-product-price">
                      {formatPrice(Number(item.price) * Number(item.quantity))}
                    </strong>
                  </div>
                ))}
              </div>

              <div className="history-total">
                <span>TOTAL</span>
                <strong>{formatPrice(order.total)}</strong>

                <div className="history-payment">
                  <span>PAYMENT STATUS</span>
                  <strong>{order.paymentStatus || "Pending"}</strong>
                </div>
              </div>

              {order.customer && (
                <div className="history-address">
                  <div className="history-address-icon">
                    <FaMapMarkerAlt />
                  </div>

                  <div>
                    <span>DELIVERING TO</span>
                    <p>
                      {order.customer.firstName} {order.customer.lastName}
                      <br />
                      {order.customer.address}
                      {order.customer.apartment
                        ? `, ${order.customer.apartment}`
                        : ""}
                      <br />
                      {order.customer.city}, {order.customer.state}{" "}
                      {order.customer.pincode}
                    </p>
                  </div>
                </div>
              )}

              <div className="history-order-action">
                <Link
                  to={`/order-details/${order.orderNumber}`}
                  state={{ order }}
                  className="history-view-order"
                >
                  <FaEye />
                  VIEW ORDER DETAILS
                  <FaArrowRight />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="history-bottom">
          <Link to="/shop" className="history-continue">
            CONTINUE SHOPPING <FaArrowRight />
          </Link>
        </div>
      </section>
    </main>
  );
};

export default History;
