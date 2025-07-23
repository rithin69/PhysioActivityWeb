import React, { useState } from 'react';
import { Calendar, FileText, Send, CheckCircle, AlertCircle } from 'lucide-react';

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
        setMessage('success');
        setDate('');
        setText('');
        setType('Assessment');
      } else {
        setMessage('error');
      }
    } catch (err) {
      setMessage('error');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Create Program Entry</h3>
        <p className="text-gray-600">Add assessments and recommendations for this patient.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            required
          >
            <option value="Assessment">Assessment</option>
            <option value="Recommendation">Recommendation</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
            placeholder="Enter your notes here..."
            required
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit
              </>
            )}
          </button>
        </div>

        {message && (
          <div className={`flex items-center p-3 rounded-lg ${
            message === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message === 'success' ? (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Successfully submitted!
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5 mr-2" />
                Submission failed. Please try again.
              </>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default ProgramsTab;
