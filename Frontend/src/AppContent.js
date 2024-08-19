// AppContent.js
import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Patients from './Patients';
import Connector from './Connector';
import Lab from './Lab';
import ProfileCreation from './Profilecreation';
import ProfilePage from './Profilepage';
import Login from './Login';
import { useRole } from './RoleContext';
import Dashboard from './Dashboard';
import Settings from './Settings';
import SiriAdPage from './SiriAdPage';

const AppContent = () => {
  const location = useLocation();
  const { role } = useRole();
  const showSidebar = location.pathname !== '/' && location.pathname !== "/physio/siri" ;

  const baseUrl = `/${role}`;
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
    <div className="flex h-screen">
      {showSidebar && <Sidebar />}
      <main className="flex-grow p-4 overflow-auto">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/physio/siri" element={<SiriAdPage/>} />

          <Route path={`${baseUrl}/dashboard`} element={<Dashboard data={mockData} />} />
          <Route path={`${baseUrl}/patients`} element={<Patients />} />
          <Route path={`${baseUrl}/profilepage`} element={<ProfilePage />} />
          <Route path={`${baseUrl}/profile`} element={<ProfileCreation />} />
          
          <Route path={`${baseUrl}/connectors`} element={<Connector />} />
          <Route path={`${baseUrl}/lab`} element={<Lab />} />
          <Route path={`${baseUrl}/settings`} element={<Settings />} />

        </Routes>
      </main>
    </div>
  );
};

export default AppContent;
