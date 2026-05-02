import React, { useState, useEffect } from 'react';
import { XIcon, PencilAltIcon, PlusIcon } from '@heroicons/react/outline';
import Modal from 'react-modal';
import QRCode from 'qrcode.react';
import { useNavigate } from 'react-router-dom';
import { useRole } from './RoleContext';

// Inside your Patients component


// import './tailwind.output.css'; // Ensure Tailwind CSS is included

const todayAppointmentsInitial = [
  {
    time: '9:00 AM',
    date: '2024-07-28',
    name: 'Zoe Miller',
    age: 30,
    condition: 'Osteoporosis',
    image: '/images/patient.jpg',
  },
  {
    time: '9:30 AM',
    date: '2024-07-28',
    name: 'John Smith',
    age: 22,
    condition: 'Osteoarthritis',
    image: '/images/patient.jpg',
  },
  {
    time: '10:30 AM',
    date: '2024-07-28',
    name: 'Sergio Pliego',
    age: 33,
    condition: 'Rheumatoid Arthritis',
    image: '/images/patient.jpg',
  },
  {
    time: '11:15 AM',
    date: '2024-07-28',
    name: 'Shirline Dungey',
    age: 45,
    condition: 'Osteomyelitis',
    image: '/images/patient.jpg',
  },
  
];

const tomorrowAppointmentsInitial = [
  {
    time: '9:00 AM',
    date: '2024-07-29',
    name: 'Emily Clark',
    age: 28,
    condition: 'Osteosarcoma',
    image: '/images/patient2.jpeg',
  },
  {
    time: '9:30 AM',
    date: '2024-07-29',
    name: 'Michael Johnson',
    age: 35,
    condition: 'Rickets',
    image: '/images/patient2.jpeg',
  },
  {
    time: '10:30 AM',
    date: '2024-07-29',
    name: 'Samantha Brown',
    age: 42,
    condition: 'Spondylitis',
    image: '/images/patient2.jpeg',
  },
  {
    time: '11:15 AM',
    date: '2024-07-29',
    name: 'Gregory Wilson',
    age: 50,
    condition: 'Fractures',
    image: '/images/patient2.jpeg',
  },
  

];

Modal.setAppElement('#root');

