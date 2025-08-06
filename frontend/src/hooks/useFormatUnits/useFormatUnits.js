export const useFormatUnits = (quantity, unit) => {
  if (quantity === null) {
    return "";
  }

  if (unit == null || unit === "") {
    return quantity;
  }

  const unitMapping = {
    milliliter: "milliliter",
    gram: "gram",
    milligram: "gram",
    grams: "gram",
  };

  const sanctionedUnits = Object.keys(unitMapping);

  if (sanctionedUnits.includes(unit)) {
    try {
      const intl = new Intl.NumberFormat("en-US", {
        style: "unit",
        unit: unitMapping[unit],
        unitDisplay: "short",
      }).format(quantity);

      if (unit === "milligram") {
        return intl.replace("g", "mg");
      }

      return intl;
    } catch {
      return `${quantity} ${unit}`;
    }
  }

  if (unit.endsWith("L") || unit.endsWith("g")) {
    return `${quantity} ${unit}`;
  }

  if (quantity === 1) {
    if (unit.endsWith("ss")) {
      return `1 ${unit}`;
    }

    if (unit.endsWith("es")) {
      return `1 ${unit.slice(0, -2)}`;
    }

    if (unit.endsWith("s")) {
      return `1 ${unit.slice(0, -1)}`;
    }

    return `1 ${unit}`;
  } else {
    if (unit.endsWith("ss")) {
      return `${quantity} ${unit}es`;
    }

    if (unit.endsWith("s")) {
      return `${quantity} ${unit}`;
    }

    return `${quantity} ${unit}s`;
  }
};
