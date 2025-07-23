import React, { useState, useEffect } from 'react';
import { Activity, Clock, Heart, TrendingUp, Users, Info } from 'lucide-react';
import PatientDetails from './PatientDetails';

const Dashboard_v2 = () => {
  const [clients, setClients] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sharingCode, setSharingCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        'https://prod-08.uksouth.logic.azure.com:443/workflows/62834f9020f246e093b95f32a7f23a45/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=ChqHsiDF1WDBn0X2ZBQ0lWFivpIuXa7lMILRSh_GbEc',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: '100001' }),
        }
      );

      const text = await response.text();
      const data = JSON.parse(text || '[]');
      setClients(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleFetchUserId = async () => {
    if (!sharingCode.trim()) return;
    setIsLoading(true);
    setFetchError('');
    try {
      const response = await fetch(
        'https://prod-33.uksouth.logic.azure.com:443/workflows/ae7905b16a744f849b8d29e96f463633/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=U2__LcFx41-n29gGBBA7WKcCYrKdDheaf0ylOrH6A68',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sharingcode: sharingCode })
        }
      );

      const text = await response.text();
      const data = JSON.parse(text);
      const userId = data.userId || data.UserID || data.id;
      if (userId) {
        setSelectedUserId(userId);
      } else {
        setFetchError('Invalid sharing code');
      }
    } catch {
      setFetchError('Error fetching user');
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'NA';
    const parts = name.trim().split(' ');
    return parts[0][0].toUpperCase() + (parts[1]?.[0] || '').toUpperCase();
  };

  const getProgressColor = (pct) => {
    if (pct >= 90) return 'bg-gradient-to-r from-green-400 to-green-600';
    if (pct >= 70) return 'bg-gradient-to-r from-yellow-400 to-orange-500';
    return 'bg-gradient-to-r from-red-400 to-red-600';
  };

  const getProgressBorderColor = (pct) => {
    if (pct >= 90) return 'border-green-200';
    if (pct >= 70) return 'border-yellow-200';
    return 'border-red-200';
  };

  if (selectedUserId) {
    return <PatientDetails userId={selectedUserId} onBack={() => setSelectedUserId(null)} />;
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6 max-w-7xl" style={{ marginLeft: '0' }}>
      {/* App Download Instructions */}
      <div className="mb-6 max-w-3xl pt-16">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-blue-900 mb-1">
                Get Started with Our Mobile App
              </h3>
              <p className="text-sm text-blue-700 leading-relaxed">
                Download our mobile app to generate your unique sharing code. Once installed, 
                open the app, navigate to settings, and find your personal sharing code to enter below.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sharing Code */}
      <div className="mb-8 max-w-5xl">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Enter Sharing Code</h2>
          </div>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Enter your sharing code from the app"
              value={sharingCode}
              onChange={(e) => {
                setSharingCode(e.target.value);
                setFetchError('');
              }}
              className="flex-grow border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-500"
            />
            <button
              onClick={handleFetchUserId}
              disabled={isLoading || !sharingCode.trim()}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-sm hover:shadow-md"
            >
              {isLoading ? 'Loading...' : 'Enter'}
            </button>
          </div>
          {fetchError && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm font-medium">{fetchError}</p>
            </div>
          )}
        </div>
      </div>

      {/* Patient Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {clients.map((client, idx) => {
          const pct = client.ActivityTarget
            ? Math.round((parseInt(client.ActivityAchieved) / parseInt(client.ActivityTarget)) * 100)
            : 0;

          return (
            <div
              key={client.ID}
              onClick={() => setSelectedUserId(client.ID)}
              className={`
                relative bg-white rounded-2xl p-6 cursor-pointer transition-all duration-300 
                border-2 border-gray-100 hover:border-teal-200 
                shadow-lg hover:shadow-2xl transform hover:-translate-y-2
                before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br 
                before:from-white before:via-gray-50 before:to-gray-100 before:opacity-50
                hover:before:from-teal-50 hover:before:via-blue-50 hover:before:to-indigo-50
                ${getProgressBorderColor(pct)} hover:border-opacity-60
                backdrop-blur-sm
              `}
            >
              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-teal-100 to-transparent rounded-bl-3xl rounded-tr-2xl opacity-30"></div>
              
              {/* Progress indicator dot */}
              <div className={`absolute top-4 right-4 w-3 h-3 rounded-full ${pct >= 90 ? 'bg-green-400' : pct >= 70 ? 'bg-yellow-400' : 'bg-red-400'} shadow-sm`}></div>

              <div className="relative z-10">
                <div className="flex flex-col items-center mb-6">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg ring-4 ring-teal-100">
                      {getInitials(client.clientName)}
                    </div>
                    {/* Online status indicator */}
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-3 border-white shadow-sm flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-gray-800 text-center">{client.clientName}</h3>
                  <p className="text-sm text-gray-500 text-center mt-1 px-2 py-1 bg-gray-50 rounded-full border">
                    {client.Goal}
                  </p>
                </div>

                {/* Stats Section */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                    <div className="flex items-center">
                      <div className="p-2 bg-teal-100 rounded-lg mr-3">
                        <Activity className="w-4 h-4 text-teal-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Steps</span>
                    </div>
                    <span className="text-lg font-bold text-gray-800">{client.ActivityAchieved}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                    <div className="flex items-center">
                      <div className="p-2 bg-red-100 rounded-lg mr-3">
                        <Heart className="w-4 h-4 text-red-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Recovery</span>
                    </div>
                    <span className="text-lg font-bold text-gray-800">{client.RecoveryScore}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg mr-3">
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Performance</span>
                    </div>
                    <span className="text-lg font-bold text-gray-800">{client.PerfScore}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">Progress</span>
                    <span className="text-sm font-bold text-gray-800">{pct}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-gray-200 border border-gray-300 overflow-hidden shadow-inner">
                    <div 
                      className={`h-full rounded-full ${getProgressColor(pct)} shadow-sm transition-all duration-500 ease-out`} 
                      style={{ width: `${pct}%` }}
                    >
                      <div className="h-full bg-gradient-to-r from-white/20 to-transparent rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-6 right-6 h-1 bg-gradient-to-r from-teal-200 via-blue-200 to-indigo-200 rounded-full opacity-60"></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard_v2;
