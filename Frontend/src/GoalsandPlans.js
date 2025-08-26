import React, { useState, useEffect } from 'react';
import { X, Target, Plus, Edit, Trash2, Search, BookOpen, Play, FileText, MessageSquare, ClipboardList, BarChart3, Youtube, FileImage } from 'lucide-react';

// Helper function to convert Excel serial date to JavaScript Date
const excelSerialToDate = (serial) => {
  if (!serial || isNaN(serial)) return null;
  // Excel's epoch starts from 1900-01-01, but JavaScript's Date starts from 1970-01-01
  // 25569 is the number of days between 1900-01-01 and 1970-01-01
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400; // 86400 seconds in a day
  const date_info = new Date(utc_value * 1000);
  return date_info;
};

// Format the date as a readable string
const formatExcelDate = (serial) => {
  if (!serial || isNaN(serial)) return 'Unknown';
  const date = excelSerialToDate(serial);
  if (!date) return 'Unknown';
  return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
};

// Asset Type Icons
const getAssetIcon = (type) => {
  switch (type) {
    case 'exercise': return <Play size={16} className="text-blue-600" />;
    case 'question': return <MessageSquare size={16} className="text-green-600" />;
    case 'followup': return <ClipboardList size={16} className="text-orange-600" />;
    case 'form': return <FileText size={16} className="text-purple-600" />;
    case 'survey': return <BarChart3 size={16} className="text-red-600" />;
    default: return <FileImage size={16} className="text-gray-600" />;
  }
};

