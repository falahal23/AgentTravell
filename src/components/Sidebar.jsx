import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaPlane } from "react-icons/fa";
import { 
  FiUsers, 
  FiMessageSquare, 
  FiCreditCard, 
  FiLogOut,
  FiGrid,      
  FiBook,      
  FiActivity,  
  FiTarget,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiPercent,
  FiAward
} from "react-icons/fi";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function Sidebar() {
  const location = useLocation();

  // Memisahkan menu ke dalam beberapa kelompok (grup)
  const menuGroups = [
    {
      title: "Main Menu",
      items: [
        { path: "/dashboard", icon: FiGrid, label: "Dashboard" },
      ],
    },
    {
      title: "Manajemen Data",
      items: [
        { path: "/customers", icon: FiUsers, label: "Data Customers" },
        { path: "/data-kontak", icon: FiBook, label: "Data Kontak" },
        { path: "/riwayat-interaksi", icon: FiMessageSquare, label: "Interaksi" },
      ],
    },
    {
      title: "Operasional",
      items: [
        { path: "/data-transaksi", icon: FiCreditCard, label: "Transaksi" },
        { path: "/marketing", icon: FiTarget, label: "Marketing" },
        { path: "/aktivitas-user", icon: FiActivity, label: "Aktivitas" },
      ],
    },
  ];

  const [baseDiscount, setBaseDiscount] = React.useState(() => {
    const saved = localStorage.getItem("member_base_discount");
    return saved ? parseFloat(saved) : 5;
  });

  const handleDiscountChange = (e) => {
    const val = parseFloat(e.target.value) || 0;
    const clamped = Math.max(0, Math.min(100, val));
    setBaseDiscount(clamped);
    localStorage.setItem("member_base_discount", clamped.toString());
    window.dispatchEvent(new Event("storage"));
  };

  const [promos, setPromos] = React.useState(() => {
    const saved = localStorage.getItem("travelgo_promos");
    if (saved) return JSON.parse(saved);
    const defaults = [
      { code: "BRONZEDEAL", discount: 10, minTier: "Bronze" },
      { code: "GOLDFUN", discount: 20, minTier: "Gold" },
      { code: "PLATINUMVIP", discount: 30, minTier: "Platinum" }
    ];
    localStorage.setItem("travelgo_promos", JSON.stringify(defaults));
    return defaults;
  });

  const [promoModalOpen, setPromoModalOpen] = React.useState(false);
  const [newPromo, setNewPromo] = React.useState({ code: "", discount: 10, minTier: "Gold" });
  const [editingPromoCode, setEditingPromoCode] = React.useState(null);

  const handleSavePromo = () => {
    if (!newPromo.code) return;
    const codeUpper = newPromo.code.trim().toUpperCase();
    let updated;
    if (editingPromoCode) {
      updated = promos.map(p => p.code === editingPromoCode ? { ...p, code: codeUpper, discount: Number(newPromo.discount), minTier: newPromo.minTier } : p);
    } else {
      if (promos.some(p => p.code === codeUpper)) {
        alert("Kode promo sudah terdaftar!");
        return;
      }
      updated = [...promos, { code: codeUpper, discount: Number(newPromo.discount), minTier: newPromo.minTier }];
    }
    setPromos(updated);
    localStorage.setItem("travelgo_promos", JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
    setNewPromo({ code: "", discount: 10, minTier: "Gold" });
    setEditingPromoCode(null);
  };

  const handleEditPromo = (promo) => {
    setNewPromo({ code: promo.code, discount: promo.discount, minTier: promo.minTier });
    setEditingPromoCode(promo.code);
  };

  const handleDeletePromo = (code) => {
    const updated = promos.filter(p => p.code !== code);
    setPromos(updated);
    localStorage.setItem("travelgo_promos", JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <aside className="w-64 h-screen hidden lg:flex flex-col bg-white border-r border-gray-100 shadow-[4px_0_24px_rgba(0,0,0,0.02)] overflow-hidden font-sans">
      
      {/* HEADER LOGO */}
      <div className="px-6 py-6 flex-shrink-0">
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="p-2 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
            <FaPlane className="text-lg text-white transform -rotate-45" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-gray-900">
            GoTravell
          </span>
        </div>
      </div>

      {/* NAVIGATION MENU */}
      <nav className="flex-1 overflow-y-auto scrollbar-hide pt-2 pb-6">
        {menuGroups.map((group, groupIndex) => (
          <div key={groupIndex}>
            
            {/* Judul Grup */}
            <div className="px-6 mb-2 mt-4">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                {group.title}
              </span>
            </div>

            {/* List Menu per Grup */}
            <ul className="space-y-1 px-3">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = 
                  item.path === "/" 
                    ? location.pathname === "/" 
                    : location.pathname.startsWith(item.path);

                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 ${
                        isActive
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <Icon 
                        className={`w-5 h-5 transition-all duration-300 ${
                          isActive 
                            ? "text-blue-600 scale-110" 
                            : "text-gray-400 group-hover:text-gray-600 group-hover:scale-110"
                        }`} 
                      />
                      <span className={`text-sm ${isActive ? "font-semibold" : "font-medium"}`}>
                        {item.label}
                      </span>
                      
                      {/* Indikator aktif di sebelah kanan */}
                      {isActive && (
                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Garis Pemisah (Divider) - Muncul di semua grup kecuali grup terakhir */}
            {groupIndex !== menuGroups.length - 1 && (
              <div className="px-6 mt-5">
                <div className="h-px bg-gray-100"></div>
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* PENGATURAN DISKON MEMBER */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/30 flex-shrink-0">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
          Diskon Tier Member
        </span>
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <div className="relative flex items-center">
              <input
                type="number"
                min="0"
                max="100"
                value={baseDiscount}
                onChange={handleDiscountChange}
                className="w-16 px-2 py-1 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 font-bold text-center bg-white pr-4"
              />
              <span className="absolute right-1 text-[10px] font-bold text-gray-400 pointer-events-none">%</span>
            </div>
            <span className="text-[10px] text-gray-500 font-semibold">Diskon Dasar (Base)</span>
          </div>
          
          <div className="grid grid-cols-2 gap-1.5 text-[9px] font-bold text-gray-500">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
              <span>Plat: {(baseDiscount * 3).toFixed(1)}%</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              <span>Gold: {(baseDiscount * 2).toFixed(1)}%</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
              <span>Silv: {(baseDiscount * 1.2).toFixed(1)}%</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-700"></span>
              <span>Bron: {(baseDiscount * 0.5).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* PENGATURAN PROMO MEMBER */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/30 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Kelola Promo CRM
          </span>
          <button 
            onClick={() => setPromoModalOpen(true)}
            className="text-[10px] font-extrabold text-blue-600 hover:text-blue-700 cursor-pointer border border-transparent bg-transparent"
          >
            Kelola
          </button>
        </div>
        
        <div className="space-y-1.5 max-h-20 overflow-y-auto pr-1">
          {promos.length === 0 ? (
            <span className="text-[9px] text-gray-400 font-medium block">Tidak ada promo aktif</span>
          ) : (
            promos.slice(0, 3).map((p) => (
              <div key={p.code} className="flex justify-between items-center bg-white border border-gray-150 px-2 py-1 rounded-lg text-[9px] font-semibold text-gray-600">
                <span className="font-bold text-blue-600">{p.code}</span>
                <span className="text-[8px] font-black text-gray-500">{p.discount}% ({p.minTier})</span>
              </div>
            ))
          )}
          {promos.length > 3 && (
            <span className="text-[8px] text-gray-400 font-medium block text-right">+ {promos.length - 3} lainnya</span>
          )}
        </div>
      </div>

      {/* PROMO CRUD DIALOG MODAL */}
      <Dialog open={promoModalOpen} onOpenChange={setPromoModalOpen}>
        <DialogContent className="max-w-md bg-white rounded-3xl border border-gray-150 p-6 text-gray-800 font-sans shadow-2xl">
          <DialogHeader className="pb-3 border-b border-gray-100">
            <DialogTitle className="text-base font-extrabold text-gray-900 flex items-center gap-2">
              <FiPercent className="text-blue-600 text-lg" />
              Kelola Kode Promo CRM
            </DialogTitle>
          </DialogHeader>

          {/* Form */}
          <div className="space-y-4 pt-3">
            <div className="bg-slate-50 p-4 rounded-2xl border border-gray-150 space-y-3">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                {editingPromoCode ? "Edit Promo" : "Tambah Promo Baru"}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Kode Promo</label>
                  <input
                    type="text"
                    placeholder="E.g. GOLDFUN"
                    value={newPromo.code}
                    onChange={(e) => setNewPromo({ ...newPromo, code: e.target.value })}
                    className="w-full h-9 px-3 text-xs border border-gray-200 rounded-xl font-bold uppercase focus:outline-none focus:border-blue-500 bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Diskon (%)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={newPromo.discount}
                    onChange={(e) => setNewPromo({ ...newPromo, discount: parseInt(e.target.value) || 0 })}
                    className="w-full h-9 px-3 text-xs border border-gray-200 rounded-xl font-bold focus:outline-none focus:border-blue-500 bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Minimal Peringkat Member</label>
                <select
                  value={newPromo.minTier}
                  onChange={(e) => setNewPromo({ ...newPromo, minTier: e.target.value })}
                  className="w-full h-9 px-3 text-xs border border-gray-200 rounded-xl font-bold text-gray-600 focus:outline-none focus:border-blue-500 bg-white outline-none cursor-pointer"
                >
                  <option value="Basic">Basic (Semua Member)</option>
                  <option value="Bronze">Bronze ke atas</option>
                  <option value="Silver">Silver ke atas</option>
                  <option value="Gold">Gold ke atas</option>
                  <option value="Platinum">Platinum saja</option>
                </select>
              </div>

              <div className="flex gap-2.5 pt-1">
                <button
                  onClick={handleSavePromo}
                  className="flex-1 h-9 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-md cursor-pointer transition-colors border border-transparent"
                >
                  {editingPromoCode ? "Simpan Perubahan" : "Tambah Promo"}
                </button>
                {editingPromoCode && (
                  <button
                    onClick={() => {
                      setEditingPromoCode(null);
                      setNewPromo({ code: "", discount: 10, minTier: "Gold" });
                    }}
                    className="px-3 h-9 border border-gray-200 hover:bg-gray-100 rounded-xl text-xs font-bold text-gray-500 cursor-pointer"
                  >
                    Batal
                  </button>
                )}
              </div>
            </div>

            {/* List */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Daftar Promo Aktif</h4>
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {promos.length === 0 ? (
                  <p className="text-center py-6 text-xs text-gray-400 font-medium">Belum ada promo aktif</p>
                ) : (
                  promos.map((p) => (
                    <div key={p.code} className="flex justify-between items-center p-3 bg-slate-50 border border-gray-150 rounded-2xl">
                      <div className="text-left space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-xs text-gray-900">{p.code}</span>
                          <span className="bg-blue-50 text-blue-600 border border-blue-100 text-[8px] font-black px-1.5 py-0.5 rounded">-{p.discount}%</span>
                        </div>
                        <p className="text-[9px] text-gray-400 font-semibold flex items-center gap-1">
                          <FiAward className="text-blue-500 text-[10px]" /> Syarat Tier: <span className="font-bold text-blue-600">{p.minTier}</span>
                        </p>
                      </div>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleEditPromo(p)}
                          className="p-1.5 hover:bg-gray-200 text-gray-500 hover:text-gray-900 rounded-lg transition-colors cursor-pointer border border-transparent bg-transparent"
                          title="Edit"
                        >
                          <FiEdit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeletePromo(p.code)}
                          className="p-1.5 hover:bg-red-50 text-red-500 hover:text-red-600 rounded-lg transition-colors cursor-pointer border border-transparent bg-transparent"
                          title="Hapus"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* BOTTOM SECTION (LOGOUT) */}
      <div className="p-4 border-t border-gray-100 flex-shrink-0 bg-gray-50/50">
        <button 
          onClick={() => console.log("Logout")}
          className="group flex items-center gap-3 w-full px-3 py-2.5 text-gray-500 hover:bg-white hover:text-red-600 hover:shadow-sm rounded-xl transition-all duration-300 border border-transparent hover:border-gray-200"
          title="Logout"
        >
          <div className="p-1.5 rounded-lg text-gray-400 group-hover:text-red-500 transition-colors">
            <FiLogOut className="w-5 h-5" />
          </div>
          <span className="text-sm font-medium">Log Out</span>
        </button>
      </div>
      
    </aside>
  );
}