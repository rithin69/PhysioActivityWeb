import React, { useState, useEffect } from 'react';
import { Activity, Heart, TrendingUp } from 'lucide-react';

const PatientDetails = ({ userId, onBack }) => {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('Overview');

  useEffect(() => {
    const fetchPatientDetails = async () => {
      setLoading(true);
      setError(null);
      setPatient(null);
      try {
        const response = await fetch(
          'https://prod-56.uksouth.logic.azure.com:443/workflows/0add900718eb4fdb827b4bce3a097eb4/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=3zK33y3Rr6U2wg8WyqK4IVjVgtn7K6aK52oTOFxPiJg',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: String(userId) }),
          }
        );
        if (response.ok) {
          const data = await response.json();
          if (data && Array.isArray(data) && data.length > 0) {
            setPatient(data[0]);
          } else {
            setError('No patient data found');
          }
        } else {
          throw new Error(`API call failed: ${response.statusText}`);
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch patient details');
      } finally {
        setLoading(false);
      }
    };

    fetchPatientDetails();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading patient details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-50">
        <div className="text-center">
          <button onClick={onBack} className="mb-4 text-teal-600 underline">Back to Dashboard</button>
          <p className="text-red-600 mb-4">{error}</p>
        </div>
      </div>
    );
  }

  if (!patient) return null;

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-4rem)] w-full p-8">
      <div className="bg-white rounded-xl shadow p-8 w-full h-full">
        <button onClick={onBack} className="mb-6 text-teal-600 underline">Back to Dashboard</button>
        <div className="flex items-center mb-8">
          <div className="w-20 h-20 rounded-full bg-teal-500 flex items-center justify-center text-white text-3xl font-bold mr-6">
            {patient.Name ? patient.Name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0,2) : 'NA'}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-teal-600 mb-1">{patient.Name || 'Patient'}</h1>
            <p className="text-gray-500">{patient.goal || 'No goal set'}</p>
          </div>
        </div>
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`px-6 py-2 font-medium ${
              activeTab === 'Overview'
                ? 'border-b-2 border-teal-500 text-teal-600'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('Overview')}
          >
            Overview
          </button>
          <button
            className={`px-6 py-2 font-medium ${
              activeTab === 'Programs'
                ? 'border-b-2 border-teal-500 text-teal-600'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('Programs')}
          >
            Programs
          </button>
        </div>
        {activeTab === 'Overview' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-gray-100 rounded-lg p-4 flex flex-col items-center">
                <Activity className="w-6 h-6 text-teal-500 mb-2" />
                <div className="text-sm text-gray-500">Daily Steps</div>
                <div className="text-2xl font-bold text-teal-600">{patient['daily steps'] || '0'}</div>
              </div>
              <div className="bg-gray-100 rounded-lg p-4 flex flex-col items-center">
                <Heart className="w-6 h-6 text-teal-500 mb-2" />
                <div className="text-sm text-gray-500">Resting HR</div>
                <div className="text-2xl font-bold text-teal-600">{patient['resting hr'] || '--'}</div>
              </div>
              <div className="bg-gray-100 rounded-lg p-4 flex flex-col items-center">
                <TrendingUp className="w-6 h-6 text-teal-500 mb-2" />
                <div className="text-sm text-gray-500">Avg Sleep</div>
                <div className="text-2xl font-bold text-teal-600">{patient['Avg sleep'] || '--'}h</div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="text-gray-500 mb-1">Age</div>
                <div className="text-lg font-bold text-gray-900">{patient.Age || '--'}</div>
              </div>
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="text-gray-500 mb-1">Sex</div>
                <div className="text-lg font-bold text-gray-900">{patient.sex || '--'}</div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'Programs' && (
          <div>
            <div className="text-gray-600">No program data available.</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDetails;
