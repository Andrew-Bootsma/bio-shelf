import { createContext } from "react";

export const MaterialMetaContext = createContext({
  types: [],
  unitOptions: {},
});

export const MaterialContext = createContext({
  materials: [],
  setMaterials: () => {},
});
