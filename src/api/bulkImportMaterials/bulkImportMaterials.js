export default async function bulkImportMaterials(materials) {
  const importedMaterials = [];

  // Import materials one by one to maintain consistency with existing API
  for (const material of materials) {
    try {
      const response = await fetch("/api/materials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(material),
      });

      if (!response.ok) {
        throw new Error(`Failed to import material: ${material.name}`);
      }

      const importedMaterial = await response.json();
      importedMaterials.push(importedMaterial);
    } catch (error) {
      // If any material fails, we still continue but throw at the end
      console.error(`Failed to import material ${material.name}:`, error);
      throw new Error(
        `Failed to import some materials. Last error: ${error.message}`,
      );
    }
  }

  return importedMaterials;
}
