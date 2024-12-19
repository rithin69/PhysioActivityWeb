import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Patients from './Patients';
import Connector from './Connector';
import Lab from './Lab';
import ProfileCreation from './Profilecreation';
import ProfilePage from './Profilepage';
import Login from './Login';
import Dashboard from './Dashboard';
import Settings from './Settings';
import SiriAdPage from './SiriAdPage';
import Patientdashboard from "./Patientdashboard"
import Navbar from './Navbar';
import Exercise from './Exercise';
import ScrollToTop from './ScrollToTop';
import CleanProfile from './CleanProfile';

const AppContent = () => {
  const location = useLocation();

  // Determine if current route is clean profile
  const isCleanProfile = location.pathname.startsWith('/cleanprofile/');

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

  return (
    <div className="flex flex-col h-screen">
      {/* Conditionally render Navbar */}
      {!isCleanProfile && <Navbar />}

      <div className="flex flex-grow h-screen">
        {/* Conditionally render Sidebar */}
        {!isCleanProfile && <Sidebar className="h-full" />}

        <main className="flex-grow overflow-auto">
          <ScrollToTop />
          <Routes>
            <Route path="/physio/siri" element={<SiriAdPage />} />
            <Route path="/Patientdashboard" element={<Patientdashboard />} />
            <Route path="/" element={<Dashboard data={mockData} />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/profilepage/:id" element={<ProfilePage />} />
            <Route path="/cleanprofile/:id" element={<CleanProfile />} />
            <Route path="/profile" element={<ProfileCreation />} />
            <Route path="/connectors" element={<Connector />} />
            <Route path="/lab" element={<Lab />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/exercise" element={<Exercise />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AppContent;
