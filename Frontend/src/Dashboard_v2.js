import React, { useState, useEffect } from 'react';
import { Activity, Clock, Heart, TrendingUp, Users } from 'lucide-react';
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
    if (pct >= 90) return 'bg-green-500';
    if (pct >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (selectedUserId) {
    return <PatientDetails userId={selectedUserId} onBack={() => setSelectedUserId(null)} />;
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6 mx-auto max-w-7xl">
      <h1 className="text-3xl font-bold text-teal-600 mb-6">Welcome, Sarah!</h1>

      {/* Sharing Code */}
      <div className="mb-8 max-w-3xl">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Enter Sharing Code</h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Sharing Code"
              value={sharingCode}
              onChange={(e) => {
                setSharingCode(e.target.value);
                setFetchError('');
              }}
              className="flex-grow border border-gray-300 rounded px-4 py-2"
            />
            <button
              onClick={handleFetchUserId}
              disabled={isLoading || !sharingCode.trim()}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              {isLoading ? 'Loading...' : 'Enter'}
            </button>
          </div>
          {fetchError && <p className="text-red-600 mt-2">{fetchError}</p>}
        </div>
      </div>

      {/* Patient Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client, idx) => {
          const pct = client.ActivityTarget
            ? Math.round((parseInt(client.ActivityAchieved) / parseInt(client.ActivityTarget)) * 100)
            : 0;

          return (
            <div
              key={client.ID}
              onClick={() => setSelectedUserId(client.ID)}
              className="bg-white rounded-lg p-6 cursor-pointer hover:shadow-md transition"
            >
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-teal-500 text-white flex items-center justify-center text-xl font-bold">
                  {getInitials(client.clientName)}
                </div>
                <h3 className="mt-3 text-lg font-semibold">{client.clientName}</h3>
                <p className="text-sm text-gray-500 mb-2">{client.Goal}</p>
              </div>

              <div className="space-y-2 text-sm text-gray-600 mt-4">
                <div className="flex items-center">
                  <Activity className="w-4 h-4 mr-2 text-teal-500" />
                  Steps: {client.ActivityAchieved}
                </div>
                <div className="flex items-center">
                  <Heart className="w-4 h-4 mr-2 text-teal-500" />
                  Recovery: {client.RecoveryScore}
                </div>
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2 text-teal-500" />
                  Perf: {client.PerfScore}
                </div>
                <div className="h-2 rounded-full w-full bg-gray-200 mt-2">
                  <div className={`h-2 rounded-full ${getProgressColor(pct)}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard_v2;
