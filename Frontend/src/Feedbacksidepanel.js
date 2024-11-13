// SidePanel.js
import React from 'react';

const feedbacksidepanel = ({ isOpen, onClose, note1, setNote1, note2, setNote2, onSave }) => {
  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } z-20`}
    >
      <div className="p-4">
        <button className="text-gray-600 float-right text-xl" onClick={onClose}>
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4"> Notes</h2>
        
        {/* Textbox for Note 1 */}
        <label className="block text-gray-800 font-semibold mb-2">Prescriptions</label>
        <textarea
          className="w-full p-2 border rounded-md mb-4"
          rows="4"
          placeholder="Enter your first note here"
          value={note1}
          onChange={(e) => setNote1(e.target.value)}
        ></textarea>

        {/* Textbox for Note 2 */}
        <label className="block text-gray-800 font-semibold mb-2">Exercise</label>
        <textarea
          className="w-full p-2 border rounded-md mb-4"
          rows="4"
          placeholder="Enter your second note here"
          value={note2}
          onChange={(e) => setNote2(e.target.value)}
        ></textarea>

        {/* Save Button */}
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4 w-full"
          onClick={onSave}
        >
          Save Notes
        </button>
      </div>
    </div>
  );
};

export default feedbacksidepanel;
