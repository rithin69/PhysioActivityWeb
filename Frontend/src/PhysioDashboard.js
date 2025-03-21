import React, { useState } from 'react';
import Patients from './Patients';
import Anonypatients from './Anonypatients';
import Navbar from './Navbar';
import { createEntity, getEntities, updateEntity, deleteEntity } from './Services/api';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';


const PhysioDashboard = () => {

  const [isFitbitExpanded, setFitbitExpanded] = useState(false);
  const [isGarminExpanded, setGarminExpanded] = useState(false);
  const [isStravaExpanded, setStravaExpanded] = useState(false);
  const [isApplewatchExpanded, setApplewatchExpanded] = useState(false)
  const [isdatavisExpanded, setdatavisExpanded] = useState(false)
  const [isdatavisExpanded1, setdatavisExpanded1] = useState(false)
  const [isPromExpanded, setPromExpanded] = useState(false)


  const [filterValue, setFilterValue] = useState("");  // State to hold the textbox input
  const [appliedValue, setAppliedValue] = useState("");
  const [userID, setUserID] = useState(''); // State to hold the UserID input
  const [userData, setUserData] = useState(null); // State to store the queried data by UserID

  const graphData = userData
    ? [
      { name: 'Calories', value: parseInt(userData?.Calories || 0) },
      { name: 'Sleep (hrs)', value: parseFloat(userData?.Sleep || 0) },
      { name: 'Steps', value: parseInt(userData?.Steps || 0) }
    ]
    : [];

  const settings = {
    dots: true,
    infinite: true,
    speed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 9000,
    arrows: true,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true
        }
      }
    ]
  };

  const applyFilter = () => {
    setAppliedValue(filterValue);
  };
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

  const navigate = useNavigate(); // Initialize navigate hook

  const handleFetchData = async () => {
    try {
      const response = await getEntities();
      const filteredData = response.data.find((entity) => entity.UserID === userID);
      setUserData(filteredData || { Calories: '-', Sleep: '-', Steps: '-' });

      // Navigate to visualization page with the UserID passed in route state
      navigate('/Patientdashboard', { state: { userData: filteredData } });
    } catch (error) {
      console.error('Error fetching data by UserID:', error);
      setUserData({ Calories: '-', Sleep: '-', Steps: '-' });
    }
  };


  return (

    <div className="container mx-auto ml-20 overflow-x-hidden">


     

      {/* Patient Overview */}
      < section className="bg-gray-100 p-6 rounded-lg shadow-lg mb-8" >
        {/* <h2 className="text-2xl font-bold text-gray-900 mb-4">Summary</h2> */}

        {/* Tiles Container */}
        <div className="w-full">
          <Slider {...settings} className="w-full">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3>Slide 1</h3>
              <p>Content for Slide 1</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3>Slide 2</h3>
              <p>Content for Slide 2</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3>Slide 3</h3>
              <p>Content for Slide 3</p>
            </div>
          </Slider>
         
        </div>
      </ section>
      < section className="bg-gray-100 p-6 rounded-lg shadow-lg mb-8" >
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Enter User Sharing Code</h2>
        <input
          type="text"
          placeholder="Enter Share Code"
          value={userID}
          onChange={(e) => setUserID(e.target.value)}
          className="border p-2 rounded mb-4"
        />
        <button onClick={handleFetchData} className="bg-blue-500 text-white px-4 py-2 rounded">
          Enter
        </button>
        {/* <section className="bg-gray-100 p-6 rounded-lg shadow-lg mb-8">  */}
        {/* <h2 className="text-2xl font-bold text-gray-900 mb-4">Enter FilterID</h2> */}

        {/* Textbox to enter filter value */}
        {/* <input
          type="text"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          className="border p-2 rounded mb-4"

          placeholder="Enter ID to filter"  // Example placeholder
        /> */}

        {/* Button to apply the filter */}
        {/* <button className="bg-pink-500 text-white px-4 py-2 rounded" onClick={applyFilter}>Apply Filter</button> */}

        {/* Pass the applied filter value to PowerBiEmbedded as a prop */}

      </section>


      <section className="bg-gray-100 p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">New  Patients</h2>
        <Anonypatients ></Anonypatients>
      </section>
      <section className="bg-gray-100 p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">My Patients </h2>
        <Patients></Patients>
      </section>
















    </div >
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

export default PhysioDashboard;