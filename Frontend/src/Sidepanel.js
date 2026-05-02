import React, { useState,useEffect } from 'react';
import { useSelector } from 'react-redux';
import { createfeedback } from './Services/api'; // Import the API function
const { v4: uuidv4 } = require('uuid'); // Importing UUID library for unique rowKey generation


const SidePanel = ({ isOpen, onClose }) => {
  // const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({ name: false, description: false });
  const userRole = useSelector((state) => state.role.role);
  const  name1  = useSelector((state) => state.user.name);

 

  const handleSubmit = async () => {
    const newErrors = {
      name: !name1,
      description: !description,
     
      
    };

    setErrors(newErrors);

    // If there are any errors, don't proceed
    if (Object.values(newErrors).some((error) => error)) return;

    const feedbackEntity = {
      PartitionKey: uuidv4(), // Use a meaningful PartitionKey
      RowKey: `${Date.now()}`, // Unique identifier for the feedback
      Name: name1,
      Description: description,
      Role: userRole
    };

    try {
      // Call the API to create feedback
      console.log(feedbackEntity)
      await createfeedback(feedbackEntity);
      // Reset form fields and errors
      // setName('');
      setDescription('');
      setErrors({ name: false, description: false });
      onClose(); // Close the side panel
    } catch (error) {
      console.error('Error submitting feedback:', error.message);
      // Optionally handle backend errors here
    }
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'
        } z-20`}
    >
      <div className="p-4">
        <button className="text-gray-600 float-right text-xl" onClick={onClose}>
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">Give Feedback</h2>
        <p className="text-gray-700 mb-4">Thank you for taking the time to give us feedback.</p>
        <div className="bg-blue-100 p-3 rounded-md mb-4">
          <p className="text-blue-700">
            <strong>ℹ️ If you need help, please contact support.</strong>
          </p>
        </div>

        {/* Name Input */}
        <label className="text-gray-800 font-semibold mb-2 block">Name:</label>
        < div className="relative">
          <input
            type="text"

            value={name1 || ''}
            // onChange={(e) => setName(e.target.value)}
            readOnly
            className="w-full p-2 border rounded-md bg-gray-100 cursor-not-allowed"
            placeholder="Your name"
          />
        

        {errors.name && (
          <>
            <span className="absolute right-3 top-3 text-red-500 text-xl">!</span>
            <p className="text-red-500 text-sm mt-1">Please enter your Name</p>
          </>
        )}
      </div>

      {/* Description Input */}
      <label className="text-gray-800 font-semibold mb-2 block">Description:</label>
      <div className="relative">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`w-full p-2 border rounded-md ${errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
          placeholder="Enter your feedback"
          rows="4"
        ></textarea>
        {errors.description && (
          <>
            <span className="absolute right-3 top-3 text-red-500 text-xl">!</span>
            <p className="text-red-500 text-sm mt-1">Please enter your Description</p>
          </>
        )}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2  mt-1 rounded-md hover:bg-blue-600"
      >
        Submit
      </button>
    </div>
    </div >
  );
};

export default SidePanel;
