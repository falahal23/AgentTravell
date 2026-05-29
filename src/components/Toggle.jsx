import React from 'react'

export default function Toggle({ checked = false, onChange }) {
  return (
    <button
      onClick={() => onChange && onChange(!checked)}
      className={`w-12 h-7 flex items-center rounded-full p-1 transition-colors ${checked ? 'bg-blue-600' : 'bg-gray-300'}`}
      aria-pressed={checked}
    >
      <span className={`bg-white w-5 h-5 rounded-full shadow transform transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  )
}
