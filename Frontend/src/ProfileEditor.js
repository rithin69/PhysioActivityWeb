import React, { useState, useEffect } from "react";
import { Pencil } from "lucide-react";
const EditableText = ({ label, value, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [temp, setTemp] = useState(value);

  const handleSave = () => {
    onSave(temp);
    setIsEditing(false);
  };

  return (
    <div className="mb-2">
      <div className="text-gray-600 text-sm">{label}</div>
      <div className="flex items-center justify-between gap-2">
        {!isEditing ? (
          <>
            <span className="text-lg font-medium">{value}</span>
            <button
              onClick={() => setIsEditing(true)}
              className="text-gray-500 hover:text-blue-500"
            >
              <Pencil size={16} />
            </button>
          </>
        ) : (
          <>
            <input
              value={temp}
              onChange={(e) => setTemp(e.target.value)}
              className="border rounded px-2 py-1 w-full"
            />
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Save
            </button>
          </>
        )}
      </div>
    </div>
  );
};


const ProfileEditor = () => {


 

    const [name, setName] = useState("johnnn");
    const [title, setTitle] = useState("I'm a Full Stack Developer.");
    const [bio, setBio] = useState("I thrive on building robust web apps");
    const [location, setLocation] = useState("Mumbai, India");
    const [image, setImage] = useState("/avatar-placeholder.png");

    const [modalOpen, setModalOpen] = useState(false);
    const [profileUrl, setProfileUrl] = useState("");

    const handleImageChange = (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const url = URL.createObjectURL(file);
        setImage(url);
      }
    };

    const handlePublish = async () => {
      const profile = { name, title, bio, location, image };

      if (image.startsWith("blob:")) {
        const blob = await fetch(image).then((r) => r.blob());
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Image = reader.result;
          profile.image = base64Image;
          await sendToPowerAutomate(profile);
        };
        reader.readAsDataURL(blob);
      } else {
        await sendToPowerAutomate(profile);
      }
    };

    const sendToPowerAutomate = async (profile) => {
      try {
        const response = await fetch("https://prod-21.uksouth.logic.azure.com:443/workflows/ec195a72fd3a45a6839ecce2fb2f8c40/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Sy9RnMnNvTOxCzXAD2cq6PtXo-jE4hrbctx6hm5pqbw", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(profile),
        });

        const result = await response.json();
        if (result.url) {
          setProfileUrl(result.url);
          setModalOpen(true); // open modal
        } else {
          alert("Failed to get profile URL");
        }
      } catch (err) {
        console.error("Error uploading profile:", err);
        alert("Upload failed.");
      }
    };

    return (
      <div className="ml-[72px] mt-[64px] p-6 bg-gray-100 min-h-[calc(100vh-64px)]">
        <div className="max-w-full mx-auto bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <img src={image} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
              <label className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition">
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                <Pencil className="text-white" size={20} />
              </label>
            </div>
            <div className="flex-1">
              <EditableText label="Name" value={name} onSave={setName} />
              <EditableText label="Title" value={title} onSave={setTitle} />
              <EditableText label="Location" value={location} onSave={setLocation} />
            </div>
          </div>
          <div className="mt-6">
            <EditableText label="Bio" value={bio} onSave={setBio} />
          </div>
          <button
            onClick={handlePublish}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Publish
          </button>
        </div>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full text-center">
              <h2 className="text-xl font-bold mb-2 text-green-600">Profile Published Successfully!</h2>
              <p className="text-gray-700 mb-4">Here is your profile URL:</p>
              <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all">
                {profileUrl}
              </a>
              <button
                onClick={() => setModalOpen(false)}
                className="mt-6 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };
  export default ProfileEditor