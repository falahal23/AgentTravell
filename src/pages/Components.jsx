// src/pages/Components.jsx
import React, { useState } from 'react'
import { FaSearch, FaFilter } from 'react-icons/fa'
import Container from '../components/Container'
import HeroSection from '../components/HeroSection'
import Alert from '../components/Alert'
import Card from '../components/Card'
import Badge from '../components/Badge'
import Avatar from '../components/Avatar'
import Button from '../components/Button'
import InputField from '../components/InputField'
import SelectField from '../components/SelectField'
import Table from '../components/Table'
import ProductSection from '../components/ProductSection'
import Footer from '../components/Footer'
import Modal from '../components/Modal'
import Spinner from '../components/Spinner'
import Toggle from '../components/Toggle'
import ProgressBar from '../components/ProgressBar'
import PageHeader from '../components/PageHeader'

const sampleProducts = [
  { id: 1, title: 'Paket A', description: 'Jalan-jalan 3 hari', price: 500000 },
  { id: 2, title: 'Paket B', description: 'Liburan keluarga', price: 750000 },
  { id: 3, title: 'Paket C', description: 'Wisata alam', price: 250000 },
]

const tableColumns = [
  { key: 'id', title: 'ID' },
  { key: 'name', title: 'Name' },
  { key: 'email', title: 'Email' },
]

const tableData = [
  { id: 1, name: 'Andi', email: 'andi@example.com' },
  { id: 2, name: 'Budi', email: 'budi@example.com' },
]

