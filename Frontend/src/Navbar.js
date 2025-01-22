import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';  // Import hooks
import { setRole } from './redux/roleSlice';  // Import the action to set the role
import { ChevronDownIcon } from '@heroicons/react/solid';  // For the dropdown arrow icon
import SidePanel from './Sidepanel';

const Navbar = ({ isSidebarExpanded }) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);  // Dropdown state
  const dispatch = useDispatch();  // Hook to dispatch actions
  const userRole = useSelector((state) => state.role.role);  // Hook to access the current role from the Redux store

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
  };

  const handleRoleSelect = (role) => {
    dispatch(setRole(role));  // Update the role in the Redux store
    setIsDropdownOpen(false);  // Close the dropdown after selection
  };

  return (
    <div
      className={`sticky top-0 z-50 bg-white flex items-center justify-between px-6 py-4 shadow-md transition-all duration-300 ${
        isSidebarExpanded ? 'ml-64' : 'ml-20'
      }`}
    >
      <div className="flex items-center">
        {/* Add a brand logo or name */}
      </div>

      <div className="flex items-center space-x-4">
        {/* Role Dropdown */}
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none"
          >
            {userRole}  {/* Display the current role */}
            <ChevronDownIcon
              className={`h-5 w-5 ml-2 transform ${
                isDropdownOpen ? 'rotate-180' : 'rotate-0'
              } transition-transform`}
            />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 shadow-lg rounded-md z-10">
              {['Guest', 'Patient', 'Physio', 'OT', 'Personal Trainer', 'Researcher', 'Admin'].map((role) => (
                <a
                  key={role}
                  href="#"
                  className="block px-4 py-2 text-gray-700 hover:bg-green-100"
                  onClick={() => handleRoleSelect(role)}  // Update the role when clicked
                >
                  {role}
                </a>
              ))}
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
