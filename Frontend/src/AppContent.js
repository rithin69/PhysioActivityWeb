import React, { useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
// ...other imports...
import Dashboard_v2 from './Dashboard_v2';
import PatientDetails from './PatientDetails';
import Navbar from './Navbar';
import Sidebar from "./Sidebar"
import Patientdashboard from './Patientdashboard';
// import Navbar from './Navbar';
import Patients from './Patients';
import Connector from './Connector';
import ProfileEditor from './ProfileEditor';
import ProfileViewer from './ProfileViewer';
import Monetization from './Monetization';
import Lab from './Lab';
import Dashboard from './Dashboard';
import Otherprofidashboard from './Otherprofidashboard';

import PhysioDashboard from './PhysioDashboard';
// import ProfileViewer from './ProfileViewer';
const AppContent = () => {
  const location = useLocation();
  const userRole = useSelector((state) => state.role.role);
  const isProfileViewer = /^\/profile\/[^/]+$/.test(location.pathname);

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(null); // <-- THIS IS THE FIX
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
  }

  return (
    <div className="flex flex-col h-screen">
      {!isProfileViewer && <Navbar isSidebarExpanded={isSidebarExpanded} />}
      <div className="flex flex-grow h-full">
        {!isProfileViewer && (
          <div
            className={`h-full transition-all duration-300 ${isSidebarExpanded ? 'w-64' : 'w-20'
              } bg-gray-800`}
          >
            <Sidebar
              isExpanded={isSidebarExpanded}
              setIsExpanded={setIsSidebarExpanded}
            />
          </div>
        )}
        <main
          className={`flex-grow transition-all duration-300 ${!isProfileViewer && isSidebarExpanded ? 'ml-64' : ''
            } bg-gray-100`}
        >
          <Routes>
            {/* <Route path="/physio/siri" element={<SiriAdPage />} /> */}
            <Route path="/Patientdashboard" element={<Patientdashboard />} />
            <Route path="/" element={getDashboardComponent()} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/profilee" element={<ProfileEditor />} />
            <Route path="/connectors" element={<Connector />} />
            <Route path="/monetization" element={<Monetization />} />
            <Route path="/lab" element={<Lab />} />
            {/* <Route path="/settings" element={<Settings />} /> */}
            {/* <Route path="/exercise" element={<Exercise />} /> */}
            <Route path="/profile/:id" element={<ProfileViewer />} />
            {/* ...other routes... */}
            <Route
              path="/Dashboard_v2"
              element={
                selectedPatientId
                  ? <PatientDetails userId={selectedPatientId} onBack={() => setSelectedPatientId(null)} />
                  : <Dashboard_v2 onPatientClick={setSelectedPatientId} />
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AppContent;
