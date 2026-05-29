import React from 'react'
import Card from './Card'

export default function ProductSection({ products = [], title = 'Products', className = '' }) {
  return (
    <section className={`${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <Card key={p.id} title={p.title ?? p.name} className="h-full">
              <p className="text-sm text-gray-600 mb-2">{p.description}</p>
              <div className="mt-2 flex items-center justify-between">
                <div className="text-lg font-bold">{p.price ? `Rp ${p.price}` : ''}</div>
                <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Pilih</button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
