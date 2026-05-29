import React from 'react'

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full p-6 z-10">
        {title && <h3 className="text-lg font-semibold mb-3">{title}</h3>}
        <div className="mb-4">{children}</div>
        <div className="flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-gray-100 rounded mr-2">Close</button>
        </div>
      </div>
    </div>
  )
}
