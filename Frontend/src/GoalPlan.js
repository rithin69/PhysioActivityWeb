import React, { useState } from 'react';
import { X, Plus, List, Calendar, Target, Video, Trash2 } from 'lucide-react';

const CreateTemplateModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    difficulty: 'Beginner',
    description: ''
  });
  
  const [exercises, setExercises] = useState([{
    id: 1,
    name: '',
    sets: '',
    reps: '',
    day: 'Monday'
  }]);

  const [viewMode, setViewMode] = useState('list');
  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleExerciseChange = (id, field, value) => {
    setExercises(prev => prev.map(ex => 
      ex.id === id ? { ...ex, [field]: value } : ex
    ));
  };

  const addExercise = () => {
    setExercises(prev => [...prev, {
      id: Date.now(),
      name: '',
      sets: '',
      reps: '',
      day: 'Monday'
    }]);
  };

  const removeExercise = (id) => {
    if (exercises.length > 1) {
      setExercises(prev => prev.filter(ex => ex.id !== id));
    }
  };

  const handleSave = () => {
    onSave({
      ...formData,
      exercises,
      id: Date.now(),
      createdAt: new Date().toISOString()
    });
    setFormData({ name: '', difficulty: 'Beginner', description: '' });
    setExercises([{ id: 1, name: '', sets: '', reps: '', day: 'Monday' }]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mr-3">
              <Target size={20} className="text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold">Create New Program Template</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <input
              type="text"
              placeholder="Program Name"
              value={formData.name}
              onChange={(e) => handleFormChange('name', e.target.value)}
              className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500"
            />
            <select
              value={formData.difficulty}
              onChange={(e) => handleFormChange('difficulty', e.target.value)}
              className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500"
            >
              {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => handleFormChange('description', e.target.value)}
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 mb-6"
            rows="3"
          />

          {/* View Toggle */}
          <div className="flex mb-6">
            <button
              onClick={() => setViewMode('list')}
              className={`px-6 py-3 rounded-l-xl font-medium ${
                viewMode === 'list' ? 'bg-purple-600 text-white' : 'bg-gray-200'
              }`}
            >
              <List size={18} className="inline mr-2" />
              List View
            </button>
            {/* <button
              onClick={() => setViewMode('calendar')}
              className={`px-6 py-3 rounded-r-xl font-medium ${
                viewMode === 'calendar' ? 'bg-purple-600 text-white' : 'bg-gray-200'
              }`}
            >
              <Calendar size={18} className="inline mr-2" />
              Calendar View
            </button> */}
          </div>

          {/* Exercises */}
          {viewMode === 'list' ? (
            <div className="space-y-4 mb-6">
              {exercises.map((exercise, index) => (
                <div key={exercise.id} className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold text-purple-600">Exercise #{index + 1}</h4>
                    {exercises.length > 1 && (
                      <button
                        onClick={() => removeExercise(exercise.id)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <input
                      type="text"
                      placeholder="Exercise name"
                      value={exercise.name}
                      onChange={(e) => handleExerciseChange(exercise.id, 'name', e.target.value)}
                      className="px-3 py-2 border rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Sets"
                      value={exercise.sets}
                      onChange={(e) => handleExerciseChange(exercise.id, 'sets', e.target.value)}
                      className="px-3 py-2 border rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Reps"
                      value={exercise.reps}
                      onChange={(e) => handleExerciseChange(exercise.id, 'reps', e.target.value)}
                      className="px-3 py-2 border rounded-lg"
                    />
                    <select
                      value={exercise.day}
                      onChange={(e) => handleExerciseChange(exercise.id, 'day', e.target.value)}
                      className="px-3 py-2 border rounded-lg"
                    >
                      {days.map(day => <option key={day} value={day}>{day}</option>)}
                    </select>
                  </div>
                </div>
              ))}
              <button
                onClick={addExercise}
                className="w-full py-3 border-2 border-dashed border-purple-300 rounded-xl text-purple-600 hover:bg-purple-50"
              >
                <Plus size={20} className="inline mr-2" />
                Add Exercise
              </button>
            </div>
          ) : (
            <div className="bg-gray-50 p-6 rounded-xl mb-6">
              <div className="grid grid-cols-7 gap-2">
                {days.map(day => (
                  <div key={day} className="bg-white p-3 rounded-lg min-h-[100px]">
                    <h5 className="font-semibold text-purple-600 text-sm mb-2">{day}</h5>
                    {exercises.filter(ex => ex.day === day).map(ex => (
                      <div key={ex.id} className="bg-purple-100 p-2 rounded text-xs mb-1">
                        {ex.name || 'Exercise'}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-3 border rounded-xl hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700"
            >
              Save Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const GoalPlan = () => {
  const [showModal, setShowModal] = useState(false);
  const [templates, setTemplates] = useState([
    {
      id: 1,
      name: 'Basic Strength Template',
      description: 'A foundational template for strength building.',
      exercises: 3,
      difficulty: 'Beginner'
    }
  ]);

  const handleSaveTemplate = (templateData) => {
    setTemplates(prev => [...prev, {
      id: templateData.id,
      name: templateData.name,
      description: templateData.description,
      exercises: templateData.exercises.length,
      difficulty: templateData.difficulty
    }]);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16 px-6 pb-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="flex items-center mb-6">
            <Target size={32} className="mr-3 text-purple-600" />
            <h1 className="text-2xl font-bold">Goals & Plans</h1>
          </div>

          <h2 className="text-lg font-semibold text-purple-600 mb-4">Program Templates</h2>
          
          <div className="space-y-4 mb-6">
            {templates.map(template => (
              <div key={template.id} className="bg-gray-50 rounded-lg p-4 border">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-purple-600 mb-1">{template.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{template.description}</p>
                    <p className="text-gray-500 text-xs">Exercises: {template.exercises}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200">
                      View Details
                    </button>
                    <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200">
                      Apply to Client
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="w-full py-4 border-2 border-dashed border-purple-300 rounded-xl text-purple-600 hover:bg-purple-50 flex items-center justify-center font-medium"
          >
            <Plus size={20} className="mr-2" />
            Create New Template
          </button>
        </div>

        <CreateTemplateModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSaveTemplate}
        />
      </div>
    </div>
  );
};

export default GoalPlan;
