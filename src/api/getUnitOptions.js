export default async function getUnitOptions() {
  const response = await fetch("/api/unitOptions");
  const data = await response.json();

  return data;
}
