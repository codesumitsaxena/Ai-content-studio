import React, { useState } from 'react';
import { XCircle, Send, Image, Video, Link, Plus, Trash2 } from 'lucide-react';

const NewPostModal = ({
  newPost,
  setNewPost,
  setShowNewPostModal,
  shareToSocial,
  darkMode,
  cardBg,
  textColor,
  textSecondary
}) => {
  // Safety check - initialize newPost if undefined
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [links, setLinks] = useState(['']);
  
  // Ensure newPost has default values
  const safeNewPost = newPost || {
    platform: 'instagram',
    content: '',
    mediaType: 'text',
    mediaUrl: ''
  };

  const handleFileUpload = (e, type) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      type: type
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const addLinkField = () => {
    setLinks(prev => [...prev, '']);
  };

  const updateLink = (index, value) => {
    setLinks(prev => prev.map((link, i) => i === index ? value : link));
  };

  const removeLink = (index) => {
    setLinks(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fadeIn">
      <div className={`${cardBg} backdrop-blur-xl rounded-3xl shadow-2xl max-w-md w-full border-2 ${darkMode ? 'border-gray-700' : 'border-purple-200'} animate-scaleIn`}>
        <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-purple-200'} flex items-center justify-between`}>
          <h3 className={`text-xl font-bold ${textColor}`}>Create New Post</h3>
          <button 
            onClick={() => setShowNewPostModal(false)} 
            className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-purple-100'}`}
          >
            <XCircle className={`w-5 h-5 ${textSecondary}`} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className={`block text-sm font-bold ${textColor} mb-2`}>Platform</label>
            <select 
              value={safeNewPost.platform}
              onChange={(e) => setNewPost({...safeNewPost, platform: e.target.value})}
              className={`w-full px-4 py-3 rounded-xl border-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-purple-200'} focus:border-purple-500 focus:outline-none font-medium`}
            >
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="twitter">Twitter/X</option>
              <option value="linkedin">LinkedIn</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm font-bold ${textColor} mb-2`}>Content Type</label>
            <div className="grid grid-cols-4 gap-2">
              {['text', 'link', 'photo', 'video'].map((type) => (
                <button
                  key={type}
                  onClick={() => setNewPost({...newPost, mediaType: type})}
                  className={`p-3 rounded-xl font-bold transition-all capitalize ${
                    newPost.mediaType === type
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white scale-105'
                      : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={`block text-sm font-bold ${textColor} mb-2`}>Post Content</label>
            <textarea
              value={newPost.content}
              onChange={(e) => setNewPost({...newPost, content: e.target.value})}
              placeholder="What's on your mind?"
              className={`w-full h-32 px-4 py-3 rounded-xl border-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-purple-200'} focus:border-purple-500 focus:outline-none resize-none`}
            />
          </div>

          {(newPost.mediaType !== 'text') && (
            <div>
              <label className={`block text-sm font-bold ${textColor} mb-2`}>
                {newPost.mediaType === 'link' ? 'Link URL' : 
                 newPost.mediaType === 'photo' ? 'Photo URL' : 'Video URL'}
              </label>
              <input
                type="url"
                value={newPost.mediaUrl}
                onChange={(e) => setNewPost({...newPost, mediaUrl: e.target.value})}
                placeholder={`Enter ${newPost.mediaType} URL`}
                className={`w-full px-4 py-3 rounded-xl border-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-purple-200'} focus:border-purple-500 focus:outline-none`}
              />
            </div>
          )}
        </div>

        <div className={`p-6 border-t ${darkMode ? 'border-gray-700' : 'border-purple-200'}`}>
          <button
            onClick={() => {
              if (!safeNewPost.content.trim()) {
                alert('Please enter post content!');
                return;
              }
              
              // Prepare post data with files and links
              const postData = {
                ...safeNewPost,
                uploadedFiles: uploadedFiles,
                links: links.filter(link => link.trim() !== '')
              };
              
              console.log('Post Data:', postData);
              shareToSocial(safeNewPost.platform);
              
              // Reset form
              setNewPost({platform: 'instagram', content: '', mediaType: 'text', mediaUrl: ''});
              setUploadedFiles([]);
              setLinks(['']);
              setShowNewPostModal(false);
            }}
            className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-xl font-bold hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-3"
          >
            <Send className="w-5 h-5" />
            Post to {safeNewPost.platform.charAt(0).toUpperCase() + safeNewPost.platform.slice(1)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewPostModal;