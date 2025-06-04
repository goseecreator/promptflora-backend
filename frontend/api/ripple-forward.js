import fs from "fs";
import path from "path";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  const { tier } = req.body;

  const log = {
    type: "ripple_forward",
    tier: tier.name,
    timestamp: new Date().toISOString(),
    message: `Ripple of $0.47 from ${tier.name} sent forward.`,
  };

  const ledgerPath = path.resolve("ripple-log.json");
  let ledger = [];

  if (fs.existsSync(ledgerPath)) {
    ledger = JSON.parse(fs.readFileSync(ledgerPath));
  }

  ledger.push(log);
  fs.writeFileSync(ledgerPath, JSON.stringify(ledger, null, 2));

  return res.status(200).json({ status: "success", ripple: 0.47 });
}
