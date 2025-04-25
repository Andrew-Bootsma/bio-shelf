import { useState, useEffect } from "react";

export const useMaterials = () => {
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    async function fetchMaterials() {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const materialsRes = await fetch("/api/materials");
      const materialsJson = await materialsRes.json();
      setMaterials(materialsJson);
    }

    fetchMaterials();
  }, []);

  return materials;
};
