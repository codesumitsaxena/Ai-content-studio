import React from 'react';
import { Image, MessageSquare, Instagram, Wand2, Video, Sparkles, Loader2, CheckCircle } from 'lucide-react';

const InputBox = ({
  idea,
  setIdea,
  uploadedImage,
  handleImageUpload,
  activeMode,
  setActiveMode,
  isLoading,
  generateContent,
  darkMode,
  cardBg,
  textColor
}) => {
  return (
    <div className={`relative ${cardBg} backdrop-blur-xl rounded-3xl shadow-2xl border-2 ${darkMode ? 'border-gray-700' : 'border-purple-200'} overflow-hidden group hover:shadow-purple-300/30 transition-all duration-300`}>
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="relative">
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="Describe your vision... I'll make it extraordinary"
          className={`w-full h-48 px-8 py-6 text-lg ${cardBg} ${textColor} placeholder-gray-400 focus:outline-none resize-none font-medium`}
          style={{lineHeight: '1.8'}}
        />
        
        <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-purple-200'} px-6 py-5 ${darkMode ? 'bg-gray-700/30' : 'bg-gradient-to-r from-purple-50/50 to-pink-50/50'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <label className="cursor-pointer group/upload">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                  uploadedImage 
                    ? 'bg-gradient-to-br from-emerald-400 to-teal-400 border-2 border-emerald-500 shadow-lg scale-110' 
                    : `${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-purple-100 hover:bg-purple-200'} border-2 border-transparent hover:border-purple-400 hover:scale-110`
                }`}>
                  <Image className={`w-5 h-5 ${uploadedImage ? 'text-white' : darkMode ? 'text-gray-400' : 'text-purple-600'}`} />
                  {uploadedImage && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </span>
                  )}
                </div>
              </label>

              <button
                onClick={() => setActiveMode(activeMode === 'chatgpt' ? null : 'chatgpt')}
                className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                  activeMode === 'chatgpt'
                    ? 'bg-gradient-to-br from-emerald-400 to-teal-400 border-2 border-emerald-500 shadow-lg scale-110'
                    : `${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-purple-100 hover:bg-purple-200'} border-2 border-transparent hover:border-emerald-400 hover:scale-110`
                }`}
              >
                <MessageSquare className={`w-5 h-5 ${activeMode === 'chatgpt' ? 'text-white' : darkMode ? 'text-gray-400' : 'text-emerald-600'}`} />
              </button>

              <button
                onClick={() => setActiveMode(activeMode === 'post' ? null : 'post')}
                className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                  activeMode === 'post'
                    ? 'bg-gradient-to-br from-blue-400 to-cyan-400 border-2 border-blue-500 shadow-lg scale-110'
                    : `${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-purple-100 hover:bg-purple-200'} border-2 border-transparent hover:border-blue-400 hover:scale-110`
                }`}
              >
                <Instagram className={`w-5 h-5 ${activeMode === 'post' ? 'text-white' : darkMode ? 'text-gray-400' : 'text-blue-600'}`} />
              </button>

              <button
                onClick={() => setActiveMode(activeMode === 'image' ? null : 'image')}
                className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                  activeMode === 'image'
                    ? 'bg-gradient-to-br from-purple-400 to-pink-400 border-2 border-purple-500 shadow-lg scale-110'
                    : `${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-purple-100 hover:bg-purple-200'} border-2 border-transparent hover:border-purple-400 hover:scale-110`
                }`}
              >
                <Wand2 className={`w-5 h-5 ${activeMode === 'image' ? 'text-white' : darkMode ? 'text-gray-400' : 'text-purple-600'}`} />
              </button>

              <button
                onClick={() => setActiveMode(activeMode === 'video' ? null : 'video')}
                className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                  activeMode === 'video'
                    ? 'bg-gradient-to-br from-orange-400 to-amber-400 border-2 border-orange-500 shadow-lg scale-110'
                    : `${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-purple-100 hover:bg-purple-200'} border-2 border-transparent hover:border-orange-400 hover:scale-110`
                }`}
              >
                <Video className={`w-5 h-5 ${activeMode === 'video' ? 'text-white' : darkMode ? 'text-gray-400' : 'text-orange-600'}`} />
              </button>
            </div>

            <button
              onClick={generateContent}
              disabled={isLoading || !idea.trim() || !activeMode}
              className={`relative px-8 py-3.5 rounded-xl font-bold flex items-center gap-3 transition-all ${
                isLoading || !idea.trim() || !activeMode
                  ? `${darkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-200 text-gray-400'} cursor-not-allowed`
                  : 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:shadow-2xl hover:shadow-purple-400/50 hover:scale-105 active:scale-95'
              }`}
            >
              {isLoading && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl animate-pulse"></div>
              )}
              <div className="relative flex items-center gap-3">
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate
                  </>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputBox;