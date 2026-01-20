import React, { useState } from 'react'
import Header from './Header'
import NotificationDropdown from './NotificationDropdown'
import InputBox from './InputBox'
import ApprovalModal from './ApprovalModal'
import PreviewModal from './PreviewModal'
import ShareModal from './ShareModal'
import NewPostModal from './NewPostModal'
import BloatoPostModal from './BloatoPostModal'

const AIContentStudio = () => {
  const [darkMode, setDarkMode] = useState(false)
  const [idea, setIdea] = useState('')
  const [uploadedImage, setUploadedImage] = useState(null)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [activeMode, setActiveMode] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [generatedContent, setGeneratedContent] = useState('')
  const [generatedImage, setGeneratedImage] = useState(null)
  const [showNotifications, setShowNotifications] = useState(false)
  const [requests, setRequests] = useState([])
  const [showApprovalModal, setShowApprovalModal] = useState(false)
  const [currentRequest, setCurrentRequest] = useState(null)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [showNewPostModal, setShowNewPostModal] = useState(false)
  const [newPost, setNewPost] = useState({
    platform: 'instagram',
    content: '',
    mediaType: 'text',
    mediaUrl: ''
  })

  const [showBloatoPostModal, setShowBloatoPostModal] = useState(false)
  const [bloatoPost, setBloatoPost] = useState({
    platform: 'instagram',
    content: '',
    mediaType: 'text',
    mediaUrl: ''
  })

  const N8N_WEBHOOK_URL = 'https://n8n.avertisystems.com/webhook-test/ai-content-studio'
  const BACKEND_API = 'http://localhost:3000/api/content'
  
  const bgColor = 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
  const cardBg = 'bg-white'
  const textColor = 'text-gray-900'
  const textSecondary = 'text-gray-500'

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setUploadedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => setUploadedImage(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  // Save content to backend and get real ID
  const saveToBackend = async (contentData) => {
    try {
      const formData = new FormData()
      formData.append('caption', contentData.caption || contentData.content)
      formData.append('status', 'pending')
      
      // If there's a generated image, convert base64 to blob
      if (contentData.generatedImage) {
        const response = await fetch(contentData.generatedImage)
        const blob = await response.blob()
        formData.append('image', blob, `generated-${Date.now()}.png`)
      }
      // Or if there's an uploaded image
      else if (uploadedFile) {
        formData.append('image', uploadedFile)
      }

      const res = await fetch(BACKEND_API, {
        method: 'POST',
        body: formData
      })

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`Backend save failed: ${errorText}`)
      }

      const savedData = await res.json()
      console.log('✅ Content saved to backend:', savedData)
      return savedData.id // Return the real backend ID
    } catch (error) {
      console.error('❌ Failed to save to backend:', error)
      return null
    }
  }

  const generateContent = async () => {
    if (!idea.trim()) {
      alert('Please enter your idea first!')
      return
    }

    if (!activeMode) {
      alert('Please select a content type (ChatGPT, Post, Image, or Video)')
      return
    }

    setIsLoading(true)
    setGeneratedContent('')
    setGeneratedImage(null)

    try {
      const requestData = {
        text: idea,
        type: activeMode,
        user_id: 'user_' + Date.now(),
        image: uploadedImage,
        timestamp: new Date().toISOString()
      }

      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      })

      const data = await response.json()

      // For chatgpt mode - just update the input field
      if (activeMode === 'chatgpt') {
        setIdea(data.published_text || data.polished_text || data.output)
        setIsLoading(false)
        return
      }

      // Prepare content data
      let generatedImageUrl = null
      let caption = data.caption || data.published_text || data.polished_text || data.output

      // For image mode - set image and caption
      if (activeMode === 'image' && data.image_data) {
        generatedImageUrl = data.image_data.startsWith('data:')
          ? data.image_data
          : `data:image/png;base64,${data.image_data}`
        
        setGeneratedImage(generatedImageUrl)
        setGeneratedContent(caption)
      } else {
        setGeneratedContent(caption)
      }

      // Create new request object
      const newRequest = {
        id: Date.now(), // Frontend ID for React keys
        type: activeMode,
        content: caption,
        caption: caption,
        image: uploadedImage,
        generatedImage: generatedImageUrl,
        status: 'pending',
        timestamp: new Date().toISOString(),
        originalIdea: idea,
        backendId: null // Will be set after saving
      }

      // Save to backend and get real ID
      const backendId = await saveToBackend(newRequest)
      if (backendId) {
        newRequest.backendId = backendId
        console.log(`✅ Content saved with backend ID: ${backendId}`)
      } else {
        console.warn('⚠️ Could not save to backend, APIs will be skipped')
      }

      setRequests(prev => [newRequest, ...prev])
      
      // Reset form after successful generation
      setIdea('')
      setUploadedImage(null)
      setUploadedFile(null)

    } catch (error) {
      console.error('Error:', error)
      alert('Error generating content. Please try again.')
    }

    setIsLoading(false)
  }

  const pendingRequests = requests.filter(r => r.status === 'pending')

  return (
    <div className={`min-h-screen ${bgColor}`} style={{ zoom: '90%' }}>
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        pendingRequests={pendingRequests}
        setShowNewPostModal={setShowNewPostModal}
        setShowBloatoPostModal={setShowBloatoPostModal}
        cardBg={cardBg}
        textColor={textColor}
        textSecondary={textSecondary}
      />

      {showNotifications && (
        <NotificationDropdown
          pendingRequests={pendingRequests}
          setCurrentRequest={setCurrentRequest}
          setShowApprovalModal={setShowApprovalModal}
          setShowNotifications={setShowNotifications}
          darkMode={darkMode}
          cardBg={cardBg}
          textColor={textColor}
          textSecondary={textSecondary}
        />
      )}

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-16">
        <div className="text-center mb-14">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight">
            Automate Social Media Platform
          </h1>
          <h2 className="mt-2 text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Powerful Content
          </h2>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            Create high-quality posts, images, videos, and prompts faster using AI-tools.
          </p>
        </div>

        <InputBox
          idea={idea}
          setIdea={setIdea}
          uploadedImage={uploadedImage}
          handleImageUpload={handleImageUpload}
          activeMode={activeMode}
          setActiveMode={setActiveMode}
          isLoading={isLoading}
          generateContent={generateContent}
          darkBg={darkMode}
          cardBg={cardBg}
          textColor={textColor}
        />
      </main>

      {showApprovalModal && currentRequest && (
        <ApprovalModal
          currentRequest={currentRequest}
          handleApproval={(req, approved) => {
            setRequests(prev =>
              prev.map(r =>
                r.id === req.id ? { ...r, status: approved ? 'approved' : 'rejected' } : r
              )
            )
            if (approved) {
              setShowApprovalModal(false)
              setShowShareModal(true)
            } else {
              setShowApprovalModal(false)
            }
          }}
          setShowApprovalModal={setShowApprovalModal}
          setShowPreview={setShowPreview}
          setShowShareModal={setShowShareModal}
          darkMode={darkMode}
          cardBg={cardBg}
          textColor={textColor}
          textSecondary={textSecondary}
        />
      )}

      {showPreview && currentRequest && (
        <PreviewModal
          currentRequest={currentRequest}
          setShowPreview={setShowPreview}
          handleApproval={(req, approved) => {
            setRequests(prev =>
              prev.map(r =>
                approved
                  ? { ...r, status: 'approved' }
                  : r
              )
            )
            setShowPreview(false)
            setShowShareModal(true)
          }}
          darkMode={darkMode}
          cardBg={cardBg}
          textColor={textColor}
          textSecondary={textSecondary}
        />
      )}

      {showShareModal && currentRequest && (
        <ShareModal
          currentRequest={currentRequest}
          shareToSocial={(platform) => {
            setRequests(prev =>
              prev.map(r =>
                r.id === currentRequest.id ? { ...r, status: 'approved' } : r
              )
            )
            setShowShareModal(false)
          }}
          setShowShareModal={setShowShareModal}
          darkMode={darkMode}
          cardBg={cardBg}
          textColor={textColor}
          textSecondary={textSecondary}
        />
      )}

      {showNewPostModal && (
        <NewPostModal
          newPost={newPost}
          setNewPost={setNewPost}
          setShowNewPostModal={setShowNewPostModal}
          shareToSocial={(platform) => {
            alert(`Posted to ${platform}`)
            setShowNewPostModal(false)
          }}
          darkMode={darkMode}
          cardBg={cardBg}
          textColor={textColor}
          textSecondary={textSecondary}
        />
      )}

      {showBloatoPostModal && (
        <BloatoPostModal
          isOpen={showBloatoPostModal}
          setIsOpen={setShowBloatoPostModal}
        />
      )}
    </div>
  )
}

export default AIContentStudio