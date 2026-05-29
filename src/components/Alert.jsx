import React from 'react'

export default function Alert({ type = 'info', children, className = '' }) {
  const variants = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    danger: 'bg-red-50 border-red-200 text-red-800',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  }
  return (
    <div className={`border-l-4 p-3 rounded ${variants[type] || variants.info} ${className}`}>
      {children}
    </div>
  )
}
