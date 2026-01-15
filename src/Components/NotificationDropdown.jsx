import React from 'react';
import { Sparkles, MessageSquare, Instagram, Image, Video, Zap } from 'lucide-react';

const NotificationDropdown = ({
  pendingRequests,
  setCurrentRequest,
  setShowApprovalModal,
  setShowNotifications,
  darkMode,
  cardBg,
  textColor,
  textSecondary
}) => {
  return (
    <div className={`absolute right-6 top-24 w-[420px] ${cardBg} backdrop-blur-xl rounded-2xl shadow-2xl border-2 ${darkMode ? 'border-gray-700' : 'border-purple-200'} max-h-[500px] overflow-y-auto z-50 animate-slideDown`}>
      <div className={`p-5 border-b ${darkMode ? 'border-gray-700' : 'border-purple-200'} sticky top-0 bg-inherit`}>
        <div className="flex items-center justify-between">
          <h3 className={`font-bold text-lg ${textColor}`}>
            Pending Requests
          </h3>
          <span className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold">
            {pendingRequests.length}
          </span>
        </div>
      </div>
      
      {pendingRequests.length === 0 ? (
        <div className="p-12 text-center">
          <Sparkles className={`w-12 h-12 mx-auto mb-3 ${textSecondary}`} />
          <p className={`${textSecondary} font-medium`}>No pending requests</p>
          <p className={`text-sm ${textSecondary} mt-1`}>Your creations will appear here</p>
        </div>
      ) : (
        <div className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-purple-100'}`}>
          {pendingRequests.map(request => (
            <div 
              key={request.id} 
              className={`p-4 hover:${darkMode ? 'bg-gray-700' : 'bg-purple-50'} cursor-pointer transition-all group`}
              onClick={() => {
                setCurrentRequest(request);
                setShowApprovalModal(true);
                setShowNotifications(false);
              }}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  request.type === 'chatgpt' ? 'bg-emerald-100' :
                  request.type === 'post' ? 'bg-blue-100' :
                  request.type === 'image' ? 'bg-purple-100' :
                  'bg-orange-100'
                } group-hover:scale-110 transition-transform`}>
                  {request.type === 'chatgpt' && <MessageSquare className="w-5 h-5 text-emerald-600" />}
                  {request.type === 'post' && <Instagram className="w-5 h-5 text-blue-600" />}
                  {request.type === 'image' && <Image className="w-5 h-5 text-purple-600" />}
                  {request.type === 'video' && <Video className="w-5 h-5 text-orange-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className={`font-bold ${textColor} capitalize`}>
                      {request.type === 'chatgpt' ? 'ChatGPT Prompt' :
                       request.type === 'post' ? 'Social Post' :
                       request.type === 'image' ? 'Image Generation' :
                       'UGC Video Script'}
                    </p>
                    <Zap className="w-4 h-4 text-amber-500" />
                  </div>
                  <p className={`text-sm ${textSecondary} line-clamp-2 mb-2`}>
                    {request.content}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">
                      {new Date(request.timestamp).toLocaleTimeString()}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
                      Awaiting Review
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;