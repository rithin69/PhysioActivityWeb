import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
// import Patients from './Patients';
// import Profile from './Profile';
// import Library from './Library';
// import Connectors from './Connectors';
import Lab from './Lab';
// import Settings from './Settings';

const App = () => {
  return (
    <Router>
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-grow p-4 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            {/* <Route path="/patients" element={<Patients />} /> */}
            {/* <Route path="/profile" element={<Profile />} /> */}
            {/* <Route path="/library" element={<Library />} /> */}
            {/* <Route path="/connectors" element={<Connectors />} /> */}
            <Route path="/lab" element={<Lab />} />
            {/* <Route path="/settings" element={<Settings />} /> */}
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
