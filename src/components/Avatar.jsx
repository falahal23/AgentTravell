import React from 'react'

function initials(name) {
  if (!name) return ''
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

export default function Avatar({ src, name, size = 40, className = '' }) {
  const style = { width: size, height: size }
  return (
    <div className={`inline-flex items-center justify-center rounded-full bg-gray-200 overflow-hidden ${className}`} style={style}>
      {src ? (
        // eslint-disable-next-line jsx-a11y/img-redundant-alt
        <img src={src} alt={name || 'avatar'} style={style} />
      ) : (
        <span className="text-sm font-semibold text-gray-700">{initials(name)}</span>
      )}
    </div>
  )
}
