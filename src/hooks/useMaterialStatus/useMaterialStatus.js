export const useMaterialStatus = (material) => {
  const LOW_STOCK_THRESHOLDS = {
    reagent: 50,
    consumable: 100,
    sample: 5,
  };

  const today = new Date().setHours(0, 0, 0, 0);
  const threshold = LOW_STOCK_THRESHOLDS[material.type];

  const isLow = material.quantity < threshold;
  const isExpired =
    material.expiryDate &&
    new Date(material.expiryDate).setHours(0, 0, 0, 0) <= today;

  if (isExpired) return "EXPIRED";
  if (isLow) return "LOW";
  return "IN_STOCK";
};
