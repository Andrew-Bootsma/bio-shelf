import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/materials/$materialId/edit")({
  component: RouteComponent,
});

function RouteComponent() {
  const { materialId } = Route.useParams();

  return (
    <div>
      <h2>Edit Material {materialId}</h2>
      {/* Your edit form goes here */}
    </div>
  );
}
