import React, { useState, useEffect } from 'react';
import { Calendar, FileText, Send, CheckCircle, AlertCircle, Target, BookOpen, Plus, Save } from 'lucide-react';

const ProgramsTab = ({ userId }) => {
  // New state for Goals & Plans templates
  const [templates, setTemplates] = useState([]);
  const [templatesLoading, setTemplatesLoading] = useState(true);
  const [templatesError, setTemplatesError] = useState(null);
  
  // New state for program assignment
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [assignmentDate, setAssignmentDate] = useState('');
  const [assignmentType, setAssignmentType] = useState('Assessment');
  const [assignmentNotes, setAssignmentNotes] = useState('');
  const [assignmentSubmitting, setAssignmentSubmitting] = useState(false);
  const [assignmentMessage, setAssignmentMessage] = useState('');

  // URLs for API calls
  const READ_TEMPLATES_URL = 'https://prod-10.uksouth.logic.azure.com:443/workflows/54232e860fb94f078eb3094f85dc6385/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=qEACM65Dv52-l1uKqYtDOzc1ZrF36XPHL_BSWlJ0bvA';
  const WRITE_ASSIGNMENT_URL = 'https://prod-38.uksouth.logic.azure.com:443/workflows/1ff55ae4f3fd4fdd99a441b96321cb4f/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=2DEpLbR77vs3qhojeFAYNCtMB4Q4G3_cYwQFf8SG_Uw';

  // Fetch Goals & Plans templates on component mount
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setTemplatesLoading(true);
        setTemplatesError(null);

        const response = await fetch(READ_TEMPLATES_URL, {
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
        console.log('Templates data received:', data);
        
        const rows = Array.isArray(data) ? data : [];

        // Map Excel data to template format
        const formattedTemplates = rows.map((row, index) => ({
          id: row.ItemInternalId ?? row.Id ?? row.id ?? `template-${index}`,
          name: row.templateName ?? row.TemplateName ?? row.name ?? 'Untitled Template',
          description: row.templateDescription ?? row.TemplateDescription ?? row.description ?? 'No description provided',
          difficulty: row.Difficultylevel ?? row.DifficultyLevel ?? row.difficulty ?? 'Beginner',
        }));

        console.log('Formatted templates:', formattedTemplates);
        setTemplates(formattedTemplates);
      } catch (err) {
        console.error('Error fetching templates:', err);
        setTemplatesError('Failed to load Goals & Plans templates.');
        setTemplates([]);
      } finally {
        setTemplatesLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  // Handle program assignment submission
  const handleAssignProgram = async (template) => {
    if (!assignmentDate) {
      alert('Please select a date for the assignment');
      return;
    }

    if (!assignmentNotes.trim()) {
      alert('Please add notes for the assignment');
      return;
    }

    setAssignmentSubmitting(true);
    setAssignmentMessage('');

    const payload = {
      "userId": "100001",
      "program name": template.name,
      "date": assignmentDate,
      "type": assignmentType,
      "notes": assignmentNotes.trim()
    };

    try {
      console.log('Assigning program:', payload);
      const response = await fetch(WRITE_ASSIGNMENT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        // setAssignmentMessage('Program assigned successfully!');
        setSelectedTemplate(null);
        setAssignmentDate('');
        setAssignmentType('Assessment');
        setAssignmentNotes('');
      } else {
        setAssignmentMessage('Failed to assign program. Please try again.');
      }
    } catch (err) {
      setAssignmentMessage('Error occurred while assigning program.');
      console.error('Assignment error:', err);
    } finally {
      setAssignmentSubmitting(false);
    }
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl space-y-8">
      {/* Goals & Plans Templates Section */}
      <div>
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center">
            <Target className="w-5 h-5 mr-2 text-purple-600" />
            Available Goals & Plans Templates
          </h3>
          <p className="text-gray-600">Select a template to assign to your patient.</p>
        </div>

        {templatesLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin mx-auto mb-4 w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full"></div>
            <p className="text-gray-500">Loading templates...</p>
          </div>
        ) : templatesError ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {templatesError}
          </div>
        ) : templates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {templates.map(template => (
              <div
                key={template.id}
                className={`bg-white rounded-lg border-2 p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedTemplate?.id === template.id 
                    ? 'border-purple-500 bg-purple-50' 
                    : 'border-gray-200 hover:border-purple-300'
                }`}
                onClick={() => setSelectedTemplate(template)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <BookOpen size={16} className="text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 text-sm">{template.name}</h4>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(template.difficulty)}`}>
                        {template.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-xs line-clamp-2">{template.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Target size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No templates available</p>
          </div>
        )}
      </div>

      {/* Program Assignment Section with Type and Notes */}
      {selectedTemplate && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-teal-600" />
            Assign Program: {selectedTemplate.name}
          </h3>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-purple-900 mb-2">{selectedTemplate.name}</h4>
            <p className="text-purple-700 text-sm mb-2">{selectedTemplate.description}</p>
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(selectedTemplate.difficulty)}`}>
              {selectedTemplate.difficulty}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assignment Date
              </label>
              <input
                type="date"
                value={assignmentDate}
                onChange={(e) => setAssignmentDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                value={assignmentType}
                onChange={(e) => setAssignmentType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              >
                <option value="Assessment">Assessment</option>
                <option value="Recommendation">Recommendation</option>
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={assignmentNotes}
              onChange={(e) => setAssignmentNotes(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
              placeholder="Enter assignment notes here..."
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => handleAssignProgram(selectedTemplate)}
              disabled={assignmentSubmitting || !assignmentDate || !assignmentNotes.trim()}
              className="inline-flex items-center px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {assignmentSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Assigning...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Assign Program
                </>
              )}
            </button>
          </div>

          {assignmentMessage && (
            <div className={`mt-4 flex items-center p-3 rounded-lg ${
              assignmentMessage.includes('successfully') 
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {assignmentMessage.includes('successfully') ? (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  {assignmentMessage}
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 mr-2" />
                  {assignmentMessage}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProgramsTab;
