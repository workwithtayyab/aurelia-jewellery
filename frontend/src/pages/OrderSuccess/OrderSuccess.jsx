import React from "react";
import { Link, useLocation, Navigate } from "react-router-dom";

import {
  FaCheck,
  FaHome,
  FaShoppingBag,
} from "react-icons/fa";

import "./OrderSuccess.css";


const OrderSuccess = () => {

  const location = useLocation();

  // =========================================
  // ORDER DATA
  // =========================================

  const order = location.state?.order;

  // If someone directly visits /order-success
  // without placing an order, send them home.

  if (!order) {
    return <Navigate to="/" replace />;
  }


  // =========================================
  // PRICE FORMAT
  // =========================================

  const formatPrice = (price) => {
    return `₹${Number(price).toLocaleString("en-IN")}`;
  };


  return (
    <main className="order-success-page">


      {/* =====================================
          SUCCESS HEADER
      ===================================== */}

      <section className="order-success-header">

        <div className="order-success-icon">
          <FaCheck />
        </div>

        <p className="order-success-eyebrow">
          ORDER CONFIRMED
        </p>

        <h1>
          Thank You For Your Order
        </h1>

        <p className="order-success-message">
          Your order has been successfully placed.
          We've received your request and will
          begin preparing your jewellery shortly.
        </p>

      </section>


      {/* =====================================
          ORDER CONTENT
      ===================================== */}

      <section className="order-success-container">


        {/* ===================================
            ORDER DETAILS
        =================================== */}

        <div className="order-success-details">


          {/* ORDER NUMBER */}

          <div className="order-info-grid">

            <div className="order-info">

              <span>
                ORDER NUMBER
              </span>

              <strong>
                {order.orderNumber}
              </strong>

            </div>


            <div className="order-info">

              <span>
                ORDER DATE
              </span>

              <strong>
                {order.orderDate}
              </strong>

            </div>


            <div className="order-info">

              <span>
                EMAIL
              </span>

              <strong>
                {order.customer.email}
              </strong>

            </div>

          </div>


          {/* =================================
              DELIVERY
          ================================= */}

          <div className="delivery-card">

            <div className="delivery-card-heading">

              <p>
                DELIVERY ADDRESS
              </p>

              <h2>
                Your Jewellery Is On Its Way
              </h2>

            </div>

            <div className="delivery-address">

              <strong>
                {order.customer.firstName}{" "}
                {order.customer.lastName}
              </strong>

              <span>
                {order.customer.address}
              </span>

              {order.customer.apartment && (

                <span>
                  {order.customer.apartment}
                </span>

              )}

              <span>
                {order.customer.city},{" "}
                {order.customer.state}
              </span>

              <span>
                {order.customer.pincode}
              </span>

              <span>
                {order.customer.phone}
              </span>

            </div>

          </div>


          {/* =================================
              ITEMS
          ================================= */}

          <div className="confirmed-items">

            <div className="confirmed-items-heading">

              <p>
                YOUR SELECTION
              </p>

              <h2>
                Order Items
              </h2>

            </div>


            <div className="confirmed-items-list">

              {order.items.map((item) => (

                <article
                  className="confirmed-item"
                  key={item.id}
                >

                  <div className="confirmed-item-image">

                    <img
                      src={item.image}
                      alt={item.name}
                    />

                    <span>
                      {item.quantity}
                    </span>

                  </div>


                  <div className="confirmed-item-details">

                    <p>
                      {item.category}
                    </p>

                    <h3>
                      {item.name}
                    </h3>

                  </div>


                  <strong>
                    {formatPrice(
                      Number(item.price) *
                      item.quantity
                    )}
                  </strong>

                </article>

              ))}

            </div>

          </div>

        </div>


        {/* ===================================
            SUMMARY
        =================================== */}

        <aside className="order-success-summary">

          <p className="summary-eyebrow">
            ORDER SUMMARY
          </p>

          <h2>
            Your Order
          </h2>


          <div className="success-summary-divider" />


          <div className="success-summary-row">

            <span>
              Subtotal
            </span>

            <strong>
              {formatPrice(order.subtotal)}
            </strong>

          </div>


          <div className="success-summary-row">

            <span>
              Shipping
            </span>

            <strong>
              FREE
            </strong>

          </div>


          <div className="success-summary-divider" />


          <div className="success-summary-total">

            <span>
              Total
            </span>

            <strong>
              {formatPrice(order.total)}
            </strong>

          </div>


          {/* =================================
              PAYMENT STATUS
          ================================= */}

          <div className="payment-status">

            <FaCheck />

            <div>

              <strong>
                Order Received
              </strong>

              <span>
                Your payment/order request has
                been successfully submitted.
              </span>

            </div>

          </div>


          {/* =================================
              ACTIONS
          ================================= */}

          <Link
            to="/shop"
            className="success-shop-button"
          >

            <FaShoppingBag />

            CONTINUE SHOPPING

          </Link>


          <Link
            to="/"
            className="success-home-button"
          >

            <FaHome />

            BACK TO HOME

          </Link>

        </aside>

      </section>

    </main>
  );
};


export default OrderSuccess;