import React from 'react'
import { Image, MessageSquare, Instagram, Wand2, Video, Sparkles, Loader2, CheckCircle } from 'lucide-react'

const InputBox = ({
  idea,
  setIdea,
  uploadedImage,
  handleImageUpload,
  activeMode,
  setActiveMode,
  isLoading,
  generateContent
}) => {

  return (
    <div className="relative bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition-all">

      {/* Text Input - No overlay */}
      <textarea
        value={idea || ''}
        onChange={(e) => setIdea(e.target.value)}
        placeholder="Describe your vision…"
        className="w-full h-44 md:h-48 px-6 py-5 text-base md:text-lg text-gray-900 placeholder-gray-400 resize-none focus:outline-none leading-relaxed"
        disabled={isLoading}
      />

      {/* Toolbar */}
      <div className="border-t border-gray-200 bg-gray-50 px-4 sm:px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">

          {/* Tools */}
          <div className="flex items-center gap-2">

            {/* Upload */}
            <label className={`${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="hidden" 
                disabled={isLoading}
              />
              <div className={`relative w-11 h-11 rounded-xl flex items-center justify-center border transition-all
                ${uploadedImage ? 'bg-emerald-500 border-emerald-500 shadow text-white scale-105' : 'bg-white border-gray-300 hover:bg-gray-100'}`}>
                <Image className="w-5 h-5" />
                {uploadedImage && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                  </span>
                )}
              </div>
            </label>

            {/* Modes */}
            {[
              { id: 'chatgpt', icon: MessageSquare, active: 'text-emerald-600 border-emerald-500 bg-emerald-50' },
              { id: 'post', icon: Instagram, active: 'text-blue-600 border-blue-500 bg-blue-50' },
              { id: 'image', icon: Wand2, active: 'text-purple-600 border-purple-500 bg-purple-50' },
              { id: 'video', icon: Video, active: 'text-orange-600 border-orange-500 bg-orange-50' }
            ].map(({ id, icon: Icon, active }) => (
              <button
                key={id}
                onClick={() => setActiveMode(activeMode === id ? null : id)}
                disabled={isLoading}
                className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-all
                  ${activeMode === id
                    ? active + ' shadow'
                    : 'bg-white border-gray-300 hover:bg-gray-100 text-gray-500'}
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Icon className="w-5 h-5" />
              </button>
            ))}
          </div>

          {/* Generate Button with Loading */}
          <button
            onClick={generateContent}
            disabled={isLoading || !(idea || '').trim() || !activeMode}
            className={`px-7 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all min-w-[140px] justify-center
              ${isLoading || !(idea || '').trim() || !activeMode
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow hover:shadow-md active:scale-95'}`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generating…</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate</span>
              </>
            )}
          </button>

        </div>
      </div>
    </div>
  )
}

export default InputBox