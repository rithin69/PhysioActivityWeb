import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faUserFriends, faUser, faBook, faPlug, faFlask } from '@fortawesome/free-solid-svg-icons';

const Sidebar = ({ isExpanded, setIsExpanded }) => {
  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <aside
      className={`bg-[#4db6c3] fixed top-0 left-0 h-screen p-4 flex flex-col transition-all duration-300 ${
        isExpanded ? 'w-64' : 'w-20'
      }`}
    >
      <div className="mb-4 cursor-pointer flex justify-center" onClick={toggleSidebar}>
        <img
          src="/images/logo.png"
          alt="Logo"
          className={`rounded-full transition-all duration-300 ${isExpanded ? 'w-24 h-24' : 'w-12 h-12'}`}
        />
      </div>
      {isExpanded && (
        <div className="text-white text-xl mb-8 text-center transition-opacity duration-300">
          PhysioActivity
        </div>
      )}
      <nav className="flex flex-col w-full space-y-4">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `text-white py-2 px-4 rounded flex items-center hover:bg-white hover:text-[#4db6c3] transition ${
              isActive ? 'active-link bg-white text-[#4db6c3]' : ''
            }`
          }
        >
          <FontAwesomeIcon icon={faTachometerAlt} className="mr-3" />
          <span className={`${isExpanded ? 'block' : 'hidden'}`}>Dashboard</span>
        </NavLink>

        <NavLink
          to="/Patientdashboard"
          end
          className={({ isActive }) =>
            `text-white py-2 px-4 rounded flex items-center hover:bg-white hover:text-[#4db6c3] transition ${
              isActive ? 'active-link bg-white text-[#4db6c3]' : ''
            }`
          }
        >
          <FontAwesomeIcon icon={faUserFriends} className="mr-3" />
          <span className={`${isExpanded ? 'block' : 'hidden'}`}>Patients</span>
        </NavLink>

        <NavLink
          to="/profile"
          end
          className={({ isActive }) =>
            `text-white py-2 px-4 rounded flex items-center hover:bg-white hover:text-[#4db6c3] transition ${
              isActive ? 'active-link bg-white text-[#4db6c3]' : ''
            }`
          }
        >
          <FontAwesomeIcon icon={faUser} className="mr-3" />
          <span className={`${isExpanded ? 'block' : 'hidden'}`}>My Page</span>
        </NavLink>

        <NavLink
          to="/exercise"
          end
          className={({ isActive }) =>
            `text-white py-2 px-4 rounded flex items-center hover:bg-white hover:text-[#4db6c3] transition ${
              isActive ? 'active-link bg-white text-[#4db6c3]' : ''
            }`
          }
        >
          <FontAwesomeIcon icon={faBook} className="mr-3" />
          <span className={`${isExpanded ? 'block' : 'hidden'}`}>Library</span>
        </NavLink>

        <NavLink
          to="/connectors"
          end
          className={({ isActive }) =>
            `text-white py-2 px-4 rounded flex items-center hover:bg-white hover:text-[#4db6c3] transition ${
              isActive ? 'active-link bg-white text-[#4db6c3]' : ''
            }`
          }
        >
          <FontAwesomeIcon icon={faPlug} className="mr-3" />
          <span className={`${isExpanded ? 'block' : 'hidden'}`}>Connect</span>
        </NavLink>

        <NavLink
          to="/lab"
          end
          className={({ isActive }) =>
            `text-white py-2 px-4 rounded flex items-center hover:bg-white hover:text-[#4db6c3] transition ${
              isActive ? 'active-link bg-white text-[#4db6c3]' : ''
            }`
          }
        >
          <FontAwesomeIcon icon={faFlask} className="mr-3" />
          <span className={`${isExpanded ? 'block' : 'hidden'}`}>Research Labs</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
