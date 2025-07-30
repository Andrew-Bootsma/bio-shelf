export default async function postMaterial(material) {
  const response = await fetch("/api/materials", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...material }),
  });

  if (!response.ok) {
    throw new Error(`Failed to import material: ${material.name}`);
  }

  return response.json();
}
