// Pesapal Mobile Money Subscription Backend

const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");
const { body, param, query, validationResult } = require('express-validator');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ================= PESAPAL CONFIG =================
const consumerKey = "SmkIrFYBHVHjV3UV0LPRQ53GjSjvT+E2";
const consumerSecret = "z80OF+dxQauvy4smSMJvifIK/uc=";
const BASE_URL = "https://pay.pesapal.com/v3"; // Production/live

let IPN_ID = ""; // Will be set after registration

// Subscription plans (UGX) and durations in days
const PLANS = {
  access2days: { price: 5000, days: 2 },
  week: { price: 10000, days: 7 },
  twoweeks: { price: 17000, days: 14 },
  month: { price: 30000, days: 30 },
  threemonth: { price: 70000, days: 90 },
  sixmonth: { price: 120000, days: 180 },
  year: { price: 200000, days: 365 },
};

// Firestore database for subscriptions and payments
const { saveUserSubscription, getUserSubscription, savePaymentRecord } = require('./lib/firestore-db');

// =============== AUTH TOKEN ===============
async function getToken() {
  try {
    console.log('Requesting Pesapal token with:', { consumerKey, consumerSecret, BASE_URL });
    const res = await axios.post(
      `${BASE_URL}/api/Auth/RequestToken`,
      {
        consumer_key: consumerKey,
        consumer_secret: consumerSecret,
      },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Pesapal token response:', res.data);
    return res.data.token;
  } catch (err) {
    if (err.response) {
      console.error('Pesapal token error:', err.response.data);
    } else {
      console.error('Pesapal token error:', err.message);
    }
    throw err;
  }
}

// =============== REGISTER IPN ===============
app.get(
  "/register-ipn",
  [query('url').optional().isURL()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
  console.warn("Validation error on /pay-subscription:", errors.array());
  return res.status(400).json({ errors: errors.array(), message: "Invalid input. Please check your details." });
    }
    try {
      const token = await getToken();
      // Use a public IPN URL for real integration, or ngrok for local testing
      const ipnUrl = req.query.url || "https://luoancientmovies.com/pesapal-ipn.php";
      const response = await axios.post(
        `${BASE_URL}/api/URLSetup/RegisterIPN`,
        {
          url: ipnUrl,
          ipn_notification_type: "POST",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );
      IPN_ID = response.data.ipn_id;
      res.json({ message: "IPN Registered", data: response.data });
    } catch (err) {
      res.status(500).json(err.response?.data || err.message);
    }
  }
);

// =============== GET REGISTERED IPNs ===============
app.get("/ipn-list", async (req, res) => {
  try {
    const token = await getToken();
    const response = await axios.get(
      `${BASE_URL}/api/URLSetup/GetIpnList`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      }
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json(err.response?.data || err.message);
  }
});

// =============== CREATE SUBSCRIPTION ORDER ===============
app.post(
  "/pay-subscription",
  [
    body('planId').isString().isIn(Object.keys(PLANS)),
    body('phone').isString().matches(/^07\d{8}$/),
    body('email').optional().isEmail(),
    body('firstName').optional().isString().trim().escape(),
    body('lastName').optional().isString().trim().escape(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { planId, phone, email, firstName, lastName } = req.body;
      if (!IPN_ID) {
        console.error("IPN_ID not set. Register your IPN first.");
        return res.status(500).json({ error: "IPN_ID not set. Register your IPN first." });
      }
      const plan = PLANS[planId];
      const token = await getToken();
      const orderRequest = {
        id: "ORDER_" + Date.now(),
        currency: "UGX",
        amount: plan.price,
        description: `${planId} subscription`,
        callback_url: "https://luoancientmovies.com/pesapal-callback.php",
        notification_id: IPN_ID,
        billing_address: {
          phone_number: phone,
          email_address: email || undefined,
          country_code: "UG",
          first_name: firstName || "",
          last_name: lastName || "",
        },
      };
      console.log('Submitting Pesapal order:', orderRequest);
      try {
        const response = await axios.post(
          `${BASE_URL}/api/Transactions/SubmitOrderRequest`,
          orderRequest,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          }
        );
        console.log('Pesapal order response:', response.data);
        if (!response.data.redirect_url) {
          return res.status(500).json({ error: "Failed to get payment redirect URL from Pesapal." });
        }
        res.json({
          redirect_url: response.data.redirect_url,
          order_id: orderRequest.id,
        });
      } catch (err) {
        if (err.response) {
          console.error('Pesapal order error:', err.response.data);
          return res.status(500).json({ error: err.response.data, message: "Payment provider error. Please try again later." });
        } else {
          console.error('Pesapal order error:', err.message);
          return res.status(500).json({ error: err.message, message: "Unexpected error. Please try again." });
        }
      }
    } catch (err) {
  console.error("/pay-subscription error:", err.message);
  return res.status(500).json({ error: err.message, message: "Server error. Please try again later." });
    }
  }
);

