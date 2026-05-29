import React from 'react'

export default function Card({ children, title, className = '' }) {
  return (
    <div className={`bg-white shadow-sm rounded-lg p-4 ${className}`}>
      {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
      <div>{children}</div>
    </div>
  )
}
