import React, { useState } from 'react';
import { X, Upload, Zap, Trash2 } from 'lucide-react';

const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #D1D5DB;
    border-radius: 10px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #9CA3AF;
  }
`;

const NewPostModal = ({ newPost, setNewPost, setShowNewPostModal, shareToSocial }) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState(['Instagram']);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isPublishing, setIsPublishing] = useState(false);

  const safeNewPost = newPost || { platform: 'instagram', content: '', mediaType: 'text', mediaUrl: '' };

  const platforms = [
    { id: 'Instagram', color: '#E1306C', bgColor: 'bg-pink-50', borderColor: 'border-pink-500', textColor: 'text-pink-600' },
    { id: 'Facebook', color: '#1877F2', bgColor: 'bg-blue-50', borderColor: 'border-blue-600', textColor: 'text-blue-600' },
    { id: 'Twitter', color: '#1DA1F2', bgColor: 'bg-sky-50', borderColor: 'border-sky-500', textColor: 'text-sky-600' },
    { id: 'LinkedIn', color: '#0A66C2', bgColor: 'bg-blue-50', borderColor: 'border-blue-700', textColor: 'text-blue-700' }
  ];

  const togglePlatform = (platformId) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  };

  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      type: file.type
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleClose = () => {
    setUploadedFiles([]);
    setNewPost({ platform: 'instagram', content: '', mediaType: 'text', mediaUrl: '' });
    setSelectedPlatforms(['Instagram']);
    setShowNewPostModal(false);
    setIsPublishing(false);
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handlePublish = async () => {
    if (!safeNewPost.content.trim()) {
      alert('Enter post content');
      return;
    }
    
    if (selectedPlatforms.length === 0) {
      alert('Select at least one platform');
      return;
    }

    setIsPublishing(true);

    try {
      const base64Files = await Promise.all(
        uploadedFiles.map(async (fileObj) => ({
          base64: await fileToBase64(fileObj.file),
          name: fileObj.name,
          type: fileObj.type
        }))
      );

      const webhookData = {
        platforms: selectedPlatforms.map(p => p.toLowerCase()),
        content: safeNewPost.content,
        caption: safeNewPost.content,
        mediaType: uploadedFiles.length > 0 ? 'image' : 'text',
        images: base64Files.length > 0 ? base64Files : [],
        image_url: safeNewPost.mediaUrl || '',
        visibility: 'public',
        timestamp: new Date().toISOString()
      };

      console.log('Sending webhook data:', webhookData);

      const response = await fetch('https://n8n.avertisystems.com/webhook/social-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData)
      });

      if (response.ok) {
        console.log('Webhook triggered successfully');
        alert(`Post published to ${selectedPlatforms.join(', ')} successfully! 🎉`);
        
        if (shareToSocial) {
          selectedPlatforms.forEach(p => shareToSocial(p.toLowerCase()));
        }
        
        handleClose();
      } else {
        const errorText = await response.text();
        console.error('Webhook failed:', response.status, errorText);
        alert('Failed to publish post: ' + (errorText || 'Unknown error'));
        setIsPublishing(false);
      }
    } catch (error) {
      console.error('Error triggering webhook:', error);
      alert('Error publishing post: ' + error.message);
      setIsPublishing(false);
    }
  };

  return (
    <>
      <style>{scrollbarStyles}</style>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
          
          {/* Header - Professional Gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-7 py-5 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-xl">
                <Zap className="w-6 h-6 text-white" fill="white" />
              </div>
              <div>
                <h2 className="text-white font-bold text-xl tracking-tight">Create New Post</h2>
                <p className="text-blue-100 text-sm">Share your content with the world</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={isPublishing}
              className="text-white/90 hover:bg-white/20 p-2 rounded-lg transition-all duration-200 disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content - Scrollable */}
          <div className="p-7 overflow-y-auto flex-1 custom-scrollbar">
            
            {/* Platforms - Multiple Selection */}
            <div className="mb-5">
              <label className="text-gray-700 font-semibold mb-3 block flex items-center gap-2 text-sm">
                <span>🌐</span> Select Platforms (Multiple)
              </label>
              <div className="grid grid-cols-2 gap-3">
                {platforms.map(platform => (
                  <button
                    key={platform.id}
                    onClick={() => togglePlatform(platform.id)}
                    disabled={isPublishing}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      selectedPlatforms.includes(platform.id)
                        ? `${platform.borderColor} ${platform.bgColor} shadow-md`
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                    } ${isPublishing ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">
                        {platform.id === 'Instagram' && (
                          <svg viewBox="0 0 24 24" className="w-8 h-8" fill={selectedPlatforms.includes(platform.id) ? platform.color : '#9CA3AF'}>
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                          </svg>
                        )}
                        {platform.id === 'Facebook' && (
                          <svg viewBox="0 0 24 24" className="w-8 h-8" fill={selectedPlatforms.includes(platform.id) ? platform.color : '#9CA3AF'}>
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                          </svg>
                        )}
                        {platform.id === 'Twitter' && (
                          <svg viewBox="0 0 24 24" className="w-8 h-8" fill={selectedPlatforms.includes(platform.id) ? platform.color : '#9CA3AF'}>
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                          </svg>
                        )}
                        {platform.id === 'LinkedIn' && (
                          <svg viewBox="0 0 24 24" className="w-8 h-8" fill={selectedPlatforms.includes(platform.id) ? platform.color : '#9CA3AF'}>
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                        )}
                      </div>
                      <div className="text-left">
                        <div className={`text-sm font-semibold ${selectedPlatforms.includes(platform.id) ? platform.textColor : 'text-gray-600'}`}>
                          {platform.id}
                        </div>
                        {selectedPlatforms.includes(platform.id) && (
                          <div className="text-xs text-green-600 font-medium">✓ Selected</div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Textarea */}
            <div className="mb-4">
              <textarea
                value={safeNewPost.content}
                onChange={(e) => setNewPost({ ...safeNewPost, content: e.target.value })}
                placeholder="What's on your mind? ✨"
                disabled={isPublishing}
                className="w-full h-32 p-4 border-2 border-gray-200 rounded-2xl resize-none focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-gray-700 placeholder-gray-400 disabled:opacity-50 disabled:bg-gray-50"
              />
            </div>

            {/* Upload Media */}
            <div className="mb-4">
              <label className={`flex items-center gap-3 cursor-pointer p-4 border-2 border-dashed border-gray-300 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 ${isPublishing ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <Upload className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-700">Upload media</span>
                <input hidden type="file" accept="image/*,video/*" multiple onChange={handleUpload} disabled={isPublishing} />
              </label>
            </div>

            {/* Preview - Show mediaUrl if exists */}
            {safeNewPost.mediaUrl && (
              <div className="border-2 border-gray-200 rounded-2xl p-4 mb-4">
                <p className="text-xs font-semibold text-gray-500 mb-2">From Approved Content:</p>
                <img src={safeNewPost.mediaUrl} className="w-full max-h-48 object-contain rounded-xl" alt="Approved media" />
              </div>
            )}

            {/* Preview - Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mb-4">
                {uploadedFiles.map((file, i) => (
                  <div key={i} className="relative group">
                    <img src={file.preview} className="h-20 w-full object-cover rounded-xl border-2 border-gray-200" alt={file.name} />
                    <button 
                      onClick={() => removeFile(i)} 
                      disabled={isPublishing}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg hover:bg-red-600 transition-all duration-200 disabled:opacity-50"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer with improved buttons - Fixed at bottom */}
          <div className="bg-gray-50 px-7 py-4 flex items-center justify-end gap-3 border-t border-gray-100 flex-shrink-0">
            <button
              onClick={handleClose}
              disabled={isPublishing}
              className="px-6 py-2.5 text-gray-700 font-medium hover:bg-gray-200 rounded-xl transition-all duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handlePublish}
              disabled={isPublishing}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPublishing ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Publishing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" fill="white" />
                  Publish
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewPostModal;