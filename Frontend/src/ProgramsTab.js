import React, { useState } from "react";

const ProgramsTab = ({ powerAutomateUrl }) => {
  // userId is hardcoded as "100001"
  const userId = "100001";

  const [date, setDate] = useState("");
  const [type, setType] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError("");
    try {
      const response = await fetch(powerAutomateUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          date,
          type,
          text,
        }),
      });
      if (!response.ok) throw new Error("Failed to save to SharePoint");
      setSuccess(true);
      setDate("");
      setType("");
      setText("");
      setTimeout(() => setSuccess(false), 3000); // Hide success after 3s
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white rounded-xl shadow p-6 space-y-4"
    >
      <div>
        <label className="block mb-1 font-medium">Date</label>
        <input
          type="date"
          className="border border-gray-300 rounded px-3 py-2 w-full"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          disabled={loading}
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Type</label>
        <select
          className="border border-gray-300 rounded px-3 py-2 w-full"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
          disabled={loading}
        >
          <option value="">Select type</option>
          <option value="Recommendation">Recommendation</option>
          <option value="Question">Question</option>
        </select>
      </div>
      {type && (
        <div>
          <label className="block mb-1 font-medium">{type} Details</label>
          <textarea
            className="border border-gray-300 rounded px-3 py-2 w-full"
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            disabled={loading}
          />
        </div>
      )}
      <button
        type="submit"
        className={`bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700 transition-colors ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
      {success && (
        <div className="text-green-600 mt-2">Saved successfully!</div>
      )}
      {error && (
        <div className="text-red-600 mt-2">{error}</div>
      )}
    </form>
  );
};

export default ProgramsTab;
