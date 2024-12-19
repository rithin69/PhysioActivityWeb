import React, { useState } from 'react';
import { CogIcon, QuestionMarkCircleIcon, ChatAlt2Icon } from '@heroicons/react/solid'; // Correct icons imported
import { ChevronDownIcon } from '@heroicons/react/solid'; // For the dropdown arrow icon
import SidePanel from './Sidepanel'; // Ensure you have a SidePanel component

const Navbar = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown state

  const handleOpenPanel = () => {
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="sticky top-0 z-50 bg-white flex items-center justify-between px-6 py-4 shadow-md">
      {/* Left Section (You can add a logo or other content here) */}
      <div className="flex items-center">
        {/* Add a brand logo or name */}
        {/* <h1 className="text-lg font-bold">Your Logo</h1> */}
      </div>

      {/* Right Section with Icons */}
      <div className="flex items-center space-x-4">
        {/* Feedback (Chat Bubble) Icon */}
        <ChatAlt2Icon
          className="h-6 w-6 text-gray-500 hover:text-gray-700 cursor-pointer"
          onClick={handleOpenPanel} // Open the side panel on click
        />

        {/* Settings (Cog) Icon */}
        <CogIcon className="h-6 w-6 text-gray-500 hover:text-gray-700 cursor-pointer" />

        {/* Help (Question Mark) Icon */}
        <QuestionMarkCircleIcon className="h-6 w-6 text-gray-500 hover:text-gray-700 cursor-pointer" />

        {/* Dropdown Button with Arrow */}
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none"
          >
            Sign In
            {/* Downward Arrow */}
            <ChevronDownIcon
              className={`h-5 w-5 ml-2 transform ${
                isDropdownOpen ? 'rotate-180' : 'rotate-0'
              } transition-transform`}
            />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 shadow-lg rounded-md z-10">
              <a
                href="#"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Physio
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Patient
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Surgeon
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Side Panel */}
      <SidePanel isOpen={isPanelOpen} onClose={handleClosePanel} />
    </div>
  );
};

export default Navbar;
