import React from 'react';

const ProfilePage = () => {
  const profileData = JSON.parse(localStorage.getItem('profileData')) || {};
  console.log(profileData)

  return (
    <div className="min-h-screen flex bg-gray-100">
      <div className="flex-grow p-8">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-5xl mx-auto">
          <div className="flex items-start space-x-8">
            {profileData.photo && (
              <div className="w-1/3">
                <img src={profileData.photo} alt="Profile" className="rounded-lg w-full h-auto object-cover" />
              </div>
            )}
            <div className="w-2/3">
              <h2 className="text-4xl font-bold mb-6">Profile</h2>
              <div className="mb-6">
                <h3 className="text-2xl font-semibold mb-2">About Us</h3>
                <p className="text-lg text-gray-700">{profileData.aboutUs}</p>
              </div>
              <div className="mb-6">
                <h3 className="text-2xl font-semibold mb-2">Testimonials</h3>
                <p className="text-lg text-gray-700">{profileData.testimonials}</p>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-2">Additional Details</h3>
                <p className="text-lg text-gray-700">{profileData.additionalDetails}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
