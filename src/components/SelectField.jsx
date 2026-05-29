import React from 'react'

export default function SelectField({ label, name, value, onChange, options = [], error = '', className = '' }) {
  return (
    <div className={`mb-4 ${className}`}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`mt-1 block w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 ${error ? 'border-red-400' : 'border-gray-300'}`}
      >
        {options.map((opt) => (
          <option key={opt.value ?? opt} value={opt.value ?? opt}>
            {opt.label ?? opt}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}
