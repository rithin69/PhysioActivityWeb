import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SidePanel from './Sidepanel';
import {
  CogIcon,
  QuestionMarkCircleIcon,
  ChatAlt2Icon,
} from '@heroicons/react/solid';

const Navbar = ({ isSidebarExpanded }) => {
  const dispatch = useDispatch();
  const userName = useSelector((state) => state.user.name) || "";

  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleOpenPanel = () => {
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
  };

  const handleFitbitRedirect = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');

    if (code && state) {
      fetch('https://physioactivitybackend2.azurewebsites.net/fitbit/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, state }),
      })
        .then(response => response.json())
        .then(data => {
          console.log('Token Exchange response:', data);
          // Handle the response (e.g., save tokens, redirect user, etc.)
          console.log('Token exchange response:', data);
        })
        .catch(error => {
          console.error('Error exchanging token:', error);
        });
    }
  };

  useEffect(() => {
    handleFitbitRedirect();
  }, []);

  const handleSignupRedirect = () => {
    window.location.href =
      'https://physioactivityuk.b2clogin.com/physioactivityuk.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1_Physioactivityauth&client_id=46873b53-0650-4ae0-bc87-a802c625a33f&nonce=defaultNonce&redirect_uri=https%3A%2F%2Fphysioactivity-release-gxhva6e5htafdbfk.germanywestcentral-01.azurewebsites.net%2Fb2c%2Fback&scope=openid&response_type=code&prompt=login&code_challenge_method=S256&code_challenge=60uPU5IZEIp1K0Vz7vi6XIjAFuTe_PLJsH_f9vIVp4E';
  };

  return (
    <div
      className={`sticky top-0 z-50 bg-white flex items-center justify-between px-6 py-4 shadow-md transition-all duration-300 ${isSidebarExpanded ? 'ml-64' : 'ml-20'
        }`}
    >
      <div className="flex items-center">{/* Brand/logo goes here */}</div>

      <div className="flex items-center space-x-4">
  {/* Only show Feedback and Settings when user is logged in */}
  {userName && (
    <>
      <ChatAlt2Icon
        className="h-6 w-6 text-gray-500 hover:text-gray-700 cursor-pointer"
        onClick={handleOpenPanel}
      />
      <CogIcon className="h-6 w-6 text-gray-500 hover:text-gray-700 cursor-pointer" />
    </>
  )}

  {/* Always show Help icon */}
  <QuestionMarkCircleIcon className="h-6 w-6 text-gray-500 hover:text-gray-700 cursor-pointer" />

  {/* Show user name or Sign Up button */}
  {userName ? (
    <div className="bg-green-500 text-white px-4 py-2 rounded-md font-semibold">
      {userName}
    </div>
  ) : (
    <button
      onClick={handleSignupRedirect}
      className="bg-green-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-600 transition"
    >
      Sign Up
    </button>
  )}
</div>






      <SidePanel isOpen={isPanelOpen} onClose={handleClosePanel} />
    </div>
  );
};

export default Navbar;