import React from 'react'
import {
  XCircle,
  CheckCircle,
  Instagram,
  MessageSquare,
  Image as ImageIcon,
  Video,
  Smartphone,
  Copy,
  Share2
} from 'lucide-react'

const ReviewModal = ({ request, onClose, onAction, darkMode }) => {
  if (!request) return null

  const typeStyles = {
    chatgpt: { icon: MessageSquare, color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'AI Prompt' },
    post: { icon: Instagram, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Social Post' },
    image: { icon: ImageIcon, color: 'text-purple-600', bg: 'bg-purple-50', label: 'AI Image' },
    video: { icon: Video, color: 'text-orange-600', bg: 'bg-orange-50', label: 'Video Script' }
  }

  const config = typeStyles[request.type] || typeStyles.chatgpt

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-fadeIn">

      <div className="bg-white border border-gray-200 rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-scaleIn">

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${config.bg}`}>
              <config.icon className={`${config.color}`} size={26} />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {config.label} Review
              </h3>
              <p className="text-sm text-gray-500">
                Preview and approve the generated content
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <XCircle size={28} className="text-gray-400 hover:text-red-500 transition" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-8 py-8 grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Content */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                Generated Text
              </h4>
              <button className="text-xs font-semibold text-blue-600 flex items-center gap-1 hover:underline">
                <Copy size={14} /> Copy
              </button>
            </div>

            <div className="p-6 rounded-2xl border border-gray-200 bg-gray-50 min-h-[250px]">
              <p className="text-base leading-relaxed whitespace-pre-wrap text-gray-800">
                {request.content}
              </p>
            </div>
          </div>

          {/* Preview */}
          <div className="flex flex-col items-center">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
              <Smartphone size={16} /> Social Preview
            </h4>

            <div className="relative w-[280px] h-[560px] bg-black rounded-[2.5rem] border-[8px] border-gray-800 shadow-xl overflow-hidden">
              <div className="bg-white h-full flex flex-col text-gray-900 overflow-y-auto">
                <div className="p-3 border-b flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500" />
                  <span className="text-xs font-semibold">Studio_AI</span>
                </div>

                {request.image && (
                  <img
                    src={request.image}
                    className="w-full h-48 object-cover"
                    alt="Post Visual"
                  />
                )}

                <div className="p-4">
                  <div className="flex gap-3 mb-3 text-gray-700">
                    <Instagram size={16} />
                    <Share2 size={16} />
                  </div>
                  <p className="text-xs leading-relaxed line-clamp-6">
                    {request.content}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-gray-200 bg-gray-50 flex justify-center gap-6">

          <button
            onClick={() => onAction(request.id, 'rejected')}
            className="flex-1 max-w-[200px] py-3 rounded-xl border border-red-500 text-red-600 font-semibold hover:bg-red-50 transition flex items-center justify-center gap-2"
          >
            <XCircle size={20} /> Reject
          </button>

          <button
            onClick={() => onAction(request.id, 'approved')}
            className="flex-1 max-w-[200px] py-3 rounded-xl bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition flex items-center justify-center gap-2"
          >
            <CheckCircle size={20} /> Approve & Share
          </button>

        </div>
      </div>
    </div>
  )
}

export default ReviewModal
