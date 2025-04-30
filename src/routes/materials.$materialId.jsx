import {
  createFileRoute,
  Outlet,
  useMatches,
  useRouter,
} from "@tanstack/react-router";
import { useContext } from "react";

import { MaterialsContext } from "../contexts";

import Material from "../components/Material/Material";

export const Route = createFileRoute("/materials/$materialId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { materialId } = Route.useParams();
  const router = useRouter();
  const matches = useMatches();

  const { materials, setMaterials } = useContext(MaterialsContext);

  const isExactDetailRoute = matches.length === 3;
  const material = materials.find((m) => m.id === materialId);

  if (!isExactDetailRoute) {
    return <Outlet />;
  }

  if (!material) {
    return <div>Loading...</div>;
  }

  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete this material?");
    if (!confirmed) return;

    await fetch(`/api/materials/${materialId}`, {
      method: "DELETE",
    });

    setMaterials(materials.filter((m) => m.id !== materialId));

    router.navigate({ to: "/materials" });
  };

  return <Material material={material} handleDelete={handleDelete} />;
}
