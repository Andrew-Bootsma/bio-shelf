import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AddMaterial from "./AddMaterial";

const App = () => {
  return (
    <StrictMode>
      <div className="m-4 font-mono">
        <h1>BioShelf</h1>
        <AddMaterial />
      </div>
    </StrictMode>
  );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
