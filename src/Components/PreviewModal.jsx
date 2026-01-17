import React from 'react'
import { X } from 'lucide-react'

const PreviewModal = ({ currentRequest, setShowPreview, handleApproval }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4">

      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">

        <div className="flex justify-between items-center px-5 py-4 border-b">
          <h3 className="font-semibold">Post Preview</h3>
          <button onClick={() => setShowPreview(false)} className="p-2 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-5 space-y-4">

          <div className="bg-gray-50 rounded-xl p-4 text-gray-800 text-sm whitespace-pre-wrap">
            {currentRequest.content}
          </div>

        </div>

        <div className="flex gap-3 p-5 border-t">
          <button
            onClick={() => setShowPreview(false)}
            className="flex-1 py-2 rounded-lg border hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setShowPreview(false)
              handleApproval(currentRequest, true)
            }}
            className="flex-1 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow"
          >
            Approve & Share
          </button>
        </div>

      </div>
    </div>
  )
}

export default PreviewModal
