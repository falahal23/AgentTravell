import React from 'react'

export default function HeroSection({ title, subtitle, ctaText, ctaOnClick, className = '' }) {
  return (
    <section className={`py-12 bg-white ${className}`}>
      <div className="max-w-4xl mx-auto text-center px-4">
        {title && <h1 className="text-3xl font-extrabold text-gray-900 mb-3">{title}</h1>}
        {subtitle && <p className="text-gray-600 mb-6">{subtitle}</p>}
        {ctaText && (
          <button onClick={ctaOnClick} className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            {ctaText}
          </button>
        )}
      </div>
    </section>
  )
}
