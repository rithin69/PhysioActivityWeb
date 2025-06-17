import React, { useState } from 'react';
import { PlusIcon } from '@heroicons/react/outline';
import Modal from 'react-modal';
import QRCode from 'qrcode.react';
import { useNavigate } from 'react-router-dom';
import { useRole } from './RoleContext';

const todayAppointmentsInitial = [
  {
    time: '9:00 AM',
    date: '2024-07-28',
    name: 'ID : 45454821',
    condition: 'Osteoporosis',
    image: '/images/profpicfemale.jpg',
  },
  {
    time: '9:30 AM',
    date: '2024-07-28',
    name: 'ID : 344545689',
    condition: 'Osteoarthritis',
    image: '/images/profpicmen.png',
  },
  {
    time: '10:30 AM',
    date: '2024-07-28',
    name: 'ID : 34845459',
    condition: 'Rheumatoid Arthritis',
    image: '/images/profpicfemale.jpg',
  },
  {
    time: '11:15 AM',
    date: '2024-07-28',
    name: 'ID : 3487455689',
    condition: 'Osteomyelitis',
    image: '/images/profpicmen.png',
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

const Anonypatients = () => {
  const [todayAppointments] = useState(todayAppointmentsInitial);
  const [tomorrowAppointments] = useState(tomorrowAppointmentsInitial);
  const [selectedTab, setSelectedTab] = useState('Today');
  const [sortOption, setSortOption] = useState('');
  const [qrModalIsOpen, setQrModalIsOpen] = useState(false);
  const { role } = useRole();
  const navigate = useNavigate();

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const sortAppointments = (appointments) => {
    if (sortOption === 'time') {
      return [...appointments].sort((a, b) => new Date(`1970/01/01 ${a.time}`) - new Date(`1970/01/01 ${b.time}`));
    } else if (sortOption === 'name') {
      return [...appointments].sort((a, b) => a.name.localeCompare(b.name));
    }
    return appointments;
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
    navigate(`/Patientdashboard`, { state: { name: appointment.name } });
  };

  return (
    <div className="bg-gray-100 p-4 font-sans">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedAppointments.map((appointment, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow-md flex flex-col cursor-pointer"
              onClick={() => handlePatientClick(appointment)}
            >
              <div className="flex items-center mb-4">
                <img
                  src={appointment.image}
                  alt={appointment.name}
                  className="w-20 h-20 rounded-full mr-4"
                />
                <div>
                  <h3 className="text-lg font-medium">
                    {appointment.name} {appointment.age}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={openQrModal}
        className="fixed bottom-8 right-8 bg-[#e11d48] text-white rounded-full p-4 shadow-lg focus:outline-none"
      >
        <PlusIcon className="w-6 h-6" />
      </button>
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
    </div>
  );
};

export default Anonypatients;
