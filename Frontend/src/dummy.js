// import React, { useState, useEffect } from 'react';
// import { ChatAltIcon, PhoneIcon, XIcon, PencilAltIcon, CheckIcon } from '@heroicons/react/outline';
// import Modal from 'react-modal';

// // import './tailwind.output.css'; // Ensure Tailwind CSS is included

// const todayAppointmentsInitial = [
//   {
//     time: '9:00 AM',
//     date: '2024-07-28',
//     name: 'Zoe Miller',
//     age: 30,
//     condition: 'Diabetis',
//     image: '/images/patient.jpg',
//   },
//   {
//     time: '9:30 AM',
//     date: '2024-07-28',
//     name: 'John Smith',
//     age: 22,
//     condition: 'Allergy',
//     image: '/images/patient.jpg',
//   },
//   {
//     time: '10:30 AM',
//     date: '2024-07-28',
//     name: 'Sergio Pliego',
//     age: 33,
//     condition: 'Asthma',
//     image: '/images/patient.jpg',
//   },
//   {
//     time: '11:15 AM',
//     date: '2024-07-28',
//     name: 'Shirline Dungey',
//     age: 45,
//     condition: 'Mammogram results',
//     image: '/images/patient.jpg',
//   },
//   {
//     time: '11:45 AM',
//     date: '2024-07-28',
//     name: 'Ashley Graham',
//     age: 8,
//     condition: 'Flu',
//     image: '/images/patient.jpg',
//   },
//   {
//     time: '12:30 PM',
//     date: '2024-07-28',
//     name: 'Frank Boehm',
//     age: 55,
//     condition: 'Cardiac arrhythmia',
//     image: '/images/patient.jpg',
//   }
// ];

// const tomorrowAppointmentsInitial = [
//   {
//     time: '9:00 AM',
//     date: '2024-07-29',
//     name: 'Emily Clark',
//     age: 28,
//     condition: 'Diabetes',
//     image: '/images/patient2.jpeg',
//   },
//   {
//     time: '9:30 AM',
//     date: '2024-07-29',
//     name: 'Michael Johnson',
//     age: 35,
//     condition: 'Hypertension',
//     image: '/images/patient2.jpeg',
//   },
//   {
//     time: '10:30 AM',
//     date: '2024-07-29',
//     name: 'Samantha Brown',
//     age: 42,
//     condition: 'Asthma',
//     image: '/images/patient2.jpeg',
//   },
//   {
//     time: '11:15 AM',
//     date: '2024-07-29',
//     name: 'Gregory Wilson',
//     age: 50,
//     condition: 'Cholesterol',
//     image: '/images/patient2.jpeg',
//   },
//   {
//     time: '11:45 AM',
//     date: '2024-07-29',
//     name: 'Alice Morgan',
//     age: 19,
//     condition: 'Flu',
//     image: '/images/patient2.jpeg',
//   },
//   {
//     time: '12:30 PM',
//     date: '2024-07-29',
//     name: 'George Brown',
//     age: 60,
//     condition: 'Heart Disease',
//     image: '/images/patient2.jpeg',
//   },
  
// ];

// Modal.setAppElement('#root');

// const Patients = () => {
//   const [todayAppointments, setTodayAppointments] = useState(todayAppointmentsInitial);
//   const [tomorrowAppointments, setTomorrowAppointments] = useState(tomorrowAppointmentsInitial);
//   const [selectedTab, setSelectedTab] = useState('Today');
//   const [currentTime, setCurrentTime] = useState(new Date());
//   const [sortOption, setSortOption] = useState('');
//   const [modalIsOpen, setModalIsOpen] = useState(false);
//   const [selectedAppointment, setSelectedAppointment] = useState(null);
//   const [notes, setNotes] = useState('');

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentTime(new Date());
//     }, 1000);
//     return () => clearInterval(timer);
//   }, []);

//   const cancelAppointment = (index, tab) => {
//     if (tab === 'Today') {
//       const updatedAppointments = todayAppointments.filter((_, i) => i !== index);
//       setTodayAppointments(updatedAppointments);
//     } else {
//       const updatedAppointments = tomorrowAppointments.filter((_, i) => i !== index);
//       setTomorrowAppointments(updatedAppointments);
//     }
//   };

//   const approveAppointment = (index, tab) => {
//     if (tab === 'Today') {
//       const updatedAppointments = todayAppointments.filter((_, i) => i !== index);
//       setTodayAppointments(updatedAppointments);
//     } else {
//       const updatedAppointments = tomorrowAppointments.filter((_, i) => i !== index);
//       setTomorrowAppointments(updatedAppointments);
//     }
//   };

//   const handleTabClick = (tab) => {
//     setSelectedTab(tab);
//   };

//   const handleSortChange = (e) => {
//     setSortOption(e.target.value);
//   };

//   const sortAppointments = (appointments) => {
//     if (sortOption === 'time') {
//       return [...appointments].sort((a, b) => new Date(1970/01/01 ${a.time}) - new Date(1970/01/01 ${b.time}));
//     } else if (sortOption === 'name') {
//       return [...appointments].sort((a, b) => a.name.localeCompare(b.name));
//     }
//     return appointments;
//   };

