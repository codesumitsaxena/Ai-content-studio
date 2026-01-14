import React from 'react';
import { Bell, Sparkles, Clock, Zap } from 'lucide-react';

const NotificationPanel = ({ requests, onSelect, darkMode }) => {
  const pending = requests.filter(r => r.status === 'pending');

  return (
    <div className={`absolute right-0 mt-4 w-80 rounded-3xl shadow-2xl border animate-slideDown z-50 overflow-hidden ${darkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
      <div className="p-4 border-b dark:border-gray-800 font-bold text-sm flex justify-between items-center">
        <span>Active Drafts</span>
        <span className="bg-indigo-500 text-white text-[10px] px-2 py-1 rounded-full">{pending.length}</span>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {pending.length === 0 ? (
          <div className="p-8 text-center opacity-40 text-xs">No pending reviews</div>
        ) : (
          pending.map(req => (
            <button 
              key={req.id}
              onClick={() => onSelect(req)}
              className="w-full p-4 text-left border-b last:border-0 dark:border-gray-800 hover:bg-indigo-500/5 transition-colors flex gap-3"
            >
              <div className="w-2 h-2 mt-2 rounded-full bg-indigo-500 animate-pulse flex-shrink-0" />
              <div>
                <p className="text-xs font-bold line-clamp-1">{req.content}</p>
                <span className="text-[10px] opacity-50 flex items-center gap-1 mt-1">
                  <Clock size={10} /> {new Date(req.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;