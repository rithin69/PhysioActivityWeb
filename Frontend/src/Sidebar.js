import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faUserFriends, faUser, faBook, faPlug, faFlask, faCogs } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  return (
    <aside className="bg-[#4db6c3] h-screen p-4 flex flex-col items-center w-64">
      <div className="mb-8">
        <img src="/images/logo.png" alt="Logo" className="w-24 h-24 rounded-full" />
      </div>
      <nav className="flex flex-col w-full space-y-4">
      <NavLink
          exact
          to="/"
          className={({ isActive }) =>
            `text-white py-2 px-4 rounded flex items-center hover:bg-white hover:text-[#4db6c3] transition ${isActive ? 'active-link' : ''}`
          }
        >
          <FontAwesomeIcon icon={faTachometerAlt} className="mr-3" />
          Dashboard
        </NavLink>
        <NavLink
          to="/patients"
          className={({ isActive }) =>
            `text-white py-2 px-4 rounded flex items-center hover:bg-white hover:text-[#4db6c3] transition ${isActive ? 'active-link' : ''}`
          }
        >
          <FontAwesomeIcon icon={faUserFriends} className="mr-3" />
          Patients
        </NavLink>
        <NavLink
          to="/Profile"
          className={({ isActive }) =>
            `text-white py-2 px-4 rounded flex items-center hover:bg-white hover:text-[#4db6c3] transition ${isActive ? 'active-link' : ''}`
          }
        >
          <FontAwesomeIcon icon={faUser} className="mr-3" />
          Profile
        </NavLink>
        <NavLink
          to="/library"
          className={({ isActive }) =>
            `text-white py-2 px-4 rounded flex items-center hover:bg-white hover:text-[#4db6c3] transition ${isActive ? 'active-link' : ''}`
          }
        >
          <FontAwesomeIcon icon={faBook} className="mr-3" />
          Library
        </NavLink>
        <NavLink
          to="/Connectors"
          className={({ isActive }) =>
            `text-white py-2 px-4 rounded flex items-center hover:bg-white hover:text-[#4db6c3] transition ${isActive ? 'active-link' : ''}`
          }
        >
          <FontAwesomeIcon icon={faPlug} className="mr-3" />
          Connectors
        </NavLink>
        <NavLink 
          to="/lab" 
          className={({ isActive }) => 
            `text-white py-2 px-4 rounded flex items-center hover:bg-white hover:text-[#4db6c3] transition ${isActive ? 'active-link' : ''}`
          }
        >
          <FontAwesomeIcon icon={faFlask} className="mr-3" />
          Lab
        </NavLink>
        <NavLink 
          to="/settings" 
          className={({ isActive }) => 
            `text-white py-2 px-4 rounded flex items-center hover:bg-white hover:text-[#4db6c3] transition ${isActive ? 'active-link' : ''}`
          }
        >
          <FontAwesomeIcon icon={faCogs} className="mr-3" />
          Settings
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
