import React, { useState } from 'react';

const ProgramsTab = ({ userId }) => {
  const [date, setDate] = useState('');
  const [type, setType] = useState('Assessment');
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    const payload = {
      userId,
      date,
      type,
      text
    };

    try {
      const response = await fetch(
        'https://prod-38.uksouth.logic.azure.com:443/workflows/1ff55ae4f3fd4fdd99a441b96321cb4f/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=2DEpLbR77vs3qhojeFAYNCtMB4Q4G3_cYwQFf8SG_Uw',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
      );

      if (response.ok) {
        setMessage('✅ Submitted successfully!');
        setDate('');
        setText('');
        setType('Assessment');
      } else {
        setMessage('❌ Submission failed. Please try again.');
      }
    } catch (err) {
      setMessage('❌ Error submitting your program.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-teal-600 mb-6">Programs</h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl bg-white rounded-lg shadow-md p-6 space-y-6"
        autoComplete="off"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          {/* Use type="date" for the browser picker, placeholder not visible in most browsers for date inputs */}
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 text-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 text-lg"
            required
          >
            <option value="Assessment">Assessment</option>
            <option value="Recommendation">Recommendation</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Text</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            className="w-full border border-gray-300 rounded px-4 py-2 text-lg"
            placeholder="Write your notes here..."
            required
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-2 rounded-md text-lg font-semibold disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>

        {message && (
          <div className="pt-2 text-base font-medium text-teal-700">{message}</div>
        )}
      </form>
    </div>
  );
};

export default ProgramsTab;
