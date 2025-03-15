import React from 'react';

const FeedbackSidePanel = ({ isOpen, onClose, note1, setNote1, note2, setNote2, onSave }) => {
  return (
    <div
      className={`fixed top-12 right-0 h-full w-80 bg-white shadow-lg transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } z-20`}
    >
      <div className="p-4">
        {/* Close Button */}
        <button className="text-gray-600 float-right text-xl" onClick={onClose}>
          &times;
        </button>

        <h2 className="text-xl font-bold mt-4">Notes</h2>

        {/* Observations Section */}
        <label className="block text-gray-800 font-semibold mb-2">Observations</label>
        <textarea
          className="w-full p-2 border rounded-md mb-4"
          rows="4"
          placeholder="Enter your first note here"
          value={note1}
          onChange={(e) => setNote1(e.target.value)}
        ></textarea>

        {/* Recommendations Section */}
        <label className="block text-gray-800 font-semibold mb-2">Recommendations</label>
        <textarea
          className="w-full p-2 border rounded-md mb-4"
          rows="4"
          placeholder="Enter your second note here"
          value={note2}
          onChange={(e) => setNote2(e.target.value)}
        ></textarea>

        {/* New AI Suggestions - Directly Below Recommendations */}
        <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">Suggestions</h3>
        <ul className="space-y-2">
          <li>
            <a 
              href="https://www.nhs.uk/conditions/rheumatoid-arthritis/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="block text-blue-600 hover:text-blue-800 transition font-medium"
            >
              🔍 Investigate RA symptoms
            </a>
          </li>
          <li>
            <a 
              href="https://www.nhs.uk/conditions/rheumatoid-arthritis/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="block text-blue-600 hover:text-blue-800 transition font-medium"
            >
              ✅ Check if pain is in both knees (symmetric)
            </a>
          </li>
          <li>
            <a 
              href="https://www.nhs.uk/conditions/rheumatoid-arthritis/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="block text-blue-600 hover:text-blue-800 transition font-medium"
            >
              🔎 Check if swelling ever occurred
            </a>
          </li>
        </ul>

        {/* Save Button */}
        <button className="bg-blue-500 text-white px-4 py-2 rounded mt-6 w-full" onClick={onSave}>
          Save Notes
        </button>
      </div>
    </div>
  );
};

export default FeedbackSidePanel;
