import { API_BASE_URL } from "../../config";

export default async function getTypes() {
  const response = await fetch(`${API_BASE_URL}/types`);
  const data = await response.json();

  return data;
}
