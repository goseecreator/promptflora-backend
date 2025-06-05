const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = "PromptFloraRippleLog";

async function writeToLedger(tier) {
  const logEntry = {
    id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    tier: tier.name,
    amount: Number(tier.amount),
    ripple: 0.47,
    timestamp: new Date().toISOString(),
  };

  const params = new PutCommand({
    TableName: TABLE_NAME,
    Item: logEntry,
  });

  try {
    await docClient.send(params);
    console.log("✅ Ripple gift logged (v3):", logEntry);
  } catch (err) {
    console.error("❌ Error logging ripple (v3):", err);
  }
}

module.exports = { writeToLedger };
