import React from 'react'
import { Sparkles, Moon, Sun, Bell, Send } from 'lucide-react'

const Header = ({
  darkMode,
  setDarkMode,
  showNotifications,
  setShowNotifications,
  pendingRequests,
  setShowNewPostModal,
  cardBg,
  textColor,
  textSecondary
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-4 flex items-center justify-between">

        {/* Logo Section */}
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>

          <div className="leading-tight">
            <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
              AI Content Studio
            </h1>
            <p className="text-sm text-gray-500 font-medium">
              Create. Generate. Publish.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* New Post */}
          <button
            onClick={() => setShowNewPostModal(true)}
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow-sm hover:bg-blue-700 hover:shadow-md transition-all active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <Send className="w-4 h-4" />
            New Post
          </button>

          {/* Notifications */}
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <Bell className="w-5 h-5 text-gray-700" />

            {pendingRequests.length > 0 && (
              <>
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shadow">
                  {pendingRequests.length}
                </span>
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-blue-600 animate-ping opacity-40"></span>
              </>
            )}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 active:scale-[0.97]"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-amber-500" />
            ) : (
              <Moon className="w-5 h-5 text-gray-700" />
            )}
          </button>

        </div>
      </div>
    </header>
  )
}

export default Header
