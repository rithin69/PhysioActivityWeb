import React, { useState } from 'react';
import { FaMapMarkerAlt, FaFire, FaSmile, FaHeartbeat, FaMoon, FaWeight, FaUsers, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { IoFootsteps } from "react-icons/io5";
import Patients from './Patients';
import Anonypatients from './Anonypatients';
import Navbar from './Navbar';

const Dashboard = () => {
  // State to handle the collapse/expand functionality, set to false by default
  const [isFitbitExpanded, setFitbitExpanded] = useState(false);
  const [isGarminExpanded, setGarminExpanded] = useState(false);
  const [isStravaExpanded, setStravaExpanded] = useState(false);

  // Dummy Data
  const mockData = {
    weekDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    totalSteps: 70000,
    avgSteps: 10000,
    stepsComparison: '2000 steps more than last week',
    totalFloors: 50,
    totalDistance: 35,
    totalCalories: 2000,
    totalActiveMinutes: 300,
    avgSleepDuration: '7 hrs',
    avgStepsPerDay: 10000,
    avgRestingHeartRate: 60,
    weight: 70,
  };

  return (
    
    <div className="container mx-auto ">
      <Navbar></Navbar>

      {/* Patient Overview */}
      <section className="bg-gray-100 p-6 rounded-lg shadow-lg mb-8">
  <h2 className="text-2xl font-bold text-gray-900 mb-4">Summary</h2>

  {/* Tiles Container */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {/* Tile 1 */}
    <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center text-center">
      <div className="text-4xl text-blue-500 mb-2"></div>
      <h3 className="text-lg font-semibold text-gray-800">X</h3>
      <p className="text-gray-600 mt-2"></p>
    </div>

    {/* Tile 2 */}
    <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center text-center">
      <div className="text-4xl text-green-500 mb-2"></div>
      <h3 className="text-lg font-semibold text-gray-800">Y</h3>
      <p className="text-gray-600 mt-2"></p>
    </div>

    {/* Tile 3 */}
    <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center text-center">
      <div className="text-4xl text-purple-500 mb-2"></div>
      <h3 className="text-lg font-semibold text-gray-800">Z</h3>
      <p className="text-gray-600 mt-2"></p>
    </div>
  </div>
</section>

      <section className="bg-gray-100 p-6 rounded-lg shadow-lg mb-8">
         <h2 className="text-2xl font-bold text-gray-900 mb-4">New  Patients</h2>
         <Anonypatients ></Anonypatients>
      </section>
      <section className="bg-gray-100 p-6 rounded-lg shadow-lg mb-8">
         <h2 className="text-2xl font-bold text-gray-900 mb-4">My Patients </h2>
         <Patients></Patients>
      </section>

      {/* Fitbit Section */}
      {/* <section className="bg-white p-4 rounded-lg shadow-lg mb-4">
        <div className="flex justify-between items-center cursor-pointer" onClick={() => setFitbitExpanded(!isFitbitExpanded)}>
          <h3 className="text-xl font-bold text-gray-800">Fitbit</h3>
          <button className="text-gray-800">
            {isFitbitExpanded ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>
        {isFitbitExpanded && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-6">
            <Detail icon={<FaSmile className="text-yellow-500" />} value={mockData.totalFloors} label="Total Floors" comparison="100 floors below last week" />
            <Detail icon={<FaMapMarkerAlt className="text-blue-500" />} value={mockData.totalDistance} label="Total KM" comparison="1.44 km below last week" />
            <Detail icon={<FaFire className="text-red-500" />} value={mockData.totalCalories} label="Avg. Daily Calorie Burn" comparison="43 cals. over last week" />
            <Detail icon={<FaHeartbeat className="text-pink-500" />} value={mockData.totalActiveMinutes} label="Total Active Zone Minutes" comparison="33 min since last week" />
            <Detail icon={<FaMoon className="text-purple-500" />} value={mockData.avgSleepDuration} label="Avg. Restful Sleep" comparison="0 hrs 19 min lower than last week" />
            <Detail icon={<IoFootsteps className="text-green-600" />} value={mockData.totalSteps} label="Total Steps" comparison={mockData.stepsComparison} />
          </div>
        )}
      </section> */}

      {/* Garmin Section */}
      {/* <section className="bg-white p-4 rounded-lg shadow-lg mb-4">
        <div className="flex justify-between items-center cursor-pointer" onClick={() => setGarminExpanded(!isGarminExpanded)}>
          <h3 className="text-xl font-bold text-gray-800">Garmin</h3>
          <button className="text-gray-800">
            {isGarminExpanded ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>
        {isGarminExpanded && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-6">
            <Detail icon={<FaSmile className="text-yellow-500" />} value={mockData.totalFloors} label="Total Floors" comparison="100 floors below last week" />
            <Detail icon={<FaMapMarkerAlt className="text-blue-500" />} value={mockData.totalDistance} label="Total KM" comparison="1.44 km below last week" />
            <Detail icon={<FaFire className="text-red-500" />} value={mockData.totalCalories} label="Avg. Daily Calorie Burn" comparison="43 cals. over last week" />
            <Detail icon={<FaHeartbeat className="text-pink-500" />} value={mockData.totalActiveMinutes} label="Total Active Zone Minutes" comparison="33 min since last week" />
            <Detail icon={<FaMoon className="text-purple-500" />} value={mockData.avgSleepDuration} label="Avg. Restful Sleep" comparison="0 hrs 19 min lower than last week" />
            <Detail icon={<IoFootsteps className="text-green-600" />} value={mockData.totalSteps} label="Total Steps" comparison={mockData.stepsComparison} />
          </div>
        )}
      </section> */}

      {/* Strava Section */}
      {/* <section className="bg-white p-4 rounded-lg shadow-lg mb-4">
        <div className="flex justify-between items-center cursor-pointer" onClick={() => setStravaExpanded(!isStravaExpanded)}>
          <h3 className="text-xl font-bold text-gray-800">Strava</h3>
          <button className="text-gray-800">
            {isStravaExpanded ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>
        {isStravaExpanded && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-6">
            <Detail icon={<FaSmile className="text-yellow-500" />} value={mockData.totalFloors} label="Total Floors" comparison="100 floors below last week" />
            <Detail icon={<FaMapMarkerAlt className="text-blue-500" />} value={mockData.totalDistance} label="Total KM" comparison="1.44 km below last week" />
            <Detail icon={<FaFire className="text-red-500" />} value={mockData.totalCalories} label="Avg. Daily Calorie Burn" comparison="43 cals. over last week" />
            <Detail icon={<FaHeartbeat className="text-pink-500" />} value={mockData.totalActiveMinutes} label="Total Active Zone Minutes" comparison="33 min since last week" />
            <Detail icon={<FaMoon className="text-purple-500" />} value={mockData.avgSleepDuration} label="Avg. Restful Sleep" comparison="0 hrs 19 min lower than last week" />
            <Detail icon={<IoFootsteps className="text-green-600" />} value={mockData.totalSteps} label="Total Steps" comparison={mockData.stepsComparison} />
          </div>
        )}
      </section> */}
    </div>
  );
};

// Detail component to reuse in the sections
const Detail = ({ icon, value, label, comparison }) => (
  <div className="p-6 border rounded-lg shadow-md bg-gray-50">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-2xl font-bold text-green-600">{value}</h3>
    <p className="text-gray-600 text-lg">{label}</p>
    <p className="text-gray-500 text-sm">{comparison}</p>
  </div>
);

// StatusBar component to display progress in the Patient Overview section
const StatusBar = ({ label, value, maxValue, color }) => {
  const percentage = (value / maxValue) * 100;

  return (
    <div>
      <div className="flex justify-between text-gray-700 mb-1">
        <span>{label}</span>
        <span>{value}/{maxValue}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4">
        <div
          className={`${color} h-4 rounded-full`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Dashboard;
