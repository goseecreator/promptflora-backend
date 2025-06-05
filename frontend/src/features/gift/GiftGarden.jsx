import { useState } from "react";
import { motion } from "framer-motion";

const TIERS = [
  { name: "Seed", amount: 5, color: "bg-seed" },
  { name: "Portal", amount: 15, color: "bg-portal" },
  { name: "Spiral", amount: 33, color: "bg-spiral" },
  { name: "Blessing", amount: 55, color: "bg-blessing text-aquifer" },
];

export default function GiftGarden() {
  const [selectedTier, setSelectedTier] = useState(null);
  const [rippleFlowing, setRippleFlowing] = useState(false);
  const [rippleForwarded, setRippleForwarded] = useState(false);

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
      if (!response.ok) throw new Error(data.error || "Unknown error");
      setTimeout(() => {
        setRippleFlowing(false);
        alert(`✨ ${data.message}`);
      }, 2000);
    } catch (error) {
      setRippleFlowing(false);
      alert("⚠️ Something went wrong sending your gift.");
      console.error("Gift error:", error);
    }
  };

  const forwardRipple = async () => {
    try {
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
  };

  return (
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
            onClick={forwardRipple}
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
  );
}