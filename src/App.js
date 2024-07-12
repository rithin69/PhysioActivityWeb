import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import Analytics from './Analytics';

const NA1 = () => <div><h1 className="text-2xl font-bold">Menu 3 Content</h1></div>;
const NA2 = () => <div><h1 className="text-2xl font-bold">Menu 4 Content</h1></div>;

const App = () => {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <main className="flex-grow p-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/menu3" element={<NA1 />} />
            <Route path="/menu4" element={<NA2 />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
