export default function TailwindCSS() {
  return (
    <div S>
      <h1 className="bg-blue-300 border m-4">Belajar Tailwind CSS 4</h1>
      <button className="bg-red-900 text-white px-4 py-2 mx-4 rounded shadow-lg">
        Click Me
      </button>
      <ProfessionalStyleGuide/>
    </div>
  )
}

function Spacing(props) {
  return (
    <div className="bg-white shadow-lg p-6 m-4 rounded-lg">
      <h2 className="text-lg font-semibold">{props.title}</h2>
      <p className="mt-2 text-gray-600">{props.content}</p>
    </div>
  )
}

function Typography(){
    return (
        <div className="p-5">
            <h1 className="text-3xl font-bold text-blue-600">Tailwind Typography</h1>
            <p className="bg-red-400 text-gray-600 text-lg mt-2 uppercase">Belajar Tailwind sangat menyenangkan dan cepat!</p>
        </div>
    )
}

function BorderRadius(){
    return (
        <button className="border-2 shadow-lg border-blue-500 text-blue-500 ml-4 px-4 py-2 rounded-lg"> Klik Saya </button>
    )
}

function BackgroundColors(){
    return(
        <div className="ml-4 bg-blue-500 text-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold">Tailwind Colors</h3>
            <p className="mt-2">Belajar Tailwind itu seru dan fleksibel!</p>
        </div>
    )
}

function FlexboxGrid(){
    return (
        <nav className="flex justify-between bg-gray-800 p-4 text-white">
            <h1 className="text-lg font-bold">MyWebsite</h1>
            <ul className="flex space-x-4">
                <li><a href="#">Home</a></li>
                <li><a href="#">About</a></li>
                <li><a href="#">Contact</a></li>
            </ul>
        </nav>
    )
}

function ShadowEffects(){
    return (
        <div className="bg-white shadow-lg p-6 rounded-lg hover:shadow-2xl transition">
            <h3 className="text-xl font-semibold">Hover me!</h3>
            <p className="text-gray-600 mt-2">Lihat efek bayangan saat hover.</p>
        </div>
    )
}

import React from 'react';

const SidebarLink = ({ label }) => (
  <button className="w-full text-left px-3 py-2 text-sm text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-md transition-all">
    {label}
  </button>
);

