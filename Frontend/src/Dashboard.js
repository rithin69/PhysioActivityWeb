import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PowerBIReport from './PowerBIReport';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const web_user_id=useSelector((state) => state.user.web_user_id) || '';
  const user_role = useSelector((state) => state.user.user_role) || '';
  const userName = useSelector((state) => state.user.name) || '';
  const mypatients = useSelector((state) => state.user.mypatients) || '';
  const newpatients = useSelector((state) => state.user.newpatients) || '';

  const [sharingCode, setSharingCode] = useState('');
  const [userID, setUserID] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [reportType, setReportType] = useState('');
  const [embedUrl, setEmbedUrl] = useState('');
  const [myPatientNames, setMyPatientNames] = useState([]);
  const [newPatientNames, setNewPatientNames] = useState([]);

  useEffect(() => {
    if (user_role === 'physio') {
      fetchPatientNames(mypatients, setMyPatientNames);
      fetchPatientNames(newpatients, setNewPatientNames);
    } else if (user_role === 'patient') {
      fetchPatientNames(mypatients, setMyPatientNames);
      setNewPatientNames([]);
    }
  }, [mypatients, newpatients, user_role]);

  const fetchPatientNames = async (idsString, setState) => {
    if (!idsString) return;
    const ids = idsString.split(',').map((id) => id.trim()).filter(Boolean);
    if (ids.length === 0) return;

    try {
      const response = await axios.post(
        'https://physioactivitybackend-gjb3dnbsgdcbgjfj.uksouth-01.azurewebsites.net/getUsersFromIds',
        { ids }
      );
      if (response.data?.users) {
        setState(response.data.users);
      }
    } catch (error) {
      console.error('Failed to fetch patient names:', error);
    }
  };

  const handleFetchUserId = async (urlOverride) => {
    if (!sharingCode.trim()) {
      setError('Please enter a sharing code');
      return;
    }

    setIsLoading(true);
    setError('');
    setUserID(sharingCode); // fallback

    // Use override URL if provided, otherwise use the default
    const url = urlOverride || "https://prod-33.uksouth.logic.azure.com:443/workflows/ae7905b16a744f849b8d29e96f463633/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=U2__LcFx41-n29gGBBA7WKcCYrKdDheaf0ylOrH6A68";

    try {
      const response = await fetch(
        url,
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
        const type = data.reportType || 'powerbi';
        const embed = data.embedUrl || '';

        if (retrievedUserId) setUserID(retrievedUserId);
        setReportType(type);
        setEmbedUrl(embed);
      } catch {
        console.warn('Non-JSON or invalid response');
        setError('Unexpected response from server');
      }
    } catch (e) {
      console.warn('Fetch failed:', e);
      setError('Failed to retrieve report. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderPatientTiles = (patients) =>
    patients.map(({ id, displayName }) => (
      <div
        key={id}
        onClick={() => navigate(`/myprofile?user=${id}`)}
        className="w-40 cursor-pointer text-center bg-white p-4 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-200"
      >
        <img
          src="/images/patient2.jpeg"
          alt="Patient"
          className="w-24 h-24 rounded-full mx-auto mb-2"
        />
        <p className="text-gray-800 font-medium">{displayName || 'Unknown'}</p>
      </div>
    ));

  return (
    <div className="pt-20 px-6 max-w-5xl w-full">
      {/* Sharing Code Entry */}
      <section className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Enter Sharing Code</h2>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Sharing Code"
            value={sharingCode}
            onChange={(e) => {
              setSharingCode(e.target.value);
              setError('');
            }}
            className="flex-grow border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={() =>
              handleFetchUserId(
                userName
                  ? "https://prod-32.uksouth.logic.azure.com:443/workflows/d84cb30b31564a54a14df0c4467f4b93/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=RIDM84vImCGaHu71_rHkj5jgoXy6LSaxprx99LAM0b4"
                  : undefined
              )
            }
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded transition disabled:opacity-50"
            disabled={isLoading || !sharingCode.trim()}
          >
            {isLoading ? 'Loading...' : 'Enter'}
          </button>


        </div>
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </section>

      {/* Patient Tiles */}
      {userName && (
        <div className="mb-8">
          <div className="flex flex-wrap gap-6">
            <div
              onClick={() => navigate('/myprofile')}
              className="w-40 cursor-pointer text-center bg-white p-4 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-200"
            >
              <img
                src="/images/patient.jpg"
                alt="User"
                className="w-24 h-24 rounded-full mx-auto mb-2"
              />
              <p className="text-gray-800 font-medium">My Profile</p>
            </div>
            {user_role === 'patient' && myPatientNames.length > 0 && renderPatientTiles(myPatientNames)}
          </div>

          {user_role === 'physio' && (
            <>
              {newPatientNames.length > 0 && (
                <section className="mt-10">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">New Patients</h3>
                  <div className="flex flex-wrap gap-6">{renderPatientTiles(newPatientNames)}</div>
                </section>
              )}
              {myPatientNames.length > 0 && (
                <section className="mt-10">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">My Patients</h3>
                  <div className="flex flex-wrap gap-6">{renderPatientTiles(myPatientNames)}</div>
                </section>
              )}
            </>
          )}
        </div>
      )}

      {/* Report Section */}
      {userID && (
        <section className="bg-white p-4 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Report</h3>
          <div className="h-[600px] w-full border rounded overflow-hidden">
            {reportType === 'shiny' && embedUrl ? (
              <iframe
                src={embedUrl}
                title="Shiny Dashboard"
                className="w-full h-full border-0"
                allowFullScreen
              />
            ) : (
              <PowerBIReport userID={userID} />
            )}
          </div>
        </section>
      )}

      {/* Loader */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
            <p className="mt-4 text-lg font-semibold">Loading report...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
