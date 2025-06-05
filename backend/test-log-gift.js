const { writeToLedger } = require("./rippleLedger");

const sampleTier = {
  name: "Blessing",
  amount: 108
};

writeToLedger(sampleTier).then(() => {
  console.log("✅ Test log complete.");
}).catch(console.error);
 