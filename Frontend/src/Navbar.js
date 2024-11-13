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
    <div className="bg-white flex items-center justify-between px-6 py-4 shadow-md">
      {/* Right Section with Buttons */}
      <div className="flex items-center space-x-4 ml-auto">
        {/* Sign In Button */}
        <button className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200">
          Sign In
        </button>
        
        {/* Feedback Button */}
        <button 
          onClick={handleOpenPanel} 
          className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-200"
        >
          Feedback
        </button>
      </div>

      {/* Side Panel */}
      <SidePanel isOpen={isPanelOpen} onClose={handleClosePanel} />
    </div>
  );
};

export default Navbar;
