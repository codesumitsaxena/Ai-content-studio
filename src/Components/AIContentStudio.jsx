import React, { useState } from 'react';
import { Sparkles, Moon, Sun, Bell, Loader2, Image as ImageIcon, Video, MessageSquare, Instagram, Wand2, Zap } from 'lucide-react';
import ReviewModal from './ReviewModal';
import NotificationPanel from './NotificationPanel';

const AIContentStudio = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [idea, setIdea] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [activeMode, setActiveMode] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showNotif, setShowNotif] = useState(false);

  const handleGenerate = async () => {
    if (!idea || !activeMode) return alert("Select a mode and enter your idea!");
    setIsLoading(true);

    // Mocking API call to your N8N Webhook
    setTimeout(() => {
      const newRequest = {
        id: Date.now(),
        type: activeMode,
        content: idea + " Optimized by Studio AI. ✨ #Innovation #Viral",
        image: uploadedImage,
        status: 'pending',
        timestamp: new Date().toISOString()
      };
      setRequests(prev => [newRequest, ...prev]);
      setIsLoading(false);
      setIdea('');
      setShowNotif(true);
    }, 1500);
  };

  const handleAction = (id, status) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    setSelectedRequest(null);
    if (status === 'approved') alert("Success! Content published to social channels.");
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'bg-gray-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Navigation Header */}
      <nav className={`sticky top-0 z-50 border-b backdrop-blur-md ${darkMode ? 'bg-gray-950/80 border-gray-800' : 'bg-white/80 border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
              <Sparkles className="text-white" size={20} />
            </div>
            <span className="text-xl font-black tracking-tight uppercase">Studio AI</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button onClick={() => setShowNotif(!showNotif)} className={`p-3 rounded-2xl transition-all ${darkMode ? 'bg-gray-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                <Bell size={22} className={requests.some(r => r.status === 'pending') ? 'animate-bounce text-indigo-500' : ''} />
              </button>
              {showNotif && (
                <NotificationPanel 
                  requests={requests} 
                  darkMode={darkMode} 
                  onSelect={(req) => { setSelectedRequest(req); setShowNotif(false); }} 
                />
              )}
            </div>
            <button onClick={() => setDarkMode(!darkMode)} className="p-3 rounded-2xl bg-slate-100 dark:bg-gray-800">
              {darkMode ? <Sun size={22} className="text-yellow-400" /> : <Moon size={22} className="text-indigo-600" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-6xl font-black tracking-tight leading-none">Turn Ideas into <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Digital Gold</span></h1>
          <p className="text-slate-500 font-medium text-lg">AI Content Studio: One platform for posts, prompts, and visuals.</p>
        </div>

        {/* The Generation Hub */}
        <div className={`rounded-[2.5rem] shadow-2xl border-2 transition-all ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-slate-200'}`}>
          <textarea 
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="What should we create today?"
            className="w-full h-52 p-8 bg-transparent outline-none text-xl resize-none font-medium placeholder:opacity-30"
          />
          
          <div className="p-6 border-t dark:border-gray-800 flex flex-wrap items-center justify-between gap-6">
            <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-gray-800 rounded-2xl">
              {[
                { id: 'chatgpt', icon: MessageSquare, label: 'Prompt' },
                { id: 'post', icon: Instagram, label: 'Post' },
                { id: 'image', icon: Wand2, label: 'Visual' },
                { id: 'video', icon: Video, label: 'Video' }
              ].map(mode => (
                <button
                  key={mode.id}
                  onClick={() => setActiveMode(mode.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${activeMode === mode.id ? 'bg-white dark:bg-gray-700 shadow-md scale-105 font-bold' : 'opacity-40 hover:opacity-100'}`}
                >
                  <mode.icon size={18} className={activeMode === mode.id ? 'text-indigo-500' : ''} />
                  <span className="text-[10px] uppercase tracking-wider">{mode.label}</span>
                </button>
              ))}
            </div>

            <button 
              onClick={handleGenerate}
              disabled={isLoading || !idea}
              className="px-10 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold flex items-center gap-3 hover:shadow-2xl hover:shadow-indigo-500/30 transition-all active:scale-95 disabled:opacity-20"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <Zap size={20} />}
              {isLoading ? 'Processing...' : 'Transform Idea'}
            </button>
          </div>
        </div>
      </main>

      {/* MODAL LAYER */}
      {selectedRequest && (
        <ReviewModal 
          request={selectedRequest}
          darkMode={darkMode}
          onClose={() => setSelectedRequest(null)}
          onAction={handleAction}
        />
      )}

      {/* Animation Definitions */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-slideDown { animation: slideDown 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default AIContentStudio;