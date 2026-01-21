import React, { useState } from 'react'
import { MessageSquare, Instagram, Wand2, Video, X, CheckCircle, XCircle, Edit2, Check, Zap } from 'lucide-react'

const BASE_URL = 'http://localhost:3000/api/content'

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

const ApprovalModal = ({
  currentRequest,
  handleApproval,
  setShowApprovalModal,
  setShowShareModal,
  darkMode,
  cardBg,
  textColor,
  textSecondary
}) => {
  
  const [isEditing, setIsEditing] = useState(false)
  const [editedCaption, setEditedCaption] = useState(currentRequest?.caption || currentRequest?.content || '')
  const [isProcessing, setIsProcessing] = useState(false)

  // Handle Edit Save
  const handleSaveEdit = async () => {
    if (!currentRequest?.backendId) {
      // Just update locally if no backend ID
      currentRequest.caption = editedCaption
      currentRequest.content = editedCaption
      setIsEditing(false)
      return
    }

    setIsProcessing(true)
    try {
      const res = await fetch(`${BASE_URL}/${currentRequest.backendId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caption: editedCaption })
      })

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`Failed to update: ${errorText}`)
      }

      // Update local state
      currentRequest.caption = editedCaption
      currentRequest.content = editedCaption
      
      setIsEditing(false)
      alert('Caption updated successfully!')
    } catch (err) {
      console.error('Edit error:', err)
      alert('Failed to update caption: ' + err.message)
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle Approve - Opens share modal first
  const handleApproveClick = () => {
    setShowApprovalModal(false)
    setShowShareModal(true)
  }

  // Handle Reject
  const handleRejectClick = async () => {
    if (!currentRequest?.backendId) {
      // If no backend ID, just call the callback
      handleApproval(currentRequest, false)
      setShowApprovalModal(false)
      return
    }

    setIsProcessing(true)
    try {
      const res = await fetch(`${BASE_URL}/${currentRequest.backendId}/reject`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      })

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`Failed to reject: ${errorText}`)
      }

      handleApproval(currentRequest, false)
      setShowApprovalModal(false)
      alert('Content rejected successfully')
    } catch (err) {
      console.error('Reject error:', err)
      alert('Failed to reject content: ' + err.message)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <>
      <style>{scrollbarStyles}</style>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

          {/* Header - Professional Gradient (Same as ShareModal) */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-7 py-5 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-xl">
                {currentRequest.type === 'chatgpt' && <MessageSquare className="w-6 h-6 text-white" />}
                {currentRequest.type === 'post' && <Instagram className="w-6 h-6 text-white" />}
                {currentRequest.type === 'image' && <Wand2 className="w-6 h-6 text-white" />}
                {currentRequest.type === 'video' && <Video className="w-6 h-6 text-white" />}
              </div>
              <div>
                <h2 className="text-white font-bold text-xl tracking-tight">
                  {currentRequest.type === 'chatgpt' ? 'ChatGPT Prompt' :
                   currentRequest.type === 'post' ? 'Social Post' :
                   currentRequest.type === 'image' ? 'AI Generated Content' :
                   'Video Script'}
                </h2>
                <p className="text-blue-100 text-sm">
                  {new Date(currentRequest.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowApprovalModal(false)}
              disabled={isProcessing}
              className="text-white/90 hover:bg-white/20 p-2 rounded-lg transition-all duration-200 disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content - Scrollable (Same structure as ShareModal) */}
          <div className="p-7 overflow-y-auto flex-1 custom-scrollbar">
            
            {/* Image Type - Show Generated Image + Caption */}
            {currentRequest.type === 'image' && currentRequest.generatedImage && (
              <div className="space-y-4">
                {/* Image Preview */}
                <div className="mb-5 bg-gray-50 rounded-2xl p-4 border-2 border-gray-200">
                  <img
                    src={currentRequest.generatedImage}
                    alt="Generated"
                    className="w-full max-h-64 object-contain rounded-xl border-2 border-gray-200"
                  />
                </div>
                
                {/* Caption Display/Edit */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-gray-700 font-semibold text-sm flex items-center gap-2">
                      <span>📝</span> Caption
                    </p>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-3">
                      <textarea
                        value={editedCaption}
                        onChange={e => setEditedCaption(e.target.value)}
                        className="w-full border-2 border-blue-400 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        rows="4"
                        placeholder="Enter caption..."
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveEdit}
                          disabled={isProcessing}
                          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white py-2.5 rounded-xl hover:from-green-600 hover:to-green-700 transition-all font-semibold text-sm shadow-md disabled:opacity-50"
                        >
                          <Check className="w-4 h-4" />
                          Save Changes
                        </button>
                        <button
                          onClick={() => {
                            setIsEditing(false)
                            setEditedCaption(currentRequest.caption || currentRequest.content)
                          }}
                          disabled={isProcessing}
                          className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-2.5 rounded-xl hover:bg-gray-200 transition-all font-semibold text-sm"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-2xl p-4 border-2 border-gray-200">
                      <p className="text-sm text-gray-800 leading-relaxed">
                        {currentRequest.caption || currentRequest.content}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Video Type - Show Thumbnail */}
            {currentRequest.type === 'video' && currentRequest.image && (
              <div className="mb-5 bg-gray-50 rounded-2xl p-4 border-2 border-gray-200">
                <img
                  src={currentRequest.image}
                  alt="Video Thumbnail"
                  className="w-full max-h-64 object-contain rounded-xl"
                />
              </div>
            )}

            {/* Original Input Text (if available) */}
            {currentRequest.originalText && currentRequest.type === 'image' && (
              <div className="mt-4">
                <p className="text-gray-700 font-semibold text-sm mb-2 flex items-center gap-2">
                  <span>💭</span> Original Input
                </p>
                <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed border-2 border-gray-200">
                  {currentRequest.originalText}
                </div>
              </div>
            )}

            {/* Generated Content/Prompt (for non-image types) */}
            {currentRequest.type !== 'image' && (
              <div className="bg-gray-50 rounded-2xl p-4 border-2 border-gray-200">
                <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {currentRequest.content}
                </p>
              </div>
            )}
          </div>

          {/* Footer Actions (Same style as ShareModal) */}
          <div className="bg-gray-50 px-7 py-4 flex items-center justify-end gap-3 border-t border-gray-100 flex-shrink-0">
            <button
              onClick={handleRejectClick}
              disabled={isProcessing || isEditing}
              className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <XCircle className="w-4 h-4" />
              Reject
            </button>

            <button
              onClick={handleApproveClick}
              disabled={isProcessing || isEditing}
              className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle className="w-4 h-4" />
              Approve & Share
            </button>
          </div>

        </div>
      </div>
    </>
  )
}

export default ApprovalModal