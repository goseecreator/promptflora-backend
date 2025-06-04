import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const ledgerPath = path.resolve("ripple-log.json");

  if (!fs.existsSync(ledgerPath)) {
    return res.status(200).json([]);
  }

  const ledger = JSON.parse(fs.readFileSync(ledgerPath));
  return res.status(200).json(ledger);
}
