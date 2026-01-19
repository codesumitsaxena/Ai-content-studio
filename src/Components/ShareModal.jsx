import React, { useState } from 'react'
import { Facebook, Instagram, Linkedin, Twitter, Loader2, CheckCircle, X, AlertCircle } from 'lucide-react'

const platforms = [
  { id: 'instagram', name: 'Instagram', icon: Instagram },
  { id: 'facebook', name: 'Facebook', icon: Facebook },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin },
  { id: 'twitter', name: 'Twitter/X', icon: Twitter }
]

const ShareModal = ({ shareToSocial, setShowShareModal, currentRequest }) => {
  const [selected, setSelected] = useState([])
  const [isPosting, setIsPosting] = useState(false)

  const N8N_WEBHOOK_URL = 'https://n8n.avertisystems.com/webhook/social-post'

  // ✅ FIX: Use platform ID instead of name
  const toggle = (platformId) => {
    setSelected(prev =>
      prev.includes(platformId) 
        ? prev.filter(p => p !== platformId) 
        : [...prev, platformId]
    )
  }

  // ✅ AGGRESSIVE image compression for AI-generated images
  const optimizeImage = async (base64Url) => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        // ✅ More aggressive resize for social media (max 1080px - Instagram standard)
        const maxWidth = 1080
        const maxHeight = 1080
        let width = img.width
        let height = img.height
        
        // Calculate scaling to fit within max dimensions
        const scale = Math.min(maxWidth / width, maxHeight / height, 1)
        width = Math.floor(width * scale)
        height = Math.floor(height * scale)
        
        canvas.width = width
        canvas.height = height
        
        // Use better quality rendering
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(img, 0, 0, width, height)
        
        // ✅ Convert to JPEG with 80% quality (optimal for social media)
        const optimized = canvas.toDataURL('image/jpeg', 0.80)
        resolve(optimized)
      }
      img.onerror = () => {
        console.error('Failed to optimize image, using original')
        resolve(base64Url)
      }
      img.src = base64Url
    })
  }

  const handlePost = async () => {
    if (selected.length === 0) {
      alert('Please select at least one platform')
      return
    }

    setIsPosting(true)
    const startTime = performance.now()

    try {
      // Get image from currentRequest
      const imageUrl = currentRequest.generatedImage || currentRequest.image
      
      // ✅ ALWAYS optimize images (both AI-generated and uploaded)
      let optimizedImage = null
      if (imageUrl) {
        console.log('🔧 Optimizing image for social media...')
        const beforeSize = imageUrl.length
        optimizedImage = await optimizeImage(imageUrl)
        const afterSize = optimizedImage.length
        const reduction = ((1 - afterSize/beforeSize) * 100).toFixed(1)
        console.log(`✅ Compressed: ${(beforeSize/1024).toFixed(0)}KB → ${(afterSize/1024).toFixed(0)}KB (${reduction}% smaller)`)
      }
      
      // Prepare images array - same format as NewPostModal
      const images = []
      if (optimizedImage) {
        images.push({
          base64: optimizedImage,
          name: `content-${Date.now()}.jpg`, // Changed to .jpg
          type: 'image/jpeg' // Changed to jpeg
        })
      }

      // ✅ CRITICAL FIX: Use same exact structure as NewPostModal
      const webhookData = {
        platforms: selected, // Already lowercase IDs like ['instagram', 'facebook']
        content: currentRequest.content,
        caption: currentRequest.content,
        mediaType: images.length > 0 ? 'image' : 'text',
        images: images,
        image_url: imageUrl || '',
        visibility: 'public',
        timestamp: new Date().toISOString()
      }

      console.log('📤 ShareModal sending:', {
        platforms: webhookData.platforms,
        contentLength: webhookData.content?.length,
        imageCount: images.length,
        imageFormat: images[0]?.type || 'none',
        imageSize: images[0] ? `${(images[0].base64.length / 1024).toFixed(1)}KB` : '0KB',
        timestamp: new Date().toISOString()
      })

      // Trigger webhook
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData)
      })

      const endTime = performance.now()
      console.log(`⏱️ Webhook took ${(endTime - startTime).toFixed(0)}ms`)

      if (response.ok) {
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
        
        console.log('✅ Success:', result)

        // Call shareToSocial callback
        if (shareToSocial) {
          selected.forEach(platform => shareToSocial(platform))
        }

        alert(`Successfully posted to ${selected.join(', ')}! 🎉`)
        setShowShareModal(false)

      } else {
        const errorText = await response.text()
        console.error('❌ Failed:', response.status, errorText)
        alert('Failed to post: ' + (errorText || 'Unknown error'))
      }

    } catch (error) {
      console.error('❌ Error:', error)
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
            
            {(currentRequest.generatedImage || currentRequest.image) && (
              <div className="relative">
                <img 
                  src={currentRequest.generatedImage || currentRequest.image} 
                  alt="Content preview" 
                  className="w-full max-h-48 object-contain rounded-lg border border-gray-200"
                />
                <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                  {currentRequest.type === 'image' ? 'AI Generated' : 'Uploaded'}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Platform Selection */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {platforms.map(({ id, name, icon: Icon }) => (
            <button
              key={id}
              onClick={() => toggle(id)} // ✅ Pass ID not name
              disabled={isPosting}
              className={`relative p-4 rounded-xl border transition-all text-center flex flex-col items-center gap-2
                ${selected.includes(id) // ✅ Check ID not name
                  ? 'border-blue-600 bg-blue-50 text-blue-600'
                  : 'border-gray-200 hover:bg-gray-50 text-gray-700'}
                ${isPosting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-sm font-medium">{name}</span>
              {selected.includes(id) && (
                <CheckCircle className="w-4 h-4 absolute top-2 right-2 text-blue-600" />
              )}
            </button>
          ))}
        </div>

        {/* Debug Info */}
        {selected.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-blue-800">
                <span className="font-semibold">Selected:</span> {selected.join(', ')}
              </div>
            </div>
          </div>
        )}

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