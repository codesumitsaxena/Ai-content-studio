import React, { useState, useEffect } from 'react'
import {
  Sparkles,
  Bell,
  Send,
  History,
  X,
  Check,
  XCircle,
  RefreshCw
} from 'lucide-react'
import HistorySidebar from './HistorySidebar'

const Header = ({
  showNotifications,
  setShowNotifications,
  pendingRequests,
  setShowNewPostModal,
  setShowBloatoPostModal
}) => {
  const [showHistory, setShowHistory] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Saiman Portal</h1>
              <p className="text-sm text-gray-500">Create. Generate. Publish.</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowNewPostModal(true)}
              className="hidden sm:flex gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              <Send className="w-4 h-4" />
              New Post
            </button>

            <button
              onClick={() => setShowBloatoPostModal(true)}
              className="hidden sm:flex gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg"
            >
              <img src="/blotato icon.ico" className="w-5 h-5" />
              Bloato Post
            </button>

            <button
              onClick={() => setShowHistory(true)}
              className="p-2 rounded bg-gray-100"
            >
              <History className="w-5 h-5" />
            </button>

            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded bg-gray-100"
            >
              <Bell className="w-5 h-5" />
              {pendingRequests.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                  {pendingRequests.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <HistorySidebar
        showHistory={showHistory}
        setShowHistory={setShowHistory}
      />
    </>
  )
}

export default Header
