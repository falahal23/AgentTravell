import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaPlane } from "react-icons/fa";
import { FiUsers, FiFileText, FiHeart, FiMessageSquare, FiCreditCard, FiBox, FiLogOut } from "react-icons/fi";
import { BsArrowRight } from "react-icons/bs";

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { path: "/", icon: FiFileText, label: "Dashboard" },
    { path: "/customers", icon: FiUsers, label: "Data Customers" },
    { path: "/data-kontak", icon: FiFileText, label: "Data Kontak" },
    { path: "/membership", icon: FiHeart, label: "Membership" },
    { path: "/riwayat-interaksi", icon: FiMessageSquare, label: "Interaksi" },
    { path: "/data-transaksi", icon: FiCreditCard, label: "Transaksi" },
    { path: "/aktivitas-user", icon: FiBox, label: "Aktivitas" },
    { path: "/marketing", icon: FiBox, label: "Marketing" },
  ];

  return (
    <aside className="w-64 h-screen bg-white flex flex-col border-r border-gray-200 overflow-hidden">
      
      {/* HEADER LOGO */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <FaPlane className="text-2xl text-blue-600 transform -rotate-45" />
          <span className="text-lg font-bold text-gray-900">GoTravell</span>
        </div>
      </div>

      {/* NAVIGATION MENU */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = 
              item.path === "/" 
                ? location.pathname === "/" 
                : location.pathname.startsWith(item.path);

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-blue-600 text-white font-semibold"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* BOTTOM SECTION */}
      <div className="px-4 py-4 border-t border-gray-100">
        
        {/* Promo Card */}
        {/* <div className="mb-5 bg-blue-50 rounded-xl p-4 relative overflow-hidden">
          <h4 className="text-blue-600 font-semibold text-sm mb-2">
            Fitur Baru! 🎉
          </h4>
          <p className="text-blue-600 text-xs leading-relaxed mb-3">
            Ekspor laporan otomatis dan hemat lebih banyak waktu.
          </p>
          
          <button className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors absolute bottom-3 left-4 text-white">
            <BsArrowRight className="text-lg" />
          </button>

          {/* Bar Chart Graphic */}
          {/* <div className="absolute right-3 bottom-2 flex items-end gap-1 h-8">
            <div className="w-1.5 h-4 bg-green-300 rounded-sm"></div>
            <div className="w-1.5 h-3 bg-pink-300 rounded-sm"></div>
            <div className="w-1.5 h-5 bg-blue-300 rounded-sm"></div>
          </div>
        </div> */} */

        {/* Logout Button */}
        <button 
          onClick={() => console.log("Logout")}
          className="flex items-center gap-3 w-full px-4 py-3 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
          title="Logout"
        >
          <FiLogOut className="w-5 h-5" />
          <span className="text-sm">Log Out</span>
        </button>
        
      </div>
    </aside>
  );
}