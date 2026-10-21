import API_BASE_URL from "../../config";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FaSearch,
  FaEye,
  FaTimes,
  FaShoppingBag,
  FaBoxOpen,
} from "react-icons/fa";

import "./Admin.css";

const API_URL = `${API_BASE_URL}/api/admin/orders`;

const STATUS_OPTIONS = [
  "Processing",
  "Confirmed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const PAYMENT_STATUS_OPTIONS = ["Pending", "Paid", "Refunded"];

const formatPrice = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN")}`;

const formatDate = (value) => {
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
  const name = [customer.firstName, customer.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  return (
    name ||
    customer.name ||
    customer.fullName ||
    customer.email ||
    "Guest Customer"
  );
};

const getCustomerEmail = (customer = {}) =>
  customer.email || "No email provided";

const getCustomerPhone = (customer = {}) =>
  customer.phone ||
  customer.phoneNumber ||
  customer.mobile ||
  "No phone provided";

const getStatusClass = (status) =>
  String(status || "Processing").toLowerCase().replace(/\s+/g, "-");

const getOrderStatus = (order) => order.orderStatus || "Processing";

const getPaymentStatus = (order) => order.paymentStatus || "Pending";

const getOrderDate = (order) =>
  formatDate(order.createdAt || order.orderDate);

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingOrder, setUpdatingOrder] = useState("");
  const [updatingPayment, setUpdatingPayment] = useState("");
  const [notice, setNotice] = useState("");

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

      const fetchedOrders = Array.isArray(data.orders)
        ? data.orders
        : [];

      setOrders(fetchedOrders);

      setSelectedOrder((current) => {
        if (!current) return null;

        return (
          fetchedOrders.find(
            (order) => order.orderNumber === current.orderNumber
          ) || null
        );
      });
    } catch (err) {
      setError(err.message || "Unable to connect to the backend.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = useMemo(() => {
    const term = search.trim().toLowerCase();

    return [...orders]
      .filter((order) => {
        const customerName = getCustomerName(order.customer).toLowerCase();
        const orderNumber = (order.orderNumber || "").toLowerCase();
        const email = getCustomerEmail(order.customer).toLowerCase();
        const status = getOrderStatus(order);

        const matchesSearch =
          !term ||
          orderNumber.includes(term) ||
          customerName.includes(term) ||
          email.includes(term);

        const matchesStatus =
          statusFilter === "All" || status === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      );
  }, [orders, search, statusFilter]);

  const stats = useMemo(() => {
    const total = orders.length;

    const pending = orders.filter(
      (order) => getOrderStatus(order) === "Processing"
    ).length;

    const processing = orders.filter((order) =>
      ["Confirmed", "Processing", "Shipped"].includes(
        getOrderStatus(order)
      )
    ).length;

    const delivered = orders.filter(
      (order) => getOrderStatus(order) === "Delivered"
    ).length;

    return { total, pending, processing, delivered };
  }, [orders]);

  // Update order fulfilment status only.
  const handleStatusChange = async (orderNumber, nextStatus) => {
    if (!orderNumber || !STATUS_OPTIONS.includes(nextStatus)) return;

    const currentOrder = orders.find(
      (order) => order.orderNumber === orderNumber
    );

    if (!currentOrder || getOrderStatus(currentOrder) === nextStatus) {
      return;
    }

    setUpdatingOrder(orderNumber);
    setError("");
    setNotice("");

    try {
      const response = await fetch(
        `${API_URL}/${encodeURIComponent(orderNumber)}/status`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: nextStatus }),
        }
      );

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        throw new Error(
          "Your admin session has expired. Please log in again."
        );
      }

      if (!response.ok || !data.order) {
        throw new Error(data.message || "Unable to update order status.");
      }

      const updatedOrder = data.order;

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.orderNumber === orderNumber ? updatedOrder : order
        )
      );

      setSelectedOrder((current) =>
        current?.orderNumber === orderNumber ? updatedOrder : current
      );

      setNotice(
        `Order ${orderNumber} updated to ${updatedOrder.orderStatus}.`
      );
    } catch (err) {
      setError(err.message || "Unable to update order status.");
    } finally {
      setUpdatingOrder("");
    }
  };

  // Update payment status independently from order status.
  const handlePaymentStatusChange = async (
    orderNumber,
    nextPaymentStatus
  ) => {
    if (
      !orderNumber ||
      !PAYMENT_STATUS_OPTIONS.includes(nextPaymentStatus)
    ) {
      return;
    }

    const currentOrder = orders.find(
      (order) => order.orderNumber === orderNumber
    );

    if (
      !currentOrder ||
      getPaymentStatus(currentOrder) === nextPaymentStatus
    ) {
      return;
    }

    setUpdatingPayment(orderNumber);
    setError("");
    setNotice("");

    try {
      const response = await fetch(
        `${API_URL}/${encodeURIComponent(orderNumber)}/payment-status`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentStatus: nextPaymentStatus,
          }),
        }
      );

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        throw new Error(
          "Your admin session has expired. Please log in again."
        );
      }

      if (!response.ok || !data.order) {
        throw new Error(
          data.message || "Unable to update payment status."
        );
      }

      const updatedOrder = data.order;

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.orderNumber === orderNumber ? updatedOrder : order
        )
      );

      setSelectedOrder((current) =>
        current?.orderNumber === orderNumber ? updatedOrder : current
      );

      setNotice(
        `Payment for ${orderNumber} updated to ${updatedOrder.paymentStatus}.`
      );
    } catch (err) {
      setError(err.message || "Unable to update payment status.");
    } finally {
      setUpdatingPayment("");
    }
  };

  return (
    <div className="admin-orders-page">
      <div className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">ORDER MANAGEMENT</p>
          <h1>Orders</h1>
          <p className="admin-muted">
            Review customer purchases and manage fulfilment.
          </p>
        </div>

        <button
          type="button"
          className="admin-secondary-button"
          onClick={fetchOrders}
          disabled={
            loading || Boolean(updatingOrder) || Boolean(updatingPayment)
          }
        >
          {loading ? "Refreshing..." : "Refresh Orders"}
        </button>
      </div>

      {notice && (
        <div className="admin-notice" role="status">
          <span>{notice}</span>
          <button
            type="button"
            onClick={() => setNotice("")}
            aria-label="Dismiss notification"
          >
            <FaTimes />
          </button>
        </div>
      )}

      {error && (
        <div className="admin-notice" role="alert">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError("")}
            aria-label="Dismiss error"
          >
            <FaTimes />
          </button>
        </div>
      )}

      <div className="admin-stats-grid admin-order-stats">
        <div className="admin-stat-card">
          <div className="admin-stat-top">
            <span>Total Orders</span>
            <span className="admin-stat-icon">
              <FaShoppingBag />
            </span>
          </div>
          <strong>{loading ? "—" : stats.total}</strong>
          <small>Orders saved in MongoDB</small>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-top">
            <span>Processing</span>
            <span className="admin-stat-icon">◷</span>
          </div>
          <strong>{loading ? "—" : stats.pending}</strong>
          <small>Awaiting further action</small>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-top">
            <span>In Progress</span>
            <span className="admin-stat-icon">↗</span>
          </div>
          <strong>{loading ? "—" : stats.processing}</strong>
          <small>Confirmed, processing or shipped</small>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-top">
            <span>Delivered</span>
            <span className="admin-stat-icon">✓</span>
          </div>
          <strong>{loading ? "—" : stats.delivered}</strong>
          <small>Successfully delivered</small>
        </div>
      </div>

      <div className="admin-orders-toolbar">
        <label className="admin-product-search">
          <FaSearch />
          <input
            type="search"
            placeholder="Search order, customer or email..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          aria-label="Filter orders by status"
        >
          <option value="All">All statuses</option>
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="admin-panel">
        <div className="admin-panel-heading">
          <h2>All Orders</h2>
          <span className="admin-muted">
            {loading ? "Loading..." : `${filteredOrders.length} results`}
          </span>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table admin-orders-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Total</th>
                <th>Payment Status</th>
                <th>Order Status</th>
                <th>Details</th>
              </tr>
            </thead>

            <tbody>
              {!loading &&
                filteredOrders.map((order) => {
                  const status = getOrderStatus(order);
                  const paymentStatus = getPaymentStatus(order);

                  return (
                    <tr key={order._id || order.orderNumber}>
                      <td>
                        <strong>{order.orderNumber || "—"}</strong>
                      </td>

                      <td>
                        <div className="admin-order-customer">
                          <strong>{getCustomerName(order.customer)}</strong>
                          <span>{getCustomerEmail(order.customer)}</span>
                        </div>
                      </td>

                      <td>{getOrderDate(order)}</td>

                      <td>
                        <strong>
                          {formatPrice(order.total ?? order.subtotal)}
                        </strong>
                      </td>

                      <td>
                        <select
                          className={`admin-order-status-select ${getStatusClass(
                            paymentStatus
                          )}`}
                          value={paymentStatus}
                          disabled={updatingPayment === order.orderNumber}
                          aria-label={`Update payment status for ${order.orderNumber}`}
                          onChange={(event) =>
                            handlePaymentStatusChange(
                              order.orderNumber,
                              event.target.value
                            )
                          }
                        >
                          {PAYMENT_STATUS_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>

                        {updatingPayment === order.orderNumber && (
                          <small>Saving payment...</small>
                        )}
                      </td>

                      <td>
                        <select
                          className={`admin-order-status-select ${getStatusClass(
                            status
                          )}`}
                          value={status}
                          disabled={updatingOrder === order.orderNumber}
                          aria-label={`Update order status for ${order.orderNumber}`}
                          onChange={(event) =>
                            handleStatusChange(
                              order.orderNumber,
                              event.target.value
                            )
                          }
                        >
                          {STATUS_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>

                        {updatingOrder === order.orderNumber && (
                          <small>Saving order...</small>
                        )}
                      </td>

                      <td>
                        <button
                          type="button"
                          className="admin-icon-button"
                          title="View order details"
                          aria-label={`View ${order.orderNumber}`}
                          onClick={() => setSelectedOrder(order)}
                        >
                          <FaEye />
                        </button>
                      </td>
                    </tr>
                  );
                })}

              {loading && (
                <tr>
                  <td colSpan="7">
                    <div className="admin-empty-state">
                      <p>Loading orders from MongoDB...</p>
                    </div>
                  </td>
                </tr>
              )}

              {!loading && !error && filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="7">
                    <div className="admin-empty-state">
                      <FaBoxOpen className="admin-empty-icon" />
                      <h3>No orders found</h3>
                      <p>Try another search or status filter.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <div
          className="admin-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedOrder(null);
            }
          }}
        >
          <section
            className="admin-product-modal admin-order-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-order-detail-title"
          >
            <div className="admin-modal-heading">
              <div>
                <p className="admin-eyebrow">ORDER DETAILS</p>
                <h2 id="admin-order-detail-title">
                  {selectedOrder.orderNumber || "Order"}
                </h2>
                <p className="admin-muted">
                  Placed on {getOrderDate(selectedOrder)}
                </p>
              </div>

              <button
                type="button"
                className="admin-icon-button"
                onClick={() => setSelectedOrder(null)}
                aria-label="Close order details"
              >
                <FaTimes />
              </button>
            </div>

            <div className="admin-order-detail-grid">
              <div className="admin-order-detail-card">
                <h3>Customer</h3>
                <strong>{getCustomerName(selectedOrder.customer)}</strong>
                <p>{getCustomerEmail(selectedOrder.customer)}</p>
                <p>{getCustomerPhone(selectedOrder.customer)}</p>

                {selectedOrder.customer?.address && (
                  <p>
                    {selectedOrder.customer.address}
                    {selectedOrder.customer.apartment
                      ? `, ${selectedOrder.customer.apartment}`
                      : ""}
                    <br />
                    {[
                      selectedOrder.customer.city,
                      selectedOrder.customer.state,
                      selectedOrder.customer.pincode,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}
              </div>

              <div className="admin-order-detail-card">
                <h3>Payment</h3>
                <p>
                  Method: {selectedOrder.paymentMethod || "Not specified"}
                </p>
                <p>Status: {getPaymentStatus(selectedOrder)}</p>
                <p>Order status: {getOrderStatus(selectedOrder)}</p>
              </div>
            </div>

            <h3 className="admin-order-items-title">Items ordered</h3>

            <div className="admin-order-items">
              {(selectedOrder.items || []).map((item, index) => (
                <div
                  className="admin-order-item"
                  key={`${item.productId || item.name || "item"}-${index}`}
                >
                  <div className="admin-order-item-image">
                    {item.image ? (
                      <img src={item.image} alt={item.name || "Product"} />
                    ) : (
                      <FaShoppingBag />
                    )}
                  </div>

                  <div className="admin-order-item-info">
                    <strong>{item.name || "Jewellery item"}</strong>
                    <span>Quantity: {Number(item.quantity || 1)}</span>
                  </div>

                  <strong>
                    {formatPrice(
                      Number(item.price || 0) * Number(item.quantity || 1)
                    )}
                  </strong>
                </div>
              ))}

              {(!selectedOrder.items || selectedOrder.items.length === 0) && (
                <p className="admin-muted">
                  No item details were saved with this order.
                </p>
              )}
            </div>

            <div className="admin-order-totals">
              <div>
                <span>Subtotal</span>
                <strong>
                  {formatPrice(
                    selectedOrder.subtotal ?? selectedOrder.total
                  )}
                </strong>
              </div>

              <div>
                <span>Shipping</span>
                <strong>{formatPrice(selectedOrder.shipping || 0)}</strong>
              </div>

              <div className="admin-order-grand-total">
                <span>Total</span>
                <strong>
                  {formatPrice(
                    selectedOrder.total ?? selectedOrder.subtotal
                  )}
                </strong>
              </div>
            </div>

            <div className="admin-order-modal-footer">
              <label>
                Update payment status
                <select
                  value={getPaymentStatus(selectedOrder)}
                  disabled={
                    updatingPayment === selectedOrder.orderNumber
                  }
                  onChange={(event) =>
                    handlePaymentStatusChange(
                      selectedOrder.orderNumber,
                      event.target.value
                    )
                  }
                >
                  {PAYMENT_STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Update order status
                <select
                  value={getOrderStatus(selectedOrder)}
                  disabled={updatingOrder === selectedOrder.orderNumber}
                  onChange={(event) =>
                    handleStatusChange(
                      selectedOrder.orderNumber,
                      event.target.value
                    )
                  }
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>

              <button
                type="button"
                className="admin-secondary-button"
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
