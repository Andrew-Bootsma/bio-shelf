import { API_BASE_URL } from "../config";

export default async function getMaterials(page) {
  const pageSize = 10;
  const response = await fetch(
    `${API_BASE_URL}/materials?_page=${page}&_per_page=${pageSize}`,
  );
  const data = await response.json();

  return data;
}
