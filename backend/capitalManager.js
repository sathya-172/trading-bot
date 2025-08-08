// capitalManager.js
const calculatePositionSize = ({ capital, riskPercent, entry, stopLoss }) => {
  const riskPerTrade = (capital * riskPercent) / 100;
  const perShareRisk = Math.abs(entry - stopLoss);
  const qty = Math.floor(riskPerTrade / perShareRisk);
  return { qty, riskPerTrade };
};

module.exports = calculatePositionSize;
