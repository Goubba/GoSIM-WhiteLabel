require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

// Enable CORS so your Vue frontend can communicate with this server
app.use(cors());

// Parse incoming JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const TARGET_BASE_URL = "https://business.getgosim.com/api/v1/vendor";

// Helper function to forward requests
const forwardRequest = async (req, res) => {
  try {
    const targetUrl = `${TARGET_BASE_URL}${req.originalUrl}`;
    const headers = { ...req.headers };
    delete headers.host;
    delete headers.origin;
    delete headers.referer;

    if (process.env.API_KEY) {
      headers["api-key"] = process.env.API_KEY;
    }

    const response = await axios({
      method: req.method,
      url: targetUrl,
      headers: headers,
      data: ["GET", "HEAD"].includes(req.method) ? undefined : req.body,
    });

    // You can alter response.data here before sending it back
    res.status(response.status).send(response.data);
  } catch (error) {
    if (error.response) {
      // You can alter error.response.data here before sending it back
      res.status(error.response.status).send(error.response.data);
    } else if (error.request) {
      res.status(504).json({ error: "Gateway Timeout", message: "No response from target API" });
    } else {
      res.status(500).json({ error: "Proxy Error", message: error.message });
    }
  }
};

// 1. Get Payment Order Status
app.get("/order/payment/:paymentId", async (req, res) => {
  // You can add custom logic here before forwarding
  await forwardRequest(req, res);
});

// 2. Get Locations (with optional search)
app.get("/locations", async (req, res) => {
  // You can add custom logic here before forwarding
  await forwardRequest(req, res);
});

// 3. Initiate External Unauth Order
app.post("/order/initiate/unauth/external", async (req, res) => {
  // You can add custom logic here before forwarding
  await forwardRequest(req, res);
});

// 4. Get Packages
app.post("/packages", async (req, res) => {
  // You can add custom logic here before forwarding
  await forwardRequest(req, res);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Proxy server listening on port ${PORT}`);
  console.log(`Forwarding all requests to ${TARGET_BASE_URL}`);
});
