import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faChartLine, faBars, faCogs } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  return (
    <aside className="bg-[#4db6c3] h-screen p-4 flex flex-col items-center w-64">
    
      <div className="mb-8">
        <img src="/images/logo.png" alt="Logo" className="w-24 h-24 rounded-full" />
      </div>
   
      <nav className="flex flex-col w-full space-y-4">
        <NavLink exact to="/" activeclassname="active-link" className="text-white py-2 px-4 rounded flex items-center hover:bg-white hover:text-[#4db6c3] transition">
          <FontAwesomeIcon icon={faTachometerAlt} className="mr-3" />
          Dashboard
        </NavLink>
        <NavLink to="/analytics" activeclassname="active-link" className="text-white py-2 px-4 rounded flex items-center hover:bg-white hover:text-[#4db6c3] transition">
          <FontAwesomeIcon icon={faChartLine} className="mr-3" />
          Analytics
        </NavLink>
        <NavLink to="/menu3" activeclassname="active-link" className="text-white py-2 px-4 rounded flex items-center hover:bg-white hover:text-[#4db6c3] transition">
          <FontAwesomeIcon icon={faBars} className="mr-3" />
          NA1
        </NavLink>
        <NavLink to="/menu4" activeclassname="active-link" className="text-white py-2 px-4 rounded flex items-center hover:bg-white hover:text-[#4db6c3] transition">
          <FontAwesomeIcon icon={faCogs} className="mr-3" />
          NA2
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
