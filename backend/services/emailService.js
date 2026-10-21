
const { Resend } = require("resend");

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// Escape dynamic values before inserting them into HTML.
function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[char];
  });
}

function formatPrice(value) {
  return `₹${Number(value).toLocaleString("en-IN")}`;
}

async function sendNewOrderNotification(order) {
  if (!resend) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  const from = process.env.ORDER_EMAIL_FROM;
  const notificationEmail = process.env.ORDER_NOTIFICATION_EMAIL;

  if (!from) {
    throw new Error("ORDER_EMAIL_FROM is not configured.");
  }

  if (
    !notificationEmail ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(notificationEmail.trim())
  ) {
    throw new Error(
      "ORDER_NOTIFICATION_EMAIL is missing or is not a valid email address."
    );
  }

  if (!order || !order.customer || !Array.isArray(order.items)) {
    throw new Error("Order details are incomplete.");
  }

  const customerName = escapeHtml(
    `${order.customer.firstName} ${order.customer.lastName}`
  );

  const rows = order.items
    .map(
      (item) => `
        <tr>
          <td style="padding:12px;border-bottom:1px solid #eee;">
            ${escapeHtml(item.name)}
          </td>
          <td style="padding:12px;text-align:center;border-bottom:1px solid #eee;">
            ${Number(item.quantity)}
          </td>
          <td style="padding:12px;text-align:right;border-bottom:1px solid #eee;">
            ${formatPrice(Number(item.price) * Number(item.quantity))}
          </td>
        </tr>
      `
    )
    .join("");

  const orderDate = order.createdAt
    ? new Date(order.createdAt).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      })
    : new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      });

  // Never let a slow email provider hold the customer's checkout open.
  const EMAIL_TIMEOUT_MS = 8000;

  const sendPromise = resend.emails.send({
    from,
    to: [notificationEmail.trim()],
    subject: `New order received - ${order.orderNumber} | Aurelia Jewellery`,
    html: `
      <div style="max-width:640px;margin:0 auto;font-family:Arial,sans-serif;color:#29251f;border:1px solid #eee;">
        <div style="background:#171717;color:#fff;padding:28px;text-align:center;">
          <h1 style="margin:0;letter-spacing:2px;">AURELIA JEWELLERY</h1>
          <p style="margin-bottom:0;">New Order Notification</p>
        </div>

        <div style="padding:24px;">
          <h2>A new order has been placed!</h2>
          <p>Review the order details below.</p>

          <p><strong>Order number:</strong> ${escapeHtml(order.orderNumber)}</p>
          <p><strong>Order date:</strong> ${escapeHtml(orderDate)}</p>
          <p><strong>Order status:</strong> ${escapeHtml(order.orderStatus || "Confirmed")}</p>
          <p><strong>Payment method:</strong> Cash on Delivery</p>
          <p><strong>Payment status:</strong> ${escapeHtml(order.paymentStatus || "Pending")}</p>

          <h3>Customer details</h3>
          <p>
            <strong>Name:</strong> ${customerName}<br>
            <strong>Email:</strong> ${escapeHtml(order.customer.email)}<br>
            <strong>Phone:</strong> ${escapeHtml(order.customer.phone)}
          </p>

          <h3>Items ordered</h3>
          <table style="width:100%;border-collapse:collapse;">
            <thead>
              <tr style="background:#f6f3ee;text-align:left;">
                <th style="padding:12px;">Product</th>
                <th style="padding:12px;text-align:center;">Qty</th>
                <th style="padding:12px;text-align:right;">Amount</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>

          <p style="text-align:right;font-size:20px;margin-top:20px;">
            <strong>Total: ${formatPrice(order.total)}</strong>
          </p>

          <h3>Delivery address</h3>
          <p>
            ${escapeHtml(order.customer.address)}
            ${
              order.customer.apartment
                ? `, ${escapeHtml(order.customer.apartment)}`
                : ""
            }<br>
            ${escapeHtml(order.customer.city)}, ${escapeHtml(order.customer.state)}
            - ${escapeHtml(order.customer.pincode)}<br>
            Phone: ${escapeHtml(order.customer.phone)}
          </p>

          <p style="color:#777;font-size:12px;">
            This is an automated notification from Aurelia Jewellery.
          </p>
        </div>
      </div>
    `,
  });

  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(
      () => reject(new Error("Resend request timed out.")),
      EMAIL_TIMEOUT_MS
    );
  });

  let result;
  try {
    result = await Promise.race([sendPromise, timeoutPromise]);
  } finally {
    clearTimeout(timeoutId);
  }

  const { data, error } = result;

  if (error) {
    throw new Error(error.message || "Resend could not send the notification.");
  }

  console.log(`New order notification accepted: ${order.orderNumber}`);

  return data;
}

module.exports = { sendNewOrderNotification };
