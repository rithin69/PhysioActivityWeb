import React, { useState, useEffect } from 'react';
import { Activity, Clock, Heart, TrendingUp, Users } from 'lucide-react';

const Dashboard_v2 = ({ onPatientClick }) => {
  // Sharing code states
  const [sharingCode, setSharingCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');

  // Dashboard states
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Avatar and progress helpers
  const getInitials = (name) => {
    if (!name) return 'NA';
    const nameParts = name.split(' ');
    if (nameParts.length >= 2) {
      return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (index) => {
    const colors = [
      'bg-purple-500',
      'bg-orange-500',
      'bg-green-500',
      'bg-blue-500',
      'bg-pink-500',
      'bg-yellow-500',
      'bg-indigo-500',
      'bg-red-500'
    ];
    return colors[index % colors.length];
  };

  const getActivityPercentage = (achieved, target) => {
    if (!achieved || !target) return 0;
    return Math.round((parseInt(achieved) / parseInt(target)) * 100);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://prod-08.uksouth.logic.azure.com:443/workflows/62834f9020f246e093b95f32a7f23a45/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=ChqHsiDF1WDBn0X2ZBQ0lWFivpIuXa7lMILRSh_GbEc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: "100001" })
      });
      if (response.ok) {
        const data = await response.json();
        setClients(data);
      } else {
        throw new Error(`API call failed: ${response.statusText}`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Sharing code handler
  const handleFetchUserId = async () => {
    if (!sharingCode.trim()) {
      setFetchError('Please enter a sharing code');
      return;
    }
    setIsLoading(true);
    setFetchError('');

    try {
      const response = await fetch(
        "https://prod-33.uksouth.logic.azure.com:443/workflows/ae7905b16a744f849b8d29e96f463633/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=U2__LcFx41-n29gGBBA7WKcCYrKdDheaf0ylOrH6A68",
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ sharingcode: sharingCode }),
        }
      );

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
        const retrievedUserId = data.userId || data.UserID || data.id;
        if (retrievedUserId) {
          onPatientClick(retrievedUserId);
          setFetchError('');
        } else {
          setFetchError('User ID not found in response');
        }
      } catch {
        setFetchError('Unexpected response from server');
      }
    } catch (e) {
      setFetchError('Failed to retrieve user ID. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="pl-64 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pl-64 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading dashboard: {error}</p>
          <button
            onClick={fetchDashboardData}
            className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="p-6">
        {/* Dashboard Heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-teal-600 mb-2">Welcome, Sarah!</h1>
        </div>
        {/* Filter */}
        <div className="flex justify-end items-center mb-6">
          <select className="border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent">
            <option>All Clients (No Date Filter)</option>
            <option>This Week</option>
            <option>This Month</option>
            <option>Last 30 Days</option>
          </select>
        </div>
        {/* Sharing Code Entry - aligned to the left */}
        <div className="flex mb-8">
          <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-2xl flex flex-col items-start">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Enter Sharing Code</h2>
            <div className="flex w-full gap-4">
              <input
                type="text"
                placeholder="Sharing Code"
                value={sharingCode}
                onChange={(e) => {
                  setSharingCode(e.target.value);
                  setFetchError('');
                }}
                className="flex-grow border border-gray-300 rounded-lg px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
              <button
                onClick={handleFetchUserId}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition disabled:opacity-50"
                disabled={isLoading || !sharingCode.trim()}
              >
                {isLoading ? 'Loading...' : 'Enter'}
              </button>
            </div>
            {fetchError && <p className="text-red-600 mt-4">{fetchError}</p>}
          </div>
        </div>
        {/* Client Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {clients.map((client, index) => {
            const activityPercentage = getActivityPercentage(client.ActivityAchieved, client.ActivityTarget);
            return (
              <div
                key={client.ID || index}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onPatientClick(client.ID)}
              >
                <div className="flex flex-col items-center mb-4">
                  <div className={`w-20 h-20 rounded-full ${getAvatarColor(index)} flex items-center justify-center text-white text-xl font-bold mb-3`}>
                    {getInitials(client.clientName)}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 text-center">{client.clientName}</h3>
                  <p className="text-sm text-gray-500">{client.Goal}</p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Activity className="w-4 h-4 mr-2 text-teal-500" />
                    <span>Steps: <strong>{client.ActivityAchieved || '0'}</strong></span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Heart className="w-4 h-4 mr-2 text-teal-500" />
                    <span>Recovery: <strong>{client.RecoveryScore || '0'}</strong></span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <TrendingUp className="w-4 h-4 mr-2 text-teal-500" />
                    <span>Performance: <strong>{client.PerfScore || '0'}</strong></span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2 text-teal-500" />
                    <span>{client.inPersonOrRemote === 'inPerson' ? 'In-Person' : 'Remote'}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Weekly Activity:</span>
                    <span className="text-sm font-bold text-gray-900">{activityPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(activityPercentage)}`}
                      style={{ width: `${Math.min(activityPercentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
                {client.nextScheduledDate && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2 text-teal-500" />
                      <span>Next: {client.nextScheduledDate}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {clients.length === 0 && !loading && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No clients found</h3>
            <p className="text-gray-500 mb-4">No client data available at the moment.</p>
            <button
              onClick={fetchDashboardData}
              className="bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600 transition-colors"
            >
              Refresh Data
            </button>
          </div>
        )}
        <div className="mt-8 text-center">
          <button
            onClick={fetchDashboardData}
            className="bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-teal-600 transition-colors font-medium"
          >
            Refresh Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard_v2;