//   const openModal = (appointment) => {
//     setSelectedAppointment(appointment);
//     setNotes('');
//     setModalIsOpen(true);
//   };

//   const closeModal = () => {
//     setModalIsOpen(false);
//     setSelectedAppointment(null);
//     setNotes('');
//   };

//   const saveNotes = () => {
//     console.log('Notes saved:', notes);
//     closeModal();
//   };

//   const currentAppointments = selectedTab === 'Today' ? todayAppointments : tomorrowAppointments;
//   const sortedAppointments = sortAppointments(currentAppointments);

//   return (
//     <div className="min-h-screen bg-gray-100 p-4 font-sans">
//       <div className="bg-white rounded-lg shadow-lg p-6">
//       <div className="flex justify-between items-center mb-2">
//   <h2 className="text-xl font-semibold flex items-center">
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       fill="none"
//       viewBox="0 0 24 24"
//       strokeWidth="1.5"
//       stroke="currentColor"
//       className="w-6 h-6 mr-2"
//     >
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
//       />
//     </svg>
//     Appointments ({sortedAppointments.length})
//   </h2>
//   <span className="text-gray-500">
//   {currentTime.toLocaleDateString()} - {currentTime.toLocaleTimeString()} 
//   </span>
// </div>

//         <div className="mb-4 text-gray-700">
//           You have the following appointments.
//         </div>
//         <div className="flex mb-4">
//           <button
//             onClick={() => handleTabClick('Today')}
//             className={px-4 py-2 ${selectedTab === 'Today' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded-l-md}
//           >
//             Today
//           </button>
//           <button
//             onClick={() => handleTabClick('Tomorrow')}
//             className={px-4 py-2 ${selectedTab === 'Tomorrow' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded-r-md}
//           >
//             Tomorrow
//           </button>
//           <select
//             onChange={handleSortChange}
//             className="ml-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
//           >
//             <option value="">Sort By</option>
//             <option value="time">Time</option>
//             <option value="name">Name</option>
//           </select>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {sortedAppointments.map((appointment, index) => (
//             <div
//               key={index}
//               className="bg-white p-4 rounded-lg shadow-md flex flex-col"
//             >
//               <div className="flex items-center mb-4">
//                 <img
//                   src={appointment.image}
//                   alt={appointment.name}
//                   className="w-20 h-20 rounded-full mr-4"
//                 />
//                 <div>
//                   <h3 className="text-lg font-medium">
//                     {appointment.name}, {appointment.age}
//                   </h3>
//                   <p className="text-gray-500">{appointment.condition}</p>
//                   <p className="text-gray-400">{appointment.date} - {appointment.time}</p>
//                 </div>
//               </div>
//               <div className="flex space-x-2 mb-2">
//                 <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md">
//                   <ChatAltIcon className="w-5 h-5 mr-1" />
//                   Chat
//                 </button>
//                 <button className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md">
//                   <PhoneIcon className="w-5 h-5 mr-1" />
//                   Call
//                 </button>
//                 <button
//                   onClick={() => openModal(appointment)}
//                   className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded-md"
//                 >
//                   <PencilAltIcon className="w-5 h-5 mr-1" />
//                   Add Notes
//                 </button>
//               </div>
//               <div className="flex space-x-2">
//                 <button
//                   onClick={() => cancelAppointment(index, selectedTab)}
//                   className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md"
//                 >
//                   <XIcon className="w-5 h-5 mr-1" />
//                   Cancel Appointment
//                 </button>
//                 <button
//                   onClick={() => approveAppointment(index, selectedTab)}
//                   className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md"
//                 >
//                   <CheckIcon className="w-5 h-5 mr-1" />
//                   Approve Appointment
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <Modal
//         isOpen={modalIsOpen}
//         onRequestClose={closeModal}
//         contentLabel="Add Notes Modal"
//         className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center"
//       >
//         <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
//           <h2 className="text-xl font-semibold mb-4">Add Notes</h2>
//           {selectedAppointment && (
//             <div>
//               <div className="mb-4">
//                 <label className="block text-gray-700">Appointment Date:</label>
//                 <input
//                   type="text"
//                   value={selectedAppointment.date}
//                   readOnly
//                   className="w-full px-4 py-2 bg-gray-100 rounded-md"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-700">Appointment Time:</label>
//                 <input
//                   type="text"
//                   value={selectedAppointment.time}
//                   readOnly
//                   className="w-full px-4 py-2 bg-gray-100 rounded-md"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-700">Notes:</label>
//                 <textarea
//                   value={notes}
//                   onChange={(e) => setNotes(e.target.value)}
//                   className="w-full px-4 py-2 bg-gray-100 rounded-md"
//                   rows="5"
//                 ></textarea>
//               </div>
//               <div className="flex justify-end space-x-2">
//                 <button
//                   onClick={closeModal}
//                   className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={saveNotes}
//                   className="px-4 py-2 bg-blue-500 text-white rounded-md"
//                 >
//                   Save
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default Patients;
