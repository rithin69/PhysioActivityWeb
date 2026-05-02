import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, AlertCircle, Target, BookOpen, Save, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSelector } from 'react-redux';

const ProgramsTab = ({ userId, patientData }) => {
  // Practitioner id from Redux
  const loggedInUserId = useSelector((state) => state.user.web_user_id) || "";

  // State
  const [assignedPrograms, setAssignedPrograms] = useState([]);
  const [assignedLoading, setAssignedLoading] = useState(true);
  const [assignedError, setAssignedError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [templatesLoading, setTemplatesLoading] = useState(true);
  const [templatesError, setTemplatesError] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [assignmentDate, setAssignmentDate] = useState('');
  const [assignmentType, setAssignmentType] = useState('Assessment');
  const [assignmentNotes, setAssignmentNotes] = useState('');
  const [assignmentSubmitting, setAssignmentSubmitting] = useState(false);
  const [assignmentMessage, setAssignmentMessage] = useState('');

  // API URLs
  const READ_ASSIGNED_PROGRAMS_URL = 'https://default08b4467318734eb590d76eae218707.8a.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/e9938c09703743118b99402f539713f1/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=j_tQrMEkZ25ICIyYVuIfKiyaMkiRfmmsa4xuV2jMrXU';
  const READ_PROGRAMS_URL = 'https://prod-12.uksouth.logic.azure.com:443/workflows/2c67864498554457a3aeb0b9b9998230/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=lMgmbftXayVUeoQRDjHogTikDGevMi6ZPNh2qMfiWPw';
  const WRITE_ASSIGNMENT_URL = 'https://prod-38.uksouth.logic.azure.com:443/workflows/1ff55ae4f3fd4fdd99a441b96321cb4f/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=2DEpLbR77vs3qhojeFAYNCtMB4Q4G3_cYwQFf8SG_Uw';

  // Fixed date utils
  const isValidDate = (date) => {
    return date && date instanceof Date && !isNaN(date.getTime());
  };

  const isSameDay = (a, b) => {
    if (!isValidDate(a) || !isValidDate(b)) return false;
    return a.getFullYear() === b.getFullYear() && 
           a.getMonth() === b.getMonth() && 
           a.getDate() === b.getDate();
  };

  const formatDate = (date) => {
    if (!date) return 'NULL';
    if (!(date instanceof Date)) return 'NOT A DATE OBJECT';
    if (isNaN(date.getTime())) return 'INVALID DATE OBJECT';
    return date.toLocaleDateString('en-GB');
  };

  // NUCLEAR OPTION - Manual date parsing that WILL work
  const parseISODate = (dateValue) => {
    if (!dateValue) return null;
    
    const cleanDate = String(dateValue).trim();
    if (!cleanDate) return null;
    
    // MANUAL PARSING - NO BULLSHIT
    const match = cleanDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) {
      console.error(`❌ Not YYYY-MM-DD format: "${cleanDate}"`);
      return null;
    }
    
    const [, yearStr, monthStr, dayStr] = match;
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10) - 1; // JS months are 0-indexed
    const day = parseInt(dayStr, 10);
    
    const date = new Date(year, month, day);
    
    // Double-check the date is what we expect
    if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
      console.error(`❌ Date mismatch: input="${cleanDate}" vs created="${date.toDateString()}"`);
      return null;
    }
    
    console.log(`✅ MANUALLY PARSED: "${cleanDate}" → ${date.toDateString()}`);
    return date;
  };

  // Fetch assigned programs
  useEffect(() => {
    const fetchAssignedPrograms = async () => {
      if (!userId) {
        setAssignedLoading(false);
        setAssignedError('No patient selected');
        return;
      }
      try {
        setAssignedLoading(true);
        setAssignedError(null);

        console.log('🔥 FETCHING ASSIGNED PROGRAMS FOR USER:', userId);

        const response = await fetch(READ_ASSIGNED_PROGRAMS_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId })
        });
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);

        const text = await response.text();
        const data = JSON.parse(text || '[]');
        const rows = Array.isArray(data) ? data : [];

        console.log('🔥 FULL API RESPONSE:', data);
        console.log('🔥 FIRST ROW KEYS:', rows[0] ? Object.keys(rows[0]) : 'No data');

        const formattedAssignedPrograms = rows.map((row, index) => {
          console.log(`🔍 Processing row ${index}:`, row);
          
          const isoDateString = row.date || row.DateISO || row['DateISO'] || row.DATE || row.Date || row['assigned date'];
          console.log(`🔍 Found date value: "${isoDateString}" (type: ${typeof isoDateString})`);
          
          const parsedDate = parseISODate(isoDateString);
          console.log(`🔍 Parsed result:`, parsedDate);

          // Fixed: put ...row FIRST, then override with parsed date
          const formatted = {
            id: row.ItemInternalId ?? row.Id ?? row.id ?? `assigned-${index}`,
            programName: row['program name'] ?? row.programName ?? 'Unknown Program',
            rawDateString: isoDateString,
            type: row.type ?? 'Assessment',
            notes: row.notes ?? 'No notes provided',
            dateCreated: row.DateCreated ?? new Date().toISOString(),
            ...row, // Spread first
            date: parsedDate  // Then override with parsed Date object
          };

          console.log(`🔍 Before spread:`, parsedDate);
          console.log(`🔍 After spread:`, formatted.date);
          console.log(`🔍 Final formatted program:`, formatted);
          return formatted;
        });

        console.log('🔥 ALL FORMATTED PROGRAMS:', formattedAssignedPrograms);
        setAssignedPrograms(formattedAssignedPrograms);
      } catch (err) {
        console.error('🔥 Error fetching assigned programs:', err);
        setAssignedError(`Failed to load assigned programs: ${err.message}`);
        setAssignedPrograms([]);
      } finally {
        setAssignedLoading(false);
      }
    };

    fetchAssignedPrograms();
  }, [userId]);

  // Fetch templates
  useEffect(() => {
    const fetchPrograms = async () => {
      if (!loggedInUserId) {
        setTemplatesLoading(false);
        setTemplatesError('Please log in to view program templates');
        return;
      }
      try {
        setTemplatesLoading(true);
        setTemplatesError(null);

        const response = await fetch(READ_PROGRAMS_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: loggedInUserId })
        });
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);

        const text = await response.text();
        const data = JSON.parse(text || '[]');
        const rows = Array.isArray(data) ? data : [];

        const formattedPrograms = rows.map((row, index) => ({
          id: row.ItemInternalId ?? row.Id ?? row.id ?? `program-${index}`,
          name: row.programName ?? row.name ?? 'Untitled Program',
          description: row.programDescription ?? row.description ?? 'No description provided',
          difficulty: row.difficulty ?? 'Beginner',
          goals: row.goals ?? '',
          selectedAssets: row.selectedAssets ?? '',
          dateCreated: row.DateCreated ?? row.dateCreated ?? new Date().toLocaleDateString()
        }));

        setTemplates(formattedPrograms);
      } catch (err) {
        setTemplatesError('Failed to load program templates.');
        setTemplates([]);
      } finally {
        setTemplatesLoading(false);
      }
    };

    fetchPrograms();
  }, [loggedInUserId]);

  // Calendar helpers
  const getDaysInMonth = (date) => isValidDate(date)
    ? new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    : 30;

  const getFirstDayOfMonth = (date) => isValidDate(date)
    ? new Date(date.getFullYear(), date.getMonth(), 1).getDay()
    : 0;

  const getProgramsForDate = (date) => {
    if (!isValidDate(date)) return [];
    const programs = assignedPrograms.filter(p => isValidDate(p.date) && isSameDay(p.date, date));
    if (programs.length > 0) {
      console.log(`📅 Found ${programs.length} programs for ${date.toDateString()}`);
    }
    return programs;
  };

  const goToPreviousMonth = () => {
    if (!isValidDate(currentDate)) return;
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  const goToNextMonth = () => {
    if (!isValidDate(currentDate)) return;
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Colors
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  const getTypeColor = (type) => {
    switch (type) {
      case 'Assessment': return 'bg-blue-100 text-blue-800';
      case 'Recommendation': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const ProgramDetailsDisplay = ({ program }) => (
    <div className="border border-gray-200 rounded-lg p-3 mb-3">
      <div className="flex items-start justify-between mb-2">
        <h5 className="font-medium text-gray-900">{program.programName || 'Unknown Program'}</h5>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(program.type)}`}>
          {program.type || 'Unknown'}
        </span>
      </div>

      <div className="space-y-1 text-sm">
        <div className="flex">
          <span className="font-medium text-gray-600 w-28">Raw ISO:</span>
          <span className="text-gray-800 flex-1">{String(program.rawDateString ?? '')}</span>
        </div>
        <div className="flex">
          <span className="font-medium text-gray-600 w-28">Date:</span>
          <span className="text-gray-800 flex-1">{
            program.date instanceof Date 
              ? program.date.toDateString() 
              : String(program.date || 'NULL')
          }</span>
        </div>
        <div className="flex">
          <span className="font-medium text-gray-600 w-28">Notes:</span>
          <span className="text-gray-800 flex-1">{program.notes}</span>
        </div>
        <div className="flex">
          <span className="font-medium text-gray-600 w-28">Type:</span>
          <span className="text-gray-800 flex-1">{program.type}</span>
        </div>
      </div>
    </div>
  );

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-gray-200"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const programsForDay = getProgramsForDate(date);
      const isSelected = selectedDate && isSameDay(date, selectedDate);

      days.push(
        <div
          key={day}
          className={`h-24 border border-gray-200 p-1 cursor-pointer hover:bg-gray-50 transition-colors
            ${isSelected ? 'bg-blue-50 border-blue-300' : ''} ${programsForDay.length > 0 ? 'bg-green-50' : ''}`}
          onClick={() => setSelectedDate(date)}
        >
          <div className="font-medium text-sm text-gray-900 mb-1">{day}</div>
          <div className="space-y-1">
            {programsForDay.slice(0, 2).map((program, idx) => (
              <div
                key={idx}
                className={`text-xs p-1 rounded truncate ${getTypeColor(program.type)}`}
                title={`${program.programName} - ${program.type}`}
              >
                {program.programName}
              </div>
            ))}
            {programsForDay.length > 2 && (
              <div className="text-xs text-gray-500">+{programsForDay.length - 2} more</div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  // FIXED FUNCTION - Prevents page refresh
  async function handleAssignProgram(template, e) {
    e.preventDefault(); // PREVENT PAGE REFRESH
    e.stopPropagation(); // STOP EVENT BUBBLING
    
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
      userId,
      "program name": template.name,
      date: assignmentDate,
      type: assignmentType,
      notes: assignmentNotes.trim()
    };

    try {
      const response = await fetch(WRITE_ASSIGNMENT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setAssignmentMessage('Program assigned successfully!');
        setSelectedTemplate(null);
        setAssignmentDate('');
        setAssignmentType('Assessment');
        setAssignmentNotes('');
        
        // Refresh the assigned programs list instead of full page reload
        const fetchResponse = await fetch(READ_ASSIGNED_PROGRAMS_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId })
        });
        if (fetchResponse.ok) {
          const text = await fetchResponse.text();
          const data = JSON.parse(text || '[]');
          const rows = Array.isArray(data) ? data : [];
          
          const updatedPrograms = rows.map((row, index) => {
            const isoDateString = row.date || row.DateISO || row['DateISO'] || row.DATE || row.Date || row['assigned date'];
            const parsedDate = parseISODate(isoDateString);
            
            return {
              id: row.ItemInternalId ?? row.Id ?? row.id ?? `assigned-${index}`,
              programName: row['program name'] ?? row.programName ?? 'Unknown Program',
              rawDateString: isoDateString,
              type: row.type ?? 'Assessment',
              notes: row.notes ?? 'No notes provided',
              dateCreated: row.DateCreated ?? new Date().toISOString(),
              ...row,
              date: parsedDate
            };
          });
          
          setAssignedPrograms(updatedPrograms);
        }
      } else {
        setAssignmentMessage('Failed to assign program. Please try again.');
      }
    } catch (err) {
      setAssignmentMessage('Error occurred while assigning program.');
      console.error('Assignment error:', err);
    } finally {
      setAssignmentSubmitting(false);
    }
  }

  if (!userId) {
    return (
      <div className="text-center py-8">
        <Target size={48} className="mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">Please select a patient to view programs</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl space-y-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Programs for {patientData?.clientName || 'Patient'}
        </h2>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700">
                <strong>Patient ID:</strong> {userId}
              </p>
              <p className="text-sm text-blue-700">
                <strong>Goal:</strong> {patientData?.Goal || 'No goal specified'}
              </p>
            </div>
            <div>
              <p className="text-sm text-blue-700">
                <strong>Practitioner ID:</strong> {loggedInUserId}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Assigned Programs Calendar */}
      <div>
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-600" />
            Assigned Programs Calendar
          </h3>
          <p className="text-gray-600">View programs assigned to this patient by date. Days with programs have a green background.</p>
        </div>

        {assignedLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin mx-auto mb-4 w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            <p className="text-gray-500">Loading assigned programs...</p>
          </div>
        ) : assignedError ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {assignedError}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
              <h4 className="text-lg font-semibold text-gray-900">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h4>
              <div className="flex space-x-2">
                <button onClick={goToPreviousMonth} className="p-2 rounded-lg hover:bg-gray-200 transition-colors">
                  <ChevronLeft size={20} />
                </button>
                <button onClick={goToNextMonth} className="p-2 rounded-lg hover:bg-gray-200 transition-colors">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-3 font-medium text-center text-gray-500 bg-gray-50 border-b border-r border-gray-200">
                  {day}
                </div>
              ))}
              {renderCalendar()}
            </div>
          </div>
        )}

        {selectedDate && (
          <div className="mt-4 bg-white rounded-xl border border-gray-200 p-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">
              Programs for {formatDate(selectedDate)}
            </h4>
            {getProgramsForDate(selectedDate).length > 0 ? (
              <div className="space-y-3">
                {getProgramsForDate(selectedDate).map((program, idx) => (
                  <ProgramDetailsDisplay key={idx} program={program} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No programs assigned for this date.</p>
            )}
          </div>
        )}
      </div>

      {/* Templates */}
      <div>
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center">
            <Target className="w-5 h-5 mr-2 text-purple-600" />
            Available Program Templates
          </h3>
          <p className="text-gray-600">Select a program template to assign to this patient.</p>
        </div>

        {templatesLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin mx-auto mb-4 w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full"></div>
            <p className="text-gray-500">Loading program templates...</p>
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
                  selectedTemplate?.id === template.id ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'
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
                <p className="text-gray-600 text-xs line-clamp-2 mb-2">{template.description}</p>

                {template.goals && (
                  <div className="mb-2">
                    <p className="text-xs font-medium text-gray-700 mb-1">Goals:</p>
                    <div className="flex flex-wrap gap-1">
                      {template.goals.split(',').map((goal, idx) => (
                        <span key={idx} className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">
                          {goal.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {template.selectedAssets && (
                  <div className="mb-2">
                    <p className="text-xs font-medium text-gray-700 mb-1">Assets:</p>
                    <p className="text-xs text-gray-600 line-clamp-2">{template.selectedAssets}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Target size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No program templates available</p>
          </div>
        )}
      </div>

      {/* Assignment */}
      {selectedTemplate && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-teal-600" />
            Assign Program: {selectedTemplate.name}
          </h3>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-purple-900 mb-2">{selectedTemplate.name}</h4>
            <p className="text-purple-700 text-sm mb-2">{selectedTemplate.description}</p>
            <div className="flex flex-wrap gap-2 mb-2">
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(selectedTemplate.difficulty)}`}>
                {selectedTemplate.difficulty}
              </span>
              {selectedTemplate.goals && (
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                  Goals: {selectedTemplate.goals}
                </span>
              )}
            </div>
            {selectedTemplate.selectedAssets && (
              <div>
                <p className="text-xs font-medium text-purple-800 mb-1">Included Assets:</p>
                <p className="text-xs text-purple-600">{selectedTemplate.selectedAssets}</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Assignment Date</label>
              <input
                type="date"
                value={assignmentDate}
                onChange={(e) => setAssignmentDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
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
              type="button"
              onClick={(e) => handleAssignProgram(selectedTemplate, e)}
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
                  Assign Program to Patient
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
