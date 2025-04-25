import { useState, useEffect } from "react";

export const useFetchMaterialMeta = () => {
  const [materialMeta, setMaterialMeta] = useState({
    types: [],
    unitOptions: {},
  });

  useEffect(() => {
    async function fetchMaterialMeta() {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const unitOptionsRes = await fetch("/api/unitOptions");
      const unitOptionsJson = await unitOptionsRes.json();

      const typesRes = await fetch("/api/types");
      const typesJson = await typesRes.json();

      setMaterialMeta({
        types: typesJson,
        unitOptions: unitOptionsJson,
      });
    }

    fetchMaterialMeta();
  }, []);

  return materialMeta;
};
