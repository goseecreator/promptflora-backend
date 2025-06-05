import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { tier } = req.body;

    if (!tier?.name || !tier?.amount) {
      return res.status(400).json({ error: 'Invalid tier data' });
    }

    const log = {
      type: 'gift',
      tier: tier.name,
      amount: tier.amount,
      ripple: 0.47,
      timestamp: new Date().toISOString(),
      message: `Gift of $${tier.amount} (${tier.name}) received. Ripple queued.`,
    };

    const ledgerPath = path.join(path.dirname(new URL(import.meta.url).pathname), 'ripple-log.json');
    let ledger = [];

    if (fs.existsSync(ledgerPath)) {
      ledger = JSON.parse(fs.readFileSync(ledgerPath, 'utf8'));
    }

    ledger.push(log);
    fs.writeFileSync(ledgerPath, JSON.stringify(ledger, null, 2));

    console.log("💠 Gift recorded:", log);

    res.status(200).json({
      status: 'success',
      ripple: 0.47,
      message: `Ripple of $0.47 BTC sent from your ${tier.name} gift.`,
    });
  } catch (err) {
    console.error('❌ API Error:', err);
    res.status(500).json({ error: 'Internal error processing gift.' });
  }
}
