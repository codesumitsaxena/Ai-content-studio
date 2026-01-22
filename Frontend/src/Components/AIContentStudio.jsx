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

  const N8N_WEBHOOK_URL = 'https://n8n.avertisystems.com/webhook/ai-content-studio'
  const BACKEND_API = 'https://aipostapi.website-design-india.com/api/content'
  

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

  // ✅ FIXED: Handle approve from history - Open ApprovalModal first, then ShareModal
  const handleApproveFromHistory = (requestData) => {
    console.log('🔍 History → Approval Flow Started')
    console.log('📦 Request Data:', requestData)
    console.log('🆔 Backend ID:', requestData.backendId)
    
    // ✅ CRITICAL: Set currentRequest with ALL data including backendId
    setCurrentRequest({
      ...requestData,
      backendId: requestData.backendId || requestData.id // Fallback to id if backendId missing
    })
    
    // ✅ Open ApprovalModal first (user can review before sharing)
    setShowApprovalModal(true)
    
    console.log('✅ ApprovalModal opened with backendId:', requestData.backendId)
  }

  // ✅ IMPROVED: Save to backend with duplicate prevention
  const saveToBackend = async (contentData) => {
    try {
      const caption = contentData.caption || contentData.content;
      const imageData = contentData.generatedImage || uploadedImage;

      // ✅ STEP 1: Check if this content already exists in backend
      console.log('🔍 Checking for existing content...');
      const checkRes = await fetch(BACKEND_API);
      if (checkRes.ok) {
        const existing = await checkRes.json();
        
        // Find if exact same caption exists (created in last 10 seconds)
        const duplicate = existing.data?.find(item => {
          const isSameCaption = item.caption === caption;
          const createdAt = new Date(item.created_at);
          const now = new Date();
          const diffSeconds = (now - createdAt) / 1000;
          return isSameCaption && diffSeconds < 10;
        });

        if (duplicate) {
          console.log('⚠️ Duplicate found! Using existing ID:', duplicate.id);
          return duplicate.id;
        }
      }

      // ✅ STEP 2: No duplicate found, create new entry
      const payload = {
        caption: caption,
        image_data: imageData
      };

      console.log('📤 Creating new backend entry...');
      const res = await fetch(BACKEND_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      const savedData = await res.json();
      console.log('✅ Backend response:', savedData);

      if (!savedData?.data?.id) {
        console.error('❌ Backend ID missing', savedData);
        return null;
      }

      return savedData.data.id;
    } catch (err) {
      console.error('❌ saveToBackend failed:', err);
      return null;
    }
  };

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
        setIdea(data.published_text || data.polished_text || data.output)
        setIsLoading(false)
        return
      }

      let generatedImageUrl = null
      let caption = data.caption || data.published_text || data.polished_text || data.output

      if (activeMode === 'image' && data.image_data) {
        generatedImageUrl = data.image_data.startsWith('data:')
          ? data.image_data
          : `data:image/png;base64,${data.image_data}`

        setGeneratedImage(generatedImageUrl)
        setGeneratedContent(caption)
      } else {
        setGeneratedContent(caption)
      }

      const newRequest = {
        id: Date.now(),
        type: activeMode,
        content: caption,
        caption: caption,
        image: uploadedImage,
        generatedImage: generatedImageUrl,
        status: 'pending',
        timestamp: new Date().toISOString(),
        originalIdea: idea,
        backendId: null
      }

      // ✅ OPTION A: If N8N saves to backend, DON'T save here
      // Just add to local notifications without backendId
      console.log('📌 N8N will save to backend, adding to notifications only');
      
      // Wait 2 seconds for N8N to save, then fetch the ID
      setTimeout(async () => {
        try {
          const checkRes = await fetch(BACKEND_API);
          if (checkRes.ok) {
            const existing = await checkRes.json();
            const found = existing.data?.find(item => {
              const isSameCaption = item.caption === caption;
              const createdAt = new Date(item.created_at);
              const now = new Date();
              const diffSeconds = (now - createdAt) / 1000;
              return isSameCaption && diffSeconds < 5;
            });
            
            if (found) {
              console.log('✅ Found backend ID from N8N:', found.id);
              newRequest.backendId = found.id;
              setRequests(prev => 
                prev.map(r => r.id === newRequest.id ? {...r, backendId: found.id} : r)
              );
            }
          }
        } catch (err) {
          console.error('Failed to fetch backend ID:', err);
        }
      }, 2000);

      // Add to notifications immediately
      setRequests(prev => {
        const exists = prev.find(r => r.id === newRequest.id);
        if (exists) return prev;
        return [newRequest, ...prev];
      });

      setIdea('')
      setUploadedImage(null)
      setUploadedFile(null)

    } catch (error) {
      console.error('Error:', error)
      alert('Error generating content. Please try again.')
    }

    setIsLoading(false)
  }

  // ✅ Remove notification after approval/rejection
  const removeNotification = (requestId) => {
    setRequests(prev => prev.filter(r => r.id !== requestId));
  };

  // ✅ Filter pending requests for notification badge
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
        onApproveFromHistory={handleApproveFromHistory}
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
            if (approved) {
              setShowApprovalModal(false)
              setShowShareModal(true)
            } else {
              // ✅ Remove from notifications on reject
              removeNotification(req.id);
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
            // ✅ Remove from notifications after sharing
            removeNotification(currentRequest.id);
            setShowShareModal(false)
          }}
          setShowShareModal={setShowShareModal}
          onPublishSuccess={() => {
            // ✅ Remove from notifications after successful publish
            removeNotification(currentRequest.id);
          }}
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