const Card = ({ title, children, description }) => (
  <section className="mb-12 scroll-mt-20" id={title.toLowerCase().replace(/\s+/g, '-')}>
    <div className="mb-5">
      <h2 className="text-xl font-semibold text-slate-900 tracking-tight">{title}</h2>
      {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
    </div>
    <div className="p-8 bg-white border border-slate-200 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.02),0_1px_2px_rgba(0,0,0,0.06)]">
      {children}
    </div>
  </section>
);

const ProfessionalStyleGuide = () => {
  return (
    <div className="min-h-screen bg-[#fafafa] flex">
      {/* Sidebar Nav - Ala Web Dokumentasi Profesional */}
      <aside className="hidden lg:block w-64 border-r border-slate-200 bg-white p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-indigo-200 shadow-lg">
            <span className="text-white font-bold text-xs">G</span>
          </div>
          <span className="font-bold text-slate-800 tracking-tight text-lg">Gemini UI</span>
        </div>
        <nav className="space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-3">Foundation</p>
          <SidebarLink label="Typography" />
          <SidebarLink label="Background Colors" />
          <SidebarLink label="Shadow Effects" />
          <SidebarLink label="Border Radius" />
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-6 mb-3 px-3">Components</p>
          <SidebarLink label="Buttons" />
          <SidebarLink label="Flexbox Grid" />
          <SidebarLink label="Spacing" />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto px-6 py-12 lg:px-12">
        <header className="mb-16 border-b border-slate-200 pb-8">
          <span className="text-indigo-600 font-semibold text-sm tracking-wide uppercase">Core Library</span>
          <h1 className="text-4xl font-extrabold text-slate-900 mt-2 tracking-tight">Design System System</h1>
          <p className="text-slate-500 mt-4 text-lg max-w-2xl leading-relaxed">
            Kumpulan komponen dasar yang dirancang untuk membangun antarmuka pengguna yang konsisten, aksesibel, dan modern.
          </p>
        </header>

        {/* 1. Button Section */}
        <Card title="Button" description="Elemen interaksi utama untuk memicu aksi spesifik.">
          <div className="flex flex-wrap gap-4 items-center">
            <button className="px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-all shadow-sm active:scale-95">
              Primary Button
            </button>
            <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition-all active:scale-95">
              Secondary
            </button>
            <button className="px-5 py-2.5 text-indigo-600 text-sm font-semibold hover:underline decoration-2 underline-offset-4 transition-all">
              Ghost Button
            </button>
          </div>
        </Card>

        {/* 2. Typography Section */}
        <Card title="Typography" description="Skala tipografi menggunakan font sistem yang dioptimalkan.">
          <div className="space-y-6">
            <div className="pb-6 border-b border-slate-100">
              <span className="text-[10px] font-mono text-slate-400 block mb-2">Display Large / 36px</span>
              <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Membangun Masa Depan Digital</h1>
            </div>
            <div className="pb-6 border-b border-slate-100">
              <span className="text-[10px] font-mono text-slate-400 block mb-2">Body Text / 16px</span>
              <p className="text-slate-600 leading-7">
                Kami percaya bahwa desain yang baik adalah desain yang tidak terlihat. Fokus pada fungsionalitas dan kemudahan penggunaan bagi setiap pengguna.
              </p>
            </div>
          </div>
        </Card>

        {/* 3. Background Colors */}
        <Card title="Background Colors" description="Palet warna primer dan netral untuk branding yang solid.">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['bg-indigo-600', 'bg-slate-900', 'bg-emerald-500', 'bg-rose-500'].map((color) => (
              <div key={color} className="space-y-2">
                <div className={`h-24 w-full ${color} rounded-xl shadow-inner`}></div>
                <span className="text-xs font-mono text-slate-500">{color.replace('bg-', '#')}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* 4. Shadow & Border Radius */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="p-8 bg-white border border-slate-200 rounded-2xl">
            <h3 className="text-lg font-semibold mb-6">Border Radius</h3>
            <div className="flex gap-4">
              <div className="w-16 h-16 bg-slate-100 rounded-lg border border-slate-200"></div>
              <div className="w-16 h-16 bg-slate-100 rounded-2xl border border-slate-200"></div>
              <div className="w-16 h-16 bg-slate-100 rounded-[2rem] border border-slate-200"></div>
            </div>
          </div>
          <div className="p-8 bg-white border border-slate-200 rounded-2xl">
            <h3 className="text-lg font-semibold mb-6">Shadow Effects</h3>
            <div className="flex gap-6 items-center">
              <div className="w-16 h-16 bg-white shadow-md rounded-xl"></div>
              <div className="w-16 h-16 bg-white shadow-xl rounded-xl"></div>
              <div className="w-16 h-16 bg-white shadow-[0_20px_50px_rgba(79,70,229,0.15)] rounded-xl"></div>
            </div>
          </div>
        </div>

        {/* 5. Flexbox Grid */}
        <Card title="Flexbox Grid" description="Sistem layout responsif untuk berbagai ukuran layar.">
          <div className="grid grid-cols-12 gap-4 h-32 text-[10px] font-mono font-bold uppercase tracking-tighter">
            <div className="col-span-8 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center justify-center text-indigo-400">8 Columns</div>
            <div className="col-span-4 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center text-slate-400">4 Columns</div>
            <div className="col-span-4 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center text-slate-400">4 Columns</div>
            <div className="col-span-8 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center justify-center text-indigo-400">8 Columns</div>
          </div>
        </Card>

        <footer className="mt-20 pt-8 border-t border-slate-200 text-center">
          <p className="text-sm text-slate-400">© 2024 Gemini Documentation System. Built with Tailwind CSS.</p>
        </footer>
      </main>
    </div>
  );
};

