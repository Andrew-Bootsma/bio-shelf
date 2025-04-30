import { createFileRoute } from "@tanstack/react-router";
import { useRouter } from "@tanstack/react-router";
import MaterialForm from "../components/MaterialForm/MaterialForm";

export const Route = createFileRoute("/materials/new")({
  component: NewMaterial,
});

function NewMaterial() {
  const router = useRouter();

  async function handleSubmit(e, formData) {
    e.preventDefault();
    const material = { ...formData };
    material.quantity = Number(material.quantity);

    await fetch("/api/materials", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(material),
    });

    router.navigate({ to: "/materials" });
  }

  return (
    <div>
      <h2>Add Material</h2>
      <div className="mx-4 flex justify-center">
        <MaterialForm handleSubmit={handleSubmit} />
      </div>
    </div>
  );
}
