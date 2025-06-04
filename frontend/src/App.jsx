import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TIERS = [
  { name: "Seed", amount: 5, color: "bg-seed" },
  { name: "Portal", amount: 15, color: "bg-portal" },
  { name: "Spiral", amount: 33, color: "bg-spiral" },
  { name: "Blessing", amount: 55, color: "bg-blessing text-aquifer" },
];

function App() {
  const [showGarden, setShowGarden] = useState(false);
  const [selectedTier, setSelectedTier] = useState(null);
  const [rippleFlowing, setRippleFlowing] = useState(false);
  const [rippleForwarded, setRippleForwarded] = useState(false);
  const [showLineage, setShowLineage] = useState(false);
  const [lineage, setLineage] = useState([]);

  const handleGift = async (tier) => {
    setSelectedTier(tier);
    setRippleFlowing(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/gift`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tier }),
      });

      const data = await response.json();

      setTimeout(() => {
        setRippleFlowing(false);
        setRippleForwarded(false); // Reset for next round
        alert(`✨ ${data.message}`);
      }, 2000);
    } catch (error) {
      setRippleFlowing(false);
      alert("⚠️ Something went wrong sending your gift.");
      console.error("Gift error:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-aquifer text-white p-6">
      <h1 className="text-3xl font-semibold mb-4">PromptFlora</h1>

      <button
        onClick={() => setShowGarden(true)}
        className="bg-portal hover:bg-spiral text-aquifer font-bold py-2 px-4 rounded transition mb-2"
      >
        Show me the garden
      </button>

      <button
        onClick={async () => {
          console.log("🧭 Reveal lineage clicked");
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/lingeage`);
          const data = await res.json();
          console.log("📜 Lineage data:", data);
          setLineage(data.slice(-5).reverse());
          setShowLineage(true);
        }}
        className="text-sm underline hover:text-blessing transition mb-6"
      >
        Reveal the Lineage
      </button>

      <AnimatePresence>
        {showGarden && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="bg-white text-aquifer p-6 rounded-xl shadow-lg w-full max-w-md space-y-4"
          >
            <h2 className="text-2xl font-semibold mb-2">💠 Choose Your Offering</h2>

            {rippleFlowing ? (
              <p className="text-center text-lg font-medium animate-pulse">
                🌊 Ripple in motion... sending your {selectedTier?.name} gift.
              </p>
            ) : (
              TIERS.map((tier) => (
                <button
                  key={tier.name}
                  className={`${tier.color} hover:opacity-90 font-bold py-2 px-4 rounded block w-full text-center transition`}
                  onClick={() => handleGift(tier)}
                >
                  {tier.name} — ${tier.amount}
                </button>
              ))
            )}

            <p className="text-sm text-aquifer/60 mt-4 italic">
              Each offering sends $0.47 BTC forward as a ripple of grace.
            </p>

            {!rippleFlowing && selectedTier && !rippleForwarded && (
              <>
                <p className="text-center text-aquifer font-semibold">
                  🌬 A ripple is ready to be sent forward...
                </p>
                <button
                  onClick={async () => {
                    try {
                      console.log("🧭 Sending ripple forward...", selectedTier);
                      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ripple-forward`, {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ tier: selectedTier }),
                      });

                      const data = await res.json();
                      console.log("✅ Ripple forward response:", data);

                      setRippleForwarded(true);
                    } catch (err) {
                      console.error("❌ Ripple forward failed:", err);
                      alert("Ripple forward failed.");
                    }
                  }}
                  className="mt-4 bg-ripple text-white font-semibold py-2 px-4 rounded hover:bg-seed transition"
                >
                  🕊 Let the ripple flow
                </button>
              </>
            )}

            {rippleForwarded && (
              <p className="text-sm text-ripple mt-2 animate-pulse">
                🌿 Ripple sent forward to nourish another soul.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLineage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="mt-6 p-4 bg-white text-aquifer rounded-lg w-full max-w-md"
          >
            <h3 className="text-lg font-semibold mb-2">🕊 Ripple Lineage</h3>
            <ul className="space-y-2 text-sm">
              {lineage.map((entry, idx) => (
                <li key={idx}>
                  <strong>{entry.tier}</strong> — {entry.message}
                  <br />
                  <span className="text-xs text-aquifer/60">
                    {new Date(entry.timestamp).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
