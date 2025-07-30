import {
  useContext,
  useRef,
  useState,
  useOptimistic,
  useActionState,
} from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "@tanstack/react-router";
import { MaterialMetaContext, MaterialsContext } from "../../contexts";
import bulkImportMaterials from "../../api/bulkImportMaterials/bulkImportMaterials";

// ImportButton component that uses useFormStatus
function ImportButton({ csvData, errors, isPreviewMode }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={!isPreviewMode || pending || errors.length > 0}
      className="disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Importing..." : `Import ${csvData.length} Materials`}
    </button>
  );
}

// ResetButton component that uses useFormStatus
function ResetButton({ onReset }) {
  const { pending } = useFormStatus();

  return (
    <button type="button" onClick={onReset} disabled={pending}>
      Reset
    </button>
  );
}

// ImportStatus component for loading feedback
function ImportStatus() {
  const { pending } = useFormStatus();
  return pending ? (
    <div className="mb-4 rounded border border-blue-400 bg-blue-100 p-3 text-blue-700">
      Processing bulk import... This may take a moment.
    </div>
  ) : null;
}

const ImportCSV = () => {
  const router = useRouter();
  const { materials, setMaterials } = useContext(MaterialsContext);
  const { types, unitOptions } = useContext(MaterialMetaContext);
  const [csvData, setCsvData] = useState([]);
  const [previewData, setPreviewData] = useState([]);
  const [errors, setErrors] = useState([]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const fileInputRef = useRef(null);
  const formRef = useRef(null);

  // Optimistic updates for better UX
  const [, addOptimisticMaterials] = useOptimistic(
    materials,
    (state, newMaterials) => [...state, ...newMaterials],
  );

  // React 19 useActionState for import handling
  const [state, importAction] = useActionState(
    async () => {
      if (csvData.length === 0) {
        return { error: "No valid data to import" };
      }

      // Optimistic update - show imported materials immediately
      addOptimisticMaterials(csvData);

      try {
        const newMaterials = await bulkImportMaterials(csvData);
        setMaterials([...materials, ...newMaterials]);
        router.navigate({ to: "/materials" });
        return { success: true, imported: newMaterials.length };
      } catch (error) {
        return { error: `Import failed: ${error.message}` };
      }
    },
    { error: null, success: false },
  );

  const parseCSV = (csvText) => {
    const lines = csvText.trim().split("\n");
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());

    const expectedHeaders = [
      "name",
      "type",
      "quantity",
      "unit",
      "location",
      "expirydate",
      "vendor",
      "description",
      "notes",
    ];

    // Validate headers
    const missingHeaders = expectedHeaders.filter((h) => !headers.includes(h));
    if (missingHeaders.length > 0) {
      setErrors([`Missing required headers: ${missingHeaders.join(", ")}`]);
      return [];
    }

    const data = [];
    const validationErrors = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim());
      const row = {};

      headers.forEach((header, index) => {
        row[header] = values[index] || "";
      });

      // Validate required fields
      if (!row.name) {
        validationErrors.push(`Row ${i}: Missing name`);
        continue;
      }

      if (!types?.find((t) => t.id === row.type)) {
        validationErrors.push(`Row ${i}: Invalid type "${row.type}"`);
        continue;
      }

      if (!row.quantity || isNaN(Number(row.quantity))) {
        validationErrors.push(`Row ${i}: Invalid quantity "${row.quantity}"`);
        continue;
      }

      if (!row.unit || !unitOptions[row.type]?.includes(row.unit)) {
        validationErrors.push(
          `Row ${i}: Invalid unit "${row.unit}" for type "${row.type}"`,
        );
        continue;
      }

      if (!row.location) {
        validationErrors.push(`Row ${i}: Missing location`);
        continue;
      }

      // Convert and validate data
      const material = {
        name: row.name,
        type: row.type,
        quantity: Number(row.quantity),
        unit: row.unit,
        location: row.location,
        expiryDate: row.expirydate || "",
        vendor: row.vendor || "",
        description: row.description || "",
        notes: row.notes || "",
      };

      // Validate expiry date format if provided
      if (material.expiryDate && !isValidDate(material.expiryDate)) {
        validationErrors.push(
          `Row ${i}: Invalid expiry date format "${material.expiryDate}". Use YYYY-MM-DD`,
        );
        continue;
      }

      data.push(material);
    }

    setErrors(validationErrors);
    return data;
  };

  const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return (
      date instanceof Date &&
      !isNaN(date) &&
      dateString.match(/^\d{4}-\d{2}-\d{2}$/)
    );
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      setErrors(["Please select a CSV file"]);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const csv = event.target.result;
      const parsed = parseCSV(csv);
      setCsvData(parsed);
      setPreviewData(parsed.slice(0, 5)); // Show first 5 rows
      setIsPreviewMode(parsed.length > 0);
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    setIsPreviewMode(false);
    setCsvData([]);
    setPreviewData([]);
    setErrors([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (!types || !unitOptions) {
    return <div className="mx-4 my-8">Loading...</div>;
  }

  return (
    <div className="max-w-6xl grow border border-black p-4">
      <div className="mb-6">
        <h3 className="mb-2">CSV Format Requirements</h3>
        <p className="mb-4 ml-2">
          Your CSV file must include the following headers (case-insensitive):
        </p>
        <div className="mb-4 ml-4 font-mono text-sm">
          <code>
            name,type,quantity,unit,location,expirydate,vendor,description,notes
          </code>
        </div>
        <div className="mb-4 ml-2">
          <p className="mb-2">
            <strong>Valid types:</strong> {types.map((t) => t.id).join(", ")}
          </p>
          <p className="mb-2">
            <strong>Date format:</strong> YYYY-MM-DD (e.g., 2025-12-31)
          </p>
          <p className="mb-2">
            <strong>Required fields:</strong> name, type, quantity, unit,
            location
          </p>
        </div>
      </div>

      {/* Display validation errors */}
      {errors.length > 0 && (
        <div className="mb-4 border border-red-500 bg-red-50 p-4">
          <h4 className="mb-2 font-bold text-red-700">Validation Errors:</h4>
          <ul className="ml-4 list-disc text-red-600">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Display import action errors */}
      {state?.error && (
        <div className="mb-4 border border-red-500 bg-red-50 p-4">
          <h4 className="mb-2 font-bold text-red-700">Import Error:</h4>
          <p className="text-red-600">{state.error}</p>
        </div>
      )}

      <ImportStatus />

      <form ref={formRef} action={importAction}>
        <div className="form-element">
          <label htmlFor="csvFile" className="mr-8">
            Select CSV File
          </label>
          <input
            ref={fileInputRef}
            id="csvFile"
            name="csvFile"
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="grow"
            required
          />
        </div>

        {isPreviewMode && (
          <div className="mb-6">
            <h3 className="mb-2">Preview ({csvData.length} materials found)</h3>
            <div className="overflow-x-auto">
              <table className="w-full border border-black text-sm">
                <thead>
                  <tr className="bg-gray-100 text-left uppercase">
                    <th className="border border-black p-2">Name</th>
                    <th className="border border-black p-2">Type</th>
                    <th className="border border-black p-2">Qty</th>
                    <th className="border border-black p-2">Unit</th>
                    <th className="border border-black p-2">Location</th>
                    <th className="border border-black p-2">Expiry</th>
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((material, index) => (
                    <tr key={index}>
                      <td className="border border-black p-2">
                        {material.name}
                      </td>
                      <td className="border border-black p-2">
                        {material.type}
                      </td>
                      <td className="border border-black p-2">
                        {material.quantity}
                      </td>
                      <td className="border border-black p-2">
                        {material.unit}
                      </td>
                      <td className="border border-black p-2">
                        {material.location}
                      </td>
                      <td className="border border-black p-2">
                        {material.expiryDate || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {csvData.length > 5 && (
                <p className="mt-2 text-sm text-gray-600">
                  ... and {csvData.length - 5} more materials
                </p>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <ImportButton
            csvData={csvData}
            errors={errors}
            isPreviewMode={isPreviewMode}
          />
          <ResetButton onReset={handleReset} />
        </div>
      </form>
    </div>
  );
};

export default ImportCSV;
