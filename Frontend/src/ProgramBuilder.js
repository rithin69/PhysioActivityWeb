import { useState } from 'react';

const ProgramBuilder = () => {
  const [activeTab, setActiveTab] = useState('Reminders');
  const tabs = ['Reminders', 'Surveys', 'Medication', 'Notes', 'Frequencies'];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Reminders':
        return <div>Reminder Settings...</div>;
      case 'Surveys':
        return <div>Survey Builder...</div>;
      case 'Medication':
        return <div>Medication Tracker...</div>;
      case 'Notes':
        return <div>Clinician Notes...</div>;
      case 'Frequencies':
        return <div>Set Frequency Rules...</div>;
      default:
        return null;
    }
  };

  return (
    <section className="bg-gray-100 p-6 rounded-lg shadow-lg mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Program Builder</h2>
      <div className="flex space-x-4 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded ${
              activeTab === tab ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'
            } shadow`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="mt-4">{renderTabContent()}</div>
    </section>
  );
};

export default ProgramBuilder;