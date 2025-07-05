import { createLazyFileRoute, useRouter } from "@tanstack/react-router";
import { useContext } from "react";

import { MaterialsContext } from "../contexts";
import MaterialForm from "../components/MaterialForm/MaterialForm";

export const Route = createLazyFileRoute("/materials/$materialId/edit")({
  component: RouteComponent,
});

function RouteComponent() {
  const { materialId } = Route.useParams();
  const router = useRouter();

  const { materials, setMaterials } = useContext(MaterialsContext);
  const material = materials.find((m) => m.id === materialId);

  async function handleSubmit(e) {
    e.preventDefault();
    const updatedMaterial = Object.fromEntries(new FormData(e.target));

    updatedMaterial.quantity = Number(updatedMaterial.quantity);
    updatedMaterial.id = materialId;

    await fetch(`/api/materials/${materialId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedMaterial),
    });

    setMaterials(
      materials.map((m) => (m.id === materialId ? updatedMaterial : m)),
    );

    router.navigate({ to: "/materials" });
  }

  return (
    <div>
      <h2>Edit Material</h2>
      <div className="flex justify-center">
        <MaterialForm handleSubmit={handleSubmit} materialData={material} />
      </div>
    </div>
  );
}
