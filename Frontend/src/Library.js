import React, { useState, useEffect } from 'react';
import { X, Video, Plus, Tag, Link, Play, Edit, Trash2, Search } from 'lucide-react';

// YouTube info function
function getYouTubeInfo(url) {
  if (!url) return null;
  try {
    console.log('Processing URL:', url);
    
    const u = new URL(url);
    const host = u.hostname.replace('www.', '');
    
    let videoId = null;
    
    if (host === 'youtube.com' || host === 'm.youtube.com') {
      videoId = u.searchParams.get('v');
    } else if (host === 'youtu.be') {
      videoId = u.pathname.replace('/', '');
    }
    
    console.log('Extracted video ID:', videoId);
    
    if (!videoId) return null;
    
    const result = {
      id: videoId,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    };
    
    console.log('Generated YouTube info:', result);
    return result;
  } catch (error) {
    console.error('Error parsing YouTube URL:', url, error);
    return null;
  }
}

// VideoCard component
const VideoCard = ({ video, onPlay, onEdit, onDelete }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageError = () => {
    console.log('Thumbnail failed to load:', video.thumbnail);
    setImageError(true);
  };

  const handleImageLoad = () => {
    console.log('Thumbnail loaded successfully:', video.thumbnail);
    setImageLoaded(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="relative">
        {video.thumbnail && !imageError ? (
          <img 
            src={video.thumbnail} 
            alt={video.title} 
            className="w-full h-40 object-cover" 
            onError={handleImageError}
            onLoad={handleImageLoad}
            crossOrigin="anonymous"
          />
        ) : (
          <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-400">
            <Video size={40} />
            <div className="absolute bottom-1 left-1 text-xs bg-red-500 text-white px-1 rounded">
              {video.url ? 'Thumbnail failed' : 'No URL'}
            </div>
          </div>
        )}
        <button
          onClick={() => onPlay(video)}
          className="absolute bottom-3 right-3 bg-purple-600 text-white rounded-full p-3 hover:bg-purple-700 shadow"
          title="Play"
        >
          <Play size={18} />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 line-clamp-2">{video.title || 'Untitled'}</h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{video.description}</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {(video.tags || []).map((t, i) => (
            <span key={i} className="inline-flex items-center text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
              <Tag size={12} className="mr-1" />
              {t}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between mt-4">
          {/* <button
            onClick={() => onEdit(video)}
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
            title="Edit"
          >
            <Edit size={16} className="mr-1" /> Edit
          </button>
          <button
            onClick={() => onDelete(video.id)}
            className="inline-flex items-center text-red-600 hover:text-red-700"
            title="Delete"
          >
            <Trash2 size={16} className="mr-1" /> Delete
          </button>
           */}
        </div>
      </div>
    </div>
  );
};

// AddVideoModal component
const AddVideoModal = ({ isOpen, onClose, onAddVideo }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const WRITE_API_URL = 'https://prod-05.uksouth.logic.azure.com:443/workflows/e727b483ccca45ce8ff8e46903f2e21f/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=MlYrP257QWooRwLDQoPsuDIU24ZeI9dnRIBwLGYdTY0';

  useEffect(() => {
    if (!isOpen) {
      setTitle('');
      setUrl('');
      setDescription('');
      setTags('');
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
      const yt = getYouTubeInfo(url);
      
      const excelData = {
        userId: '100001',       
        title: title.trim(),        
        description: description.trim(),  
        url: url.trim(),            
        tags: tags.trim()           
      };

      console.log('Sending data to Excel:', excelData);

      const response = await fetch(WRITE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(excelData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save video: HTTP ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Excel write response:', result);

      const newVideo = {
        id: `video-${Date.now()}`,
        title: title.trim(),
        description: description.trim(),
        url: url.trim(),
        tags: tags
          .split(',')
          .map(t => t.trim())
          .filter(Boolean),
        thumbnail: yt?.thumbnailUrl || '',
        dateAdded: new Date().toLocaleDateString(),
        isYouTube: !!yt,
        duration: '',
      };

      onAddVideo(newVideo);
      onClose();

    } catch (error) {
      console.error('Error saving video:', error);
      setSubmitError(error.message || 'Failed to save video to Excel');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Add New Video</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
            disabled={isSubmitting}
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Video title"
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
            <div className="relative">
              <Link size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                className="w-full border rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                required
                disabled={isSubmitting}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description"
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
            <input
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. legs, mobility"
              disabled={isSubmitting}
            />
          </div>

          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
              {submitError}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 flex items-center disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Saving...
                </>
              ) : (
                'Add Video'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Library component - FIXED FIELD MAPPING!
const Library = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [videos, setVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const READ_API_URL =
    'https://prod-12.uksouth.logic.azure.com:443/workflows/2c67864498554457a3aeb0b9b9998230/triggers/manual/paths/invoke' +
    '?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0' +
    '&sig=lMgmbftXayVUeoQRDjHogTikDGevMi6ZPNh2qMfiWPw';

  // FIXED: Now looks for the correct column name "Videourl"
  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(READ_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: '100001' })
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const data = await res.json();
      const rows = Array.isArray(data) ? data : [];

      const formatted = rows.map((r, i) => {
        const title = r.Title ?? r.title ?? '';
        const description = r.Description ?? r.description ?? '';
        // 🎯 THE FIX: Now correctly looks for "Videourl" (exact match!)
        const url = r.Videourl ?? r.VideoUrl ?? r.videoUrl ?? r.Url ?? r.url ?? '';
        const tagsRaw = r.Tags ?? r.tags ?? '';
        
        console.log(`Processing video from Excel: ${title}, URL: ${url}`);
        
        // Generate YouTube info for Excel data
        const yt = url ? getYouTubeInfo(url) : null;
        
        return {
          id: r.ItemInternalId ?? r.Id ?? r.id ?? `video-${i}`,
          title,
          description,
          url,
          tags: typeof tagsRaw === 'string'
            ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean)
            : Array.isArray(tagsRaw) ? tagsRaw : [],
          thumbnail: yt?.thumbnailUrl || r.Thumbnail || r.thumbnail || '',
          dateAdded: r.DateAdded || r.dateAdded || new Date().toLocaleDateString(),
          isYouTube: !!yt,
          duration: r.Duration || r.duration || ''
        };
      });

      console.log('Formatted videos with thumbnails:', formatted);
      setVideos(formatted);
    } catch (err) {
      console.error('Error fetching videos:', err);
      setError('Failed to load videos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleAddVideo = async (newVideo) => {
    setVideos(prev => [...prev, newVideo]);
  };

  const handlePlayVideo = (video) => {
    if (video.url) {
      window.open(video.url, '_blank');
    }
  };

  const handleEditVideo = (video) => {
    console.log('Edit video:', video);
  };

  const handleDeleteVideo = (videoId) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      setVideos(prev => prev.filter(v => v.id !== videoId));
    }
  };

  const filteredVideos = videos.filter(video =>
    (video.title || '').toLowerCase().includes((searchTerm || '').toLowerCase()) ||
    (video.description || '').toLowerCase().includes((searchTerm || '').toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-16 px-6 pb-6">
      <div className="max-w-7xl mx-auto">
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

        {loading ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-500">
            Loading videos...
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center text-red-500">
            {error}
          </div>
        ) : filteredVideos.length > 0 ? (
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
