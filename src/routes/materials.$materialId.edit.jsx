import { createFileRoute, useRouter } from "@tanstack/react-router";
import MaterialForm from "../components/MaterialForm/MaterialForm";

export const Route = createFileRoute("/materials/$materialId/edit")({
  component: RouteComponent,
});

function RouteComponent() {
  const { materialId } = Route.useParams();
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    const material = Object.fromEntries(new FormData(e.target));

    await fetch(`/api/materials/${materialId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(material),
    });

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
