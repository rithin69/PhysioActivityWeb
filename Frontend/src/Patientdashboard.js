import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaFire, FaSmile, FaHeartbeat, FaMoon, FaWeight, FaUsers, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { IoFootsteps } from "react-icons/io5";
import { useLocation } from 'react-router-dom';
import Sidepanel from './Sidepanel'; // Import your SidePanel component
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart,
  Line, ResponsiveContainer
} from 'recharts';
import Pbi from './Pbi';
import PowerBiembededstatic from './PowerBiEmbeddedstatic';
import PowerBiEmbeddedfilter from './PowerBiEmbeddedfilter';
import PowerBIReport from './PowerBIReport';
import Feedbacksidepanel from './Feedbacksidepanel';

const Patientdashboard = () => {
  const [isPanelOpen, setPanelOpen] = useState(false);
  const [note1, setNote1] = useState('');
  const [note2, setNote2] = useState('');
  const location = useLocation();
  const { name } = location.state || {};
  const [appliedValue, setAppliedValue] = useState("");
  const [isFitbitExpanded, setFitbitExpanded] = useState(false);
  const [isGarminExpanded, setGarminExpanded] = useState(false);
  const [isStravaExpanded, setStravaExpanded] = useState(false);
  const [isMSKExpanded, setMSKExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // New Loading State
  const painData = [
    { week: "Week 1", pain: 8 },
    { week: "Week 2", pain: 7 },
    { week: "Week 3", pain: 6 },
    { week: "Week 4", pain: 5 },
    { week: "Week 5", pain: 4 },
  ];

  // Dummy Data for DAS28 Scores
  const das28Data = [
    { week: "Week 1", score: 6.5 },
    { week: "Week 2", score: 6.0 },
    { week: "Week 3", score: 5.2 },
    { week: "Week 4", score: 4.6 },
    { week: "Week 5", score: 4.0 },
  ];
  
  


  const [isSidePanelOpen, setSidePanelOpen] = useState(false);
  const [userID, setUserID] = useState(''); // State to hold the UserID input
  const userData = location.state?.userData;

  const [isFitbitExpanded1, setFitbitExpanded1] = useState(false);
  const [isGarminExpanded1, setGarminExpanded1] = useState(false);
  const [isStravaExpanded1, setStravaExpanded1] = useState(false);

  const [isApplewatchExpanded, setApplewatchExpanded] = useState(false)
  const [isdatavisExpanded, setdatavisExpanded] = useState(false)
  const [isdatavisExpanded1, setdatavisExpanded1] = useState(false)
  const [isPromExpanded, setPromExpanded] = useState(false)

  const [filterValue, setFilterValue] = useState("");



  const applyFilter = () => {
    setAppliedValue(filterValue);  // Pass the filter value to PowerBiEmbedded
  };

  const togglePanel = () => {
    setPanelOpen(!isPanelOpen);
  };

  // Function to handle saving notes
  const handleSave = () => {
    // console.log('Note 1:', note1);
    // console.log('Note 2:', note2);
    // alert("Notes saved!");
    setPanelOpen(false);  // Close the panel after saving
  };

  const graphData = userData
    ? [
      { name: 'Calories', value: parseInt(userData?.Calories || 0) },
      { name: 'Sleep (hrs)', value: parseFloat(userData?.Sleep || 0) },
      { name: 'Steps', value: parseInt(userData?.Steps || 0) }
    ]
    : [];
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
  const images = [
    '/images/sug1.jpg',
    '/images/sug2.jpg',
    '/images/sug3.jpg'
  ];

  return (
    <div className="container mx-auto p-4">
      <Feedbacksidepanel
        isOpen={isPanelOpen}
        onClose={togglePanel}
        note1={note1}
        setNote1={setNote1}
        note2={note2}
        setNote2={setNote2}
        onSave={handleSave}
        images={images}
      />
      {/* Breadcrumb */}
      <nav className="mb-4 text-gray-700">
        <span className="text-blue-600 font-semibold">My Patients</span>
        <span className="mx-2">{'>'}</span>
        <span className="font-semibold">{name || 'Patient Name'}</span>
      </nav>


      {/* Personal  Information  */}
      <section className="bg-gray-100 p-6 rounded-lg shadow-lg mb-8 relative ">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Personal Information</h2>
        {/* Add Notes Button */}
        <button
          className="absolute top-6 right-8 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition duration-200 absolute"
          onClick={togglePanel} // Open SidePanel on click
        >
          {isPanelOpen ? '📝Add Notes' : '📝Add Notes'}
        </button>
        <div className="flex flex-col space-y-4 text-gray-700 text-lg">
          <div>
            <span className="font-semibold text-gray-900">Patient Name: </span>{ name|| `John`}
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


          <div>
            <span className="font-semibold text-gray-900">Needs glasses with an eyesight number</span>
            <input
              type="checkbox"
              checked={true}

              className="ml-2"
            />

          </div>

          <div>
            <span className="font-semibold text-gray-900">Diagnosed Condition : </span> Osteoarthritis
          </div>
        </div>


      </section>
      {/* Loading Modal */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
            <p className="mt-4 text-lg font-semibold">Loading data...</p>
          </div>
        </div>
      )}

      {/* Patient Overview */}
      <section className="bg-gray-100 p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Patient Overview</h2>

        <p className="text-gray-500 font-bold text-lg mt-6"> Patient progress:</p>

        {/* Status Bars */}
        <div className="mt-4 space-y-4">
          <StatusBar label="Total Steps" value={mockData.totalSteps} maxValue={100000} color="bg-green-500" />
          <StatusBar label="Total Active Minutes" value={mockData.totalActiveMinutes} maxValue={600} color="bg-blue-500" />
          <StatusBar label="Avg. Restful Sleep" value={7} maxValue={8} color="bg-purple-500" />
        </div>
      </section>

      {/* Data Visualization for specific UserID */}
      <section className="bg-white p-4 rounded-lg shadow-lg mb-4">
        <h3 className="text-xl font-bold text-gray-800">Data Visualization for UserID: {userID || '-'}</h3>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-6">
          {/* Show default "-" if no data is available */}
          <div className="p-6 border rounded-lg shadow-md bg-gray-50">
            <div><strong>Calories:</strong> {userData?.Calories || '-'}</div>
          </div>
          <div className="p-6 border rounded-lg shadow-md bg-gray-50">
            <div><strong>Sleep:</strong> {userData?.Sleep || '-'}</div>
          </div>
          <div className="p-6 border rounded-lg shadow-md bg-gray-50">
            <div><strong>Steps:</strong> {userData?.Steps || '-'}</div>
          </div>
        </div>
      </section>
      {/* Bar Chart Visualization */}
      <section className="bg-white p-4 rounded-lg shadow-lg mb-4">
        <h3 className="text-xl font-bold text-gray-800 mb-4">User Data Chart</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={graphData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>

      </section>


 {/* PROMS Section (Pain Points & DAS28 Scores) */}
<section className="bg-white p-4 rounded-lg shadow-lg mb-4">
  <div className="flex justify-between items-center cursor-pointer" onClick={() => setPromExpanded(!isPromExpanded)}>
    <h3 className="text-xl font-bold text-gray-800">Proms - Patient Reported Outcomes</h3>
    <button className="text-gray-800">
      {isPromExpanded ? <FaChevronUp /> : <FaChevronDown />}
    </button>
  </div>
  {isPromExpanded && (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* Smooth Curve Line Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-3">Pain Points Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={painData}>
            <XAxis dataKey="week" />
            <YAxis domain={[0, 10]} />
            <Tooltip />
            <Line 
              type="step"  // Makes the line smooth
              dataKey="pain" 
              stroke="red" 
              strokeWidth={2} 
              dot={{ r: 4 }} // Makes data points more visible
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* DAS28 Scores Bar Chart */}
     {/* DAS28 Scores Bar Chart */}
<div className="bg-white p-6 rounded-lg shadow-md">
  <h3 className="text-xl font-semibold text-gray-800 mb-3">DAS28 Scores Over Time</h3>
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={das28Data}>
      <XAxis dataKey="week" />
      <YAxis domain={[0, 10]} />
      <Tooltip />
      <Legend />
      <Bar dataKey="score" fill="#8884d8" />
    </BarChart>
  </ResponsiveContainer>
</div>


    </div>
  )}
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

      {/* Applewatch Section */}
      <section className="bg-white p-4 rounded-lg shadow-lg mb-4">
        <div className="flex justify-between items-center cursor-pointer" onClick={() => setApplewatchExpanded(!isApplewatchExpanded)}>
          <h3 className="text-xl font-bold text-gray-800">Apple Watch</h3>
          <button className="text-gray-800">
            {isApplewatchExpanded ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>
        {isApplewatchExpanded && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-6">
            <Pbi pagename="Apple" />

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


      <section className="bg-white p-4 rounded-lg shadow-lg mb-4">
        <div className="flex justify-between items-center cursor-pointer" onClick={() => setMSKExpanded(!isMSKExpanded)}>
          <h3 className="text-xl font-bold text-gray-800">MSK Health Index</h3>
          <button className="text-gray-800">
            {isMSKExpanded ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>
        {isMSKExpanded && (
          <div className="mt-4 h-[560px]">
            <PowerBIReport />
          </div>
        )}
      </section>;


      {/* Fitbit Section */}
      {/* <section className="bg-white p-4 rounded-lg shadow-lg mb-4">
        <div className="flex justify-between items-center cursor-pointer" onClick={() => setFitbitExpanded1(!isFitbitExpanded1)}>
          <h3 className="text-xl font-bold text-gray-800">Fitbit</h3>
          <button className="text-gray-800">
            {isFitbitExpanded1 ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>
        {isFitbitExpanded1 && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-6">
            <Pbi pagename="Fitbit" />


          </div>
        )}
      </section> */}

      {/* Garmin Section */}
      {/* <section className="bg-white p-4 rounded-lg shadow-lg mb-4">
        <div className="flex justify-between items-center cursor-pointer" onClick={() => setGarminExpanded1(!isGarminExpanded1)}>
          <h3 className="text-xl font-bold text-gray-800">Garmin</h3>
          <button className="text-gray-800">
            {isGarminExpanded1 ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>
        {isGarminExpanded1 && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-6">
            <Pbi pagename="Garmin" />


          </div>
        )}
      </section> */}

      {/* Strava Section */}
      {/* <section className="bg-white p-4 rounded-lg shadow-lg mb-4">
        <div className="flex justify-between items-center cursor-pointer" onClick={() => setStravaExpanded1(!isStravaExpanded1)}>
          <h3 className="text-xl font-bold text-gray-800">Strava</h3>
          <button className="text-gray-800">
            {isStravaExpanded1 ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>
        {isStravaExpanded1 && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-6">
            <Pbi pagename="Strava" />

          </div>
        )}
      </section> */}

















      {/* powerbi  plot  Section */}
      {/* <section className="bg-white p-4 rounded-lg shadow-lg mb-4">
        <div className="flex justify-between items-center cursor-pointer" onClick={() => setdatavisExpanded1(!isdatavisExpanded1)}>
          <h3 className="text-xl font-bold text-gray-800">Embedded Plot</h3>
          <button className="text-gray-800">
            {isdatavisExpanded1 ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>
        {isdatavisExpanded1 && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-6">
            <PowerBiembededstatic />
          </div>
        )}
      </section> */}






      {/* powerbi  report  Section */}
      {/* <section className="bg-white p-4 rounded-lg shadow-lg mb-4">
        <div className="flex justify-between items-center cursor-pointer" onClick={() => setdatavisExpanded(!isdatavisExpanded)}>
          <h3 className="text-xl font-bold text-gray-800">Embedded Premium Report</h3>
          <button className="text-gray-800">
            {isdatavisExpanded ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>
        {isdatavisExpanded && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-6">
            <PowerBiEmbeddedfilter pagename="MSK LabAll" filterValue={appliedValue} />


          </div>
        )}
      </section> */}

      {/* <Sidepanel isOpen={isSidePanelOpen} onClose={() => setSidePanelOpen(false)} /> */}

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

export default Patientdashboard;