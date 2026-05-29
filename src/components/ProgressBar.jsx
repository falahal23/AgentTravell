import React from 'react'

export default function ProgressBar({ value = 0, height = 8, className = '' }) {
  return (
    <div className={`w-full rounded-full bg-slate-200 overflow-hidden ${className}`} style={{ height }}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      ></div>
    </div>
  )
}
