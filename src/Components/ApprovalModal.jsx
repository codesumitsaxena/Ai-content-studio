import React from 'react';
import { MessageSquare, Instagram, Wand2, Video, XCircle, CheckCircle, Eye } from 'lucide-react';

const ApprovalModal = ({
  currentRequest,
  handleApproval,
  setShowApprovalModal,
  setShowPreview,
  darkMode,
  cardBg,
  textColor,
  textSecondary
}) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fadeIn">
      <div className={`${cardBg} backdrop-blur-xl rounded-3xl shadow-2xl max-w-md w-full border-2 ${darkMode ? 'border-gray-700' : 'border-purple-200'} animate-scaleIn overflow-hidden`}>
        <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-purple-200'} flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              currentRequest.type === 'chatgpt' ? 'bg-emerald-100' :
              currentRequest.type === 'post' ? 'bg-blue-100' :
              currentRequest.type === 'image' ? 'bg-purple-100' :
              'bg-orange-100'
            }`}>
              {currentRequest.type === 'chatgpt' && <MessageSquare className="w-5 h-5 text-emerald-600" />}
              {currentRequest.type === 'post' && <Instagram className="w-5 h-5 text-blue-600" />}
              {currentRequest.type === 'image' && <Wand2 className="w-5 h-5 text-purple-600" />}
              {currentRequest.type === 'video' && <Video className="w-5 h-5 text-orange-600" />}
            </div>
            <div>
              <h3 className={`font-bold ${textColor}`}>
                {currentRequest.type === 'chatgpt' ? 'ChatGPT Prompt' :
                 currentRequest.type === 'post' ? 'Social Post' :
                 currentRequest.type === 'image' ? 'AI Image' :
                 'Video Script'}
              </h3>
              <p className={`text-xs ${textSecondary}`}>
                {new Date(currentRequest.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setShowApprovalModal(false)} 
            className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-purple-100'} transition-all`}
          >
            <XCircle className={`w-5 h-5 ${textSecondary}`} />
          </button>
        </div>

        <div className="max-h-[500px] overflow-y-auto">
          {(currentRequest.type === 'image' && currentRequest.generatedImage) && (
            <div className="p-4">
              <img 
                src={currentRequest.generatedImage} 
                alt="Generated" 
                className="w-full rounded-2xl shadow-lg border-2 border-purple-200" 
              />
            </div>
          )}

          {currentRequest.type === 'video' && currentRequest.image && (
            <div className="p-4">
              <img 
                src={currentRequest.image} 
                alt="Video Thumbnail" 
                className="w-full rounded-2xl shadow-lg border-2 border-orange-200" 
              />
            </div>
          )}

          <div className="p-4">
            <div className={`p-4 rounded-2xl ${darkMode ? 'bg-gray-700/50' : 'bg-gradient-to-br from-purple-50 to-pink-50'} ${textColor}`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {currentRequest.content}
              </p>
            </div>
          </div>
        </div>

        <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-purple-200'} flex gap-3`}>
          <button
            onClick={() => handleApproval(currentRequest, false)}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-red-400 to-pink-500 text-white rounded-xl font-bold hover:shadow-lg transform hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <XCircle className="w-5 h-5" />
            Reject
          </button>
          
          <button
            onClick={() => setShowPreview(true)}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-400 to-cyan-500 text-white rounded-xl font-bold hover:shadow-lg transform hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Eye className="w-5 h-5" />
            Preview
          </button>
          
          <button
            onClick={() => handleApproval(currentRequest, true)}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-400 to-teal-500 text-white rounded-xl font-bold hover:shadow-lg transform hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            Approve
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApprovalModal;