import React, { useState, useEffect } from 'react';
import { Activity, Heart, TrendingUp, ArrowLeft, User, Calendar, Target } from 'lucide-react';
import ProgramsTab from './ProgramsTab';

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
        <div className="text-center bg-white rounded-lg shadow-sm p-8 border">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-200 border-t-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading patient details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-50">
        <div className="text-center bg-white rounded-lg shadow-sm p-8 border max-w-md">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Data</h3>
          <p className="text-red-600 mb-4 text-sm">{error}</p>
          <button 
            onClick={onBack} 
            className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!patient) return null;

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-4rem)] w-full p-6" style={{ marginLeft: '0' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <button 
            onClick={onBack} 
            className="inline-flex items-center px-3 py-2 text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>
          
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full bg-teal-600 flex items-center justify-center text-white text-xl font-semibold mr-6">
              {patient.Name ? patient.Name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0,2) : 'NA'}
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                {patient.Name || 'Patient'}
              </h1>
              <p className="text-gray-600">{patient.goal || 'No goal set'}</p>
              <p className="text-sm text-gray-500 mt-1">Patient ID: {userId}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border">
          {/* Tabs */}
          <div className="flex border-b">
            <button
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'Overview'
                  ? 'text-teal-600 border-b-2 border-teal-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('Overview')}
            >
              Overview
            </button>
            <button
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'Programs'
                  ? 'text-teal-600 border-b-2 border-teal-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('Programs')}
            >
              Programs
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'Overview' && (
              <div className="space-y-6">
                {/* Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6 border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Daily Steps</p>
                        <p className="text-2xl font-semibold text-gray-900">{patient['daily steps'] || '0'}</p>
                      </div>
                      <Activity className="w-8 h-8 text-teal-600" />
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6 border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Resting HR</p>
                        <p className="text-2xl font-semibold text-gray-900">{patient['resting hr'] || '--'}</p>
                      </div>
                      <Heart className="w-8 h-8 text-red-500" />
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6 border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Avg Sleep</p>
                        <p className="text-2xl font-semibold text-gray-900">{patient['Avg sleep'] || '--'}h</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-blue-500" />
                    </div>
                  </div>
                </div>

                {/* Patient Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6 border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Age</p>
                        <p className="text-xl font-semibold text-gray-900">{patient.Age || '--'}</p>
                      </div>
                      <Calendar className="w-6 h-6 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6 border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Sex</p>
                        <p className="text-xl font-semibold text-gray-900">{patient.sex || '--'}</p>
                      </div>
                      <User className="w-6 h-6 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'Programs' && (
              <ProgramsTab userId={userId} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;
