
import React from "react";
import { Link, useParams } from "react-router-dom";

import {
  FaArrowLeft,
  FaArrowRight,
  FaBoxOpen,
  FaCalendarAlt,
  FaCreditCard,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaCheckCircle,
} from "react-icons/fa";

import { useCart } from "../../Context/CartContext";

import "./OrderDetails.css";

const OrderDetails = () => {
  // =========================================
  // LATEST ORDER FROM CART CONTEXT
  // =========================================

  const { orders } = useCart();
  const { orderNumber } = useParams();

  const order = orders.find(
    (item) => item.orderNumber === orderNumber
  );

  // =========================================
  // PRICE FORMAT
  // =========================================

  const formatPrice = (price) =>
    `₹${Number(price || 0).toLocaleString("en-IN")}`;

  // =========================================
  // ORDER NOT FOUND
  // =========================================

  if (!order) {
    return (
      <main className="order-details-page">
        <section className="order-not-found">
          <div className="order-not-found-icon">
            <FaBoxOpen />
          </div>

          <p className="order-details-eyebrow">AURELIA</p>

          <h1>Order Not Found</h1>

          <p>
            We couldn't find the order you're looking for.
          </p>

          <Link
            to="/history"
            className="order-back-button"
          >
            <FaArrowLeft />
            BACK TO MY ORDERS
          </Link>
        </section>
      </main>
    );
  }

  // =========================================
  // CUSTOMER AND ORDER STATUS
  // =========================================

  const customer = order.customer || {};
  const orderStatus =
    order.orderStatus || order.status || "Confirmed";

  const paymentStatus = order.paymentStatus || "Pending";

  // =========================================
  // RENDER ORDER DETAILS
  // =========================================

  return (
    <main className="order-details-page">
      {/* HEADER */}

      <section className="order-details-hero">
        <Link
          to="/history"
          className="order-details-back"
        >
          <FaArrowLeft />
          BACK TO MY ORDERS
        </Link>

        <p className="order-details-eyebrow">AURELIA</p>

        <h1>Order Details</h1>

        <p>Thank you for choosing Aurelia.</p>
      </section>

      {/* MAIN CONTAINER */}

      <section className="order-details-container">
        {/* ORDER HEADER */}

        <div className="order-details-header">
          <div className="order-details-header-left">
            <div className="order-details-icon">
              <FaBoxOpen />
            </div>

            <div>
              <span>ORDER NUMBER</span>

              <h2>{order.orderNumber}</h2>

              <p>Placed on {order.orderDate || "—"}</p>
            </div>
          </div>

          <div
            className={`order-details-status ${orderStatus
              .toLowerCase()
              .replace(/\s+/g, "-")}`}
          >
            <FaCheckCircle />
            <span>{orderStatus}</span>
          </div>
        </div>

        {/* ORDER INFORMATION */}

        <div className="order-details-info">
          <div className="order-detail-info-item">
            <FaCalendarAlt />

            <div>
              <span>ORDER DATE</span>
              <strong>{order.orderDate || "—"}</strong>
            </div>
          </div>

          <div className="order-detail-info-item">
            <FaCreditCard />

            <div>
              <span>PAYMENT METHOD</span>
              <strong>
                {order.paymentMethod || "Cash on Delivery"}
              </strong>
            </div>
          </div>

          <div className="order-detail-info-item">
            <FaCheckCircle />

            <div>
              <span>PAYMENT STATUS</span>
              <strong>{paymentStatus}</strong>
            </div>
          </div>
        </div>

        {/* ORDERED PRODUCTS */}

        <section className="order-details-section">
          <div className="order-section-heading">
            <div>
              <span>YOUR SELECTION</span>
              <h2>Ordered Items</h2>
            </div>

            <small>
              {order.items?.length || 0}{" "}
              {order.items?.length === 1 ? "item" : "items"}
            </small>
          </div>

          <div className="order-items">
            {order.items?.map((item, index) => (
              <div
                className="order-item"
                key={`${item.id ?? item.name ?? "item"}-${index}`}
              >
                <div className="order-item-image">
                  {item.image && (
                    <img src={item.image} alt={item.name || "Product"} />
                  )}

                  <span>{item.quantity || 1}</span>
                </div>

                <div className="order-item-details">
                  <h3>{item.name || "Jewellery item"}</h3>
                  <p>{item.category || ""}</p>

                  {item.material && <small>{item.material}</small>}
                </div>

                <div className="order-item-price">
                  <span>
                    {formatPrice(item.price)} × {item.quantity || 1}
                  </span>

                  <strong>
                    {formatPrice(
                      Number(item.price || 0) *
                        Number(item.quantity || 1)
                    )}
                  </strong>
                </div>
              </div>
            ))}

            {(!order.items || order.items.length === 0) && (
              <p>No item details are available for this order.</p>
            )}
          </div>
        </section>

        {/* PRICE SUMMARY */}

        <section className="order-details-section">
          <div className="order-section-heading">
            <div>
              <span>PAYMENT SUMMARY</span>
              <h2>Order Total</h2>
            </div>
          </div>

          <div className="order-summary">
            <div>
              <span>Subtotal</span>
              <strong>
                {formatPrice(order.subtotal ?? order.total)}
              </strong>
            </div>

            <div>
              <span>Shipping</span>
              <strong>
                {Number(order.shipping || 0) === 0
                  ? "FREE"
                  : formatPrice(order.shipping)}
              </strong>
            </div>

            <div className="order-summary-total">
              <span>Total</span>
              <strong>
                {formatPrice(order.total ?? order.subtotal)}
              </strong>
            </div>
          </div>
        </section>

        {/* DELIVERY AND CUSTOMER INFORMATION */}

        <section className="order-details-grid">
          <div className="order-address-card">
            <div className="order-card-heading">
              <div className="order-card-icon">
                <FaMapMarkerAlt />
              </div>

              <div>
                <span>DELIVERY</span>
                <h2>Shipping Address</h2>
              </div>
            </div>

            <div className="order-card-content">
              <strong>
                {[customer.firstName, customer.lastName]
                  .filter(Boolean)
                  .join(" ") || "Customer"}
              </strong>

              <p>
                {customer.address || "Address not provided"}

                {customer.apartment && (
                  <>
                    <br />
                    {customer.apartment}
                  </>
                )}

                {(customer.city || customer.state) && (
                  <>
                    <br />
                    {[customer.city, customer.state]
                      .filter(Boolean)
                      .join(", ")}
                  </>
                )}

                {customer.pincode && (
                  <>
                    <br />
                    {customer.pincode}
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="order-address-card">
            <div className="order-card-heading">
              <div className="order-card-icon">
                <FaEnvelope />
              </div>

              <div>
                <span>CONTACT</span>
                <h2>Customer Information</h2>
              </div>
            </div>

            <div className="order-card-content">
              <div className="order-contact-row">
                <FaEnvelope />
                <span>{customer.email || "No email provided"}</span>
              </div>

              <div className="order-contact-row">
                <FaPhone />
                <span>{customer.phone || "No phone provided"}</span>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM ACTIONS */}

        <div className="order-details-actions">
          <Link
            to="/history"
            className="order-action-secondary"
          >
            <FaArrowLeft />
            MY ORDERS
          </Link>

          <Link
            to="/shop"
            className="order-action-primary"
          >
            CONTINUE SHOPPING
            <FaArrowRight />
          </Link>
        </div>
      </section>
    </main>
  );
};

export default OrderDetails;
