import React, { useState } from 'react'
import { Facebook, Instagram, Linkedin, Twitter, Loader2, CheckCircle, X } from 'lucide-react'

const platforms = [
  { id: 'facebook', name: 'Facebook', icon: Facebook },
  { id: 'instagram', name: 'Instagram', icon: Instagram },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin },
  { id: 'twitter', name: 'Twitter/X', icon: Twitter }
]

const ShareModal = ({ shareToSocial, setShowShareModal, currentRequest }) => {
  const [selected, setSelected] = useState([])
  const [isPosting, setIsPosting] = useState(false)

  const N8N_WEBHOOK_URL = 'https://n8n.avertisystems.com/webhook-test/social-post'

  const toggle = name => {
    setSelected(prev =>
      prev.includes(name) ? prev.filter(p => p !== name) : [...prev, name]
    )
  }

  const handlePost = async () => {
    if (selected.length === 0) {
      alert('Please select at least one platform')
      return
    }

    setIsPosting(true)

    try {
      // Prepare webhook data exactly like NewPostModal
      const webhookData = {
        platforms: selected.map(p => p.toLowerCase()),
        content: currentRequest.content,
        caption: currentRequest.content,
        mediaType: (currentRequest.generatedImage || currentRequest.image) ? 'image' : 'text',
        images: [],
        image_url: currentRequest.generatedImage || currentRequest.image || '',
        visibility: 'public',
        timestamp: new Date().toISOString(),
        // Extra metadata
        type: currentRequest.type,
        user_id: 'user_' + Date.now(),
        action: 'post_to_social'
      }

      console.log('Sending webhook data from ShareModal:', webhookData)

      // Trigger webhook
      const response = await fetch(N8N_WEBHOOK_URL, {
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

        // Call shareToSocial for each platform
        selected.forEach(platform => shareToSocial(platform))

        // Show success message
        alert(`Successfully posted to ${selected.join(', ')}! 🎉`)
        
        // Close modal
        setShowShareModal(false)

      } else {
        const errorText = await response.text()
        console.error('Webhook failed:', response.status, errorText)
        alert('Failed to post: ' + (errorText || 'Unknown error'))
      }

    } catch (error) {
      console.error('Error posting to social media:', error)
      alert('Error posting content: ' + error.message)
    } finally {
      setIsPosting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-gray-200 p-6 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">Select Platforms</h3>
          <button
            onClick={() => setShowShareModal(false)}
            disabled={isPosting}
            className="p-2 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content Preview */}
        {currentRequest && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <p className="text-sm text-gray-700 max-h-32 overflow-y-auto">
              {currentRequest.content}
            </p>
            
            {/* Show image if exists */}
            {(currentRequest.generatedImage || currentRequest.image) && (
              <img 
                src={currentRequest.generatedImage || currentRequest.image} 
                alt="Content preview" 
                className="w-full max-h-48 object-contain rounded-lg border border-gray-200"
              />
            )}
          </div>
        )}

        {/* Platform Selection */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {platforms.map(({ id, name, icon: Icon }) => (
            <button
              key={id}
              onClick={() => toggle(name)}
              disabled={isPosting}
              className={`relative p-4 rounded-xl border transition-all text-center flex flex-col items-center gap-2
                ${selected.includes(name)
                  ? 'border-blue-600 bg-blue-50 text-blue-600'
                  : 'border-gray-200 hover:bg-gray-50 text-gray-700'}
                ${isPosting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-sm font-medium">{name}</span>
              {selected.includes(name) && (
                <CheckCircle className="w-4 h-4 absolute top-2 right-2 text-blue-600" />
              )}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button 
            onClick={() => setShowShareModal(false)} 
            disabled={isPosting}
            className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handlePost}
            disabled={isPosting || selected.length === 0}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[140px] justify-center"
          >
            {isPosting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Posting...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Confirm & Send
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  )
}

export default ShareModal