import React, { useState } from 'react';

function Settings() {
  const [profile, setProfile] = useState({
    displayPic: '/images/patient.jpg',
    name: 'John Doe',
    address: '123 Main St, Springfield, USA',
    age: 30,
    gender: 'Male'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prevProfile => ({
      ...prevProfile,
      [name]: value
    }));
  };

  const handleSave = () => {
    // Handle save logic here
    console.log('Profile saved:', profile);
  };

  const handleUpdate = () => {
    // Handle update logic here
    console.log('Profile updated:', profile);
  };

  return (
    // <div className="flex min-h-screen bg-gray-100">
    //   <div className="flex-1 flex items-center justify-center p-4">
        <div className="  rounded-lg shadow-lg p-6 w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-4 text-center">Profile Settings</h2>
          <div className="flex flex-col items-center mb-4">
            <img src={profile.displayPic} alt="Profile" className="w-32 h-32 rounded-full mb-4" />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProfile({ ...profile, displayPic: URL.createObjectURL(e.target.files[0]) })}
              className="mb-4"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Name:</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-100 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Address:</label>
            <input
              type="text"
              name="address"
              value={profile.address}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-100 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Age:</label>
            <input
              type="number"
              name="age"
              value={profile.age}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-100 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Gender:</label>
            <select
              name="gender"
              value={profile.gender}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-100 rounded-md"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="flex justify-between">
            <button
              onClick={handleUpdate}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Update
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Save
            </button>
          </div>
        </div>
    //   </div>
    // </div>
  );
}

export default Settings;
