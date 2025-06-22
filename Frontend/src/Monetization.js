import React, { useState, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { DollarSign, PlusCircle } from 'lucide-react';

const Monetization = () => {
  // Hardcoded clients data with sample charges
  const [clients, setClients] = useState([
    {
      id: 'client1',
      name: 'John Smith',
      gender: 'Male',
      age: 28,
      primaryGoal: 'Weight Loss',
      programCharges: [
        {
          id: 'charge1',
          date: '2025-06-15',
          amount: 150,
          description: 'Personal Training Session',
          programType: 'In-person Session'
        },
        {
          id: 'charge2',
          date: '2025-06-10',
          amount: 200,
          description: 'Monthly Fitness Program',
          programType: 'Remote Program'
        }
      ],
      programs: [
        { name: 'Weight Loss Program', difficulty: 'Intermediate' }
      ]
    },
    {
      id: 'client2',
      name: 'Sarah Johnson',
      gender: 'Female',
      age: 35,
      primaryGoal: 'Muscle Building',
      programCharges: [
        {
          id: 'charge3',
          date: '2025-06-20',
          amount: 180,
          description: 'Strength Training Session',
          programType: 'In-person Session'
        },
        {
          id: 'charge4',
          date: '2025-06-05',
          amount: 120,
          description: 'Nutrition Consultation',
          programType: 'Remote Program'
        }
      ],
      programs: [
        { name: 'Strength Program', difficulty: 'Advanced' }
      ]
    },
    {
      id: 'client3',
      name: 'Mike Davis',
      gender: 'Male',
      age: 42,
      primaryGoal: 'General Fitness',
      programCharges: [
        {
          id: 'charge5',
          date: '2025-06-18',
          amount: 100,
          description: 'Cardio Training Session',
          programType: 'In-person Session'
        }
      ],
      programs: [
        { name: 'Cardio Program', difficulty: 'Beginner' }
      ]
    },
    {
      id: 'client4',
      name: 'Emily Wilson',
      gender: 'Female',
      age: 29,
      primaryGoal: 'Flexibility',
      programCharges: [
        {
          id: 'charge6',
          date: '2025-06-12',
          amount: 90,
          description: 'Yoga Session',
          programType: 'In-person Session'
        },
        {
          id: 'charge7',
          date: '2025-06-08',
          amount: 75,
          description: 'Online Flexibility Program',
          programType: 'Remote Program'
        }
      ],
      programs: [
        { name: 'Flexibility Program', difficulty: 'Beginner' }
      ]
    }
  ]);

  // Filter state variables
  const [selectedClientFilter, setSelectedClientFilter] = useState('');
  const [selectedGenderFilter, setSelectedGenderFilter] = useState('');
  const [selectedAgeRangeFilter, setSelectedAgeRangeFilter] = useState('');
  const [selectedGoalFilter, setSelectedGoalFilter] = useState('');
  const [selectedProgramTypeFilter, setSelectedProgramTypeFilter] = useState('');
  const [selectedDifficultyFilter, setSelectedDifficultyFilter] = useState('');

  // New charge form state variables
  const [newChargeClient, setNewChargeClient] = useState('');
  const [newChargeAmount, setNewChargeAmount] = useState('');
  const [newChargeDescription, setNewChargeDescription] = useState('');
  const [newChargeDate, setNewChargeDate] = useState(new Date().toISOString().slice(0, 10));

  const allCharges = useMemo(() => {
    return clients.flatMap(client =>
      (client.programCharges || []).map(charge => ({
        ...charge,
        clientId: client.id,
        clientName: client.name,
        clientGender: client.gender,
        clientAge: client.age,
        clientPrimaryGoal: client.primaryGoal,
      }))
    ).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [clients]);

  const filteredCharges = useMemo(() => {
    return allCharges.filter(charge => {
      const clientMatch = !selectedClientFilter || charge.clientId === selectedClientFilter;
      const genderMatch = !selectedGenderFilter || charge.clientGender === selectedGenderFilter;
      const ageMatch = !selectedAgeRangeFilter ||
        (selectedAgeRangeFilter === '<30' && charge.clientAge < 30) ||
        (selectedAgeRangeFilter === '30-50' && charge.clientAge >= 30 && charge.clientAge <= 50) ||
        (selectedAgeRangeFilter === '>50' && charge.clientAge > 50);
      const goalMatch = !selectedGoalFilter || charge.clientPrimaryGoal === selectedGoalFilter;
      const programTypeMatch = !selectedProgramTypeFilter || charge.programType === selectedProgramTypeFilter;
      const difficultyMatch = !selectedDifficultyFilter ||
        (clients.find(c => c.id === charge.clientId)?.programs?.some(p => p.difficulty === selectedDifficultyFilter) || false);

      return clientMatch && genderMatch && ageMatch && goalMatch && programTypeMatch && difficultyMatch;
    });
  }, [allCharges, selectedClientFilter, selectedGenderFilter, selectedAgeRangeFilter, selectedGoalFilter, selectedProgramTypeFilter, selectedDifficultyFilter, clients]);

  const totalEarnings = filteredCharges.reduce((sum, charge) => sum + charge.amount, 0);

  // Monthly earnings data for chart
  const monthlyEarningsData = useMemo(() => {
    const earningsMap = new Map();
    filteredCharges.forEach(charge => {
      const monthYear = charge.date.substring(0, 7);
      earningsMap.set(monthYear, (earningsMap.get(monthYear) || 0) + charge.amount);
    });

    return Array.from(earningsMap.entries())
      .map(([monthYear, amount]) => ({ name: monthYear, earnings: amount }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [filteredCharges]);

  // Revenue by program type data
  const revenueByTypeData = useMemo(() => {
    const typeEarnings = {
      'In-person Session': 0,
      'Remote Program': 0,
      'Other': 0,
    };

    filteredCharges.forEach(charge => {
      if (charge.programType === 'In-person Session') {
        typeEarnings['In-person Session'] += charge.amount;
      } else if (charge.programType === 'Remote Program') {
        typeEarnings['Remote Program'] += charge.amount;
      } else {
        typeEarnings['Other'] += charge.amount;
      }
    });

    return Object.keys(typeEarnings).map(type => ({
      name: type,
      revenue: typeEarnings[type],
    }));
  }, [filteredCharges]);

  const handleAddCharge = () => {
    if (!newChargeClient || !newChargeAmount || !newChargeDescription || !newChargeDate) {
      alert("All fields are required to add a charge.");
      return;
    }

    const newCharge = {
      id: `charge-${Date.now()}`,
      date: newChargeDate,
      amount: parseFloat(newChargeAmount),
      description: newChargeDescription,
      programType: newChargeDescription.toLowerCase().includes('in-person') || 
                   newChargeDescription.toLowerCase().includes('session') ? 
                   'In-person Session' : 'Remote Program',
    };

    // Update clients state
    setClients(prevClients => 
      prevClients.map(client => 
        client.id === newChargeClient 
          ? { 
              ...client, 
              programCharges: [...(client.programCharges || []), newCharge] 
            }
          : client
      )
    );

    // Reset form
    setNewChargeClient('');
    setNewChargeAmount('');
    setNewChargeDescription('');
    setNewChargeDate(new Date().toISOString().slice(0, 10));
    
    alert('Charge added successfully!');
  };

  const uniqueProgramTypes = useMemo(() => {
    const types = new Set();
    clients.forEach(client => {
      (client.programCharges || []).forEach(charge => {
        if (charge.programType) types.add(charge.programType);
      });
    });
    return Array.from(types);
  }, [clients]);

  const uniqueGoals = useMemo(() => {
    const goals = new Set();
    clients.forEach(client => {
      if (client.primaryGoal) goals.add(client.primaryGoal);
    });
    return Array.from(goals);
  }, [clients]);

  const uniqueDifficulties = useMemo(() => {
    const difficulties = new Set();
    clients.forEach(client => {
      (client.programs || []).forEach(program => {
        if (program.difficulty) difficulties.add(program.difficulty);
      });
    });
    return Array.from(difficulties);
  }, [clients]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen rounded-xl shadow-inner">
      <h1 className="text-3xl font-bold text-[#4cb6c3] mb-6 flex items-center">
        <DollarSign size={28} className="mr-3" /> 
      </h1>

      {/* Add New Charge Section */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold text-[#4cb6c3] mb-4">Add New Charge</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label htmlFor="newChargeClient" className="block text-sm font-medium text-gray-700 mb-1">Client</label>
            <select
              id="newChargeClient"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              value={newChargeClient}
              onChange={(e) => setNewChargeClient(e.target.value)}
            >
              <option value="">Select Client</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>{client.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="newChargeAmount" className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
            <input
              type="number"
              step="0.01"
              id="newChargeAmount"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              value={newChargeAmount}
              onChange={(e) => setNewChargeAmount(e.target.value)}
              placeholder="e.g., 150.00"
            />
          </div>
          <div>
            <label htmlFor="newChargeDescription" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              type="text"
              id="newChargeDescription"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              value={newChargeDescription}
              onChange={(e) => setNewChargeDescription(e.target.value)}
              placeholder="e.g., Monthly Program Fee"
            />
          </div>
          <div>
            <label htmlFor="newChargeDate" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              id="newChargeDate"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              value={newChargeDate}
              onChange={(e) => setNewChargeDate(e.target.value)}
            />
          </div>
        </div>
        <button
          onClick={handleAddCharge}
          className="px-5 py-2 bg-[#4cb6c3] text-white rounded-md hover:bg-[#3a9aa5] transition-colors duration-200 font-medium flex items-center"
        >
          <PlusCircle size={20} className="mr-2" /> Add Charge
        </button>
      </div>

      {/* Earnings Overview with Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold text-[#4cb6c3] mb-4">Earnings Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div>
            <label htmlFor="filterClient" className="block text-sm font-medium text-gray-700 mb-1">Filter by Client</label>
            <select
              id="filterClient"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={selectedClientFilter}
              onChange={(e) => setSelectedClientFilter(e.target.value)}
            >
              <option value="">All Clients</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>{client.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="filterGender" className="block text-sm font-medium text-gray-700 mb-1">Filter by Gender</label>
            <select
              id="filterGender"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={selectedGenderFilter}
              onChange={(e) => setSelectedGenderFilter(e.target.value)}
            >
              <option value="">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div>
            <label htmlFor="filterAge" className="block text-sm font-medium text-gray-700 mb-1">Filter by Age</label>
            <select
              id="filterAge"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={selectedAgeRangeFilter}
              onChange={(e) => setSelectedAgeRangeFilter(e.target.value)}
            >
              <option value="">All Ages</option>
              <option value="<30">{'< 30'}</option>
              <option value="30-50">30-50</option>
              <option value=">50">{'> 50'}</option>
            </select>
          </div>
          <div>
            <label htmlFor="filterGoal" className="block text-sm font-medium text-gray-700 mb-1">Filter by Goal</label>
            <select
              id="filterGoal"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={selectedGoalFilter}
              onChange={(e) => setSelectedGoalFilter(e.target.value)}
            >
              <option value="">All Goals</option>
              {uniqueGoals.map(goal => <option key={goal} value={goal}>{goal}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="filterProgramType" className="block text-sm font-medium text-gray-700 mb-1">Filter by Program Type</label>
            <select
              id="filterProgramType"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={selectedProgramTypeFilter}
              onChange={(e) => setSelectedProgramTypeFilter(e.target.value)}
            >
              <option value="">All Program Types</option>
              {uniqueProgramTypes.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="filterDifficulty" className="block text-sm font-medium text-gray-700 mb-1">Filter by Difficulty</label>
            <select
              id="filterDifficulty"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={selectedDifficultyFilter}
              onChange={(e) => setSelectedDifficultyFilter(e.target.value)}
            >
              <option value="">All Difficulties</option>
              {uniqueDifficulties.map(diff => <option key={diff} value={diff}>{diff}</option>)}
            </select>
          </div>
        </div>

        <div className="mb-4 text-right">
          <p className="text-lg font-bold text-green-700">Total Earnings: ${totalEarnings.toFixed(2)}</p>
        </div>

        <h4 className="text-lg font-semibold text-[#4cb6c3] mb-4">Monthly Earnings Trend</h4>
        {monthlyEarningsData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyEarningsData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              <Bar dataKey="earnings" fill="#82ca9d" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-600 text-center">No earnings data to display for the selected filters.</p>
        )}
      </div>

      {/* Revenue by Program Type Chart */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold text-[#4cb6c3] mb-4">Revenue by Service Type</h3>
        {revenueByTypeData.some(d => d.revenue > 0) ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueByTypeData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              <Legend />
              <Bar dataKey="revenue" fill="#6B46C1" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-600 text-center">No revenue data by type to display for the selected filters.</p>
        )}
      </div>

      {/* All Charges Table */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-semibold text-[#4cb6c3] mb-4">All Charges</h3>
        {filteredCharges.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCharges.map(charge => (
                  <tr key={charge.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{charge.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{charge.clientName}</td>
                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-700">{charge.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{charge.programType || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">${charge.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No charges match the selected filters.</p>
        )}
      </div>
    </div>
  );
};

export default Monetization;
