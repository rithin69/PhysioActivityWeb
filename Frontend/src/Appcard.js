import React, { useState } from 'react';
import { FaPlug, FaUnlink } from 'react-icons/fa';

function AppCard({ name, icon }) {
  const [isConnected, setIsConnected] = useState(false);

  const handleButtonClick = () => {
    setIsConnected(!isConnected);
  };

  return (
    <div className="bg-gray-100 rounded-lg shadow-md p-8 flex flex-col items-center border-2 hover:shadow-lg hover:transform hover:scale-105 transition-all duration-300">
      <img src={icon} alt={name} className="w-16 h-16 mb-4" />
      <h2 className="text-lg font-semibold mb-2">{name}</h2>
      <button 
        onClick={handleButtonClick} 
        className={`py-1 px-4 rounded-md flex items-center space-x-2 ${
          isConnected ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
        } text-white`}
      >
        {isConnected ? <FaUnlink /> : <FaPlug />}
        <span>{isConnected ? 'Disconnect' : 'Connect'}</span>
      </button>
    </div>
  );
}

export default AppCard;
