
const express = require("express");
const { Resend } = require("resend");

const router = express.Router();

const escapeHtml = (value = "") =>
  String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });

router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body || {};

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof subject !== "string" ||
      typeof message !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !subject.trim() ||
      !message.trim()
    ) {
      return res.status(400).json({
        message: "Please complete all contact form fields.",
      });
    }

    if (
      name.length > 100 ||
      email.length > 254 ||
      subject.length > 100 ||
      message.length > 5000
    ) {
      return res.status(400).json({
        message: "One or more fields exceed the allowed length.",
      });
    }

    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!validEmail.test(email.trim())) {
      return res.status(400).json({
        message: "Please enter a valid email address.",
      });
    }

    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured.");
      return res.status(500).json({
        message: "Email service is not configured. Please try again later.",
      });
    }

    const recipient =
      process.env.ADMIN_EMAIL ||
      process.env.ORDER_NOTIFICATION_EMAIL;

    const sender = process.env.ORDER_EMAIL_FROM;

    if (!recipient || !sender) {
      console.error("Contact email recipient or sender is not configured.");
      return res.status(500).json({
        message: "Email service is not configured. Please try again later.",
      });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const safeName = escapeHtml(name.trim());
    const safeEmail = escapeHtml(email.trim());
    const safeSubject = escapeHtml(subject.trim());
    const safeMessage = escapeHtml(message.trim()).replace(/\n/g, "<br>");

    const { data, error } = await resend.emails.send({
      from: sender,
      to: [recipient],
      replyTo: email.trim(),
      subject: `Aurelia Contact Enquiry: ${subject.trim()}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #29241f; line-height: 1.7;">
          <h2 style="color: #b08d57;">New Aurelia Jewellery Enquiry</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Subject:</strong> ${safeSubject}</p>
          <hr style="border: 0; border-top: 1px solid #e7dfd2;" />
          <p><strong>Message:</strong></p>
          <p>${safeMessage}</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend contact email error:", error);
      return res.status(502).json({
        message: "We couldn't send your message. Please try again later.",
      });
    }

    return res.status(200).json({
      message: "Thank you for contacting Aurelia! Your enquiry has been sent.",
      id: data?.id,
    });
  } catch (error) {
    console.error("Contact endpoint error:", error);

    return res.status(500).json({
      message: "Something went wrong while sending your message.",
    });
  }
});

module.exports = router;
