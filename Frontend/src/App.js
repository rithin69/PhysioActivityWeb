// App.js
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppContent from './AppContent';
import { RoleProvider } from './RoleContext';


const App = () => {
  return (
    <Router>
    
      <RoleProvider>
        <AppContent />
      </RoleProvider>
    </Router>
  );
};

export default App;
