import React from 'react';
import { useSelector } from 'react-redux';  // Import the hook to access the role
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faUserFriends, faUser, faBook, faPlug, faFlask,faDollarSign } from '@fortawesome/free-solid-svg-icons';

const Sidebar = ({ isExpanded, setIsExpanded }) => {
  const userRole = useSelector((state) => state.role.role);  // Access the current role from the Redux store

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const getSidebarLinks = () => {
    switch (userRole) {
      case 'Admin':
        return [
          { to: '/', label: 'Dashboard', icon: faTachometerAlt },
          { to: '/Patientdashboard', label: 'Patients', icon: faUserFriends },
          { to: '/profilee', label: 'My Page', icon: faUser },
          { to: '/exercise', label: 'Library', icon: faBook },
          { to: '/connectors', label: 'Connect', icon: faPlug },
          { to: '/lab', label: 'Research Labs', icon: faFlask },
          { to: '/monetization', label: 'Monetization', icon: faDollarSign  },
          { to: '/dashboard_v2', label: 'dashboard_v2', icon: faTachometerAlt  },
        ];
      case 'Researcher':
        return [
          { to: '/', label: 'Dashboard', icon: faTachometerAlt },
          { to: '/Patientdashboard', label: 'Schedule', icon: faUserFriends },
          { to: '/profilee', label: 'Goals & Plans', icon: faUser },
          { to: '/exercise', label: 'Library', icon: faBook },
          { to: '/connectors', label: 'Reports', icon: faPlug },
          { to: '/lab', label: 'Research Labs', icon: faFlask },
     
        ];
      case 'Physio':
        return [
          { to: '/', label: 'Dashboard', icon: faTachometerAlt },
          { to: '/Patientdashboard', label: 'Patients', icon: faUserFriends },
          { to: '/profilee', label: 'My Page', icon: faUser },
          { to: '/exercise', label: 'Library', icon: faBook },
          { to: '/connectors', label: 'Connect', icon: faPlug },
        ];
      case 'Guest':
      case 'Patient':
      case 'OT':
      case 'Personal Trainer':
        return [
          { to: '/', label: 'Dashboard', icon: faTachometerAlt },
          
        ];
      default:
        return [
          { to: '/', label: 'Dashboard', icon: faTachometerAlt },
        ];
    }
  };

  const sidebarLinks = getSidebarLinks();

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
        {sidebarLinks.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              `text-white py-2 px-4 rounded flex items-center hover:bg-white hover:text-[#4db6c3] transition ${
                isActive ? 'active-link bg-white text-[#4db6c3]' : ''
              }`
            }
          >
            <FontAwesomeIcon icon={icon} className="mr-3" />
            <span className={`${isExpanded ? 'block' : 'hidden'}`}>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
