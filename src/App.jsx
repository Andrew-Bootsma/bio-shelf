import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import Inventory from "./Inventory/Inventory";
import AddMaterial from "./AddMaterial/AddMaterial";

const App = () => {
  return (
    <StrictMode>
      <div className="font-mono">
        <h1 className="mx-4 mt-4">BioShelf</h1>

        <Inventory />

        <AddMaterial />
      </div>
    </StrictMode>
  );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
