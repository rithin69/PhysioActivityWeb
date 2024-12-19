import React from 'react';
import { useParams } from 'react-router-dom';

const ProfilePage = () => {
  const { id } = useParams();
  const profileData = JSON.parse(localStorage.getItem(id));

  // Copy clean profile link
  const handleCopyLink = () => {
    const cleanURL = `${window.location.origin}/cleanprofile/${id}`; // Clean URL with ID
    navigator.clipboard.writeText(cleanURL)
      .then(() => {
        alert('Clean Profile Link copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy link:', err);
      });
  };
  

  if (!profileData) {
    return <div className="p-4 text-center text-red-500">Profile not found!</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Profile Page</h2>
        {profileData.photo && (
          <img
            src={profileData.photo}
            alt="Profile"
            className="rounded-md w-32 h-32 object-cover mb-4"
          />
        )}
        <p className="mb-2"><strong>About Us:</strong> {profileData.aboutUs}</p>
        <p className="mb-2"><strong>Testimonials:</strong> {profileData.testimonials}</p>
        <p className="mb-2"><strong>Additional Details:</strong> {profileData.additionalDetails}</p>

        <div className="mt-4">
          <button
            onClick={handleCopyLink}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Copy Profile Link
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
