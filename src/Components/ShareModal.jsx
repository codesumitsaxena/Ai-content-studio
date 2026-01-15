import React from 'react';
import { CheckCircle, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

const ShareModal = ({
  shareToSocial,
  setShowShareModal,
  darkMode,
  cardBg,
  textColor,
  textSecondary
}) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fadeIn">
      <div className={`${cardBg} backdrop-blur-xl rounded-3xl p-10 shadow-2xl max-w-2xl w-full border-2 ${darkMode ? 'border-gray-700' : 'border-purple-200'} animate-scaleIn`}>
        <div className="text-center mb-10">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full blur-2xl opacity-50 animate-pulse"></div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full flex items-center justify-center shadow-2xl">
              <CheckCircle className="w-12 h-12 text-white" strokeWidth={3} />
            </div>
          </div>
          <h3 className={`text-4xl font-black ${textColor} mb-3`}>Content Approved! 🎉</h3>
          <p className={`text-lg ${textSecondary}`}>Choose your platform to publish</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => shareToSocial('Facebook')}
            className="group relative px-6 py-5 bg-[#1877F2] text-white rounded-2xl font-bold hover:shadow-2xl hover:shadow-blue-500/30 transform hover:scale-105 active:scale-95 transition-all overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors"></div>
            <div className="relative flex items-center justify-center gap-3">
              <Facebook className="w-6 h-6" />
              <span>Facebook</span>
            </div>
          </button>
          
          <button
            onClick={() => shareToSocial('Instagram')}
            className="group relative px-6 py-5 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white rounded-2xl font-bold hover:shadow-2xl hover:shadow-pink-500/30 transform hover:scale-105 active:scale-95 transition-all overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors"></div>
            <div className="relative flex items-center justify-center gap-3">
              <Instagram className="w-6 h-6" />
              <span>Instagram</span>
            </div>
          </button>
          
          <button
            onClick={() => shareToSocial('LinkedIn')}
            className="group relative px-6 py-5 bg-[#0A66C2] text-white rounded-2xl font-bold hover:shadow-2xl hover:shadow-blue-700/30 transform hover:scale-105 active:scale-95 transition-all overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors"></div>
            <div className="relative flex items-center justify-center gap-3">
              <Linkedin className="w-6 h-6" />
              <span>LinkedIn</span>
            </div>
          </button>
          
          <button
            onClick={() => shareToSocial('Twitter/X')}
            className="group relative px-6 py-5 bg-black text-white rounded-2xl font-bold hover:shadow-2xl hover:shadow-gray-700/30 transform hover:scale-105 active:scale-95 transition-all overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors"></div>
            <div className="relative flex items-center justify-center gap-3">
              <Twitter className="w-6 h-6" />
              <span>Twitter/X</span>
            </div>
          </button>
        </div>

        <button
          onClick={() => setShowShareModal(false)}
          className={`w-full px-6 py-4 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-purple-100 hover:bg-purple-200'} ${textColor} rounded-2xl font-bold transition-all`}
        >
          Maybe Later
        </button>
      </div>
    </div>
  );
};

export default ShareModal;