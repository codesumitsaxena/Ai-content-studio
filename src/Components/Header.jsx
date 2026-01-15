import React from 'react';
import { Sparkles, Moon, Sun, Bell, Send } from 'lucide-react';

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
    <header className={`sticky top-0 z-50 ${cardBg} backdrop-blur-xl border-b ${darkMode ? 'border-gray-700' : 'border-purple-200'} shadow-lg bg-opacity-95`}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI Content Studio
            </h1>
            <p className={`text-xs ${textSecondary} font-medium`}>Create. Generate. Publish.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowNewPostModal(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            New Post
          </button>
          
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-3 rounded-xl ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-purple-100 hover:bg-purple-200'} transition-all transform hover:scale-105`}
          >
            <Bell className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-purple-700'}`} />
            {pendingRequests.length > 0 && (
              <>
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  {pendingRequests.length}
                </span>
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-pink-500 rounded-full animate-ping"></span>
              </>
            )}
          </button>
          
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-3 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-purple-100'} hover:scale-110 transition-all`}
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-purple-700" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;