import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faUserFriends, faUser, faBook, faPlug, faFlask, faCogs } from '@fortawesome/free-solid-svg-icons';
// import { useRole } from './RoleContext';

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  // const { role } = useRole();

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  // const baseUrl = `/${role}`;

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
          to="/"
          end
          className={({ isActive }) =>
            `text-white py-2 px-4 rounded flex items-center hover:bg-white hover:text-[#4db6c3] transition ${isActive ? 'active-link' : ''}`
          }
        >
          <FontAwesomeIcon icon={faTachometerAlt} className="mr-3" />
          <span className={`${isExpanded ? 'block' : 'hidden'}`}>Dashboard</span>
        </NavLink>

        <NavLink
          to="/Patientdashboard"
          end
          className={({ isActive }) =>
            `text-white py-2 px-4 rounded flex items-center hover:bg-white hover:text-[#4db6c3] transition ${isActive ? 'active-link' : ''}`
          }
        >
          <FontAwesomeIcon icon={faUserFriends} className="mr-3" />
          <span className={`${isExpanded ? 'block' : 'hidden'}`}> Patients</span>
        </NavLink>

        <NavLink
          to="/profile"
          end
          className={({ isActive }) =>
            `text-white py-2 px-4 rounded flex items-center hover:bg-white hover:text-[#4db6c3] transition ${isActive ? 'active-link' : ''}`
          }
        >
          <FontAwesomeIcon icon={faUser} className="mr-3" />
          <span className={`${isExpanded ? 'block' : 'hidden'}`}>My Page</span>



        </NavLink>

        <NavLink
          to="/exercise"
          end
          className={({ isActive }) =>
            `text-white py-2 px-4 rounded flex items-center hover:bg-white hover:text-[#4db6c3] transition ${isActive ? 'active-link' : ''}`
          }
        >

          <FontAwesomeIcon icon={faBook} className="mr-3" />
          <span className={`${isExpanded ? 'block' : 'hidden'}`}>Library</span>
        </NavLink>

        <NavLink
          to="/connectors"
          end
          className={({ isActive }) =>
            `text-white py-2 px-4 rounded flex items-center hover:bg-white hover:text-[#4db6c3] transition ${isActive ? 'active-link' : ''}`
          }
        >
          <FontAwesomeIcon icon={faPlug} className="mr-3" />
          <span className={`${isExpanded ? 'block' : 'hidden'}`}>Connect</span>
        </NavLink>


        <NavLink
          to="/lab"
          end
          className={({ isActive }) =>
            `text-white py-2 px-4 rounded flex items-center hover:bg-white hover:text-[#4db6c3] transition ${isActive ? 'active-link' : ''}`
          }
        >
          <FontAwesomeIcon icon={faFlask} className="mr-3" />
          <span className={`${isExpanded ? 'block' : 'hidden'}`}>Research Labs</span>
        </NavLink>
        {/* <NavLink 
          to="/settings"
          end
          className={({ isActive }) => 
            `text-white py-2 px-4 rounded flex items-center hover:bg-white hover:text-[#4db6c3] transition ${isActive ? 'active-link' : ''}`
          }
        >
          <FontAwesomeIcon icon={faCogs} className="mr-3" />
          <span className={`${isExpanded ? 'block' : 'hidden'}`}>Configure Settings</span>
        </NavLink> */}
      </nav>
    </aside>
  );
};

export default Sidebar;
