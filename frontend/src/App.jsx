import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import GiftGarden from "./features/gift/GiftGarden";
import LineageReveal from "./features/lineage/LineageReveal";

function App() {
  const [showGarden, setShowGarden] = useState(false);
  const [showLineage, setShowLineage] = useState(false);
  const [lineage, setLineage] = useState([]);

  const fetchLineage = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/lineage`);
      const data = await res.json();
      console.log("📜 Lineage data:", data);
      setLineage(data.slice(-5).reverse());
      setShowLineage(true);
    } catch (err) {
      console.error("Lineage fetch error:", err);
      alert("⚠️ Could not fetch lineage. Try again later.");
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
        onClick={fetchLineage}
        className="text-sm underline hover:text-blessing transition mb-6"
      >
        Reveal the Lineage
      </button>

      <AnimatePresence>{showGarden && <GiftGarden />}</AnimatePresence>
      <AnimatePresence>
        {showLineage && <LineageReveal lineage={lineage} />}
      </AnimatePresence>
    </div>
  );
}

export default App;