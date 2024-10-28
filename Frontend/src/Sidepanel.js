// SidePanel.js
import React from 'react';

const SidePanel = ({ isOpen, onClose }) => {
    console.log("sadasd")
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
        <h2 className="text-xl font-bold mb-4">Give Feedback</h2>
        <p className="text-gray-700 mb-4">Thank you for taking the time to give us feedback.</p>
        <div className="bg-blue-100 p-3 rounded-md mb-4">
          <p className="text-blue-700">
            <strong>ℹ️ If you need help, please contact support.</strong>
          </p>
        </div>
        <label className="text-gray-800 font-semibold mb-2">Are you satisfied with your experience?</label>
        <div className="flex space-x-4 mt-4">
          <button className="text-2xl">😊</button>
          <button className="text-2xl">😐</button>
          <button className="text-2xl">☹️</button>
        </div>
      </div>
    </div>
  );
};

export default SidePanel;