// ...existing code...

// =============== IPN HANDLER ===============
app.post(
  "/ipn",
  [
    body('OrderTrackingId').isString().notEmpty(),
    body('planId').optional().isString().isIn(Object.keys(PLANS)),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
  console.warn("Validation error on /ipn:", errors.array());
  return res.status(400).json({ errors: errors.array(), message: "Invalid input for IPN." });
    }
    const { OrderTrackingId } = req.body;
  console.log("📩 IPN Received:", req.body);
    try {
      const token = await getToken();
      const response = await axios.get(
        `${BASE_URL}/Transactions/GetTransactionStatus?orderTrackingId=${OrderTrackingId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const status = response.data.payment_status_description;
      const phone = response.data.phone_number;
      const planId = response.data.plan_id || req.body.planId;
  console.log("🔎 Payment Status:", status);
      if (status === "COMPLETED" && phone && planId && PLANS[planId]) {
        const plan = PLANS[planId];
        const now = new Date();
        const expires = new Date(now.getTime() + plan.days * 24 * 60 * 60 * 1000);
        await saveUserSubscription(phone, planId, expires.toISOString());
        await savePaymentRecord(OrderTrackingId, response.data);
        console.log(`✅ Subscription activated for ${phone} until ${expires}`);
      }
      res.sendStatus(200);
    } catch (err) {
      console.error("IPN Error:", err.response?.data || err.message);
      res.status(500).json({ error: err.response?.data || err.message, message: "Failed to process payment notification." });
    }
  }
);

// =============== CALLBACK ===============
app.get(
  "/callback",
  [query('paymentId').optional().isString().trim().escape()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
  console.warn("Validation error on /callback:", errors.array());
  return res.status(400).json({ errors: errors.array(), message: "Invalid callback input." });
    }
    if (req.query && req.query.paymentId) {
      try {
        await savePaymentRecord(req.query.paymentId, req.query);
      } catch (err) {
        console.error("Failed to save payment record in callback:", err);
      }
    }
    res.send("✅ Payment complete. Please check your account.");
  }
);

// =============== CHECK SUBSCRIPTION STATUS ===============
app.get(
  "/subscription/:phone",
  [param('phone').isString().matches(/^07\d{8}$/)],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
  console.warn("Validation error on /subscription/:phone:", errors.array());
  return res.status(400).json({ errors: errors.array(), message: "Invalid phone number format." });
    }
    const { phone } = req.params;
    try {
      const user = await getUserSubscription(phone);
      if (!user) return res.json({ active: false });
      const active = new Date() < new Date(user.expires);
      res.json({ active, plan: user.plan, expires: user.expires });
    } catch (err) {
  console.error("Failed to fetch subscription status for", phone, err);
  res.status(500).json({ error: 'Failed to fetch subscription status', message: "Server error. Please try again later." });
    }
  }
);

// =============== START SERVER ===============
app.listen(4000, () =>
  console.log("🚀 Pesapal subscription backend running on http://localhost:4000")
);