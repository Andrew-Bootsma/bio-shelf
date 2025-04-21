import { useState, useEffect } from "react";

export const useUnitOptions = () => {
  const [unitOptions, setUnitOptions] = useState([]);

  useEffect(() => {
    async function fetchUnitOptions() {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const unitOptionsRes = await fetch("/api/unitOptions");
      const unitOptionsJson = await unitOptionsRes.json();
      setUnitOptions(unitOptionsJson);
    }

    fetchUnitOptions();
  }, []);

  return unitOptions;
};
