import React, { useState } from 'react';
import Dashboard_v2 from './Dashboard_v2';
import PatientDetails from './PatientDetails';

const DashboardPage = () => {
  const [selectedPatientId, setSelectedPatientId] = useState(null);

  return (
    <>
      {selectedPatientId ? (
        <PatientDetails
          userId={selectedPatientId}
          onBack={() => setSelectedPatientId(null)}
        />
      ) : (
        <Dashboard_v2 onPatientClick={setSelectedPatientId} />
      )}
    </>
  );
};

export default DashboardPage;
