import { API_BASE_URL } from "../../config";

export default async function getMaterial(id) {
  const response = await fetch(`${API_BASE_URL}/materials/${id}`);
  const data = await response.json();

  return data;
}
