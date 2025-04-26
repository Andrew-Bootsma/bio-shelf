import { createFileRoute } from "@tanstack/react-router";
import { useRouter } from "@tanstack/react-router";
import MaterialForm from "../components/MaterialForm/MaterialForm";

export const Route = createFileRoute("/materials/new")({
  component: NewMaterial,
});

function NewMaterial() {
  console.log("NewMaterial component rendered");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    const material = Object.fromEntries(new FormData(e.target));

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
      <h2 className="mx-4 mb-8">Add Material</h2>
      <div className="flex justify-center">
        <MaterialForm handleSubmit={handleSubmit} />
      </div>
    </div>
  );
}
