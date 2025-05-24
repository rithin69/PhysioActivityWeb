import React, { useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import Patients from './Patients';
import Connector from './Connector';
import Lab from './Lab';
import ProfileEditor from './ProfileEditor';
import Dashboard from './Dashboard';
import Settings from './Settings';
import SiriAdPage from './SiriAdPage';
import Patientdashboard from './Patientdashboard';
import Navbar from './Navbar';
import Exercise from './Exercise';
import ScrollToTop from './ScrollToTop';
import Otherprofidashboard from './Otherprofidashboard';
import PhysioDashboard from './PhysioDashboard';
import ProfileViewer from './ProfileViewer';

const AppContent = () => {
  const location = useLocation();
  const userRole = useSelector((state) => state.role.role);

  // Determine if the current route is exactly "/profile/:id"
  const isProfileViewer = /^\/profile\/[^/]+$/.test(location.pathname);

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const mockData = {
    weekDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    totalSteps: 70000,
    avgSteps: 10000,
    stepsComparison: '2000 steps more than last week',
    totalFloors: 50,
    totalDistance: 35,
    totalCalories: 2000,
    totalActiveMinutes: 300,
    avgSleepDuration: '7 hrs',
    avgStepsPerDay: 10000,
    avgRestingHeartRate: 60,
    weight: 70,
  };

  const getDashboardComponent = () => {
    switch (userRole) {
      case 'Guest':
        return <Dashboard data={mockData} />;
      case 'Physio':
        return <PhysioDashboard data={mockData} />;
      case 'OT':
      case 'Personal Trainer':
      case 'Researcher':
      case 'Admin':
      case 'Patient':
        return <Otherprofidashboard data={mockData} />;
      default:
        return <Dashboard data={mockData} />;
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar - hide on profile viewer */}
      {!isProfileViewer && <Navbar isSidebarExpanded={isSidebarExpanded} />}

      <div className="flex flex-grow h-full">
        {/* Sidebar - hide on profile viewer */}
        {!isProfileViewer && (
          <div
            className={`h-full transition-all duration-300 ${
              isSidebarExpanded ? 'w-64' : 'w-20'
            } bg-gray-800`}
          >
            <Sidebar
              isExpanded={isSidebarExpanded}
              setIsExpanded={setIsSidebarExpanded}
            />
          </div>
        )}

        {/* Main Content */}
        <main
          className={`flex-grow transition-all duration-300 ${
            !isProfileViewer && isSidebarExpanded ? 'ml-64' : ''
          } bg-gray-100`}
        >
          <ScrollToTop />
          <Routes>
            <Route path="/physio/siri" element={<SiriAdPage />} />
            <Route path="/Patientdashboard" element={<Patientdashboard />} />
            <Route path="/" element={getDashboardComponent()} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/profilee" element={<ProfileEditor />} />
            <Route path="/connectors" element={<Connector />} />
            <Route path="/lab" element={<Lab />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/exercise" element={<Exercise />} />
            <Route path="/profile/:id" element={<ProfileViewer />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AppContent;
