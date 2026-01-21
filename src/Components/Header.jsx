import React, { useState, useEffect } from 'react'
import {
  Sparkles,
  Bell,
  Send,
  History,
  X,
  Check,
  XCircle,
  RefreshCw,
  Edit2,
  Home,
  Calendar,
  Clock,
  Key,
  Save,
  RotateCcw
} from 'lucide-react'

const BASE_URL = 'http://localhost:3000/api/content'
const WEBHOOK_URL = 'https://n8n.avertisystems.com/webhook-test/api-key-webhook'

// API Key Modal Component
const ApiKeyModal = ({ showModal, setShowModal }) => {
  const [apiKey, setApiKey] = useState('')
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState(null)
  const [error, setError] = useState(null)

  const handleSave = async () => {
    if (!apiKey.trim()) {
      setError('Please enter an API key')
      return
    }

    setLoading(true)
    setError(null)
    setResponse(null)

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: apiKey })
      })

      const data = await res.json()
      setResponse(data)
      
      if (res.ok) {
        setTimeout(() => {
          setShowModal(false)
          setApiKey('')
          setResponse(null)
        }, 2000)
      }
    } catch (err) {
      setError('Failed to save API key: ' + err.message)
      console.error('Webhook error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!showModal) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
              <Key className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-white font-bold text-lg">API Settings</h2>
          </div>
          <button
            onClick={() => setShowModal(false)}
            className="text-white/90 hover:bg-white/20 p-2 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Gemini API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Gemini API key..."
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              disabled={loading}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 flex items-start gap-2">
              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Success Response */}
          {response && (
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3 flex items-start gap-2">
              <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-green-700">
                <p className="font-semibold mb-1">Success!</p>
                <pre className="text-xs bg-white/50 rounded p-2 overflow-auto">
                  {JSON.stringify(response, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save API Key
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// Social Media Icons Component
const SocialMediaIcons = ({ socialMediaPosted }) => {
  const platforms = [
    {
      id: 'instagram',
      name: 'Instagram',
      icon: (isActive) => (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill={isActive ? 'url(#instagram-gradient)' : '#9CA3AF'}>
          <defs>
            <radialGradient id="instagram-gradient" cx="30%" cy="107%">
              <stop offset="0%" stopColor="#fdf497" />
              <stop offset="5%" stopColor="#fdf497" />
              <stop offset="45%" stopColor="#fd5949" />
              <stop offset="60%" stopColor="#d6249f" />
              <stop offset="90%" stopColor="#285AEB" />
            </radialGradient>
          </defs>
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      )
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: (isActive) => (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill={isActive ? '#1877F2' : '#9CA3AF'}>
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: (isActive) => (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill={isActive ? '#1DA1F2' : '#9CA3AF'}>
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      )
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: (isActive) => (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill={isActive ? '#0A66C2' : '#9CA3AF'}>
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    }
  ]

  return (
    <div className="flex items-center gap-1.5">
      {platforms.map(platform => {
        const isPosted = socialMediaPosted?.[platform.id] === 1
        return (
          <div
            key={platform.id}
            className={`transition-all ${isPosted ? 'scale-110' : 'opacity-50'}`}
            title={isPosted ? `Posted on ${platform.name}` : `Not posted on ${platform.name}`}
          >
            {platform.icon(isPosted)}
          </div>
        )
      })}
    </div>
  )
}

const HistoryNavbar = ({ showHistory, setShowHistory, onApprove }) => {
  const [historyData, setHistoryData] = useState([])
  const [activeTab, setActiveTab] = useState('all')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editedCaption, setEditedCaption] = useState('')
  const [hoveredId, setHoveredId] = useState(null)
  const [flippedCards, setFlippedCards] = useState(new Set())

  const fetchContent = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(BASE_URL)
      if (!res.ok) throw new Error('Failed to fetch')
      const json = await res.json()

      const mapped = json.data.map(item => ({
        id: item.id,
        prompt: item.caption,
        image: item.image_path
          ? `http://localhost:3000/${item.image_path.replace(/\\/g, '/')}`
          : null,
        status: item.status,
        socialMediaPosted: item.social_media_posted || {},
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        backendId: item.id
      }))

      setHistoryData(mapped)
    } catch (err) {
      setError('Failed to load content')
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (showHistory) fetchContent()
  }, [showHistory])

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleSaveCaption = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caption: editedCaption })
      })

      if (!res.ok) throw new Error('Failed to update caption')

      setHistoryData(prev =>
        prev.map(item =>
          item.id === id ? { ...item, prompt: editedCaption } : item
        )
      )

      setEditingId(null)
      setEditedCaption('')
      alert('Caption updated successfully!')
    } catch (err) {
      console.error('Save error:', err)
      alert('Failed to save caption')
    }
  }

  const handleApprove = (item) => {
    const requestData = {
      id: item.id,
      backendId: item.backendId,
      content: item.prompt,
      caption: item.prompt,
      image: item.image,
      generatedImage: item.image,
      status: 'pending',
      type: 'image'
    }
    
    setShowHistory(false)
    onApprove(requestData)
  }

  const handleReject = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/${id}/reject`, { 
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      })

      if (!res.ok) throw new Error('Failed to reject')

      await fetchContent()
      alert('Content rejected successfully')
    } catch (err) {
      console.error('Reject error:', err)
      alert('Failed to reject content')
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditedCaption('')
  }

  const toggleFlip = (id) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const filtered =
    activeTab === 'all'
      ? historyData
      : historyData.filter(i => i.status === activeTab)

  if (!showHistory) return null

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 z-40 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 bg-white shadow-md border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <History className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-xl text-gray-900">Content History</h2>
            <p className="text-sm text-gray-500">Manage your generated content</p>
          </div>
        </div>
        <button 
          onClick={() => setShowHistory(false)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <Home className="w-4 h-4" />
          <span className="font-medium">Back to Home</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-2 px-6 py-6 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        {['all', 'pending', 'approved', 'rejected'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
              activeTab === tab
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 hover:border-gray-400'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content Grid */}
      <div className="overflow-y-auto px-6 py-6" style={{ height: 'calc(85vh - 30px)' }}>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <RefreshCw className="animate-spin w-12 h-12 text-blue-600 mb-4" />
            <p className="text-gray-500">Loading content...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20">
            <XCircle className="w-16 h-16 text-red-500 mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchContent}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg">
              <History className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">No {activeTab !== 'all' ? activeTab : ''} content found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(item => (
              <div 
                key={item.id} 
                className="flip-card-container"
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className={`flip-card-inner ${flippedCards.has(item.id) ? 'flipped' : ''}`}>
                  {/* FRONT SIDE */}
                  <div className="flip-card-front bg-white rounded-2xl overflow-hidden shadow-md border border-gray-200">
                    {/* Image Section */}
                    {item.image && (
                      <div className="relative h-44 bg-gray-100 overflow-hidden group">
                        <img
                          src={item.image}
                          alt="Content preview"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        
                        {/* Date Badge with Flip Icon */}
                        <div className="absolute top-2 right-2 flex items-center gap-2">
                          <div className="bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg shadow-lg flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-blue-600" />
                            <span className="text-xs font-semibold text-gray-700">
                              {formatDate(item.createdAt).split(',')[0]}
                            </span>
                          </div>
                          <button
                            onClick={() => toggleFlip(item.id)}
                            className="bg-blue-600 hover:bg-blue-700 p-1.5 rounded-lg shadow-lg transition-all group/flip"
                            title="View full image"
                          >
                            <RotateCcw className="w-4 h-4 text-white group-hover/flip:rotate-180 transition-transform duration-300" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Content Section */}
                    <div className="p-3">
                      {/* Caption with Edit Button */}
                      <div className="mb-2">
                        {item.status === 'pending' && editingId === item.id ? (
                          <div className="space-y-2">
                            <textarea
                              value={editedCaption}
                              onChange={e => setEditedCaption(e.target.value)}
                              className="w-full border-2 border-blue-400 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                              rows="4"
                              placeholder="Enter new caption..."
                              autoFocus
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleSaveCaption(item.id)}
                                className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all font-semibold text-sm shadow-md"
                              >
                                <Check className="w-4 h-4" />
                                Save
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="flex-1 flex items-center justify-center gap-1.5 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-all font-semibold text-sm"
                              >
                                <X className="w-4 h-4" />
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="relative">
                            <p className="text-sm text-gray-700 leading-relaxed line-clamp-4 min-h-[72px] mb-1">
                              {item.prompt}
                            </p>
                            
                            {/* Edit Button - Shows on Hover (but no flip trigger) */}
                            {item.status === 'pending' && hoveredId === item.id && editingId !== item.id && (
                              <button
                                onClick={() => {
                                  setEditingId(item.id)
                                  setEditedCaption(item.prompt)
                                }}
                                className="absolute -top-1 right-0 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg"
                                title="Edit caption"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Social Media Icons + Timestamps */}
                      <div className="mb-2 space-y-1.5">
                        {/* Social Media Published Status */}
                        <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Publish to:</span>
                          <SocialMediaIcons socialMediaPosted={item.socialMediaPosted} />
                        </div>

                        {/* Timestamps */}
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span className="font-medium">Created:</span>
                            <span className="text-xs">{formatDate(item.createdAt)}</span>
                          </div>
                          {item.updatedAt && item.updatedAt !== item.createdAt && (
                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                              <Clock className="w-3 h-3 text-gray-400" />
                              <span className="font-medium">Updated:</span>
                              <span className="text-xs">{formatDate(item.updatedAt)}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      {item.status === 'pending' && editingId !== item.id && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(item)}
                            className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all font-semibold text-sm shadow-md"
                          >
                            <Check className="w-4 h-4" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(item.id)}
                            className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all font-semibold text-sm shadow-md"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </button>
                        </div>
                      )}

                      {/* Status Badge for Approved */}
                      {item.status === 'approved' && (
                        <div className="flex items-center justify-center gap-1.5 bg-green-50 text-green-700 py-2 rounded-lg font-semibold text-sm border-2 border-green-200">
                          <Check className="w-4 h-4" />
                          Approved
                        </div>
                      )}

                      {/* Status Badge for Rejected */}
                      {item.status === 'rejected' && (
                        <div className="flex items-center justify-center gap-1.5 bg-red-50 text-red-700 py-2 rounded-lg font-semibold text-sm border-2 border-red-200">
                          <XCircle className="w-4 h-4" />
                          Rejected
                        </div>
                      )}
                    </div>
                  </div>

                  {/* BACK SIDE - Full Image Only */}
                  <div className="flip-card-back bg-gray-900 rounded-2xl overflow-hidden shadow-md border border-gray-200 relative">
                    {item.image && (
                      <>
                        <img
                          src={item.image}
                          alt="Full preview"
                          className="w-full h-full object-cover"
                        />
                        {/* Close/Back button on flipped side */}
                        <button
                          onClick={() => toggleFlip(item.id)}
                          className="absolute top-2 right-2 bg-white/90 hover:bg-white p-2 rounded-lg shadow-lg transition-all"
                          title="Back to details"
                        >
                          <X className="w-5 h-5 text-gray-700" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .flip-card-container {
          perspective: 1000px;
          height: 420px;
        }

        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.6s;
          transform-style: preserve-3d;
        }

        .flip-card-inner.flipped {
          transform: rotateY(180deg);
        }

        .flip-card-front,
        .flip-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        .flip-card-back {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  )
}

const Header = ({
  showNotifications,
  setShowNotifications,
  pendingRequests,
  setShowNewPostModal,
  setShowBloatoPostModal,
  onApproveFromHistory
}) => {
  const [showHistory, setShowHistory] = useState(false)
  const [showApiModal, setShowApiModal] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo - Clickable to close history */}
          <button 
            onClick={() => setShowHistory(false)}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-lg font-bold text-gray-900">Saiman Portal</h1>
              <p className="text-xs text-gray-500">Create. Generate. Publish.</p>
            </div>
          </button>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowNewPostModal(true)}
              className="hidden sm:flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm font-medium"
            >
              <Send className="w-4 h-4" />
              <span>New Post</span>
            </button>

            <button
              onClick={() => setShowBloatoPostModal(true)}
              className="hidden sm:flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-sm font-medium"
            >
              <Sparkles className="w-4 h-4" />
              <span>Bloato Post</span>
            </button>

            <button
              onClick={() => setShowApiModal(true)}
              className="p-2.5 rounded-lg bg-white hover:bg-gray-50 transition-all border border-gray-200 shadow-sm"
              title="API Settings"
            >
              <Key className="w-5 h-5 text-purple-600" />
            </button>

            <button
              onClick={() => setShowHistory(!showHistory)}
              className="p-2.5 rounded-lg bg-white hover:bg-gray-50 transition-all border border-gray-200 shadow-sm"
              title="View History"
            >
              <History className="w-5 h-5 text-gray-700" />
            </button>

            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-lg bg-white hover:bg-gray-50 transition-all border border-gray-200 shadow-sm"
              title="Notifications"
            >
              <Bell className="w-5 h-5 text-gray-700" />
              {pendingRequests.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center font-semibold shadow-md">
                  {pendingRequests.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <ApiKeyModal showModal={showApiModal} setShowModal={setShowApiModal} />
      
      <HistoryNavbar
        showHistory={showHistory}
        setShowHistory={setShowHistory}
        onApprove={onApproveFromHistory}
      />
    </>
  )
}

export default Header