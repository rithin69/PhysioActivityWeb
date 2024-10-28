// Navbar.js
import React, { useState } from 'react';
import SidePanel from './Sidepanel';

const Navbar = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleOpenPanel = () => {
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
  };

  return (
    <div className="bg-[#0e7490] flex items-center justify-between px-6 py-6 text-white shadow-md">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <span className="font-bold text-xl">PhysioActivity</span>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-6">
        <button className="hover:text-gray-200 transition-colors duration-200">Sign In</button>
        {/* Attach handleOpenPanel to Feedback button */}
        <button onClick={handleOpenPanel} className="hover:text-gray-200 transition-colors duration-200">
          Feedback
        </button>
      </div>

      {/* Side Panel */}
      <SidePanel isOpen={isPanelOpen} onClose={handleClosePanel} />
    </div>
  );
};

export default Navbar;
