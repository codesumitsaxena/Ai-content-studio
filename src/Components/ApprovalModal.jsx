import React, { useState } from 'react'
import { MessageSquare, Instagram, Wand2, Video, X, CheckCircle, XCircle, Edit2, Check } from 'lucide-react'

const BASE_URL = 'http://localhost:3000/api/content'

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm
              ${currentRequest.type === 'chatgpt' ? 'bg-emerald-500 text-white' :
                currentRequest.type === 'post' ? 'bg-blue-500 text-white' :
                currentRequest.type === 'image' ? 'bg-purple-500 text-white' :
                'bg-orange-500 text-white'}`}>
              {currentRequest.type === 'chatgpt' && <MessageSquare className="w-5 h-5" />}
              {currentRequest.type === 'post' && <Instagram className="w-5 h-5" />}
              {currentRequest.type === 'image' && <Wand2 className="w-5 h-5" />}
              {currentRequest.type === 'video' && <Video className="w-5 h-5" />}
            </div>

            <div>
              <h3 className="font-bold text-lg text-gray-900">
                {currentRequest.type === 'chatgpt' ? 'ChatGPT Prompt' :
                 currentRequest.type === 'post' ? 'Social Post' :
                 currentRequest.type === 'image' ? 'AI Generated Content' :
                 'Video Script'}
              </h3>
              <p className="text-xs text-gray-500">
                {new Date(currentRequest.timestamp).toLocaleString()}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowApprovalModal(false)}
            disabled={isProcessing}
            className="p-2 rounded-lg hover:bg-white/50 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[500px] overflow-y-auto">
          <div className="p-6">
            
            {/* Image Type - Show Generated Image + Caption */}
            {currentRequest.type === 'image' && currentRequest.generatedImage && (
              <div className="space-y-4">
                {/* Image Preview - Reduced Size */}
                <div className="flex justify-center bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <img
                    src={currentRequest.generatedImage}
                    alt="Generated"
                    className="max-w-md max-h-80 w-auto h-auto object-contain rounded-lg shadow-lg"
                  />
                </div>
                
                {/* Caption Display/Edit */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-bold text-gray-700">Caption</p>
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
                          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold text-sm shadow-md disabled:opacity-50"
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
                          className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-2.5 rounded-lg hover:bg-gray-200 transition-all font-semibold text-sm"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 text-sm text-gray-800 leading-relaxed border border-blue-200 shadow-sm">
                      {currentRequest.caption || currentRequest.content}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Video Type - Show Thumbnail */}
            {currentRequest.type === 'video' && currentRequest.image && (
              <div className="flex justify-center bg-gray-50 rounded-xl p-4 border border-gray-200">
                <img
                  src={currentRequest.image}
                  alt="Video Thumbnail"
                  className="max-w-md max-h-80 w-auto h-auto object-contain rounded-lg shadow-lg"
                />
              </div>
            )}

            {/* Original Input Text (if available) */}
            {currentRequest.originalText && currentRequest.type === 'image' && (
              <div className="mt-4">
                <p className="text-sm font-bold text-gray-700 mb-2">Original Input</p>
                <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 leading-relaxed border border-gray-200">
                  {currentRequest.originalText}
                </div>
              </div>
            )}

            {/* Generated Content/Prompt (for non-image types) */}
            {currentRequest.type !== 'image' && (
              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap border border-gray-200 shadow-sm">
                {currentRequest.content}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex gap-3">
          <button
            onClick={handleRejectClick}
            disabled={isProcessing || isEditing}
            className="flex-1 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <XCircle className="w-5 h-5" />
            Reject
          </button>

          <button
            onClick={handleApproveClick}
            disabled={isProcessing || isEditing}
            className="flex-1 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle className="w-5 h-5" />
            Approve & Share
          </button>
        </div>

      </div>
    </div>
  )
}

export default ApprovalModal