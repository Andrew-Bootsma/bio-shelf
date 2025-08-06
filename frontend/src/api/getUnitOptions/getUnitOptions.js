import { API_BASE_URL } from "../../config";

export default async function getUnitOptions() {
  const response = await fetch(`${API_BASE_URL}/unitOptions`);
  const data = await response.json();

  return data;
}
