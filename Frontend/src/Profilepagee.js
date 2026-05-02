import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import PowerBIReport from "./PowerBIReport";
import axios from "axios";

const Profilepagee = () => {
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const queryUserId = params.get("user"); // e.g., /myprofile?user=abc123
    const user_role = useSelector((state) => state.user.user_role);
    const reduxUser = useSelector((state) => state.user);
    const isCurrentUser = !queryUserId || queryUserId === reduxUser.userID;
    const shouldShowEditableSection = user_role === "physio" && !isCurrentUser;


    const tabs = ["Questions", "Notes", "Reminders", "Exercises"];
    const [questionsText, setQuestionsText] = useState("");
    const [exercisesText, setExercisesText] = useState("");

    // This will determine if physio is viewing someone else's profile
    const canEdit = user_role === "physio";

    // const isCurrentUser = !queryUserId || queryUserId === reduxUser.userID;

    const [profileData, setProfileData] = useState({
        name: reduxUser.name || "NA",
        email: reduxUser.email || "NA",
        country: reduxUser.country || "United Kingdom",
        userID: reduxUser.userID,
    });

    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("Notes");
    const [notesText, setNotesText] = useState("");
    const [remindersText, setRemindersText] = useState("");


    useEffect(() => {
        if (queryUserId && queryUserId !== reduxUser.userID) {
            fetchProfileData(queryUserId);
        }
    }, [queryUserId]);

    const fetchProfileData = async (id) => {
        setLoading(true);
        try {
            const response = await axios.post(
                "https://physioactivitybackend-gjb3dnbsgdcbgjfj.uksouth-01.azurewebsites.net/getUsersFromIds",
                { ids: [id] }
            );

            if (response.data?.users?.length > 0) {
                const user = response.data.users[0];
                setProfileData({
                    name: user.displayName || "N/A",
                    email: user.email || "N/A",
                    country: user.country || "N/A",
                    userID: user.id || id,
                });
            }
        } catch (err) {
            console.error("Error fetching user data:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (type) => {
        const content = type === "Notes" ? notesText : remindersText;
        alert(`Submitted ${type}: ${content}`);
        // Save to DB logic here
    };

    return (
        <div className="w-full bg-gray-100 min-h-screen px-8 py-6">
            {/* Breadcrumb */}
            <div className="mb-4 text-sm text-gray-600">
                <a
                    // href="https://physioactivity-release-gxhva6e5htafdbfk.germanywestcentral-01.azurewebsites.net/"
                    className="text-blue-600 hover:underline"
                >
                    Dashboard
                </a>
                {" > "}
                <span className="font-medium">
                    {isCurrentUser ? "MyProfile" : profileData.name || "Profile"}
                </span>
            </div>

            {/* Profile Card */}
            <div className="bg-white shadow-md rounded-lg p-6 w-full mb-6">
                <div className="flex items-center space-x-4 mb-4">
                    <img
                        src="/images/patient.jpg"
                        alt="User Avatar"
                        className="w-16 h-16 rounded-full object-cover"
                    />
                    <h2 className="text-2xl font-semibold">{profileData.name}</h2>
                </div>

                {loading ? (
                    <p>Loading patient details...</p>
                ) : (
                    <div>
                        <h3 className="text-lg font-bold mb-2">Personal Information</h3>
                        <p><strong>Patient Name:</strong> {profileData.name}</p>
                        <p><strong>Email:</strong> {profileData.email}</p>
                        <p><strong>Country:</strong> {profileData.country}</p>
                    </div>
                )}

                {/* ✅ Show Update button only for self */}
                {isCurrentUser && (
                    <div className="flex justify-end mt-6">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                            Update Profile
                        </button>
                    </div>
                )}
            </div>

            {/* Power BI Report */}
            {!(user_role === "physio" && isCurrentUser) && (
                <section className="bg-white p-4 rounded-lg shadow-lg w-full mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Report</h3>
                    <div className="h-[600px] w-full border rounded overflow-hidden">
                        <PowerBIReport userID={profileData.userID} />
                    </div>
                </section>
            )}


            {(shouldShowEditableSection || user_role === "patient") && (
                <section className="bg-white p-6 rounded-lg shadow-lg w-full">
                    <div className="flex space-x-4 mb-4">
                        {tabs
                            .filter((tab) => {
                                if (user_role === "physio") return true;
                                // Patients see only Notes and Reminders
                                return tab === "Notes" || tab === "Reminders";
                            })
                            .map((tab) => (
                                <button
                                    key={tab}
                                    className={`px-4 py-2 rounded ${activeTab === tab
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-200 text-gray-800"
                                        }`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab}
                                </button>
                            ))}
                    </div>

                    <div>
                        <textarea
                            className="w-full p-3 border rounded mb-4"
                            rows="6"
                            placeholder={`Enter ${activeTab.toLowerCase()} here...`}
                            value={
                                activeTab === "Questions"
                                    ? questionsText
                                    : activeTab === "Notes"
                                        ? notesText
                                        : activeTab === "Reminders"
                                            ? remindersText
                                            : exercisesText
                            }
                            onChange={(e) => {
                                const val = e.target.value;
                                if (user_role === "physio" || isCurrentUser) {
                                    if (activeTab === "Questions") setQuestionsText(val);
                                    else if (activeTab === "Notes") setNotesText(val);
                                    else if (activeTab === "Reminders") setRemindersText(val);
                                    else setExercisesText(val);
                                }
                            }}
                            readOnly={user_role === "patient" && !isCurrentUser}
                        />

                        {(user_role === "physio" || (user_role === "patient" && isCurrentUser)) && (
                            <button
                                onClick={() => handleSubmit(activeTab)}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                Save
                            </button>
                        )}
                    </div>
                </section>
            )}


        </div>
    );
};

export default Profilepagee;
