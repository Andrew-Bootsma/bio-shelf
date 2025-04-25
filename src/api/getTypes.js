export default async function getTypes() {
  const response = await fetch("/api/types");
  const data = await response.json();

  return data;
}
