import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faUserFriends, faUser, faBook, faPlug, faFlask, faCogs } from '@fortawesome/free-solid-svg-icons';
import { useRole } from './RoleContext';

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { role } = useRole();

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const baseUrl = `/${role}`;

  return (
    <aside className={`bg-[#4db6c3] h-screen p-4 flex flex-col items-center transition-all duration-300 ${isExpanded ? 'w-64' : 'w-20'}`}>
      <div className="mb-4 cursor-pointer" onClick={toggleSidebar}>
        <img
          src={isExpanded ? "/images/logo.png" : "/images/logo.png"}
          alt="Logo"
          className={`rounded-full transition-all duration-300 ${isExpanded ? 'w-24 h-24' : 'w-12 h-12'}`}
        />
      </div>
      {isExpanded && (
        <div className="text-white text-xl mb-8 transition-opacity duration-300">
          PhysioActivity
        </div>
      )}
      <nav className="flex flex-col w-full space-y-4">
        <NavLink
          to={`${baseUrl}/dashboard`}
          end
          className={({ isActive }) =>
            `text-white py-2 px-4 rounded flex items-center hover:bg-white hover:text-[#4db6c3] transition ${isActive ? 'active-link' : ''}`
          }
        >
          <FontAwesomeIcon icon={faTachometerAlt} className="mr-3" />
          <span className={`${isExpanded ? 'block' : 'hidden'}`}>Dashboard</span>
        </NavLink>

        <NavLink
          to={`${baseUrl}/patients`}
          end
          className={({ isActive }) =>
            `text-white py-2 px-4 rounded flex items-center hover:bg-white hover:text-[#4db6c3] transition ${isActive ? 'active-link' : ''}`
          }
        >
          <FontAwesomeIcon icon={faUserFriends} className="mr-3" />
          <span className={`${isExpanded ? 'block' : 'hidden'}`}>Patients</span>
        </NavLink>

        <NavLink
          to={`${baseUrl}/profile`}
          end
          className={({ isActive }) =>
            `text-white py-2 px-4 rounded flex items-center hover:bg-white hover:text-[#4db6c3] transition ${isActive ? 'active-link' : ''}`
          }
        >
          <FontAwesomeIcon icon={faUser} className="mr-3" />
          <span className={`${isExpanded ? 'block' : 'hidden'}`}>Profile</span>
        </NavLink>
        <a
          href="http://51.89.139.42/"
          className="text-white py-2 px-4 rounded flex items-center hover:bg-white hover:text-[#4db6c3] transition"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon icon={faBook} className="mr-3" />
          <span className={`${isExpanded ? 'block' : 'hidden'}`}>Library</span>
        </a>
        <NavLink
          to={`${baseUrl}/connectors`}
          end
          className={({ isActive }) =>
            `text-white py-2 px-4 rounded flex items-center hover:bg-white hover:text-[#4db6c3] transition ${isActive ? 'active-link' : ''}`
          }
        >
          <FontAwesomeIcon icon={faPlug} className="mr-3" />
          <span className={`${isExpanded ? 'block' : 'hidden'}`}>Connectors</span>
        </NavLink>
        <NavLink 
          to={`${baseUrl}/lab`} 
          end
          className={({ isActive }) => 
            `text-white py-2 px-4 rounded flex items-center hover:bg-white hover:text-[#4db6c3] transition ${isActive ? 'active-link' : ''}`
          }
        >
          <FontAwesomeIcon icon={faFlask} className="mr-3" />
          <span className={`${isExpanded ? 'block' : 'hidden'}`}>Lab</span>
        </NavLink>
        <NavLink 
          to={`${baseUrl}/settings`} 
          end
          className={({ isActive }) => 
            `text-white py-2 px-4 rounded flex items-center hover:bg-white hover:text-[#4db6c3] transition ${isActive ? 'active-link' : ''}`
          }
        >
          <FontAwesomeIcon icon={faCogs} className="mr-3" />
          <span className={`${isExpanded ? 'block' : 'hidden'}`}>Settings</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
