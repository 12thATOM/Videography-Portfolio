import React, { useState, useEffect } from 'react';
import { useContent } from '../context/ContentContext';
import { X, Plus, Trash2, Upload, Save, FileJson, RefreshCw, Check } from 'lucide-react';
import { MediaImage } from './MediaImage';

export const EditModal = () => {
  const {
    siteData,
    updateData,
    addItem,
    removeItem,
    uploadFile,
    saveChanges,
    hasUnsavedChanges,
    saveStatus,
    activeModal,
    setActiveModal,
    resetToDefault,
    exportJSON,
    exportForPublish,
    importJSON,
  } = useContent();

  const [activeTab, setActiveTab] = useState('brand');
  const [jsonText, setJsonText] = useState(() => JSON.stringify(siteData, null, 2));
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!activeModal) return;
    const tabMap = {
      'json-editor': 'json',
      photos: 'photos',
      cinematics: 'cinematics',
      videography: 'videography',
      about: 'about',
      brand: 'brand',
    };
    if (tabMap[activeModal]) {
      setActiveTab(tabMap[activeModal]);
    }
  }, [activeModal]);

  const [newPhoto, setNewPhoto] = useState({
    title: '',
    category: 'Portrait',
    orientation: 'portrait',
    aspectRatio: '3/4',
    url: '',
    description: '',
  });

  const [newCinematic, setNewCinematic] = useState({
    title: '',
    category: 'Short Film',
    videoType: 'mp4',
    videoUrl: '',
    poster: '',
    description: '',
    duration: '03:00',
    year: '2026',
  });

  const [newVideography, setNewVideography] = useState({
    title: '',
    client: '',
    category: 'Commercial',
    videoType: 'mp4',
    videoUrl: '',
    poster: '',
    description: '',
    resolution: '4K',
  });

  if (!activeModal) return null;

  const handleFileUpload = async (e, folder, callback) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await uploadFile(file, folder);
      if (result) callback(result.key, result.mimeType);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleAddPhotoSubmit = (e) => {
    e.preventDefault();
    if (!newPhoto.url || !newPhoto.title) {
      alert('Please fill in the Photo Title and upload an image from your device.');
      return;
    }
    addItem('photographyPage.photos', { ...newPhoto, id: 'photo_' + Date.now() });
    setNewPhoto({ title: '', category: 'Portrait', orientation: 'portrait', aspectRatio: '3/4', url: '', description: '' });
    alert('Photo added to Photography gallery!');
  };

  const handleAddCinematicSubmit = (e) => {
    e.preventDefault();
    if (!newCinematic.videoUrl || !newCinematic.title) {
      alert('Please fill in the Video Title and upload an MP4 from your device.');
      return;
    }
    addItem('cinematicsPage.videos', { ...newCinematic, id: 'cine_' + Date.now() });
    setNewCinematic({ title: '', category: 'Short Film', videoType: 'mp4', videoUrl: '', poster: '', description: '', duration: '03:00', year: '2026' });
    alert('Video added to Cinematics gallery!');
  };

  const handleAddVideographySubmit = (e) => {
    e.preventDefault();
    if (!newVideography.videoUrl || !newVideography.title) {
      alert('Please fill in Video Title and upload an MP4 from your device.');
      return;
    }
    addItem('videographyPage.videos', { ...newVideography, id: 'video_' + Date.now() });
    setNewVideography({ title: '', client: '', category: 'Commercial', videoType: 'mp4', videoUrl: '', poster: '', description: '', resolution: '4K' });
    alert('Video added to Videography gallery!');
  };

  const handleFeaturedCoverUpload = async (e, cardIndex) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await uploadFile(file, 'covers/featured');
      if (result) {
        const updated = [...siteData.featuredWork];
        updated[cardIndex].coverImage = result.key;
        updateData('featuredWork', updated);
      }
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <h2 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider font-heading">
              Content Manager
            </h2>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex border-b border-neutral-800 overflow-x-auto bg-neutral-950 text-[10px] sm:text-xs uppercase tracking-wider font-medium">
          {['brand', 'photos', 'cinematics', 'videography', 'about', 'json'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 sm:px-5 py-2.5 sm:py-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? 'border-blue-500 text-white bg-neutral-900'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {tab === 'brand' && 'Brand & Hero'}
              {tab === 'photos' && 'Photography'}
              {tab === 'cinematics' && 'Cinematics'}
              {tab === 'videography' && 'Videography'}
              {tab === 'about' && 'About'}
              {tab === 'json' && 'JSON'}
            </button>
          ))}
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-xs text-neutral-300 flex-1">
          {uploading && (
            <div className="bg-blue-950/50 border border-blue-800 rounded-lg p-3 text-blue-300 text-center">
              Uploading file… please wait
            </div>
          )}

          {activeTab === 'brand' && (
            <div className="space-y-6">
              <div className="space-y-4 bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                <h3 className="font-semibold text-white uppercase tracking-wider">Brand Information</h3>
                <div>
                  <label className="block text-neutral-400 mb-1">Artist Name / Header Title</label>
                  <input
                    type="text"
                    value={siteData.brand.title}
                    onChange={(e) => updateData('brand.title', e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Subtitle Roles (Separator: |)</label>
                  <input
                    type="text"
                    value={siteData.brand.subtitleRole}
                    onChange={(e) => updateData('brand.subtitleRole', e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Hero Background Image</label>
                  <label className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 rounded text-white font-semibold cursor-pointer">
                    <Upload size={14} />
                    <span>Upload Hero Background</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'hero', (key) => updateData('hero.bgImage', key))}
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-4 bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                <h3 className="font-semibold text-white uppercase tracking-wider">Featured Work Card Covers</h3>
                {siteData.featuredWork.map((card, idx) => (
                  <div key={card.id} className="flex items-center justify-between gap-3 p-3 bg-neutral-900 rounded-lg border border-neutral-800">
                    <div className="flex items-center space-x-3 min-w-0">
                      <MediaImage src={card.coverImage} alt={card.title} className="w-12 h-12 object-cover rounded flex-shrink-0" />
                      <span className="text-white font-semibold truncate">{card.title}</span>
                    </div>
                    <label className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded text-white text-[10px] font-semibold cursor-pointer flex items-center space-x-1 flex-shrink-0">
                      <Upload size={12} />
                      <span>Upload</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFeaturedCoverUpload(e, idx)} />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'photos' && (
            <div className="space-y-6">
              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-2">
                <h3 className="font-semibold text-white uppercase tracking-wider">Photography Page Cover</h3>
                <label className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 rounded text-white font-semibold cursor-pointer">
                  <Upload size={14} />
                  <span>Upload Cover Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'covers/photography', (key) => updateData('photographyPage.coverImage', key))}
                  />
                </label>
              </div>

              <form onSubmit={handleAddPhotoSubmit} className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-4">
                <h3 className="font-semibold text-white uppercase tracking-wider flex items-center space-x-2">
                  <Plus size={16} className="text-blue-400" />
                  <span>Add New Photograph</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-neutral-400 mb-1">Photo Title</label>
                    <input
                      type="text"
                      value={newPhoto.title}
                      onChange={(e) => setNewPhoto({ ...newPhoto, title: e.target.value })}
                      placeholder="e.g. Studio Portrait #1"
                      className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1">Category</label>
                    <input
                      type="text"
                      value={newPhoto.category}
                      onChange={(e) => setNewPhoto({ ...newPhoto, category: e.target.value })}
                      placeholder="e.g. Portrait, Landscape"
                      className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 text-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-neutral-400 mb-1">Upload Photo from Device</label>
                    <label className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 rounded text-white font-semibold cursor-pointer">
                      <Upload size={14} />
                      <span>{newPhoto.url ? 'Photo Selected ✓ — Change' : 'Choose Photo File'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, 'photos', (key) => setNewPhoto({ ...newPhoto, url: key }))}
                      />
                    </label>
                  </div>
                </div>
                <button type="submit" className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded transition-colors">
                  Save Photo to Gallery
                </button>
              </form>

              <div className="space-y-3">
                <h3 className="font-semibold text-white uppercase tracking-wider">
                  Current Photos ({siteData.photographyPage.photos.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {siteData.photographyPage.photos.map((photo) => (
                    <div key={photo.id} className="relative group bg-neutral-950 p-2 rounded-lg border border-neutral-800 flex items-center space-x-3">
                      <MediaImage src={photo.url} alt={photo.title} className="w-12 h-12 object-cover rounded flex-shrink-0" />
                      <div className="flex-1 truncate">
                        <p className="font-semibold text-white truncate">{photo.title}</p>
                        <p className="text-[10px] text-neutral-400">{photo.category}</p>
                      </div>
                      <button
                        onClick={() => removeItem('photographyPage.photos', photo.id)}
                        className="p-1.5 bg-red-950 hover:bg-red-900 text-red-300 rounded flex-shrink-0"
                        title="Delete Photo"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cinematics' && (
            <div className="space-y-6">
              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-2">
                <h3 className="font-semibold text-white uppercase tracking-wider">Cinematics Page Cover</h3>
                <label className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 rounded text-white font-semibold cursor-pointer">
                  <Upload size={14} />
                  <span>Upload Cover Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'covers/cinematics', (key) => updateData('cinematicsPage.coverImage', key))}
                  />
                </label>
              </div>

              <form onSubmit={handleAddCinematicSubmit} className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-4">
                <h3 className="font-semibold text-white uppercase tracking-wider flex items-center space-x-2">
                  <Plus size={16} className="text-blue-400" />
                  <span>Add New Cinematic Video</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-neutral-400 mb-1">Video Title</label>
                    <input
                      type="text"
                      value={newCinematic.title}
                      onChange={(e) => setNewCinematic({ ...newCinematic, title: e.target.value })}
                      placeholder="e.g. Short Film - Echoes"
                      className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1">Upload Video from Device (all formats)</label>
                    <label className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 rounded text-white font-semibold cursor-pointer">
                      <Upload size={14} />
                      <span>{newCinematic.videoUrl ? 'Video Selected ✓ — Change' : 'Choose Video File'}</span>
                      <input
                        type="file"
                        accept="video/*,.mp4,.webm,.mov,.avi,.mkv,.ogv,.mpeg,.mpg,.m4v"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, 'videos/cinematics', (key, mime) => setNewCinematic({ ...newCinematic, videoUrl: key, mimeType: mime, videoType: 'file' }))}
                      />
                    </label>
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1">Poster Image (optional)</label>
                    <label className="flex items-center justify-center space-x-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded text-neutral-200 cursor-pointer">
                      <Upload size={14} />
                      <span>{newCinematic.poster ? 'Poster Selected ✓' : 'Upload Poster'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, 'posters', (key) => setNewCinematic({ ...newCinematic, poster: key }))}
                      />
                    </label>
                  </div>
                </div>
                <button type="submit" className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded transition-colors">
                  Save Video to Cinematics
                </button>
              </form>

              <div className="space-y-3">
                <h3 className="font-semibold text-white uppercase tracking-wider">
                  Current Videos ({siteData.cinematicsPage.videos.length})
                </h3>
                <div className="space-y-2">
                  {siteData.cinematicsPage.videos.map((vid) => (
                    <div key={vid.id} className="bg-neutral-950 p-3 rounded-lg border border-neutral-800 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-white">{vid.title}</p>
                        <p className="text-[10px] text-neutral-400 font-mono">
                          {vid.videoUrl ? (vid.videoUrl.startsWith('idb:') ? 'Uploaded MP4' : vid.videoUrl.slice(0, 45) + '...') : 'No video'}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem('cinematicsPage.videos', vid.id)}
                        className="p-1.5 bg-red-950 hover:bg-red-900 text-red-300 rounded"
                        title="Delete Video"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'videography' && (
            <div className="space-y-6">
              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-2">
                <h3 className="font-semibold text-white uppercase tracking-wider">Videography Page Cover</h3>
                <label className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 rounded text-white font-semibold cursor-pointer">
                  <Upload size={14} />
                  <span>Upload Cover Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'covers/videography', (key) => updateData('videographyPage.coverImage', key))}
                  />
                </label>
              </div>

              <form onSubmit={handleAddVideographySubmit} className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-4">
                <h3 className="font-semibold text-white uppercase tracking-wider flex items-center space-x-2">
                  <Plus size={16} className="text-blue-400" />
                  <span>Add Commercial Videography Project</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-neutral-400 mb-1">Project Title</label>
                    <input
                      type="text"
                      value={newVideography.title}
                      onChange={(e) => setNewVideography({ ...newVideography, title: e.target.value })}
                      placeholder="e.g. Porsche GT3 Commercial"
                      className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1">Client Name</label>
                    <input
                      type="text"
                      value={newVideography.client}
                      onChange={(e) => setNewVideography({ ...newVideography, client: e.target.value })}
                      placeholder="e.g. Porsche Italia"
                      className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 text-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-neutral-400 mb-1">Upload Video from Device (all formats)</label>
                    <label className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 rounded text-white font-semibold cursor-pointer">
                      <Upload size={14} />
                      <span>{newVideography.videoUrl ? 'Video Selected ✓ — Change' : 'Choose Video File'}</span>
                      <input
                        type="file"
                        accept="video/*,.mp4,.webm,.mov,.avi,.mkv,.ogv,.mpeg,.mpg,.m4v"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, 'videos/videography', (key, mime) => setNewVideography({ ...newVideography, videoUrl: key, mimeType: mime, videoType: 'file' }))}
                      />
                    </label>
                  </div>
                </div>
                <button type="submit" className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded transition-colors">
                  Save Videography Project
                </button>
              </form>

              <div className="space-y-2">
                <h3 className="font-semibold text-white uppercase tracking-wider">Existing Projects</h3>
                {siteData.videographyPage.videos.map((vid) => (
                  <div key={vid.id} className="bg-neutral-950 p-3 rounded-lg border border-neutral-800 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">
                        {vid.title} <span className="text-neutral-500 text-xs">({vid.client})</span>
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem('videographyPage.videos', vid.id)}
                      className="p-1.5 bg-red-950 hover:bg-red-900 text-red-300 rounded"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-6">
              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-4">
                <h3 className="font-semibold text-white uppercase tracking-wider">Profile Image</h3>
                <label className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 rounded text-white font-semibold cursor-pointer">
                  <Upload size={14} />
                  <span>Upload Profile Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'profile', (key) => updateData('about.profileImage', key))}
                  />
                </label>
              </div>
              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-3">
                <h3 className="font-semibold text-white uppercase tracking-wider">Bio Paragraphs</h3>
                {siteData.about.bio.map((paragraph, index) => (
                  <textarea
                    key={index}
                    value={paragraph}
                    onChange={(e) => {
                      const updated = [...siteData.about.bio];
                      updated[index] = e.target.value;
                      updateData('about.bio', updated);
                    }}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded p-3 text-sm text-neutral-200"
                    rows={3}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'json' && (
            <div className="space-y-4">
              <p className="text-neutral-400">
                View, edit, or copy the entire JSON portfolio structure. Note: uploaded media references use idb: keys stored in browser IndexedDB.
              </p>
              <textarea
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                className="w-full h-60 sm:h-80 bg-neutral-950 border border-neutral-800 rounded p-3 font-mono text-[10px] sm:text-[11px] text-green-400 focus:outline-none"
              />
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => importJSON(jsonText)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded flex items-center space-x-2"
                >
                  <Save size={14} />
                  <span>Apply JSON Edits</span>
                </button>
                <button
                  onClick={() => {
                    setJsonText(JSON.stringify(siteData, null, 2));
                  }}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded"
                >
                  Refresh from Current
                </button>
                <button
                  onClick={exportForPublish}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-medium rounded flex items-center space-x-2"
                >
                  <Upload size={14} />
                  <span>Export for Publish</span>
                </button>
                <button
                  onClick={exportJSON}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded flex items-center space-x-2"
                >
                  <FileJson size={14} />
                  <span>Download .json</span>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-neutral-800 bg-neutral-950 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 safe-bottom">
          <button
            onClick={resetToDefault}
            className="text-[10px] sm:text-xs text-red-400 hover:text-red-300 flex items-center space-x-1 touch-target justify-center sm:justify-start"
          >
            <RefreshCw size={13} />
            <span>Reset to Default</span>
          </button>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={saveChanges}
              disabled={saveStatus === 'saving'}
              className={`flex items-center justify-center space-x-2 px-4 sm:px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors touch-target flex-1 sm:flex-none ${
                saveStatus === 'saved'
                  ? 'bg-emerald-600 text-white'
                  : hasUnsavedChanges
                  ? 'bg-amber-600 hover:bg-amber-500 text-white'
                  : 'bg-blue-600 hover:bg-blue-500 text-white'
              } disabled:opacity-60`}
            >
              {saveStatus === 'saved' ? <Check size={14} /> : <Save size={14} />}
              <span>{saveStatus === 'saved' ? 'Saved!' : 'Save Changes'}</span>
            </button>
            <button
              onClick={() => setActiveModal(null)}
              className="px-4 sm:px-5 py-2.5 bg-white text-black font-semibold rounded-full text-xs hover:bg-neutral-200 transition-colors uppercase tracking-wider touch-target flex-1 sm:flex-none"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
