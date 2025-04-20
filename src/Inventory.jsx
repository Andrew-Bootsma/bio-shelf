import Material from "./Material";

const Inventory = () => {
  return (
    <div>
      <h1>Inventory</h1>

      <div className="overflow-x-auto border border-black shadow-hard">
        <table className="w-full text-left font-mono text-sm">
          <thead className="bg-brand-muted uppercase text-black">
            <tr>
              <th className="border border-black px-2 py-1">Name</th>
              <th className="border border-black px-2 py-1 text-center">Qty</th>
              <th className="border border-black px-2 py-1 text-center">
                Unit
              </th>
              <th className="border border-black px-2 py-1 text-center">
                Status
              </th>
              <th className="border border-black px-2 py-1 text-center">
                Expires
              </th>
            </tr>
          </thead>
          <tbody>
            <Material
              name="Tris-HCl Buffer (1M, pH 8.0)"
              quantity={250}
              unit="mL"
              status="OK"
              expiryDate="2025-12-01"
            />
            <Material
              name="1.5 mL Microcentrifuge Tubes"
              quantity={1000}
              unit="pcs"
              status="OK"
            />
            <Material
              name="Human Plasma (Frozen)"
              quantity={100}
              unit="L"
              status="EXPIRED"
              expiryDate="2024-10-01"
            />
            <Material
              name="Vortex Mixer"
              quantity={1}
              unit="unit"
              status="LOW"
            />
            <Material
              name="Agarose Powder (Store at room temp, dry)"
              quantity={100}
              unit="g"
              status="OK"
              expiryDate="2026-03-15"
            />
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;
