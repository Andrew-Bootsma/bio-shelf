import { API_BASE_URL } from "../config";

export default async function getMaterials() {
  const response = await fetch(`${API_BASE_URL}/materials`);
  const data = await response.json();

  return data;
}
