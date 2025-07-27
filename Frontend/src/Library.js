import React, { useState } from 'react';
import { X, Video, Plus, Tag, Link, Play, Edit, Trash2, Search } from 'lucide-react';

// Helper function to extract YouTube video ID and generate embed URL/thumbnail
const getYouTubeInfo = (url) => {
  if (!url || typeof url !== 'string') {
    return null;
  }

  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = url.match(regExp);
  const videoId = (match && match[1]) ? match[1] : null;
  
  if (videoId) {
    return {
      videoId,
      embedUrl: `https://www.youtube.com/embed/${videoId}`,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      watchUrl: `https://www.youtube.com/watch?v=${videoId}`
    };
  }
  return null;
};

// Video Card Component
const VideoCard = ({ video, onPlay, onEdit, onDelete }) => {
  const [imageError, setImageError] = useState(false);
  const youtubeInfo = getYouTubeInfo(video.url);
  
  const thumbnailUrl = youtubeInfo?.thumbnailUrl || video.thumbnail;

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow group">
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gray-100">
        <img 
          src={imageError ? 'https://via.placeholder.com/320x180/e5e7eb/6b7280?text=Error' : thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
        
        {/* Overlay controls */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
            <button
              onClick={() => onPlay(video)}
              className="p-3 bg-white text-gray-900 rounded-full hover:bg-gray-100 transition-colors shadow-lg"
              title="Play video"
            >
              <Play size={20} />
            </button>
            <button
              onClick={() => onEdit(video)}
              className="p-3 bg-white text-gray-900 rounded-full hover:bg-gray-100 transition-colors shadow-lg"
              title="Edit video"
            >
              <Edit size={20} />
            </button>
            <button
              onClick={() => onDelete(video.id)}
              className="p-3 bg-white text-red-600 rounded-full hover:bg-red-50 transition-colors shadow-lg"
              title="Delete video"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
        
        {/* Duration badge */}
        {video.duration && (
          <div className="absolute bottom-2 right-2 px-2 py-1 bg-black bg-opacity-75 text-white text-xs rounded">
            {video.duration}
          </div>
        )}
      </div>
      
      {/* Video info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-2 line-clamp-2">
          {video.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {video.description}
        </p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {video.tags?.slice(0, 3).map(tag => (
            <span key={tag} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
              {tag}
            </span>
          ))}
          {video.tags?.length > 3 && (
            <span className="text-xs text-gray-500">+{video.tags.length - 3}</span>
          )}
        </div>
      </div>
    </div>
  );
};

// Add Video Modal (keeping your existing modal code)
const AddVideoModal = ({ isOpen, onClose, onAddVideo }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    tags: ''
  });
  
  const [errors, setErrors] = useState({});
  const [previewData, setPreviewData] = useState(null);

  React.useEffect(() => {
    if (isOpen) {
      setFormData({ title: '', description: '', url: '', tags: '' });
      setErrors({});
      setPreviewData(null);
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (formData.url) {
      const youtubeInfo = getYouTubeInfo(formData.url);
      if (youtubeInfo) {
        setPreviewData(youtubeInfo);
      } else {
        setPreviewData(null);
      }
    } else {
      setPreviewData(null);
    }
  }, [formData.url]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.url.trim()) {
      newErrors.url = 'Video URL is required';
    } else {
      try {
        new URL(formData.url);
      } catch {
        newErrors.url = 'Please enter a valid URL';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const tags = formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== '');
    
    const youtubeInfo = getYouTubeInfo(formData.url);
    
    const newVideo = {
      id: `video-${Date.now()}`,
      title: formData.title.trim(),
      description: formData.description.trim(),
      url: formData.url.trim(),
      tags,
      thumbnail: youtubeInfo?.thumbnailUrl,
      dateAdded: new Date().toLocaleDateString(),
      isYouTube: !!youtubeInfo,
      duration: ''
    };
    
    onAddVideo(newVideo);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mr-3">
              <Video size={20} className="text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Add New Exercise Video</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${
                errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Enter video title"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center mr-2">!</span>
                {errors.title}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors resize-none"
              rows="3"
              placeholder="Describe the video content"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Video URL (YouTube or Direct Link) *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Link size={18} className="text-gray-400" />
              </div>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => handleChange('url', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${
                  errors.url ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>
            {errors.url && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center mr-2">!</span>
                {errors.url}
              </p>
            )}
          </div>

          {previewData && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preview
              </label>
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <img
                  src={previewData.thumbnailUrl}
                  alt="Video preview"
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/320x180/e5e7eb/6b7280?text=Preview+Error';
                  }}
                />
              </div>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (comma-separated)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Tag size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => handleChange('tags', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                placeholder="strength, beginner, upper body"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors flex items-center"
            >
              <Plus size={18} className="mr-2" />
              Add Video
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Library component with MORE top padding to prevent cropping
const Library = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [videos, setVideos] = useState([
    {
      id: 'real-1',
      title: 'Perfect Squat Form - Complete Guide',
      description: 'Learn proper squat technique with detailed form cues and common mistakes to avoid.',
      url: 'https://www.youtube.com/watch?v=Dy28eq2PjcM',
      tags: ['strength', 'legs', 'beginner', 'form'],
      thumbnail: 'https://img.youtube.com/vi/Dy28eq2PjcM/hqdefault.jpg',
      dateAdded: '2024-01-15',
      isYouTube: true,
      duration: '8:42'
    },
    {
      id: 'real-2',
      title: '10-Minute Morning Stretch Routine',
      description: 'Full body stretching routine perfect for starting your day with energy and flexibility.',
      url: 'https://www.youtube.com/watch?v=g_tea8ZNk5A',
      tags: ['stretching', 'morning', 'flexibility', 'beginner'],
      thumbnail: 'https://img.youtube.com/vi/g_tea8ZNk5A/hqdefault.jpg',
      dateAdded: '2024-01-20',
      isYouTube: true,
      duration: '10:15'
    },
    {
      id: 'real-3',
      title: 'HIIT Cardio Workout - No Equipment',
      description: 'High-intensity interval training workout that requires no equipment. Burn calories fast!',
      url: 'https://www.youtube.com/watch?v=ml6cT4AZdqI',
      tags: ['hiit', 'cardio', 'no-equipment', 'fat-loss'],
      thumbnail: 'https://img.youtube.com/vi/ml6cT4AZdqI/hqdefault.jpg',
      dateAdded: '2024-01-25',
      isYouTube: true,
      duration: '15:30'
    },
    {
      id: 'real-4',
      title: 'Push Up Variations for All Levels',
      description: 'Master different push-up variations from beginner to advanced levels.',
      url: 'https://www.youtube.com/watch?v=0GsVJsS6474',
      tags: ['push-ups', 'upper-body', 'strength', 'bodyweight'],
      thumbnail: 'https://img.youtube.com/vi/0GsVJsS6474/hqdefault.jpg',
      dateAdded: '2024-02-01',
      isYouTube: true,
      duration: '12:20'
    },
    {
      id: 'real-5',
      title: 'Yoga Flow for Beginners',
      description: 'Gentle yoga flow perfect for beginners. Improve flexibility and reduce stress.',
      url: 'https://www.youtube.com/watch?v=v7AYKMP6rOE',
      tags: ['yoga', 'beginner', 'flexibility', 'relaxation'],
      thumbnail: 'https://img.youtube.com/vi/v7AYKMP6rOE/hqdefault.jpg',
      dateAdded: '2024-02-05',
      isYouTube: true,
      duration: '20:45'
    },
    {
      id: 'real-6',
      title: 'Core Strength Workout - 15 Minutes',
      description: 'Intense core workout to build abdominal strength and stability.',
      url: 'https://www.youtube.com/watch?v=1919oeGACbE',
      tags: ['core', 'abs', 'strength', 'intermediate'],
      thumbnail: 'https://img.youtube.com/vi/1919oeGACbE/hqdefault.jpg',
      dateAdded: '2024-02-10',
      isYouTube: true,
      duration: '15:00'
    },
    {
      id: 'real-7',
      title: 'Resistance Band Full Body Workout',
      description: 'Complete full body workout using only resistance bands. Perfect for home or travel.',
      url: 'https://www.youtube.com/watch?v=6hwUUXJGIGQ',
      tags: ['resistance-bands', 'full-body', 'home-workout', 'equipment'],
      thumbnail: 'https://img.youtube.com/vi/6hwUUXJGIGQ/hqdefault.jpg',
      dateAdded: '2024-02-15',
      isYouTube: true,
      duration: '25:30'
    },
    {
      id: 'real-8',
      title: 'Proper Deadlift Technique',
      description: 'Learn the fundamentals of deadlifting with proper form and safety tips.',
      url: 'https://www.youtube.com/watch?v=op9kVnSso6Q',
      tags: ['deadlift', 'strength', 'form', 'powerlifting'],
      thumbnail: 'https://img.youtube.com/vi/op9kVnSso6Q/hqdefault.jpg',
      dateAdded: '2024-02-20',
      isYouTube: true,
      duration: '11:15'
    }
  ]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddVideo = (newVideo) => {
    setVideos(prev => [...prev, newVideo]);
  };

  const handlePlayVideo = (video) => {
    if (video.isYouTube) {
      window.open(video.url, '_blank');
    }
  };

  const handleEditVideo = (video) => {
    console.log('Edit video:', video);
    // Implement edit functionality
  };

  const handleDeleteVideo = (videoId) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      setVideos(prev => prev.filter(v => v.id !== videoId));
    }
  };

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-16 px-6 pb-6">
      <div className="max-w-7xl mx-auto">
        {/* Header - increased top padding from pt-8 to pt-16 */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-800 flex items-center mb-2">
                <Video size={24} className="mr-3 text-purple-600" />
                Exercise Video Library
              </h1>
              <p className="text-gray-600">
                Manage your collection of exercise videos ({videos.length} videos)
              </p>
            </div>
            
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center font-medium shadow-sm"
            >
              <Plus size={20} className="mr-2" />
              Add New Video
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search videos by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
        </div>

        {/* Video Grid */}
        {filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVideos.map(video => (
              <VideoCard
                key={video.id}
                video={video}
                onPlay={handlePlayVideo}
                onEdit={handleEditVideo}
                onDelete={handleDeleteVideo}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Video size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              No videos found
            </h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your search terms
            </p>
          </div>
        )}

        {/* Add Video Modal */}
        <AddVideoModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAddVideo={handleAddVideo}
        />
      </div>
    </div>
  );
};

export default Library;
