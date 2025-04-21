export const useMaterialStatus = (quantity, expiryDate, type) => {
  const LOW_STOCK_THRESHOLDS = {
    reagent: 50,
    consumable: 100,
    sample: 5,
  };

  const today = new Date().setHours(0, 0, 0, 0);
  const threshold = LOW_STOCK_THRESHOLDS[type];

  const isLow = quantity < threshold;
  const isExpired =
    expiryDate && new Date(expiryDate).setHours(0, 0, 0, 0) <= today;

  if (isExpired) return "EXPIRED";
  if (isLow) return "LOW";
  return "IN STOCK";
};
