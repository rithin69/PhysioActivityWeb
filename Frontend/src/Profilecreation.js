import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from './RoleContext';

const ProfileCreation = () => {
  const [photo, setPhoto] = useState(null);
  const [aboutUs, setAboutUs] = useState('');
  const [testimonials, setTestimonials] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const navigate = useNavigate();
  const { role } = useRole();
  const baseUrl = `/${role}`;


  const handleSubmit = (e) => {
    e.preventDefault();
    const profileData = {
      photo,
      aboutUs,
      testimonials,
      additionalDetails,
    };
    localStorage.setItem('profileData', JSON.stringify(profileData));
    navigate(`${baseUrl}/profilepage`);
  };

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSampleProfileClick = () => {
    window.open('https://physioactivity-1.web.app/physio/siri', '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Create Your Profile</h2>
          <button 
            type="button" 
            onClick={handleSampleProfileClick} 
            className="px-4 py-2 bg-green-500 text-white rounded-md"
          >
            Sample Profile
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Upload Photo:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="w-full px-4 py-2 bg-gray-100 rounded-md"
            />
            {photo && <img src={photo} alt="Profile" className="mt-4 rounded-md w-32 h-32 object-cover" />}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">About Us:</label>
            <textarea
              value={aboutUs}
              onChange={(e) => setAboutUs(e.target.value)}
              className="w-full px-4 py-2 bg-gray-100 rounded-md"
              rows="4"
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Testimonials:</label>
            <textarea
              value={testimonials}
              onChange={(e) => setTestimonials(e.target.value)}
              className="w-full px-4 py-2 bg-gray-100 rounded-md"
              rows="4"
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Additional Details:</label>
            <textarea
              value={additionalDetails}
              onChange={(e) => setAdditionalDetails(e.target.value)}
              className="w-full px-4 py-2 bg-gray-100 rounded-md"
              rows="4"
            ></textarea>
          </div>
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileCreation;
