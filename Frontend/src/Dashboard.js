import React from 'react';
import { FaMapMarkerAlt, FaFire, FaSmile, FaHeartbeat, FaMoon, FaWeight, FaUsers, FaStar } from 'react-icons/fa';
import { IoFootsteps } from "react-icons/io5";

const Dashboard = ({ data }) => {
  return (
    <div className="flex-1 bg-white shadow-lg rounded-lg p-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-green-600">Hi, Jimmy!</h1>
        <p className="text-gray-500 text-lg">Here are your stats for Jul. 22 - Jul. 28</p>
      </div>
      <div className="text-center mb-8">
        <div className="flex justify-around mt-6">
          {data.weekDays.map((day, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="w-14 h-14 bg-[#104378] text-white rounded-full flex items-center justify-center">
                <FaStar />
              </div>
              <span className="mt-2 text-gray-600 text-lg font-semibold">{day}</span>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <h2 className="text-4xl font-semibold flex items-center justify-center">
            {data.totalSteps} <IoFootsteps className="ml-3 text-green-600" />
          </h2>
          <p className="text-gray-500 text-lg">Avg: {data.avgSteps} steps per day</p>
          <p className="text-gray-500 text-lg">{data.stepsComparison}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
        <Detail icon={<FaSmile className="text-yellow-500" />} value={data.totalFloors} label="total floors" comparison="100 floors below last week" />
        <Detail icon={<FaMapMarkerAlt className="text-blue-500" />} value={data.totalDistance} label="total km" comparison="1.44 km below last week" />
        <Detail icon={<FaFire className="text-red-500" />} value={data.totalCalories} label="avg. daily calorie burn" comparison="43 cals. over last week" />
        <Detail icon={<FaHeartbeat className="text-pink-500" />} value={data.totalActiveMinutes} label="total active zone minutes" comparison="33 min since last week" />
        <Detail icon={<FaMoon className="text-purple-500" />} value={data.avgSleepDuration} label="avg. restful sleep" comparison="0 hrs 19 min lower than last week" />
        <Detail icon={<FaUsers className="text-green-500" />} value={data.avgStepsPerDay} label="avg. hrs with 250+ steps" comparison="same as previous week" />
        <Detail icon={<FaHeartbeat className="text-teal-500" />} value={data.avgRestingHeartRate} label="avg. resting heart rate" comparison="1 bpm since last week" />
        <Detail icon={<FaWeight className="text-orange-500" />} value={data.weight} label="weight loss" comparison="same as previous week" />
      </div>
    </div>
  );
};

const Detail = ({ icon, value, label, comparison }) => (
  <div className="p-6 border rounded-lg shadow-md bg-gray-50">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-2xl font-bold text-green-600">{value}</h3>
    <p className="text-gray-600 text-lg">{label}</p>
    <p className="text-gray-500 text-sm">{comparison}</p>
  </div>
);

export default Dashboard;
