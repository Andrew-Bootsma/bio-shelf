import { createRoot } from "react-dom/client";
import AddMaterial from "./AddMaterial";

const App = () => {
  return (
    <div className="m-4 font-mono">
      <h1>BioShelf</h1>

      <AddMaterial />
    </div>
  );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