// Helper function to extract YouTube video ID from URL
const extractYouTubeVideoID = (url) => {
  if (!url) return null;
  const regex = /(?:youtube\.com.*(?:\?|&)v=|youtu\.be\/)([a-zA-Z0-9_-]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

// Create New Asset Modal Component (unchanged)
const CreateAssetModal = ({ isOpen, onClose, onCreateAsset }) => {
  const [assetData, setAssetData] = useState({
    name: '',
    description: '',
    type: 'exercise',
    content: '',
    youtubeUrl: '',
    tags: '',
    difficulty: 'Beginner'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const WRITE_API_URL = 'https://prod-30.uksouth.logic.azure.com:443/workflows/e72f984258194950a52263896a57d51e/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=R2UJtgA2jYTXJ_OmmSnB0naHcJzuyUtPjdiNQnkXo04';

  useEffect(() => {
    if (!isOpen) {
      setAssetData({
        name: '',
        description: '',
        type: 'exercise',
        content: '',
        youtubeUrl: '',
        tags: '',
        difficulty: 'Beginner'
      });
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
      const apiData = {
        userId: "100001",
        assetType: assetData.type,
        assetName: assetData.name.trim(),
        assetDescription: assetData.description.trim(),
        assetContent: assetData.content.trim(),
        youtubeUrl: assetData.youtubeUrl.trim(),
        tags: assetData.tags.trim(),
        difficulty: assetData.difficulty
      };

      console.log('Sending asset data to Excel:', apiData);

      const response = await fetch(WRITE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(apiData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save asset: HTTP ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Excel write response:', result);

      const newAsset = {
        id: `asset-${Date.now()}`,
        ...assetData,
        dateCreated: new Date().toLocaleDateString()
      };

      onCreateAsset(newAsset);
      onClose();

    } catch (error) {
      console.error('Error saving asset:', error);
      setSubmitError(error.message || 'Failed to save asset to Excel');
    } finally {
      setIsSubmitting(false);
    }
  };

  const assetTypes = [
    { value: 'exercise', label: 'Exercise' },
    { value: 'question', label: 'Question' },
    { value: 'followup', label: 'Follow-up' },
    { value: 'form', label: 'Form' },
    { value: 'survey', label: 'Survey' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Create New Asset</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
            disabled={isSubmitting}
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Asset Type</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                value={assetData.type}
                onChange={(e) => setAssetData(prev => ({ ...prev, type: e.target.value }))}
                disabled={isSubmitting}
              >
                {assetTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                value={assetData.difficulty}
                onChange={(e) => setAssetData(prev => ({ ...prev, difficulty: e.target.value }))}
                disabled={isSubmitting}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Asset Name</label>
            <input
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              value={assetData.name}
              onChange={(e) => setAssetData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter asset name"
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              rows={3}
              value={assetData.description}
              onChange={(e) => setAssetData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the asset"
              required
              disabled={isSubmitting}
            />
          </div>

          {assetData.type === 'exercise' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                YouTube URL (Optional)
                <span className="text-sm text-gray-500 ml-2">Leave empty for text-based description</span>
              </label>
              <div className="relative">
                <Youtube size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500" />
                <input
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  value={assetData.youtubeUrl}
                  onChange={(e) => setAssetData(prev => ({ ...prev, youtubeUrl: e.target.value }))}
                  placeholder="https://youtube.com/watch?v=..."
                  disabled={isSubmitting}
                />
              </div>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {assetData.type === 'exercise' && !assetData.youtubeUrl ? 'Exercise Instructions' : 'Content'}
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              rows={6}
              value={assetData.content}
              onChange={(e) => setAssetData(prev => ({ ...prev, content: e.target.value }))}
              placeholder={
                assetData.type === 'exercise' ? 
                  (assetData.youtubeUrl ? 'Additional notes or instructions...' : 'Detailed exercise instructions...') :
                assetData.type === 'question' ? 'Enter your question here...' :
                assetData.type === 'followup' ? 'Follow-up instructions or questions...' :
                assetData.type === 'form' ? 'Form fields and structure...' :
                'Survey questions and options...'
              }
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (Optional)
              <span className="text-sm text-gray-500 ml-2">Comma-separated for easy filtering</span>
            </label>
            <input
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              value={assetData.tags}
              onChange={(e) => setAssetData(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="strength, flexibility, cardio, assessment..."
              disabled={isSubmitting}
            />
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
                'Create Asset'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Create Program Template Modal
const CreateProgramModal = ({ isOpen, onClose, onCreateProgram, assets }) => {
  const [programData, setProgramData] = useState({
    name: '',
    description: '',
    difficulty: 'Beginner',
    goals: '',
    selectedAssets: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const PROGRAM_WRITE_API_URL = 'https://prod-05.uksouth.logic.azure.com:443/workflows/e727b483ccca45ce8ff8e46903f2e21f/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=MlYrP257QWooRwLDQoPsuDIU24ZeI9dnRIBwLGYdTY0';

  useEffect(() => {
    if (!isOpen) {
      setProgramData({
        name: '',
        description: '',
        difficulty: 'Beginner',
        goals: '',
        selectedAssets: []
      });
      setIsSubmitting(false);
      setSubmitError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAssetToggle = (assetId) => {
    setProgramData(prev => ({
      ...prev,
      selectedAssets: prev.selectedAssets.includes(assetId)
        ? prev.selectedAssets.filter(id => id !== assetId)
        : [...prev.selectedAssets, assetId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Convert selected asset IDs to asset names
      const selectedAssetNames = programData.selectedAssets
        .map(id => assets.find(asset => asset.id === id)?.name)
        .filter(Boolean)
        .join(', ');

      const apiData = {
        userId: "100001",
        programName: programData.name.trim(),
        programDescription: programData.description.trim(),
        difficulty: programData.difficulty,
        goals: programData.goals.trim(),
        selectedAssets: selectedAssetNames, // Send names instead of IDs
        dateCreated: new Date().toISOString()
      };

      console.log('Sending program data to Excel:', apiData);

      const response = await fetch(PROGRAM_WRITE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(apiData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save program: HTTP ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Program save response:', result);

      // Create local program object for immediate UI update
      const newProgram = {
        id: `program-${Date.now()}`,
        ...programData,
        assetCount: programData.selectedAssets.length,
        dateCreated: new Date().toLocaleDateString()
      };

      onCreateProgram(newProgram);
      onClose();

    } catch (error) {
      console.error('Error saving program:', error);
      setSubmitError(error.message || 'Failed to save program to Excel');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Create Program Template</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Program Name</label>
              <input
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                value={programData.name}
                onChange={(e) => setProgramData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter program name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                value={programData.difficulty}
                onChange={(e) => setProgramData(prev => ({ ...prev, difficulty: e.target.value }))}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              rows={3}
              value={programData.description}
              onChange={(e) => setProgramData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the program"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Associated Goals/Tags
              <span className="text-sm text-gray-500 ml-2">Comma-separated goals this program addresses</span>
            </label>
            <input
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              value={programData.goals}
              onChange={(e) => setProgramData(prev => ({ ...prev, goals: e.target.value }))}
              placeholder="weight loss, strength building, flexibility, pain management..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Select Assets for this Program ({programData.selectedAssets.length} selected)
            </label>
            <div className="border border-gray-300 rounded-lg max-h-64 overflow-y-auto">
              {assets.length === 0 ? (
                <div className="p-4 text-gray-500 text-center">
                  No assets available. Create some assets first.
                </div>
              ) : (
                <div className="p-4 space-y-2">
                  {assets.map(asset => (
                    <label key={asset.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={programData.selectedAssets.includes(asset.id)}
                        onChange={() => handleAssetToggle(asset.id)}
                        className="w-4 h-4 text-purple-600"
                      />
                      <div className="flex items-center space-x-2 flex-1">
                        {getAssetIcon(asset.type)}
                        <span className="text-sm font-medium">{asset.name}</span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {asset.type}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
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
              className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-purple-600 text-white hover:bg-purple-700 flex items-center disabled:bg-gray-400"
              disabled={isSubmitting || programData.selectedAssets.length === 0}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Creating...
                </>
              ) : (
                'Create Program'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Asset Card Component
const AssetCard = ({ asset, onEdit, onDelete }) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'exercise': return 'bg-blue-100 text-blue-800';
      case 'question': return 'bg-green-100 text-green-800';
      case 'followup': return 'bg-orange-100 text-orange-800';
      case 'form': return 'bg-purple-100 text-purple-800';
      case 'survey': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            {getAssetIcon(asset.type)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-lg">{asset.name}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(asset.type)}`}>
                {asset.type}
              </span>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(asset.difficulty)}`}>
                {asset.difficulty}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{asset.description}</p>
      
      {asset.youtubeUrl && asset.youtubeUrl.trim() !== '' && (
        <div className="mb-4">
          <a 
            href={asset.youtubeUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="block relative group"
          >
            <img
              src={`https://img.youtube.com/vi/${extractYouTubeVideoID(asset.youtubeUrl)}/0.jpg`}
              alt="YouTube Video Thumbnail"
              className="w-full h-40 object-cover rounded-lg"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="hidden w-full h-40 bg-red-50 border-2 border-dashed border-red-200 rounded-lg items-center justify-center flex-col">
              <Youtube size={32} className="text-red-500 mb-2" />
              <span className="text-sm text-red-600">YouTube Video</span>
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center opacity-80 group-hover:opacity-100 transform group-hover:scale-110 transition-all duration-200">
                <Play size={24} className="text-white ml-1" />
              </div>
            </div>
          </a>
          <div className="flex items-center space-x-2 mt-2 text-sm text-red-600">
            <Youtube size={14} />
            <span>Click to watch video</span>
          </div>
        </div>
      )}
      
      {asset.tags && (
        <div className="flex flex-wrap gap-1 mb-4">
          {asset.tags.split(',').map((tag, index) => (
            <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {tag.trim()}
            </span>
          ))}
        </div>
      )}
      
      <div className="text-sm text-gray-500">
        Created: {asset.dateCreated && !isNaN(asset.dateCreated) 
          ? formatExcelDate(asset.dateCreated) 
          : asset.dateCreated || 'Unknown'
        }
      </div>
    </div>
  );
};

// Program Card Component
const ProgramCard = ({ program, assets }) => {
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
            <h3 className="font-semibold text-gray-800 text-lg">{program.name}</h3>
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(program.difficulty)}`}>
              {program.difficulty}
            </span>
          </div>
        </div>
      </div>
      
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{program.description}</p>
      
      {program.goals && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-1">Associated Goals:</p>
          <div className="flex flex-wrap gap-1">
            {program.goals.split(',').map((goal, index) => (
              <span key={index} className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                {goal.trim()}
              </span>
            ))}
          </div>
        </div>
      )}

      {program.selectedAssets && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-1">Assets:</p>
          <p className="text-xs text-gray-600">{program.selectedAssets}</p>
        </div>
      )}
      
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>Created: {program.dateCreated && !isNaN(program.dateCreated) 
          ? formatExcelDate(program.dateCreated) 
          : program.dateCreated || 'Unknown'
        }</span>
      </div>
    </div>
  );
};

// Main Goals & Plans Component - UPDATED TO FETCH BOTH ASSETS AND PROGRAMS
const GoalsAndPlans = () => {
  const [showCreateAssetModal, setShowCreateAssetModal] = useState(false);
  const [showCreateProgramModal, setShowCreateProgramModal] = useState(false);
  const [assets, setAssets] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('assets');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API URLs for fetching data
  const READ_ASSETS_API_URL = 'https://prod-10.uksouth.logic.azure.com:443/workflows/54232e860fb94f078eb3094f85dc6385/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=qEACM65Dv52-l1uKqYtDOzc1ZrF36XPHL_BSWlJ0bvA';
  
  const READ_PROGRAMS_API_URL = 'https://prod-12.uksouth.logic.azure.com:443/workflows/2c67864498554457a3aeb0b9b9998230/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=lMgmbftXayVUeoQRDjHogTikDGevMi6ZPNh2qMfiWPw';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch both assets and programs in parallel
        const [assetsResponse, programsResponse] = await Promise.all([
          fetch(READ_ASSETS_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: '100001' })
          }),
          fetch(READ_PROGRAMS_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: '100001' })
          })
        ]);

        if (!assetsResponse.ok) {
          throw new Error(`Assets fetch failed: HTTP ${assetsResponse.status}`);
        }

        if (!programsResponse.ok) {
          throw new Error(`Programs fetch failed: HTTP ${programsResponse.status}`);
        }

        const assetsData = await assetsResponse.json();
        const programsData = await programsResponse.json();

        console.log('Raw Assets data:', assetsData);
        console.log('Raw Programs data:', programsData);
        
        const assetsRows = Array.isArray(assetsData) ? assetsData : [];
        const programsRows = Array.isArray(programsData) ? programsData : [];

        // Format assets with date conversion
        const formattedAssets = assetsRows.map((row, index) => ({
          id: row.ItemInternalId ?? row.Id ?? row.id ?? `asset-${index}`,
          name: row.assetName ?? 'Untitled Asset',
          description: row.assetDescription ?? 'No description provided',
          type: row.assetType ?? 'exercise',
          content: row.assetContent ?? '',
          youtubeUrl: row.youtubeUrl ?? '',
          tags: row.tags ?? '',
          difficulty: row.difficulty ?? 'Beginner',
          // Convert Excel serial date to readable format
          dateCreated: row.DateCreated ? formatExcelDate(row.DateCreated) : new Date().toLocaleDateString()
        }));

        // Format programs with date conversion
        const formattedPrograms = programsRows.map((row, index) => ({
          id: row.ItemInternalId ?? row.Id ?? row.id ?? `program-${index}`,
          name: row.programName ?? 'Untitled Program',
          description: row.programDescription ?? 'No description provided',
          difficulty: row.difficulty ?? 'Beginner',
          goals: row.goals ?? '',
          selectedAssets: row.selectedAssets ?? '',
          // Convert Excel serial date to readable format
          dateCreated: row.DateCreated ? formatExcelDate(row.DateCreated) : new Date().toLocaleDateString()
        }));

        console.log('Formatted assets:', formattedAssets);
        console.log('Formatted programs:', formattedPrograms);
        
        setAssets(formattedAssets);
        setPrograms(formattedPrograms);
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data from Excel.');
        setAssets([]);
        setPrograms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateAsset = (newAsset) => {
    setAssets(prev => [...prev, newAsset]);
  };

  const handleCreateProgram = (newProgram) => {
    setPrograms(prev => [...prev, newProgram]);
  };

  const filteredAssets = assets.filter(asset =>
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPrograms = programs.filter(program =>
    program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (program.goals && program.goals.toLowerCase().includes(searchTerm.toLowerCase()))
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
                Asset Library & Program Management
              </h1>
              <p className="text-gray-600">
                Manage your library of assets (exercises, questions, forms, surveys) and create program templates
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowCreateAssetModal(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center font-medium shadow-sm transition-colors"
              >
                <Plus size={20} className="mr-2" />
                Create Asset
              </button>
              <button
                onClick={() => setShowCreateProgramModal(true)}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center font-medium shadow-sm transition-colors"
              >
                <Plus size={20} className="mr-2" />
                Create Program
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('assets')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'assets'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Asset Library ({assets.length})
            </button>
            <button
              onClick={() => setActiveTab('programs')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'programs'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Program Templates ({programs.length})
            </button>
          </div>

          <div className="p-6">
            {/* Search Bar */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">
                {activeTab === 'assets' ? 'Asset Library' : 'Program Templates'}
              </h2>
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-64"
                />
              </div>
            </div>

            {/* Content */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin mx-auto mb-4 w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full"></div>
                <p className="text-gray-500">Loading...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <Target size={64} className="mx-auto text-red-300 mb-4" />
                <h3 className="text-lg font-medium text-red-600 mb-2">Error Loading Data</h3>
                <p className="text-red-500 mb-6">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Retry
                </button>
              </div>
            ) : activeTab === 'assets' ? (
              filteredAssets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAssets.map(asset => (
                    <AssetCard
                      key={asset.id}
                      asset={asset}
                      onEdit={() => {}}
                      onDelete={() => {}}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Target size={64} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">
                    {searchTerm ? 'No assets found' : 'No assets created yet'}
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {searchTerm 
                      ? 'Try adjusting your search terms' 
                      : 'Create your first asset (exercise, question, form, or survey) to get started'
                    }
                  </p>
                  {!searchTerm && (
                    <button
                      onClick={() => setShowCreateAssetModal(true)}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center mx-auto font-medium"
                    >
                      <Plus size={20} className="mr-2" />
                      Create First Asset
                    </button>
                  )}
                </div>
              )
            ) : (
              filteredPrograms.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPrograms.map(program => (
                    <ProgramCard
                      key={program.id}
                      program={program}
                      assets={assets}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen size={64} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">
                    {searchTerm ? 'No programs found' : 'No programs created yet'}
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {searchTerm 
                      ? 'Try adjusting your search terms' 
                      : 'Create your first program template by grouping assets together'
                    }
                  </p>
                  {!searchTerm && (
                    <button
                      onClick={() => setShowCreateProgramModal(true)}
                      className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center mx-auto font-medium"
                      disabled={assets.length === 0}
                    >
                      <Plus size={20} className="mr-2" />
                      {assets.length === 0 ? 'Create Assets First' : 'Create First Program'}
                    </button>
                  )}
                </div>
              )
            )}
          </div>
        </div>

        {/* Modals */}
        <CreateAssetModal
          isOpen={showCreateAssetModal}
          onClose={() => setShowCreateAssetModal(false)}
          onCreateAsset={handleCreateAsset}
        />

        <CreateProgramModal
          isOpen={showCreateProgramModal}
          onClose={() => setShowCreateProgramModal(false)}
          onCreateProgram={handleCreateProgram}
          assets={assets}
        />
      </div>
    </div>
  );
};

export default GoalsAndPlans;
