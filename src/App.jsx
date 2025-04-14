import { createRoot } from "react-dom/client";
import Material from "./Material";

const App = () => {
  return (
    <div>
      <h1>BioShelf</h1>
      <Material
        name="Tris-HCl Buffer (1M, pH 8.0)"
        description="pH 8.0 buffer used in DNA, RNA, and protein protocols"
      />
      <Material
        name="1.5 mL Microcentrifuge Tubes"
        description="Disposable tubes for sample prep, centrifugation, and storage"
      />
      <Material
        name="Human Plasma (Frozen)"
        description="Frozen human plasma used for research and diagnostic applications"
      />
      <Material
        name="Vortex Mixer"
        description="Benchtop device for rapid mixing of liquid samples in tubes"
      />
      <Material
        name="Agarose Powder (Store at room temp, dry)"
        description="Dry powder used to prepare agarose gels for nucleic acid electrophoresis"
      />
    </div>
  );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
