let ledger = globalThis.ledger || [];
globalThis.ledger = ledger;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { tier } = req.body;

    const log = {
      type: "ripple_forward",
      tier: tier.name,
      timestamp: new Date().toISOString(),
      message: `Ripple of $0.47 from ${tier.name} sent forward.`,
    };

    ledger.push(log);

    return res.status(200).json({ status: "success", ripple: 0.47 });
  } catch (err) {
    console.error("❌ Error in /api/ripple-forward:", err);
    return res.status(500).json({ error: "Internal error forwarding ripple." });
  }
}
