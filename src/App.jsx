import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { MaterialMetaContext } from "./contexts";

import Inventory from "./Inventory/Inventory";
import AddMaterial from "./AddMaterial/AddMaterial";

import { useFetchMaterialMeta } from "./useMaterialMeta";

const App = () => {
  const materialMeta = useFetchMaterialMeta();

  return (
    <StrictMode>
      <MaterialMetaContext.Provider value={materialMeta}>
        <div className="font-mono">
          <h1 className="mx-4 mt-4">BioShelf</h1>
          <Inventory />
          <AddMaterial />
        </div>
      </MaterialMetaContext.Provider>
    </StrictMode>
  );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
