import fs from "fs";
import path from "path";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  const { tier } = req.body;

  const log = {
    type: "gift",
    tier: tier.name,
    amount: tier.amount,
    ripple: 0.47,
    timestamp: new Date().toISOString(),
    message: `Gift of $${tier.amount} (${tier.name}) received. Ripple queued.`,
  };

  const ledgerPath = path.resolve("ripple-log.json");
  let ledger = [];

  if (fs.existsSync(ledgerPath)) {
    ledger = JSON.parse(fs.readFileSync(ledgerPath));
  }

  ledger.push(log);
  fs.writeFileSync(ledgerPath, JSON.stringify(ledger, null, 2));

  return res.status(200).json({
    status: "success",
    ripple: 0.47,
    message: `Ripple of $0.47 BTC sent from your ${tier.name} gift.`,
  });
}
