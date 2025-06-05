const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const AWS = require("aws-sdk");
const { writeToLedger } = require("./rippleLedger");

const app = express();
const PORT = 3001;

// AWS SDK config
const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Simple test route
app.get("/ping", (req, res) => {
  console.log("🟢 Ping received");
  res.send("pong");
});

// 💠 Ritual Gift Endpoint
app.post("/api/gift", async (req, res) => {
  try {
    const { tier } = req.body;

    if (!tier?.name || !tier?.amount) {
      return res.status(400).json({ error: "Invalid tier data" });
    }

    await writeToLedger(tier);

    res.status(200).json({
      status: "success",
      ripple: 0.47,
      message: `Ripple of $0.47 BTC sent from your ${tier.name} gift.`,
    });
  } catch (err) {
    console.error("❌ Error in /api/gift:", err);
    res.status(500).json({ error: "Internal error processing gift." });
  }
});

// 🌱 Lineage Fetch (Last 5 Gifts)
app.get("/api/lineage", async (req, res) => {
  console.log("📥 /api/lineage request received");

  const params = {
    TableName: "PromptFloraRippleLog"
  };

  try {
    const data = await dynamoDb.scan(params).promise();

    if (!data.Items || data.Items.length === 0) {
      return res.status(200).json([]);
    }

    // With v3: Items are already plain JS, no parsing needed
    const sortedLineage = data.Items
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 5);

    res.status(200).json(sortedLineage);
  } catch (err) {
    console.error("❌ Error fetching lineage:", err);
    res.status(500).json({ error: "Could not fetch lineage" });
  }
});

// 🌊 Ripple Forward Endpoint

// Server listener
app.listen(PORT, '127.0.0.1', () => {
  console.log(`🔮 PromptFlora server listening at http://127.0.0.1:${PORT}`);
});
