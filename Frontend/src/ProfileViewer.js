import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ProfileViewer = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(
            `https://physioprofile.blob.core.windows.net/profile/${id}`
          );
          
        if (!res.ok) throw new Error("Profile not found.");
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchProfile();
  }, [id]);

  if (error) {
    return <div className="p-6 text-red-600">Error: {error}</div>;
  }

  if (!profile) {
    return <div className="p-6 text-gray-600">Loading profile...</div>;
  }

  return (
    <div className="ml-[72px] mt-[64px] p-6 bg-gray-100 min-h-[calc(100vh-64px)]">
      <div className="max-w-full mx-auto bg-white p-6 rounded-xl shadow-md">
        <div className="flex items-center space-x-4">
          <img
            src={profile.image}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover"
          />
          <div>
            <h2 className="text-2xl font-bold">{profile.name}</h2>
            <p className="text-gray-600">{profile.title}</p>
            <p className="text-gray-500">{profile.location}</p>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="font-semibold text-lg">Bio</h3>
          <p className="text-gray-700">{profile.bio}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileViewer;
