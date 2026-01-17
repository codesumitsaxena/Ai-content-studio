// ========== ApprovalModal.jsx (FIXED) ==========
import React from 'react'
import { MessageSquare, Instagram, Wand2, Video, X, CheckCircle, Eye } from 'lucide-react'

const ApprovalModal = ({
  currentRequest,
  handleApproval,
  setShowApprovalModal,
  setShowPreview,
  setShowShareModal,  // ✅ Ye prop use karenge
  darkMode,
  cardBg,
  textColor,
  textSecondary
}) => {
  
  // ✅ FIX: Directly ShareModal open karo
  const handleApproveClick = () => {
    setShowApprovalModal(false)
    setShowShareModal(true)  // ✅ ShareModal open
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-scaleIn">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center
              ${currentRequest.type === 'chatgpt' ? 'bg-emerald-50 text-emerald-600' :
                currentRequest.type === 'post' ? 'bg-blue-50 text-blue-600' :
                currentRequest.type === 'image' ? 'bg-purple-50 text-purple-600' :
                'bg-orange-50 text-orange-600'}`}>
              {currentRequest.type === 'chatgpt' && <MessageSquare className="w-4 h-4" />}
              {currentRequest.type === 'post' && <Instagram className="w-4 h-4" />}
              {currentRequest.type === 'image' && <Wand2 className="w-4 h-4" />}
              {currentRequest.type === 'video' && <Video className="w-4 h-4" />}
            </div>

            <div>
              <h3 className="font-semibold text-sm text-gray-900">
                {currentRequest.type === 'chatgpt' ? 'ChatGPT Prompt' :
                 currentRequest.type === 'post' ? 'Social Post' :
                 currentRequest.type === 'image' ? 'AI Image' :
                 'Video Script'}
              </h3>
              <p className="text-xs text-gray-500">
                {new Date(currentRequest.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowApprovalModal(false)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[300px] overflow-y-auto">
          {currentRequest.type === 'image' && currentRequest.generatedImage && (
            <div className="p-4">
              <img
                src={currentRequest.generatedImage}
                alt="Generated"
                className="w-full rounded-lg border border-gray-200 shadow-sm"
              />
            </div>
          )}

          {currentRequest.type === 'video' && currentRequest.image && (
            <div className="p-4">
              <img
                src={currentRequest.image}
                alt="Video Thumbnail"
                className="w-full rounded-lg border border-gray-200 shadow-sm"
              />
            </div>
          )}

          <div className="p-4">
            <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {currentRequest.content}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-4 py-3 border-t border-gray-200 flex gap-2">
          <button
            onClick={() => handleApproval(currentRequest, false)}
            className="flex-1 py-2 rounded-lg font-semibold text-sm bg-red-50 text-red-600 hover:bg-red-100 transition flex items-center justify-center gap-1.5"
          >
            <X className="w-4 h-4" />
            Reject
          </button>

          <button
            onClick={() => setShowPreview(true)}
            className="flex-1 py-2 rounded-lg font-semibold text-sm bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition flex items-center justify-center gap-1.5"
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>

          <button
            onClick={handleApproveClick}  // ✅ Ye function call hoga
            className="flex-1 py-2 rounded-lg font-semibold text-sm bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition flex items-center justify-center gap-1.5"
          >
            <CheckCircle className="w-4 h-4" />
            Approve
          </button>
        </div>

      </div>
    </div>
  )
}

export default ApprovalModal