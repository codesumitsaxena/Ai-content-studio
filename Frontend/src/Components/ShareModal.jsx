import React, { useState } from 'react'
import { Facebook, Instagram, Linkedin, Twitter, Loader2, X, Zap } from 'lucide-react'

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

const ShareModal = ({ shareToSocial, setShowShareModal, currentRequest, onPublishSuccess }) => {
  const [selected, setSelected] = useState([])
  const [isPosting, setIsPosting] = useState(false)

  const N8N_WEBHOOK_URL = 'https://n8n.avertisystems.com/webhook/social-post'

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: '#E1306C', bgColor: 'bg-pink-50', borderColor: 'border-pink-500', textColor: 'text-pink-600' },
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: '#1877F2', bgColor: 'bg-blue-50', borderColor: 'border-blue-600', textColor: 'text-blue-600' },
    { id: 'twitter', name: 'Twitter/X', icon: Twitter, color: '#1DA1F2', bgColor: 'bg-sky-50', borderColor: 'border-sky-500', textColor: 'text-sky-600' },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: '#0A66C2', bgColor: 'bg-blue-50', borderColor: 'border-blue-700', textColor: 'text-blue-700' }
  ]

  const toggle = (platformId) => {
    setSelected(prev =>
      prev.includes(platformId) 
        ? prev.filter(p => p !== platformId) 
        : [...prev, platformId]
    )
  }

  // ✅ FIXED: Handle CORS errors for localhost images
  const optimizeImage = async (base64Url) => {
    return new Promise((resolve) => {
      // ✅ Skip optimization for localhost images (CORS issue)
      if (base64Url.startsWith('http://localhost') || base64Url.startsWith('http://127.0.0.1')) {
        console.log('⚠️ Skipping optimization for localhost image (CORS)')
        
        // Convert to base64 instead
        fetch(base64Url)
          .then(res => res.blob())
          .then(blob => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result)
            reader.onerror = () => {
              console.error('FileReader error, using original URL')
              resolve(base64Url)
            }
            reader.readAsDataURL(blob)
          })
          .catch(err => {
            console.error('Fetch error:', err, '- using original URL')
            resolve(base64Url)
          })
        return
      }

      // ✅ Only optimize base64 images
      if (!base64Url.startsWith('data:')) {
        console.log('⚠️ Not a base64 image, using original')
        resolve(base64Url)
        return
      }

      const img = new Image()
      img.crossOrigin = 'anonymous' // ✅ Enable CORS
      
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          
          const maxWidth = 1080
          const maxHeight = 1080
          let width = img.width
          let height = img.height
          
          const scale = Math.min(maxWidth / width, maxHeight / height, 1)
          width = Math.floor(width * scale)
          height = Math.floor(height * scale)
          
          canvas.width = width
          canvas.height = height
          
          ctx.imageSmoothingEnabled = true
          ctx.imageSmoothingQuality = 'high'
          ctx.drawImage(img, 0, 0, width, height)
          
          const optimized = canvas.toDataURL('image/jpeg', 0.80)
          console.log('✅ Image optimized successfully')
          resolve(optimized)
        } catch (err) {
          console.error('❌ Canvas error (CORS):', err)
          resolve(base64Url)
        }
      }
      
      img.onerror = () => {
        console.error('❌ Failed to load image, using original')
        resolve(base64Url)
      }
      
      img.src = base64Url
    })
  }

  // ✅ Update database with APPROVED status + platforms
  const updateDatabaseAfterPublish = async (publishedPlatforms) => {
    if (!currentRequest?.backendId) {
      console.error('❌ No backend ID found, cannot update database')
      console.log('Current request:', currentRequest)
      alert('Warning: Content was posted but status could not be saved to database. Backend ID is missing.')
      return false
    }

    try {
      // Convert array to object format: { instagram: 1, facebook: 1, twitter: 0, linkedin: 0 }
      const platformObject = {
        instagram: publishedPlatforms.includes('instagram') ? 1 : 0,
        facebook: publishedPlatforms.includes('facebook') ? 1 : 0,
        twitter: publishedPlatforms.includes('twitter') ? 1 : 0,
        linkedin: publishedPlatforms.includes('linkedin') ? 1 : 0
      }

      console.log('📤 Updating database with:', {
        backendId: currentRequest.backendId,
        platforms: platformObject,
        url: `${BASE_URL}/${currentRequest.backendId}/approve`
      })

      // ✅ CRITICAL: Call /approve endpoint which updates BOTH status AND platforms
      const res = await fetch(`${BASE_URL}/${currentRequest.backendId}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          social_media_posted: platformObject 
        })
      })

      if (!res.ok) {
        const errorText = await res.text()
        console.error('❌ Server response:', res.status, errorText)
        throw new Error(`Failed to update database: ${res.status} - ${errorText}`)
      }

      const result = await res.json()
      console.log('✅ Database updated successfully:', result)
      return true
    } catch (err) {
      console.error('❌ Database update error:', err)
      alert(`Warning: Posted successfully but database update failed: ${err.message}`)
      return false
    }
  }

  const handlePost = async () => {
    if (selected.length === 0) {
      alert('Please select at least one platform')
      return
    }

    setIsPosting(true)
    const startTime = performance.now()

    try {
      const imageUrl = currentRequest.generatedImage || currentRequest.image
      
      let optimizedImage = null
      if (imageUrl) {
        console.log('🔧 Processing image for social media...')
        console.log('📎 Image URL:', imageUrl.substring(0, 50) + '...')
        
        try {
          optimizedImage = await optimizeImage(imageUrl)
          
          if (optimizedImage && optimizedImage.startsWith('data:')) {
            const beforeSize = imageUrl.length
            const afterSize = optimizedImage.length
            const reduction = ((1 - afterSize/beforeSize) * 100).toFixed(1)
            console.log(`✅ Image processed: ${(beforeSize/1024).toFixed(0)}KB → ${(afterSize/1024).toFixed(0)}KB`)
          } else {
            console.log('⚠️ Using original image (optimization skipped)')
          }
        } catch (err) {
          console.error('❌ Image processing failed:', err)
          optimizedImage = imageUrl
        }
      }
      
      const images = []
      if (optimizedImage) {
        images.push({
          base64: optimizedImage,
          name: `content-${Date.now()}.jpg`,
          type: 'image/jpeg'
        })
      }

      const webhookData = {
        platforms: selected,
        content: currentRequest.content,
        caption: currentRequest.content,
        mediaType: images.length > 0 ? 'image' : 'text',
        images: images,
        image_url: imageUrl || '',
        visibility: 'public',
        timestamp: new Date().toISOString()
      }

      console.log('📤 ShareModal sending to N8N:', {
        platforms: webhookData.platforms,
        contentLength: webhookData.content?.length,
        imageCount: images.length,
        imageFormat: images[0]?.type || 'none',
        imageSize: images[0] ? `${(images[0].base64.length / 1024).toFixed(1)}KB` : '0KB',
        timestamp: new Date().toISOString()
      })

      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData)
      })

      const endTime = performance.now()
      console.log(`⏱️ N8N Webhook took ${(endTime - startTime).toFixed(0)}ms`)

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
        
        console.log('✅ N8N Publish Success:', result)

        // ✅ CRITICAL: Update database with APPROVED status + platforms
        const dbUpdateSuccess = await updateDatabaseAfterPublish(selected)

        // Call shareToSocial callback
        if (shareToSocial) {
          selected.forEach(platform => shareToSocial(platform))
        }

        // ✅ Notify parent component about successful publish
        if (onPublishSuccess) {
          onPublishSuccess()
        }

        if (dbUpdateSuccess) {
          alert(`✅ Successfully posted to ${selected.join(', ')} and status updated to APPROVED! 🎉`)
        } else {
          alert(`⚠️ Posted to ${selected.join(', ')} but database status update failed. Please check console and refresh the page.`)
        }
        setShowShareModal(false)

      } else {
        const errorText = await response.text()
        console.error('❌ N8N Publish Failed:', response.status, errorText)
        alert('Failed to post to social media: ' + (errorText || 'Unknown error'))
      }

    } catch (error) {
      console.error('❌ Error:', error)
      alert('Error posting content: ' + error.message)
    } finally {
      setIsPosting(false)
    }
  }

  return (
    <>
      <style>{scrollbarStyles}</style>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
          
          {/* Header - Professional Gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-7 py-5 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-xl">
                <Zap className="w-6 h-6 text-white" fill="white" />
              </div>
              <div>
                <h2 className="text-white font-bold text-xl tracking-tight">Publish Content</h2>
                <p className="text-blue-100 text-sm">Share your content with the world</p>
              </div>
            </div>
            <button
              onClick={() => setShowShareModal(false)}
              disabled={isPosting}
              className="text-white/90 hover:bg-white/20 p-2 rounded-lg transition-all duration-200 disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content - Scrollable */}
          <div className="p-7 overflow-y-auto flex-1 custom-scrollbar">

            {/* Content Preview */}
            {currentRequest && (
              <div className="mb-5 bg-gray-50 rounded-2xl p-4 border-2 border-gray-200">
                <p className="text-sm font-semibold text-gray-500 mb-2">Content Preview:</p>
                <p className="text-sm text-gray-800 max-h-24 overflow-y-auto leading-relaxed mb-3">
                  {currentRequest.content}
                </p>
                
                {(currentRequest.generatedImage || currentRequest.image) && (
                  <div className="relative">
                    <img 
                      src={currentRequest.generatedImage || currentRequest.image} 
                      alt="Content preview" 
                      className="w-full max-h-64 object-contain rounded-xl border-2 border-gray-200"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Platforms - Multiple Selection */}
            <div className="mb-5">
              <label className="text-gray-700 font-semibold mb-3  flex items-center gap-2 text-sm">
                <span>🌐</span> Select Platforms (Multiple)
              </label>
              <div className="grid grid-cols-2 gap-3">
                {platforms.map(platform => (
                  <button
                    key={platform.id}
                    onClick={() => toggle(platform.id)}
                    disabled={isPosting}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      selected.includes(platform.id)
                        ? `${platform.borderColor} ${platform.bgColor} shadow-md`
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                    } ${isPosting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">
                        {platform.id === 'instagram' && (
                          <svg viewBox="0 0 24 24" className="w-8 h-8" fill={selected.includes(platform.id) ? platform.color : '#9CA3AF'}>
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                          </svg>
                        )}
                        {platform.id === 'facebook' && (
                          <svg viewBox="0 0 24 24" className="w-8 h-8" fill={selected.includes(platform.id) ? platform.color : '#9CA3AF'}>
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                          </svg>
                        )}
                        {platform.id === 'twitter' && (
                          <svg viewBox="0 0 24 24" className="w-8 h-8" fill={selected.includes(platform.id) ? platform.color : '#9CA3AF'}>
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                          </svg>
                        )}
                        {platform.id === 'linkedin' && (
                          <svg viewBox="0 0 24 24" className="w-8 h-8" fill={selected.includes(platform.id) ? platform.color : '#9CA3AF'}>
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                        )}
                      </div>
                      <div className="text-left">
                        <div className={`text-sm font-semibold ${selected.includes(platform.id) ? platform.textColor : 'text-gray-600'}`}>
                          {platform.name}
                        </div>
                        {selected.includes(platform.id) && (
                          <div className="text-xs text-green-600 font-medium">✓ Selected</div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer with improved buttons - Fixed at bottom */}
          <div className="bg-gray-50 px-7 py-4 flex items-center justify-end gap-3 border-t border-gray-100 flex-shrink-0">
            <button
              onClick={() => setShowShareModal(false)}
              disabled={isPosting}
              className="px-6 py-2.5 text-gray-700 font-medium hover:bg-gray-200 rounded-xl transition-all duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handlePost}
              disabled={isPosting || selected.length === 0}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPosting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" fill="white" />
                  Publish
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default ShareModal