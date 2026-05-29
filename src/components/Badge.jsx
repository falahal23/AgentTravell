import React from 'react'

export default function Badge({ children, variant = 'primary', className = '' }) {
  const variants = {
    primary: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    danger: 'bg-red-100 text-red-800',
    gray: 'bg-gray-100 text-gray-800',
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${variants[variant] || variants.primary} ${className}`}>
      {children}
    </span>
  )
}
