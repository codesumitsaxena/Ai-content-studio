import React from 'react';
import { XCircle, CheckCircle, Instagram, MessageSquare, Image as ImageIcon, Video, Smartphone, Copy, Share2 } from 'lucide-react';

const ReviewModal = ({ request, onClose, onAction, darkMode }) => {
  if (!request) return null;

  const typeStyles = {
    chatgpt: { icon: MessageSquare, color: 'text-emerald-500', bg: 'bg-emerald-500/10', label: 'AI Prompt' },
    post: { icon: Instagram, color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'Social Post' },
    image: { icon: ImageIcon, color: 'text-purple-500', bg: 'bg-purple-500/10', label: 'AI Image' },
    video: { icon: Video, color: 'text-orange-500', bg: 'bg-orange-500/10', label: 'Video Script' },
  };

  const config = typeStyles[request.type] || typeStyles.chatgpt;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className={`${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-slate-200'} border-2 rounded-[2.5rem] w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-scaleIn`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-800">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${config.bg}`}>
              <config.icon className={config.color} size={28} />
            </div>
            <div>
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{config.label} Review</h3>
              <p className="text-sm text-slate-500">Preview and approve the generated content</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-full transition-all">
            <XCircle size={32} className="text-slate-400 hover:text-red-500" />
          </button>
        </div>

        {/* Body Split: Content & Preview */}
        <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Section 1: Content Editor View */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Generated Text</h4>
              <button className="text-xs font-bold text-indigo-500 flex items-center gap-1 hover:underline">
                <Copy size={14} /> Copy
              </button>
            </div>
            <div className={`p-6 rounded-3xl border-2 min-h-[250px] ${darkMode ? 'bg-gray-800/50 border-gray-700 text-slate-200' : 'bg-slate-50 border-slate-100 text-slate-700'}`}>
              <p className="text-lg leading-relaxed whitespace-pre-wrap">{request.content}</p>
            </div>
          </div>

          {/* Section 2: Smartphone Mockup Preview */}
          <div className="flex flex-col items-center">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
              <Smartphone size={16} /> Social Preview
            </h4>
            <div className="relative w-[280px] h-[560px] bg-black rounded-[3rem] border-[10px] border-gray-800 shadow-2xl overflow-hidden ring-4 ring-gray-700/10">
              <div className="bg-white h-full flex flex-col text-slate-900 overflow-y-auto">
                <div className="p-3 border-b flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500" />
                  <span className="text-[10px] font-bold">Studio_AI</span>
                </div>
                {request.image && (
                  <img src={request.image} className="w-full h-48 object-cover" alt="Post Visual" />
                )}
                <div className="p-4">
                  <div className="flex gap-3 mb-3 text-slate-800">
                    <Instagram size={16} /> <Share2 size={16} />
                  </div>
                  <p className="text-[10px] leading-relaxed line-clamp-6">{request.content}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className={`p-8 border-t ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-slate-50 border-slate-100'} flex justify-center gap-6`}>
          <button 
            onClick={() => onAction(request.id, 'rejected')}
            className="flex-1 max-w-[200px] py-4 rounded-2xl border-2 border-red-500 text-red-500 font-bold hover:bg-red-50 transition-all flex items-center justify-center gap-2"
          >
            <XCircle size={20} /> Reject
          </button>
          <button 
            onClick={() => onAction(request.id, 'approved')}
            className="flex-1 max-w-[200px] py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle size={20} /> Approve & Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;