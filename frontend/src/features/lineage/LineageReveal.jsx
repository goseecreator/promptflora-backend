import { motion } from "framer-motion";

export default function LineageReveal({ lineage }) {
  return (
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
            <strong>{entry.tier}</strong> — {entry.message || `${entry.ripple} BTC`}
            <br />
            <span className="text-xs text-aquifer/60">
              {new Date(entry.timestamp).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}