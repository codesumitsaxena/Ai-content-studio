// ========== AIContentStudio.jsx (WITH BLOATO POST) ==========
import React, { useState } from 'react'
import Header from './Header'
import NotificationDropdown from './NotificationDropdown'
import InputBox from './InputBox'
import ApprovalModal from './ApprovalModal'
import PreviewModal from './PreviewModal'
import ShareModal from './ShareModal'
import NewPostModal from './NewPostModal'
import BloatoPostModal from './BloatoPostModal' // ✅ STEP 1: Import BloatoPostModal
import { Sparkles, Wand2 } from 'lucide-react'

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

  const N8N_WEBHOOK_URL = 'https://n8n.avertisystems.com/webhook/ai-content-studio'
  

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

      if (activeMode === 'chatgpt') {
        setIdea(data.polished_text || data.output)
        setIsLoading(false)
        return
      }

      if (activeMode === 'image' && data.image_data) {
        const imageUrl = data.image_data.startsWith('data:')
          ? data.image_data
          : `data:image/png;base64,${data.image_data}`

        setGeneratedImage(imageUrl)
        setGeneratedContent(data.image_prompt || data.polished_text)
      } else {
        setGeneratedContent(data.polished_text || data.output)
      }

      setIdea('')

      const newRequest = {
        id: Date.now(),
        type: activeMode,
        content: data.polished_text || data.output,
        image: uploadedImage,
        generatedImage: activeMode === 'image' && data.image_data
          ? (data.image_data.startsWith('data:') ? data.image_data : `data:image/png;base64,${data.image_data}`)
          : null,
        status: 'pending',
        timestamp: new Date().toISOString(),
        originalIdea: idea
      }

      setRequests(prev => [newRequest, ...prev])

    } catch (error) {
      console.error('Error:', error)
      alert('Error generating content. Please try again.')
    }

    setIsLoading(false)
  }

  const pendingRequests = requests.filter(r => r.status === 'pending')

  return (
<div className={`min-h-screen ${bgColor}`} style={{ zoom: '90%' }}>      {/* ✅ STEP 3: Pass Bloato props to Header */}
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        pendingRequests={pendingRequests}
        setShowNewPostModal={setShowNewPostModal}
        setShowBloatoPostModal={setShowBloatoPostModal} // ✅ Add this prop
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
          darkMode={darkMode}
          cardBg={cardBg}
          textColor={textColor}
        />

        {/* {generatedImage && (
          <div className="mt-10 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4 text-gray-800 font-semibold">
              <Wand2 className="w-5 h-5" />
              Generated Image
            </div>
            <img src={generatedImage} className="rounded-xl shadow w-full" />
          </div>
        )} */}
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
            alert(`Posted to ${platform}`)
            setShowShareModal(false)
            setIdea('')
            setUploadedImage(null)
            setActiveMode(null)
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

      {/* ✅ STEP 4: Add BloatoPostModal component */}
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