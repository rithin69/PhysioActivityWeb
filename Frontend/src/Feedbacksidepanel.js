import React from 'react';

const FeedbackSidePanel = ({
  isOpen,
  onClose,
  note1,
  setNote1,
  note2,
  setNote2,
  onSave,
  images
}) => {
  return (
    <div
      className={`fixed top-10 right-0 h-[calc(100%-2.5rem)] w-96 bg-white shadow-2xl transition-transform duration-300 z-30 border-l border-gray-200 
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      {/* Full-height flex container */}
      <div className="h-full flex flex-col">
        {/* Header (Fixed at Top) */}
        <div className="sticky top-0 bg-white z-40 flex justify-between items-center px-6 py-4 border-b border-gray-200 shadow-md">
          <h2 className="text-2xl font-bold text-gray-900"> 📝 Notes</h2>
          <button 
            onClick={onClose} 
            className="text-red-600 hover:text-red-900 text-xl font-bold"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Observations Section */}
          <div className="mb-6">
            <label className="block text-xl font-bold text-gray-900 mb-2 ">
🔎 Observations</label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows="4"
              placeholder="Enter observations here..."
              value={note1}
              onChange={(e) => setNote1(e.target.value)}
            ></textarea>
          </div>

          {/* Recommendations Section */}
          <div className="mb-6">
            <label className="block text-xl font-bold text-gray-900 mb-2 ">

📢 Recommendations</label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows="4"
              placeholder="Enter recommendations here..."
              value={note2}
              onChange={(e) => setNote2(e.target.value)}
            ></textarea>
          </div>

          {/* Suggestions Section with Images */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
💡 Suggestions</h3>
            <div className="grid grid-cols-2 gap-6">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="border-2 border-gray-300 rounded-lg overflow-hidden 
                    hover:border-blue-500 hover:scale-105 hover:shadow-xl 
                    transition-transform duration-300 p-3"
                >
                  <img 
                    src={image} 
                    alt={`suggestion-${index}`} 
                    className="w-48 h-48 object-contain rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Hyperlinked Suggestions */}
          <div className="mt-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">🌐 Additional Resources</h3>

            <ul className="space-y-3">
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
              <li>
                <a
                  href="https://www.nhs.uk/conditions/rheumatoid-arthritis/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:text-blue-800 transition font-medium"
                >
                  🩸 Recommend Blood test for RA
                </a>
              </li>
              <li>
                <a
                  href="https://www.nhs.uk/conditions/rheumatoid-arthritis/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:text-blue-800 transition font-medium"
                >
                  📌 Signpost to RA specialist
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Save Button (Fixed at Bottom) */}
        <div className="p-2 border-t border-gray-200 bg-white">
          <button
            className="bg-blue-500 text-white px-6 py-3 rounded-lg w-full font-semibold shadow-lg hover:bg-blue-600 transition"
            onClick={onSave}
          >
            Save Notes
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackSidePanel;
