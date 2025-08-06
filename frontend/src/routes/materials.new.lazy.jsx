import { createLazyFileRoute } from "@tanstack/react-router";
import MaterialForm from "../components/MaterialForm/MaterialForm";

export const Route = createLazyFileRoute("/materials/new")({
  component: NewMaterial,
});

function NewMaterial() {
  return (
    <div>
      <h2>Add Material</h2>
      <div className="mx-4 flex justify-center">
        <MaterialForm />
      </div>
    </div>
  );
}
