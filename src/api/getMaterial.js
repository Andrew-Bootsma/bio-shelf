export default async function getMaterial(id) {
  const response = await fetch(`/api/materials/${id}`);
  const data = await response.json();

  return data;
}
