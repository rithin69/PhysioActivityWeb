import React, { useEffect, useState, useMemo } from "react";

// Helper: Convert Excel serial date to yyyy-mm-dd
function excelSerialDateToISO(serial) {
  if (!serial) return '';
  const date = new Date(Math.round((serial - 25569) * 86400 * 1000));
  return date.toISOString().slice(0, 10);
}

const POWER_AUTOMATE_URL =
  "https://prod-52.uksouth.logic.azure.com:443/workflows/8b8b2803c6584b8f8d33c5a1168e8adf/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=2simhHaA_7klSYNhPhJqY9_OBT97gjbc4WEdnuf0kwE";

const AllCharges = () => {
  const [charges, setCharges] = useState([]);
  const [selectedTableStatusFilter, setSelectedTableStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCharges() {
      setLoading(true);
      setError("");
      try {
        // POST request to your Power Automate URL
        const response = await fetch(POWER_AUTOMATE_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: "100001" }) // Adjust userId as needed
        });

        const data = await response.json();

        // If response is an array, use it directly; if it's a single object, wrap it in an array
        let items = [];
        if (Array.isArray(data)) {
          items = data;
        } else if (data.value && Array.isArray(data.value)) {
          items = data.value;
        } else if (typeof data === "object") {
          items = [data];
        }

        setCharges(items);
      } catch (e) {
        setError("Failed to fetch charges.");
        setCharges([]);
      }
      setLoading(false);
    }
    fetchCharges();
  }, []);

  // Status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Successful":
        return "bg-green-100 text-green-800";
      case "Failed":
        return "bg-red-100 text-red-800";
      case "Processing":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Filter by status
  const tableFilteredCharges = useMemo(() => {
    return charges.filter((charge) => {
      const statusMatch =
        !selectedTableStatusFilter ||
        (charge.Status || charge.status) === selectedTableStatusFilter;
      return statusMatch;
    });
  }, [charges, selectedTableStatusFilter]);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-16">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-[#4cb6c3]">All Charges</h3>
        <div className="w-48">
          <label
            htmlFor="tableStatusFilter"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Filter by Status
          </label>
          <select
            id="tableStatusFilter"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#4cb6c3] focus:border-[#4cb6c3]"
            value={selectedTableStatusFilter}
            onChange={(e) => setSelectedTableStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Successful">Successful</option>
            <option value="Failed">Failed</option>
            <option value="Processing">Processing</option>
          </select>
        </div>
      </div>
      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : tableFilteredCharges.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tableFilteredCharges.map((charge, idx) => (
                <tr key={charge.ID || charge.id || idx}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {excelSerialDateToISO(charge.dateCreated || charge.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-normal text-sm text-gray-700">
                    {charge.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        charge.Status || charge.status
                      )}`}
                    >
                      {charge.Status || charge.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">
                    ${Number(charge.amount).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600">No charges match the selected filters.</p>
      )}
    </div>
  );
};

export default AllCharges;
