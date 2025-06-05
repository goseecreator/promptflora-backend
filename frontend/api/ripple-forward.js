const AWS = require("aws-sdk");

const dynamoDb = new AWS.DynamoDB.DocumentClient({
  region: "us-east-1",
});

const TABLE_NAME = "PromptFloraRippleLog";

async function writeToLedger(tier) {
  const logEntry = {
    id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    tier: tier.name,
    amount: tier.amount,
    ripple: 0.47,
    timestamp: new Date().toISOString(),
  };

  const params = {
    TableName: TABLE_NAME,
    Item: logEntry,
  };

  try {
    await dynamoDb.put(params).promise();
    console.log("✅ Ripple gift logged:", logEntry);
  } catch (err) {
    console.error("❌ Error logging ripple:", err);
  }
}

module.exports = { writeToLedger };
