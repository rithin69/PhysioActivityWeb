import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTachometerAlt,
  faUserFriends,
  faUser,
  faBook,
  faPlug,
  faFlask,
  faUserShield,
  faBullseye,
  faChartLine // 👈 Add this icon for Dashboard_v2 (or choose another icon)
} from '@fortawesome/free-solid-svg-icons';

const Sidebar = ({ isExpanded, setIsExpanded }) => {
  const location = useLocation();
  const isAdmin = useSelector((state) => state.user.isAdmin);
  const navpanel = useSelector((state) => state.user.navpanel) || "";

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const getSidebarLinks = () => {
    const allLinks = {
      Dashboard: { to: '/', label: 'Dashboard', icon: faTachometerAlt },
      'Dashboard V2': { to: '/Dashboard_v2', label: 'Dashboard V2', icon: faTachometerAlt }, // 👈 Add this line
      Patients: { to: '/Patientdashboard', label: 'Patients', icon: faUserFriends },
      'My Page': { to: '/profilee', label: 'My Page', icon: faUser },
      Library: { to: '/exercise', label: 'Library', icon: faBook },
      Connect: { to: '/connectors', label: 'Connect', icon: faPlug },
      'Research Labs': { to: '/lab', label: 'Research Labs', icon: faFlask },
      'Goals and Plans': { to: '/goals-plans', label: 'Goals and Plans', icon: faBullseye },
    };

    if (!navpanel || navpanel.trim() === '') {
      return [allLinks['Dashboard']]; // Only show Dashboard if navpanel is empty
    }

    const allowedPanels = navpanel
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    return allowedPanels.map((key) => allLinks[key]).filter(Boolean);
  };

  const sidebarLinks = getSidebarLinks();

  if (isAdmin) {
    sidebarLinks.push({
      to: '/admin',
      label: 'Admin',
      icon: faUserShield,
    });
  }

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
          className={`rounded-full transition-all duration-300 ${
            isExpanded ? 'w-24 h-24' : 'w-12 h-12'
          }`}
        />
      </div>
      {isExpanded && (
        <div className="text-white text-xl mb-8 text-center transition-opacity duration-300">
          PhysioActivity
        </div>
      )}
      <nav className="flex flex-col w-full space-y-4">
        {sidebarLinks.map(({ to, label, icon }) => {
          return (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => {
                const highlightDashboard =
                  to === '/' && (location.pathname === '/' || location.pathname.startsWith('/myprofile'));

                const active = isActive || highlightDashboard;

                return `text-white py-2 px-4 rounded flex items-center hover:bg-white hover:text-[#4db6c3] transition ${
                  active ? 'active-link bg-white text-[#4db6c3]' : ''
                }`;
              }}
            >
              <FontAwesomeIcon icon={icon} className="mr-3" />
              <span className={`${isExpanded ? 'block' : 'hidden'}`}>{label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
