import React, { useState } from 'react';
import { FaMapMarkerAlt, FaFire, FaSmile, FaHeartbeat, FaMoon, FaWeight, FaUsers, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { IoFootsteps } from "react-icons/io5";
import { useLocation } from 'react-router-dom';
import Sidepanel from './Sidepanel'; // Import your SidePanel component


const Dashboard = () => {
  // State to handle the collapse/expand functionality, set to false by default
  const [isFitbitExpanded, setFitbitExpanded] = useState(false);
  const [isGarminExpanded, setGarminExpanded] = useState(false);
  const [isStravaExpanded, setStravaExpanded] = useState(false);
  const location = useLocation();
  const { name } = location.state || {}; // Fallback in case state is undefined
  const [isSidePanelOpen, setSidePanelOpen] = useState(false);

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
    <div className="container mx-auto p-4">

      {/* Personal  Information  */}
      <section className="bg-gray-100 p-6 rounded-lg shadow-lg mb-8 relative ">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Personal Information</h2>
        {/* Add Notes Button */}
        <button
          className="absolute top-6 right-8 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition duration-200 absolute"
          onClick={() => setSidePanelOpen(true)} // Open SidePanel on click
        >
          Add Notes
        </button>
        <div className="flex flex-col space-y-4 text-gray-700 text-lg">
          <div>
            <span className="font-semibold text-gray-900">Patient Name:</span> {name}
          </div>
          <div>
            <span className="font-semibold text-gray-900">Age:</span> 29
          </div>
          <div>
            <span className="font-semibold text-gray-900">Height:</span> 175 cm
          </div>
          <div>
            <span className="font-semibold text-gray-900">Weight:</span> 70 kg
          </div>
          <div>
            <span className="font-semibold text-gray-900">Blood Type:</span> A+
          </div>

          {/* <div className="flex items-center"> */}
          <div>
          <span className="font-semibold text-gray-900">Needs glasses with an eyesight number</span>
            <input
              type="checkbox"
              checked = {true}
              // {needsGlasses}
              // onChange={() => setNeedsGlasses(!needsGlasses)}
              className="ml-2"
            />
            
          </div>
        {/* </div> */}
        <div>
          <span className="font-semibold text-gray-900">Diagnosed Condition : </span> Osteoarthritis
        </div>
        </div>


      </section>

      {/* Patient Overview */}
      <section className="bg-gray-100 p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Patient Overview</h2>
        {/* Add Notes Button */}
        {/* <button 
          className="absolute top-6 right-8 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition duration-200"
          onClick={() => setSidePanelOpen(true)} // Open SidePanel on click
        >
          Add Notes
        </button> */}
        {/* <div className="flex flex-col space-y-4 text-gray-700 text-lg">
          <div>
            <span className="font-semibold text-gray-900">Patient Name:</span> {name}
          </div>
          <div>
            <span className="font-semibold text-gray-900">Age:</span> 29
          </div>
          <div>
            <span className="font-semibold text-gray-900">Height:</span> 175 cm
          </div>
          <div>
            <span className="font-semibold text-gray-900">Weight:</span> 70 kg
          </div>
        </div> */}
        <p className="text-gray-500 font-bold text-lg mt-6"> Patient progress:</p>

        {/* Status Bars */}
        <div className="mt-4 space-y-4">
          <StatusBar label="Total Steps" value={mockData.totalSteps} maxValue={100000} color="bg-green-500" />
          <StatusBar label="Total Active Minutes" value={mockData.totalActiveMinutes} maxValue={600} color="bg-blue-500" />
          <StatusBar label="Avg. Restful Sleep" value={7} maxValue={8} color="bg-purple-500" />
        </div>
      </section>

      {/* Fitbit Section */}
      <section className="bg-white p-4 rounded-lg shadow-lg mb-4">
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
      </section>

      {/* Garmin Section */}
      <section className="bg-white p-4 rounded-lg shadow-lg mb-4">
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
      </section>

      {/* Strava Section */}
      <section className="bg-white p-4 rounded-lg shadow-lg mb-4">
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
      </section>
      <Sidepanel isOpen={isSidePanelOpen} onClose={() => setSidePanelOpen(false)} />
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