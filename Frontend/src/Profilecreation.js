import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const ProfileCreation = () => {
  const [photo, setPhoto] = useState(null);
  const [aboutUs, setAboutUs] = useState('');
  const [testimonials, setTestimonials] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [shareableLink, setShareableLink] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Generate a unique ID for the profile
    const profileId = uuidv4();
    const profileData = {
      id: profileId,
      photo,
      aboutUs,
      testimonials,
      additionalDetails,
    };

    // Save profile data to localStorage
    localStorage.setItem(profileId, JSON.stringify(profileData));

    // Generate shareable link
    const link = `${window.location.origin}/cleanprofile/${profileId}`;
    setShareableLink(link);

    // Navigate to the profile page
    navigate(`/profilepage/${profileId}`);
  };

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(URL.createObjectURL(e.target.files[0]));
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareableLink);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Create Your Profile</h2>
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

        {/* Shareable Link Section */}
        {shareableLink && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md">
            <p className="mb-2 text-gray-700">Share this link:</p>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={shareableLink}
                readOnly
                className="flex-grow px-2 py-1 border rounded-md"
              />
              <button
                onClick={copyToClipboard}
                className="px-4 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Copy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCreation;
