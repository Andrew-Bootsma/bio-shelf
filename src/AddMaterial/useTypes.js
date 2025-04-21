import { useState, useEffect } from "react";

export const useTypes = () => {
  const [types, setTypes] = useState([]);

  useEffect(() => {
    async function fetchTypes() {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const typesRes = await fetch("/api/types");
      const typesJson = await typesRes.json();
      setTypes(typesJson);
    }

    fetchTypes();
  }, []);

  return types;
};
