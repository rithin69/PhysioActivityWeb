// ✅ UPDATED FRONTEND (React) - AdminDashboard.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from 'uuid'; // Add this import
import { DotLottieReact } from '@lottiefiles/dotlottie-react';



const AdminDashboard = () => {
  const [isAddingAttribute, setIsAddingAttribute] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [userAttributes, setUserAttributes] = useState({});
  const [newAttrKey, setNewAttrKey] = useState("");
  const [newAttrValue, setNewAttrValue] = useState("");

  const { name, isAdmin } = useSelector((state) => state.user);

  useEffect(() => {
    if (!isAdmin) return;

    axios
      .get("https://physioactivitybackend-gjb3dnbsgdcbgjfj.uksouth-01.azurewebsites.net/api/users")
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        setLoading(false);
      });
  }, [isAdmin]);

  const toggleExpand = async (userId) => {
    if (expandedUserId === userId) {
      setExpandedUserId(null);
      return;
    }
  
    try {
      const res = await axios.get(`https://physioactivitybackend-gjb3dnbsgdcbgjfj.uksouth-01.azurewebsites.net/api/users/${userId}`);
      
      // Ensure we fall back to empty object if extensions is undefined
      const attrs = res.data.extensions || {}; 
  
      setUserAttributes((prev) => ({ ...prev, [userId]: attrs }));
      setExpandedUserId(userId);
    } catch (err) {
      console.error("Error fetching user attributes:", err);
      // Initialize empty attributes if error occurs
      setUserAttributes((prev) => ({ ...prev, [userId]: {} })); 
    }
  };

  const handleSave = async (userId) => {
    const updates = userAttributes[userId];
    if (!updates) return;
  
    try {
      const BACKEND_API_URL = "https://physioactivitybackend-gjb3dnbsgdcbgjfj.uksouth-01.azurewebsites.net";
      
      // Standardize attribute names before sending
      const standardizedUpdates = {};
      Object.entries(updates).forEach(([key, value]) => {
        const standardizedKey = key.toLowerCase().replace(/\$/g, '');
        standardizedUpdates[standardizedKey] = value;
      });
  
      await axios.patch(
        `${BACKEND_API_URL}/api/users/${userId}`,
        standardizedUpdates,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      alert("✅ User updated successfully");
    } catch (err) {
      let errorMsg = "Failed to save changes";
      
      if (err.response) {
        errorMsg = err.response.data?.error || 
                  err.response.data?.message || 
                  "Server error occurred";
        
        if (err.response.data?.details) {
          errorMsg += `: ${err.response.data.details}`;
        }
        
        if (err.response.data?.availableAttributes) {
          errorMsg += `\n\nAvailable attributes: ${err.response.data.availableAttributes.join(', ')}`;
        }
      } else {
        errorMsg = err.message;
      }
  
      alert(`❌ ${errorMsg}`);
    }
  };
  const handleAttrChange = (userId, key, value) => {
    setUserAttributes((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [key]: value,
      },
    }));
  };

  const handleAddAttribute = async (userId) => {
    if (!newAttrKey || !newAttrValue) return;
  
    setIsAddingAttribute(true); // Show loader
  
    try {
      const CLIENT_ID = "46873b53-0650-4ae0-bc87-a802c625a33f";
      const BACKEND_API_URL = "https://physioactivitybackend-gjb3dnbsgdcbgjfj.uksouth-01.azurewebsites.net";
  
      const cleanKey = newAttrKey
        .replace(/^extension_[a-f0-9]{32}_/i, '')
        .replace(/[^a-zA-Z0-9_]/g, '')
        .toLowerCase()
        .substring(0, 20);
  
      if (!cleanKey) throw new Error("Invalid attribute name");
  
      const cleanAttributeName = cleanKey;
  
      await axios.post(
        `${BACKEND_API_URL}/api/users/${userId}/attributes`,
        {
          attributeName: cleanAttributeName,
          attributeValue: newAttrValue
        },
        {
          timeout: 60000,
          headers: {
            'Content-Type': 'application/json',
            'X-Request-Id': uuidv4()
          }
        }
      );
  
      setUserAttributes(prev => ({
        ...prev,
        [userId]: {
          ...prev[userId],
          [`extension_${CLIENT_ID.replace(/-/g, '')}_${cleanKey}`]: newAttrValue
        }
      }));
  
      setNewAttrKey("");
      setNewAttrValue("");
  
    } catch (err) {
      let errorDetails = "Unknown error occurred";
      if (err.response?.data) {
        errorDetails = JSON.stringify(err.response.data, null, 2);
      } else {
        errorDetails = err.message;
      }
  
      alert(`❌ Failed to add attribute\n\n${errorDetails}`);
    } finally {
      setIsAddingAttribute(false); // Hide loader
    }
  };
  
  return (
    <div className="p-6">
      {isAddingAttribute && (
  <div className="fixed inset-0 bg-white bg-opacity-80 z-50 flex flex-col items-center justify-center">
    <DotLottieReact
      src="https://lottie.host/4f4767e5-444c-4415-b506-73a3f8fd509e/L5MkdDfXo6.lottie"
      loop
      autoplay
      style={{ height: '200px', width: '200px' }}
    />
    <p className="text-lg font-semibold mt-4 text-gray-700">Adding Attribute...</p>
  </div>
)}


      <h2 className="text-2xl font-bold mb-2">👋 Welcome, Admin {name}</h2>
      <h3 className="text-xl font-semibold mb-4">📋 Registered Users</h3>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="bg-white border rounded shadow p-4">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleExpand(user.id)}
              >
                <div>
                  <p className="font-semibold">{user.displayName || "—"}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-xs text-gray-400">ID: {user.id}</p>
                </div>
                <button className="text-blue-600 underline">{expandedUserId === user.id ? "Collapse" : "Expand"}</button>
              </div>

              {expandedUserId === user.id && (
                <div className="mt-4 space-y-3">
                  <h4 className="font-medium text-gray-700">Custom Attributes</h4>
                  {Object.entries(userAttributes[user.id] || {}).map(([key, value]) => (
                    <div key={key} className="flex gap-2">
                      <input className="border p-1 rounded w-1/3" value={key} disabled />
                      <input
                        className="border p-1 rounded w-2/3"
                        value={value}
                        onChange={(e) => handleAttrChange(user.id, key, e.target.value)}
                      />
                    </div>
                  ))}

                  <div className="flex gap-2 mt-2">
                    <input
                      className="border p-1 rounded w-1/3"
                      placeholder="New Key"
                      value={newAttrKey}
                      onChange={(e) => setNewAttrKey(e.target.value)}
                    />
                    <input
                      className="border p-1 rounded w-2/3"
                      placeholder="New Value"
                      value={newAttrValue}
                      onChange={(e) => setNewAttrValue(e.target.value)}
                    />
                    <button onClick={() => handleAddAttribute(user.id)} className="bg-green-500 text-white px-3 py-1 rounded">
                      Add
                    </button>
                  </div>

                  <button onClick={() => handleSave(user.id)} className="mt-3 bg-blue-600 text-white px-4 py-2 rounded">
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
