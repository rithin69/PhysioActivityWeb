import React, { useState, useEffect } from 'react';
import { X, Target, Plus, Edit, Trash2, Search, BookOpen } from 'lucide-react';

// Create New Template Modal Component
const CreateTemplateModal = ({ isOpen, onClose, onCreateTemplate }) => {
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [difficultylevel, setDifficultylevel] = useState('Beginner');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const WRITE_API_URL = 'https://prod-30.uksouth.logic.azure.com:443/workflows/e72f984258194950a52263896a57d51e/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=R2UJtgA2jYTXJ_OmmSnB0naHcJzuyUtPjdiNQnkXo04';

  useEffect(() => {
    if (!isOpen) {
      setTemplateName('');
      setTemplateDescription('');
      setDifficultylevel('Beginner');
      setIsSubmitting(false);
      setSubmitError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const templateData = {
        userId:"100001",
        templateName: templateName.trim(),
        templateDescription: templateDescription.trim(),
        Difficultylevel: difficultylevel
      };

      console.log('Sending template data to Excel:', templateData);

      const response = await fetch(WRITE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(templateData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save template: HTTP ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Excel write response:', result);

      // Create local template object for immediate UI update
      const newTemplate = {
        id: `template-${Date.now()}`,
        name: templateName.trim(),
        description: templateDescription.trim(),
        difficulty: difficultylevel,
        exercises: Math.floor(Math.random() * 5) + 1, // Random number for demo
        dateCreated: new Date().toLocaleDateString()
      };

      onCreateTemplate(newTemplate);
      onClose();

    } catch (error) {
      console.error('Error saving template:', error);
      setSubmitError(error.message || 'Failed to save template to Excel');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Create New Program Template</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
            disabled={isSubmitting}
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Program Name</label>
            <input
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="Enter program name"
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              rows={4}
              value={templateDescription}
              onChange={(e) => setTemplateDescription(e.target.value)}
              placeholder="Describe the program template"
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              value={difficultylevel}
              onChange={(e) => setDifficultylevel(e.target.value)}
              disabled={isSubmitting}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
              {submitError}
            </div>
          )}

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-purple-600 text-white hover:bg-purple-700 flex items-center disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Creating...
                </>
              ) : (
                'Create Template'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Template Card Component
const TemplateCard = ({ template, onEdit, onDelete }) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
            <BookOpen size={20} className="text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-lg">{template.name}</h3>
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(template.difficulty)}`}>
              {template.difficulty}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {/* <button
            onClick={() => onEdit(template)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit size={16} />
          </button> */}
          {/* <button
            onClick={() => onDelete(template.id)}
            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button> */}
        </div>
      </div>
      
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{template.description}</p>
      
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>Exercises: {template.exercises}</span>
        <span>Created: {template.dateCreated}</span>
      </div>
    </div>
  );
};

// Main Goals & Plans Component
const GoalsAndPlans = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Read API URL for fetching templates
  const READ_API_URL = 'https://prod-10.uksouth.logic.azure.com:443/workflows/54232e860fb94f078eb3094f85dc6385/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=qEACM65Dv52-l1uKqYtDOzc1ZrF36XPHL_BSWlJ0bvA';

  // Fetch templates from Excel when component loads
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(READ_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userId: '100001' })
        });

        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }

        const data = await response.json();
        console.log('Raw Excel template data received:', data);
        
        const rows = Array.isArray(data) ? data : [];

        // Map Excel data to template format
        const formattedTemplates = rows.map((row, index) => ({
          id: row.ItemInternalId ?? row.Id ?? row.id ?? `template-${index}`,
          name: row.templateName ?? row.TemplateName ?? row.name ?? 'Untitled Template',
          description: row.templateDescription ?? row.TemplateDescription ?? row.description ?? 'No description provided',
          difficulty: row.Difficultylevel ?? row.DifficultyLevel ?? row.difficulty ?? 'Beginner',
          exercises: Math.floor(Math.random() * 5) + 1, // Random number for demo
          dateCreated: row.DateCreated ?? row.dateCreated ?? new Date().toLocaleDateString()
        }));

        console.log('Formatted templates:', formattedTemplates);
        setTemplates(formattedTemplates);
      } catch (err) {
        console.error('Error fetching templates:', err);
        setError('Failed to load templates from Excel.');
        // Set empty array on error to show "no templates" message
        setTemplates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const handleCreateTemplate = (newTemplate) => {
    setTemplates(prev => [...prev, newTemplate]);
  };

  const handleEditTemplate = (template) => {
    console.log('Edit template:', template);
    // Implement edit functionality
  };

  const handleDeleteTemplate = (templateId) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      setTemplates(prev => prev.filter(t => t.id !== templateId));
    }
  };

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-16 px-6 pb-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center mb-2">
                <Target size={28} className="mr-3 text-purple-600" />
                Goals & Plans
              </h1>
              <p className="text-gray-600">
                Create and manage program templates for your patients
              </p>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center font-medium shadow-sm transition-colors"
            >
              <Plus size={20} className="mr-2" />
              Create New Template
            </button>
          </div>
        </div>

        {/* Program Templates Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Program Templates</h2>
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-64"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin mx-auto mb-4 w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full"></div>
              <p className="text-gray-500">Loading templates...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <Target size={64} className="mx-auto text-red-300 mb-4" />
              <h3 className="text-lg font-medium text-red-600 mb-2">Error Loading Templates</h3>
              <p className="text-red-500 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          ) : filteredTemplates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map(template => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onEdit={handleEditTemplate}
                  onDelete={handleDeleteTemplate}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Target size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                {searchTerm ? 'No templates found' : 'No templates created yet'}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm 
                  ? 'Try adjusting your search terms' 
                  : 'Create your first program template to get started'
                }
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center mx-auto font-medium"
                >
                  <Plus size={20} className="mr-2" />
                  Create Template
                </button>
              )}
            </div>
          )}
        </div>

        {/* Create Template Modal */}
        <CreateTemplateModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreateTemplate={handleCreateTemplate}
        />
      </div>
    </div>
  );
};

export default GoalsAndPlans;
