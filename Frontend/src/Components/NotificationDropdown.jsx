import React from 'react'
import { Sparkles, MessageSquare, Instagram, Image, Video, Zap } from 'lucide-react'

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
    <div className="absolute right-6 top-20 w-[420px] max-w-[90vw] bg-white rounded-2xl shadow-xl border border-gray-200 max-h-[520px] overflow-hidden z-50 animate-slideDown">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
        <h3 className="font-semibold text-gray-900 text-lg">
          Pending Requests
        </h3>
        <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-sm font-semibold shadow-sm">
          {pendingRequests.length}
        </span>
      </div>

      {/* Content */}
      {pendingRequests.length === 0 ? (
        <div className="py-14 px-6 text-center">
          <Sparkles className="w-10 h-10 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 font-medium">
            No pending requests
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Your upcoming content will appear here
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100 overflow-y-auto max-h-[460px]">

          {pendingRequests.map(request => (
            <div
              key={request.id}
              onClick={() => {
                setCurrentRequest(request)
                setShowApprovalModal(true)
                setShowNotifications(false)
              }}
              className="px-5 py-4 cursor-pointer transition-all hover:bg-gray-50 group"
            >
              <div className="flex gap-4">

                {/* Icon */}
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105
                  ${request.type === 'chatgpt' ? 'bg-emerald-50 text-emerald-600' :
                    request.type === 'post' ? 'bg-blue-50 text-blue-600' :
                    request.type === 'image' ? 'bg-purple-50 text-purple-600' :
                    'bg-orange-50 text-orange-600'}`}>
                  {request.type === 'chatgpt' && <MessageSquare className="w-5 h-5" />}
                  {request.type === 'post' && <Instagram className="w-5 h-5" />}
                  {request.type === 'image' && <Image className="w-5 h-5" />}
                  {request.type === 'video' && <Video className="w-5 h-5" />}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-gray-900 truncate">
                      {request.type === 'chatgpt' ? 'ChatGPT Prompt' :
                       request.type === 'post' ? 'Social Post' :
                       request.type === 'image' ? 'Image Generation' :
                       'UGC Video Script'}
                    </p>
                    <Zap className="w-4 h-4 text-amber-500" />
                  </div>

                  <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                    {request.content}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span>
                      {new Date(request.timestamp).toLocaleTimeString()}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">
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
  )
}

export default NotificationDropdown
