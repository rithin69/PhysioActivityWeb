import React, { useState,useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'; // Import hooks
import { setRole } from './redux/roleSlice'; // Import the action to set the role
import { ChevronDownIcon } from '@heroicons/react/solid'; // For the dropdown arrow icon
import SidePanel from './Sidepanel';
import {
  CogIcon,
  QuestionMarkCircleIcon,
  ChatAlt2Icon,
} from '@heroicons/react/solid'; // Correct icons imported

const Navbar = ({ isSidebarExpanded }) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown state
  const dispatch = useDispatch(); // Hook to dispatch actions
  const userRole = useSelector((state) => state.role.role); // Hook to access the current role from the Redux store
  // const userId = useSelector((state) => state.user.id); // Replace with your app's user ID selector

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const handleOpenPanel = () => {
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
  };

  const handleRoleSelect = (role) => {
    dispatch(setRole(role)); // Update the role in the Redux store
    setIsDropdownOpen(false); // Close the dropdown after selection
  };

  const redirectToFitbit = () => {
  //  const fitbitAuthUrl=`physioactivitybackend-gjb3dnbsgdcbgjfj.uksouth-01.azurewebsites.net\fitbit\auth`
  const fitbitAuthUrl = `https://www.fitbit.com/oauth2/authorize?client_id=23RQGB&response_type=code&code_challenge=iuI14a-HY3uhrVZxBHauT1EoYcBN1HoRWSjVl3_wAeA&code_challenge_method=S256&redirect_uri=${encodeURIComponent('https://physioactivity-master-bch8c8b5eyg9g3g2.uksouth-01.azurewebsites.net/')}&scope=activity%20heartrate%20location%20nutrition%20oxygen_saturation%20profile%20respiratory_rate%20settings%20sleep%20social%20temperature%20weight&state=897456`;

  window.location.href = fitbitAuthUrl;
  
   
    
  }
  const handleFitbitRedirect = () => {
    console.log("ghgh")
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
  
    if (code && state) {
      // Send the code and state to the backend
      fetch('https://physioactivitybackend-gjb3dnbsgdcbgjfj.uksouth-01.azurewebsites.net/fitbit/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, state }),
      })
        .then(response => response.json())
        .then(data => {
          console.log('Token exchange response:', data);
          // Handle the response (e.g., save tokens, redirect user, etc.)
        })
        .catch(error => {
          console.error('Error exchanging token:', error);
        });
    }
  };
  useEffect(() => {
    handleFitbitRedirect(); // Runs when the component mounts
  }, []); 
  

  return (
    
    <div
      className={`sticky top-0 z-50 bg-white flex items-center justify-between px-6 py-4 shadow-md transition-all duration-300 ${
        isSidebarExpanded ? 'ml-64' : 'ml-20'
      }`}
    >
      {console.log("hhhhhhhhhhhhhhhhh")}
      <div className="flex items-center">{/* Add a brand logo or name */}</div>

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

        {/* Connect to Fitbit Button */}
        {/* <button
          onClick={redirectToFitbit}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
        >
          Connect to Fitbit
        </button> */}

        {/* Role Dropdown */}
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none"
          >
            {userRole} {/* Display the current role */}
            <ChevronDownIcon
              className={`h-5 w-5 ml-2 transform ${
                isDropdownOpen ? 'rotate-180' : 'rotate-0'
              } transition-transform`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 shadow-lg rounded-md z-10">
              {[
                'Guest',
                'Patient',
                'Physio',
                'OT',
                'Personal Trainer',
                'Researcher',
                'Admin',
              ].map((role) => (
                <a
                  key={role}
                  href="#"
                  className="block px-4 py-2 text-gray-700 hover:bg-green-100"
                  onClick={() => handleRoleSelect(role)} // Update the role when clicked
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
