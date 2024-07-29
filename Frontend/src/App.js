import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import Patients from './Patients';

// import Library from './Library';
import Connector from './Connector';
import Lab from './Lab';
import ProfileCreation from './Profilecreation';
import ProfilePage from './Profilepage';
// import Settings from './Settings';

const App = () => {
  return (
    <Router>
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-grow p-4 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/profile" element={<ProfileCreation />} />
            <Route path="/profilepage" element={<ProfilePage />} />
            <Route path="/connectors" element={<Connector />} />
            <Route path="/lab" element={<Lab />} />
            {/* <Route path="/settings" element={<Settings />} /> */}
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
