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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-scaleIn">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm
              ${currentRequest.type === 'chatgpt' ? 'bg-emerald-100 text-emerald-600' :
                currentRequest.type === 'post' ? 'bg-blue-100 text-blue-600' :
                currentRequest.type === 'image' ? 'bg-purple-100 text-purple-600' :
                'bg-orange-100 text-orange-600'}`}>
              {currentRequest.type === 'chatgpt' && <MessageSquare className="w-5 h-5" />}
              {currentRequest.type === 'post' && <Instagram className="w-5 h-5" />}
              {currentRequest.type === 'image' && <Wand2 className="w-5 h-5" />}
              {currentRequest.type === 'video' && <Video className="w-5 h-5" />}
            </div>

            <div>
              <h3 className="font-bold text-base text-gray-900">
                {currentRequest.type === 'chatgpt' ? 'ChatGPT Prompt' :
                 currentRequest.type === 'post' ? 'Social Post' :
                 currentRequest.type === 'image' ? 'AI Image' :
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
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[500px] overflow-y-auto">
          {/* Image Type - Show Generated Image + Caption */}
          {currentRequest.type === 'image' && currentRequest.generatedImage && (
            <div className="p-5">
              <img
                src={currentRequest.generatedImage}
                alt="Generated"
                className="w-full rounded-xl border border-gray-200 shadow-md"
              />
              
              {/* Caption Display/Edit */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Caption</p>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      <Edit2 className="w-3 h-3" />
                      Edit
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-2">
                    <textarea
                      value={editedCaption}
                      onChange={e => setEditedCaption(e.target.value)}
                      className="w-full border-2 border-blue-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows="4"
                      placeholder="Enter caption..."
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveEdit}
                        disabled={isProcessing}
                        className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm disabled:opacity-50"
                      >
                        <Check className="w-4 h-4" />
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false)
                          setEditedCaption(currentRequest.caption || currentRequest.content)
                        }}
                        disabled={isProcessing}
                        className="flex-1 flex items-center justify-center gap-2 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 text-sm text-gray-800 leading-relaxed border border-blue-100 shadow-sm">
                    {currentRequest.caption || currentRequest.content}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Video Type - Show Thumbnail */}
          {currentRequest.type === 'video' && currentRequest.image && (
            <div className="p-5">
              <img
                src={currentRequest.image}
                alt="Video Thumbnail"
                className="w-full rounded-xl border border-gray-200 shadow-md"
              />
            </div>
          )}

          {/* Original Input Text (if available) */}
          {currentRequest.originalText && currentRequest.type === 'image' && (
            <div className="px-5 pb-3">
              <p className="text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">Original Input</p>
              <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-700 leading-relaxed border border-gray-200">
                {currentRequest.originalText}
              </div>
            </div>
          )}

          {/* Generated Content/Prompt (for non-image types) */}
          {currentRequest.type !== 'image' && (
            <div className="p-5">
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap border border-gray-200">
                {currentRequest.content}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-4 border-t border-gray-200 bg-gray-50 flex gap-3">
          <button
            onClick={handleRejectClick}
            disabled={isProcessing || isEditing}
            className="flex-1 py-2.5 rounded-lg font-semibold text-sm bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <XCircle className="w-4 h-4" />
            Reject
          </button>

          <button
            onClick={handleApproveClick}
            disabled={isProcessing || isEditing}
            className="flex-1 py-2.5 rounded-lg font-semibold text-sm bg-emerald-600 text-white hover:bg-emerald-700 shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle className="w-4 h-4" />
            Approve & Share
          </button>
        </div>

      </div>
    </div>
  )
}

export default ApprovalModal