import React, { useState } from 'react'
import {
  X, Send, Trash2, Sparkles, Calendar, Globe, Lock, Plus,
  Instagram, Facebook, Twitter, Linkedin
} from 'lucide-react'

const NewPostModal = ({ newPost, setNewPost, setShowNewPostModal, shareToSocial }) => {

  const [uploadedFiles, setUploadedFiles] = useState([])
  const [selectedPlatforms, setSelectedPlatforms] = useState(['instagram'])
  const [postVisibility, setPostVisibility] = useState('public')
  const [isPublishing, setIsPublishing] = useState(false)

  const safeNewPost = newPost || { platform: 'instagram', content: '', mediaType: 'text', mediaUrl: '' }

  const platforms = [
    { id: 'instagram', name: 'Instagram', Icon: Instagram },
    { id: 'facebook', name: 'Facebook', Icon: Facebook },
    { id: 'twitter', name: 'Twitter', Icon: Twitter },
    { id: 'linkedin', name: 'LinkedIn', Icon: Linkedin }
  ]

  const handleUpload = (e) => {
    const files = Array.from(e.target.files)
    const newFiles = files.map(file => ({ 
      file, 
      preview: URL.createObjectURL(file),
      name: file.name,
      type: file.type
    }))
    setUploadedFiles(prev => [...prev, ...newFiles])
  }

  const removeFile = (index) => setUploadedFiles(prev => prev.filter((_, i) => i !== index))

  const togglePlatform = (id) => {
    setSelectedPlatforms(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id])
  }

  const closeModal = () => {
    setUploadedFiles([])
    setNewPost({ platform: 'instagram', content: '', mediaType: 'text', mediaUrl: '' })
    setShowNewPostModal(false)
    setIsPublishing(false)
  }

  // Convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = error => reject(error)
    })
  }

  const handlePublish = async () => {
    if (!safeNewPost.content.trim()) {
      alert('Enter post content')
      return
    }
    
    if (selectedPlatforms.length === 0) {
      alert('Select at least one platform')
      return
    }

    setIsPublishing(true)

    try {
      // Convert uploaded files to base64
      const base64Files = await Promise.all(
        uploadedFiles.map(async (fileObj) => ({
          base64: await fileToBase64(fileObj.file),
          name: fileObj.name,
          type: fileObj.type
        }))
      )

      // Prepare webhook data
      const webhookData = {
        platforms: selectedPlatforms,
        content: safeNewPost.content,
        caption: safeNewPost.content,
        mediaType: uploadedFiles.length > 0 ? 'image' : 'text',
        images: base64Files.length > 0 ? base64Files : [],
        image_url: safeNewPost.mediaUrl || '',
        visibility: postVisibility,
        timestamp: new Date().toISOString()
      }

      console.log('Sending webhook data:', webhookData)

      // Trigger webhook
      const response = await fetch('https://n8n.avertisystems.com/webhook-test/social-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData)
      })

      if (response.ok) {
        // Try to parse JSON, but handle empty responses gracefully
        let result = null
        const contentType = response.headers.get('content-type')
        
        if (contentType && contentType.includes('application/json')) {
          const text = await response.text()
          if (text && text.trim()) {
            try {
              result = JSON.parse(text)
            } catch (e) {
              console.warn('Response is not valid JSON:', text)
            }
          }
        }
        
        console.log('Webhook triggered successfully:', result)
        
        // Show success message
        alert('Post published successfully! 🎉')
        
        // Share to social platforms (if this function exists)
        if (shareToSocial) {
          selectedPlatforms.forEach(p => shareToSocial(p))
        }
        
        // Close modal
        closeModal()
      } else {
        const errorText = await response.text()
        console.error('Webhook failed:', response.status, errorText)
        alert('Failed to publish post: ' + (errorText || 'Unknown error'))
        setIsPublishing(false)
      }
    } catch (error) {
      console.error('Error triggering webhook:', error)
      alert('Error publishing post: ' + error.message)
      setIsPublishing(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">

      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-gray-200">

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b">
          <div className="flex items-center gap-3">
            <Sparkles className="text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold">Create Post</h3>
              <p className="text-sm text-gray-500">Share with your audience</p>
            </div>
          </div>

          <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg" disabled={isPublishing}>
            <X />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">

          {/* Platforms */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Globe size={16} /> Platforms
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {platforms.map(p => (
                <button
                  key={p.id}
                  onClick={() => togglePlatform(p.id)}
                  disabled={isPublishing}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition
                    ${selectedPlatforms.includes(p.id)
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-600'}
                    ${isPublishing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <p.Icon />
                  <span className="text-sm font-semibold">{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <textarea
            value={safeNewPost.content}
            onChange={e => setNewPost({ ...safeNewPost, content: e.target.value })}
            placeholder="What do you want to share?"
            disabled={isPublishing}
            className="w-full min-h-[150px] border rounded-xl p-4 focus:ring-2 focus:ring-blue-400 resize-none disabled:opacity-50"
          />

          {/* Upload */}
          <div>
            <label className={`flex items-center gap-3 cursor-pointer p-4 border-2 border-dashed rounded-xl hover:border-blue-400 transition ${isPublishing ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <Plus className="text-blue-600" />
              <span className="font-medium text-gray-700">Upload media</span>
              <input hidden type="file" accept="image/*,video/*" multiple onChange={handleUpload} disabled={isPublishing} />
            </label>
          </div>

          {/* Preview - Show mediaUrl if exists */}
          {safeNewPost.mediaUrl && (
            <div className="border rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-2">From Approved Content:</p>
              <img src={safeNewPost.mediaUrl} className="w-full max-h-48 object-contain rounded-lg" alt="Approved media" />
            </div>
          )}

          {/* Preview - Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {uploadedFiles.map((file, i) => (
                <div key={i} className="relative">
                  <img src={file.preview} className="h-24 w-full object-cover rounded-lg" alt={file.name} />
                  <button 
                    onClick={() => removeFile(i)} 
                    disabled={isPublishing}
                    className="absolute -top-2 -right-2 bg-white p-1 rounded-full shadow hover:bg-gray-100 disabled:opacity-50"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t flex justify-end gap-3 bg-gray-50">
          <button 
            onClick={closeModal} 
            disabled={isPublishing}
            className="px-6 py-2.5 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="px-8 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isPublishing ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Publishing...
              </>
            ) : (
              <>
                <Send size={18} /> Publish
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  )
}

export default NewPostModal