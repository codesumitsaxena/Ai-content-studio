import React, { useEffect, useState } from 'react'
import {
  History,
  X,
  Check,
  XCircle,
  RefreshCw,
  Edit2
} from 'lucide-react'

const BASE_URL = 'http://localhost:3000/api/content'

const HistorySidebar = ({ showHistory, setShowHistory }) => {
  const [historyData, setHistoryData] = useState([])
  const [activeTab, setActiveTab] = useState('all')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [editingId, setEditingId] = useState(null)
  const [editedCaption, setEditedCaption] = useState('')

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
        createdAt: item.created_at
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
    } catch (err) {
      console.error('Save error:', err)
      alert('Failed to save caption')
    }
  }

  const handleApprove = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/${id}/approve`, { 
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      })

      if (!res.ok) throw new Error('Failed to approve')

      setHistoryData(prev =>
        prev.map(i => i.id === id ? { ...i, status: 'approved' } : i)
      )
    } catch (err) {
      console.error('Approve error:', err)
      alert('Failed to approve content')
    }
  }

  const handleReject = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/${id}/reject`, { 
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      })

      if (!res.ok) throw new Error('Failed to reject')

      setHistoryData(prev =>
        prev.map(i => i.id === id ? { ...i, status: 'rejected' } : i)
      )
    } catch (err) {
      console.error('Reject error:', err)
      alert('Failed to reject content')
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditedCaption('')
  }

  const filtered =
    activeTab === 'all'
      ? historyData
      : historyData.filter(i => i.status === activeTab)

  return (
    <>
      {showHistory && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={() => setShowHistory(false)}
        />
      )}

      <div className={`fixed top-0 right-0 h-full w-[380px] bg-white z-50 shadow-2xl transform transition-transform duration-300 ${showHistory ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md">
          <div className="flex items-center gap-3">
            <History className="w-5 h-5" />
            <span className="font-semibold text-lg">Content History</span>
          </div>
          <button 
            onClick={() => setShowHistory(false)}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200">
          {['all', 'pending', 'approved', 'rejected'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto h-[calc(100vh-140px)]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <RefreshCw className="animate-spin w-8 h-8 text-blue-600 mb-3" />
              <p className="text-sm text-gray-500">Loading content...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12">
              <XCircle className="w-12 h-12 text-red-500 mb-3" />
              <p className="text-sm text-red-600">{error}</p>
              <button 
                onClick={fetchContent}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <History className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">No {activeTab !== 'all' ? activeTab : ''} content found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map(item => (
                <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">

                  {/* Caption/Edit Input */}
                  {item.status === 'pending' && editingId === item.id ? (
                    <div className="mb-3">
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Edit Caption</label>
                      <textarea
                        value={editedCaption}
                        onChange={e => setEditedCaption(e.target.value)}
                        className="w-full border border-blue-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows="3"
                        placeholder="Enter new caption..."
                      />
                    </div>
                  ) : (
                    <div className="mb-3">
                      <h3 className="text-sm font-semibold text-gray-800 leading-relaxed">
                        {item.prompt}
                      </h3>
                    </div>
                  )}

                  {/* Image */}
                  {item.image && (
                    <div className="mb-3">
                      <img
                        src={item.image}
                        alt="Content preview"
                        className="w-full h-44 object-cover rounded-lg border border-gray-200"
                      />
                    </div>
                  )}

                  {/* Status Badge & Date */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                      item.status === 'approved' ? 'bg-green-100 text-green-700' :
                      item.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Action Buttons for Pending Items */}
                  {item.status === 'pending' && (
                    <div className="space-y-2">
                      {/* Edit/Save Buttons */}
                      <div className="flex gap-2">
                        {editingId === item.id ? (
                          <>
                            <button
                              onClick={() => handleSaveCaption(item.id)}
                              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                            >
                              <Check className="w-4 h-4" />
                              Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="flex-1 flex items-center justify-center gap-2 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm"
                            >
                              <X className="w-4 h-4" />
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingId(item.id)
                              setEditedCaption(item.prompt)
                            }}
                            className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm border border-gray-300"
                          >
                            <Edit2 className="w-4 h-4" />
                            Edit Caption
                          </button>
                        )}
                      </div>

                      {/* Approve/Reject Buttons */}
                      {editingId !== item.id && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(item.id)}
                            className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm shadow-sm"
                          >
                            <Check className="w-4 h-4" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(item.id)}
                            className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors font-medium text-sm shadow-sm"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default HistorySidebar