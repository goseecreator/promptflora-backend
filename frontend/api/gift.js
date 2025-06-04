let ledger = globalThis.ledger || [];
globalThis.ledger = ledger;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { tier } = req.body;

    const log = {
      type: "gift",
      tier: tier.name,
      amount: tier.amount,
      ripple: 0.47,
      timestamp: new Date().toISOString(),
      message: `Gift of $${tier.amount} (${tier.name}) received. Ripple queued.`,
    };

    ledger.push(log);

    return res.status(200).json({
      status: "success",
      ripple: 0.47,
      message: `Ripple of $0.47 BTC sent from your ${tier.name} gift.`,
    });
  } catch (err) {
    console.error("❌ Error in /api/gift:", err);
    return res.status(500).json({ error: "Internal error processing gift." });
  }
}
