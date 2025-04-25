export default async function getMaterials(page) {
  const pageSize = 10;
  const response = await fetch(
    `/api/materials?_page=${page}&_per_page=${pageSize}`,
  );
  const data = await response.json();

  return data;
}
