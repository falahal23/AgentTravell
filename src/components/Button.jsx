import React from 'react'

export default function Button({ children, onClick, className = '', variant = 'primary', ...props }) {
  const base = 'inline-flex items-center justify-center px-4 py-2 rounded-md font-medium focus:outline-none'
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  }
  return (
    <button onClick={onClick} className={`${base} ${variants[variant] || variants.primary} ${className}`} {...props}>
      {children}
    </button>
  )
}
