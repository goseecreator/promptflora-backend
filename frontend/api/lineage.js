let ledger = globalThis.ledger || [];
globalThis.ledger = ledger;

export default async function handler(req, res) {
  try {
    return res.status(200).json(ledger);
  } catch (err) {
    console.error("❌ Error in /api/lineage:", err);
    return res.status(500).json({ error: "Internal error reading lineage." });
  }
}
