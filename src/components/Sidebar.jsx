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
  FiTarget
} from "react-icons/fi";

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

  return (
    <aside className="w-64 h-screen bg-white flex flex-col border-r border-gray-100 shadow-[4px_0_24px_rgba(0,0,0,0.02)] overflow-hidden font-sans">
      
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