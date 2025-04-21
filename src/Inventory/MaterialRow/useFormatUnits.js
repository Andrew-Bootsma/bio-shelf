export const useFormatUnits = (quantity, unit) => {
  const sanctionedUnits = [
    "milliliter",
    "liter",
    "gram",
    "milligram",
    "kilogram",
    "meter",
    "centimeter",
    "millimeter",
    "celsius",
  ];

  if (sanctionedUnits.includes(unit)) {
    const intl = new Intl.NumberFormat("en-US", {
      style: "unit",
      unit: unit,
    });

    return intl.format(quantity);
  }

  return `${quantity} ${unit}`;
};
