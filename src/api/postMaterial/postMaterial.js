export default async function postMaterial(material) {
  console.log(material);

  const response = await fetch("/api/materials", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...material }),
  });

  if (!response) {
    throw new Error("Network response failed.");
  }

  return response.json();
}
