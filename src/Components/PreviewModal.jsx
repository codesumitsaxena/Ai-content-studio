import React from 'react';
import { XCircle } from 'lucide-react';

const PreviewModal = ({
  currentRequest,
  setShowPreview,
  handleApproval,
  darkMode,
  cardBg,
  textColor,
  textSecondary
}) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] flex items-center justify-center p-6 animate-fadeIn">
      <div className={`${cardBg} backdrop-blur-xl rounded-3xl shadow-2xl max-w-md w-full border-2 ${darkMode ? 'border-gray-700' : 'border-purple-200'}`}>
        <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-purple-200'} flex items-center justify-between`}>
          <h3 className={`text-xl font-bold ${textColor}`}>Content Preview</h3>
          <button 
            onClick={() => setShowPreview(false)} 
            className={`p-2 rounded-xl ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-purple-100'}`}
          >
            <XCircle className={`w-6 h-6 ${textSecondary}`} />
          </button>
        </div>
        
        <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-2xl shadow-xl overflow-hidden border-2 ${darkMode ? 'border-gray-700' : 'border-purple-200'} m-4`}>
          <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-purple-200'} flex items-center gap-3`}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500"></div>
            <div>
              <p className={`font-bold ${textColor}`}>Your Brand</p>
              <p className={`text-xs ${textSecondary}`}>Just now</p>
            </div>
          </div>
          {(currentRequest.image || currentRequest.generatedImage) && (
            <img src={currentRequest.generatedImage || currentRequest.image} alt="Preview" className="w-full" />
          )}
          <div className="p-4">
            <p className={`${textColor} whitespace-pre-wrap text-sm`}>{currentRequest.content}</p>
          </div>
        </div>

        <div className="p-4 flex gap-3">
          <button
            onClick={() => setShowPreview(false)}
            className={`flex-1 px-6 py-3 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-purple-100 hover:bg-purple-200'} ${textColor} rounded-xl font-bold hover:scale-105 transition-all`}
          >
            Close
          </button>
          <button
            onClick={() => {
              setShowPreview(false);
              handleApproval(currentRequest, true);
            }}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-400 to-teal-500 text-white rounded-xl font-bold hover:scale-105 transition-all"
          >
            Approve & Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;