export default function Components() {
  const [isModalOpen, setModalOpen] = useState(false)
  const [toggleOn, setToggleOn] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  return (
    /* Solusi: min-h-screen & flex flex-col untuk memaksa footer ke paling bawah */
    <div className="min-h-screen bg-[#F3F5F7] font-sans antialiased text-slate-800 flex flex-col justify-between">
      
      {/* WRAPPER KONTEN UTAMA */}
      <div className="flex-1 p-4 md:p-10 w-full max-w-7xl mx-auto">
        
        {/* HERO SECTION - Menyelaraskan dengan tema gelap premium */}
        <div className="mb-10 rounded-[2.5rem] overflow-hidden bg-[#1C1A3A] text-white p-8 md:p-12 relative shadow-sm">
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#10B981]/10 rounded-full blur-[100px]"></div>
          <div className="relative z-10 max-w-2xl">
            <span className="text-[#10B981] font-bold text-xs uppercase tracking-widest bg-[#10B981]/10 px-3 py-1 rounded-full">
              UI Kit Showcase
            </span>
            <h1 className="text-4xl font-black mt-4 tracking-tight leading-tight">Component Library</h1>
            <p className="text-slate-400 text-sm mt-2 font-medium">
              Sistem dokumentasi visual komponen mandiri untuk Travelingo Dashboard.
            </p>
          </div>
        </div>

        <PageHeader title="Components" breadcrumb={["Dashboard", "Components"]}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-[300px]">
              <span className="absolute inset-y-0 left-4 flex items-center text-slate-400 text-sm">
                <FaSearch />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search components..."
                className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-sm text-slate-600 placeholder-slate-400 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              />
            </div>
            <button className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition active:scale-95">
              Search
            </button>
          </div>
        </PageHeader>

        {/* DASHBOARD SPLIT GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* MAIN ELEMENT AREA (LEFT - TAKES 2 COLS) */}
          <main className="lg:col-span-2 space-y-8">
            
            {/* BUTTONS & FORMS BLOCK */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm">
                <h3 className="text-base font-bold text-slate-900 tracking-tight mb-5 border-b border-slate-50 pb-2">Buttons & Badges</h3>
                <div className="flex flex-wrap gap-3 items-center">
                  <Button className="bg-[#10B981] hover:bg-emerald-600 text-white rounded-xl text-xs font-bold px-4 py-2">Primary</Button>
                  <Button variant="secondary" className="rounded-xl text-xs font-bold px-4 py-2">Secondary</Button>
                  <Button variant="danger" className="rounded-xl text-xs font-bold px-4 py-2">Danger</Button>
                  <Badge className="bg-[#10B981]/10 text-[#10B981] px-2.5 py-1 rounded-full font-bold text-[10px]">New Item</Badge>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm">
                <h3 className="text-base font-bold text-slate-900 tracking-tight mb-4 border-b border-slate-50 pb-2">Form Fields</h3>
                <div className="space-y-4">
                  <InputField label="Nama Destinasi" placeholder="Masukkan nama tempat..." className="text-xs" />
                  <SelectField label="Pilih Paket Tour" options={sampleProducts.map(p => ({ value: p.id, label: p.title }))} />
                </div>
              </div>
            </div>

            {/* DATA TABLE BLOCK */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm">
              <h3 className="text-base font-bold text-slate-900 tracking-tight mb-4 border-b border-slate-50 pb-2">Data Table</h3>
              <div className="overflow-hidden rounded-2xl border border-slate-50">
                <Table columns={tableColumns} data={tableData} />
              </div>
            </div>

            {/* FEEDBACK & INTERACTIVE CONTROL BLOCK */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm">
                <h3 className="text-base font-bold text-slate-900 tracking-tight mb-4 border-b border-slate-50 pb-2">Modals & Async</h3>
                <div className="flex items-center gap-4 py-2">
                  <button 
                    onClick={() => setModalOpen(true)}
                    className="px-5 py-2.5 bg-[#1C1A3A] text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition"
                  >
                    Open System Modal
                  </button>
                  <Spinner className="text-[#10B981]" />
                </div>
                <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Konfirmasi Perjalanan">
                  <p className="text-sm text-slate-500 leading-relaxed">Apakah Anda yakin ingin menyimpan rute wisata baru ini ke dalam dashboard utama?</p>
                </Modal>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm">
                <h3 className="text-base font-bold text-slate-900 tracking-tight mb-4 border-b border-slate-50 pb-2">Toggle Control</h3>
                <div className="flex items-center justify-between bg-[#F8FAFC] p-4 rounded-2xl border border-slate-100">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-800">Status Agen</span>
                    <span className="text-[11px] text-slate-400 font-medium">Ubah visibilitas publik</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Toggle checked={toggleOn} onChange={setToggleOn} />
                    <span className={`text-xs font-black ${toggleOn ? 'text-[#10B981]' : 'text-slate-400'}`}>
                      {toggleOn ? 'ACTIVE' : 'OFFLINE'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm">
              <h3 className="text-base font-bold text-slate-900 tracking-tight mb-4 border-b border-slate-50 pb-2">Progress Bar</h3>
              <div className="space-y-4">
                <p className="text-sm text-slate-500">Gunakan progress bar untuk menampilkan progress upload, loading, atau status perjalanan.</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
                    <span>Booking progress</span>
                    <span>55%</span>
                  </div>
                  <ProgressBar value={55} />
                </div>
              </div>
            </div>

            {/* COMPONENT PREVIEW BLOCK */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm">
              <h3 className="text-base font-bold text-slate-900 tracking-tight mb-4 border-b border-slate-50 pb-2">Product Section Preview</h3>
              <ProductSection products={sampleProducts} title="Pilihan Paket Terpopuler" />
            </div>
          </main>

          {/* SIDEBAR BLOCK (RIGHT - TAKES 1 COL) */}
          <aside className="space-y-8">
            
            {/* USER QUICK METRICS */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm">
              <h3 className="text-base font-bold text-slate-900 tracking-tight mb-4 border-b border-slate-50 pb-2">User Profile</h3>
              <div className="flex items-center gap-4 bg-[#F8FAFC] p-4 rounded-2xl border border-slate-100">
                <Avatar name="Falahal" className="w-12 h-12 rounded-full ring-2 ring-[#10B981]" />
                <div>
                  <div className="font-bold text-slate-800 text-sm">Falahal</div>
                  <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Super Admin</div>
                </div>
              </div>
            </div>

            {/* BADGES METRICS SYSTEM */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm">
              <h3 className="text-base font-bold text-slate-900 tracking-tight mb-4 border-b border-slate-50 pb-2">System Badges</h3>
              <div className="flex gap-2 flex-wrap">
                <Badge className="bg-slate-100 text-slate-600 px-2.5 py-1 text-[10px] font-bold rounded-lg">Default</Badge>
                <Badge className="bg-emerald-50 text-emerald-600 px-2.5 py-1 text-[10px] font-bold rounded-lg">Verified</Badge>
                <Badge className="bg-rose-50 text-rose-600 px-2.5 py-1 text-[10px] font-bold rounded-lg">Rejected</Badge>
              </div>
            </div>

            {/* SYSTEM ALERTS BLOCK */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm">
              <h3 className="text-base font-bold text-slate-900 tracking-tight mb-4 border-b border-slate-50 pb-2">System Alerts</h3>
              <div className="space-y-3">
                <Alert type="info">Pembayaran tiket sedang diproses.</Alert>
                <Alert type="success">Rute penerbangan berhasil diperbarui.</Alert>
              </div>
            </div>
          </aside>

        </div>
      </div>

      {/* FOOTER DI PALING BAWAH HALAMAN */}
      <div className="w-full mt-10">
        <Footer />
      </div>

    </div>
  )
}