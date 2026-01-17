import React from 'react'
import { Clock } from 'lucide-react'

const NotificationPanel = ({ requests, onSelect, darkMode }) => {
  const pending = requests.filter(r => r.status === 'pending')

  return (
    <div className="absolute right-0 mt-3 w-80 max-w-[90vw] bg-white rounded-2xl shadow-xl border border-gray-200 animate-slideDown z-50 overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <span className="font-semibold text-sm text-gray-900">Active Drafts</span>
        <span className="bg-blue-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow-sm">
          {pending.length}
        </span>
      </div>

      {/* Content */}
      <div className="max-h-80 overflow-y-auto">

        {pending.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-400">
            No pending reviews
          </div>
        ) : (
          pending.map(req => (
            <button
              key={req.id}
              onClick={() => onSelect(req)}
              className="w-full px-4 py-3 text-left border-b last:border-b-0 border-gray-100 hover:bg-gray-50 transition-all flex gap-3 items-start"
            >
              <div className="w-2.5 h-2.5 mt-2 rounded-full bg-blue-500 animate-pulse shrink-0" />

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {req.content}
                </p>

                <span className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                  <Clock className="w-3 h-3" />
                  {new Date(req.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </button>
          ))
        )}

      </div>
    </div>
  )
}

export default NotificationPanel