const Patients = () => {
  const [todayAppointments, setTodayAppointments] = useState(todayAppointmentsInitial);
  const [tomorrowAppointments, setTomorrowAppointments] = useState(tomorrowAppointmentsInitial);
  const [selectedTab, setSelectedTab] = useState('Today');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sortOption, setSortOption] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [qrModalIsOpen, setQrModalIsOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [notes, setNotes] = useState('');

  const { role } = useRole();
  const baseUrl = `/${role}`;
  const navigate = useNavigate();

  // ************************countdown*********************
  const [countdownTime, setCountdownTime] = useState(54000); // Initial time in seconds (15 hours)
  const [appointmentTime] = useState(new Date(new Date().getTime() + 54000 * 1000)); // 15 hours from now

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdownTime(prevTime => prevTime > 0 ? prevTime - 1 : 0);
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  // ************************countdown*********************

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const rescheduleAppointment = (index, tab) => {
    // Logic for rescheduling appointment goes here
    // alert(`Reschedule appointment for ${tab} at index ${index}`);
  };

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };


  const sortAppointments = (appointments) => {
    if (sortOption === 'time') {
      return [...appointments].sort((a, b) => new Date(`1970/01/01 ${a.time}`) - new Date(`1970/01/01 ${b.time}`));
    } else if (sortOption === 'name') {
      return [...appointments].sort((a, b) => a.name.localeCompare(b.name));
    }
    return appointments;
  };

  const openModal = (appointment) => {
    setSelectedAppointment(appointment);
    setNotes('');
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedAppointment(null);
    setNotes('');
  };

  const saveNotes = () => {
    console.log('Notes saved:', notes);
    closeModal();
  };

  const openQrModal = () => {
    setQrModalIsOpen(true);
  };

  const closeQrModal = () => {
    setQrModalIsOpen(false);
  };

  const currentAppointments = selectedTab === 'Today' ? todayAppointments : tomorrowAppointments;
  const sortedAppointments = sortAppointments(currentAppointments);
  const handlePatientClick = (appointment) => {
    // Only passing the name here
    navigate(`/Patientdashboard`, { state: { name: appointment.name } });
  };

  return (
    <div className=" bg-gray-100 p-4 font-sans">
      {/* Reminder Container */}
      {/* <div className="mb-6 p-4 bg-blue-100 text-blue-800 rounded-lg shadow-md flex items-center justify-between">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a2 2 0 002-2H8a2 2 0 002 2zm6-6V9a6 6 0 10-12 0v3a2 2 0 01-1 1.732V15h14v-1.268A2 2 0 0116 12z" clipRule="evenodd" />
          </svg>
          <div>
            <h3 className="text-lg font-semibold">Appointment with Zoe Miller</h3>
            <p>In {formatTime(countdownTime)}</p>
          </div>
        </div>
        <button className="flex items-center bg-red-500 text-white px-4 py-2 rounded-md shadow-md" onClick={() => { navigate(`${baseUrl}/dashboard`); }}>

          Open
        </button>
      </div> */}


      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-2">
          {/* <h2 className="text-xl font-semibold flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
              />
            </svg>
            Appointments ({sortedAppointments.length})
          </h2> */}
          {/* <span className="text-gray-500">
            {currentTime.toLocaleDateString()} - {currentTime.toLocaleTimeString()}
          </span> */}
        </div>

        {/* <div className="mb-4 text-gray-700">
          You have the following appointments.
        </div> */}
        {/* <div className="flex mb-4">
          <button
            onClick={() => handleTabClick('Today')}
            className={`px-4 py-2 ${selectedTab === 'Today' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded-l-md`}
          >
            Today
          </button>
          <button
            onClick={() => handleTabClick('Tomorrow')}
            className={`px-4 py-2 ${selectedTab === 'Tomorrow' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded-r-md`}
          >
            Tomorrow
          </button>
          <select
            onChange={handleSortChange}
            className="ml-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
          >
            <option value="">Sort By</option>
            <option value="time">Time</option>
            <option value="name">Name</option>
          </select>
        </div> */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedAppointments.map((appointment, index) => (

           <div
              key={index}
              className="bg-white p-4 rounded-lg shadow-md flex flex-col cursor-pointer"
              onClick={() => handlePatientClick(appointment)} // Navigate on patient click
            >
              <div className="flex items-center mb-4">
                <img
                  src={appointment.image}
                  alt={appointment.name}
                  className="w-20 h-20 rounded-full mr-4"
                />
                <div>
                  <h3 className="text-lg font-medium">
                    {appointment.name}, {appointment.age}
                  </h3>
                  <p className="text-gray-500">{appointment.condition}</p>
                  <p className="text-gray-400">{appointment.date} - {appointment.time}</p>
                </div>
              </div>
              <div className="flex space-x-2 mb-4">
                <button
                  onClick={() => openModal(appointment)}
                  className="w-3/4 px-4 py-2 bg-yellow-500 text-white rounded-md flex items-center justify-center"
                >
                  <PencilAltIcon className="w-5 h-5 mr-1" />
                   Add Notes
                </button>
                {/* <button
                  onClick={() => rescheduleAppointment(index, selectedTab)}
                  className="w-full px-4 py-2 bg-[#16a34a] text-white rounded-md flex items-center justify-center"
                >
                  Reschedule
                </button> */}
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Floating "+" Button */}
      <button
        onClick={openQrModal}
        className="fixed bottom-8 right-8 bg-[#e11d48] text-white rounded-full p-4 shadow-lg focus:outline-none"
      >
        <PlusIcon className="w-6 h-6" />
      </button>

      {/* QR Code Modal */}
      <Modal
        isOpen={qrModalIsOpen}
        onRequestClose={closeQrModal}
        className="fixed inset-0 flex items-center justify-center bg-stone-50 bg-opacity-90"
      >
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Scan this QR Code</h2>
          <QRCode value="https://www.google.com" size={256} />
          <button
            onClick={closeQrModal}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md"
          >
            Close
          </button>
        </div>
      </Modal>

      {/* Notes Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"
      >
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Notes for {selectedAppointment?.name}</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full h-32 p-2 border border-gray-300 rounded-md"
          />
          <div className="flex space-x-2 mt-4">
            <button
              onClick={saveNotes}
              className="px-4 py-2 bg-green-500 text-white rounded-md flex-1"
            >
              Save
            </button>
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-red-500 text-white rounded-md flex-1"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Patients;
