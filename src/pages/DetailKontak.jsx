import { useParams, useNavigate } from "react-router-dom";
import { FaUserShield, FaPhone, FaEnvelope, FaMapMarkedAlt, FaHome, FaArrowLeft, FaMapPin } from "react-icons/fa";
import dataKontak from "../Data/DataKontak.json";

export default function DetailKontak() {
  const { id } = useParams();
  const navigate = useNavigate();
  const detail = dataKontak.find((item) => item.id_customer === id);

  if (!detail) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 space-y-4">
        <div className="p-6 bg-white rounded-2xl shadow-xl text-center">
          <h2 className="text-3xl font-bold text-slate-400 mb-2">Data Kontak Tidak Ditemukan</h2>
          <p className="text-slate-500 mb-4">ID: {id}</p>
          <button 
            onClick={() => navigate(-1)} 
            className="inline-flex items-center gap-2 px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl"
          >
            <FaArrowLeft /> Kembali ke Data Kontak
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors font-bold text-sm"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Kembali ke Data Kontak
        </button>

        {/* MAIN CARD */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 overflow-hidden border border-slate-50">
          
          {/* BANNER */}
          <div className="h-40 bg-gradient-to-r from-blue-600 to-indigo-600 w-full relative">
            <div className="absolute -bottom-16 left-8 p-1 bg-white rounded-3xl shadow-lg">
              <div className="h-32 w-32 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-5xl font-black">
                {detail.id_customer?.charAt(detail.id_customer.length - 1)}
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div className="pt-20 p-8 space-y-8">
            
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-4xl font-black text-slate-800 tracking-tight">
                  Detail Informasi Customer
                </h1>
                <p className="text-slate-400 font-bold tracking-widest text-sm uppercase mt-2">
                  Customer ID: {detail.id_customer}
                </p>
              </div>
              <span className="px-6 py-3 rounded-2xl border border-blue-200 bg-blue-50 text-blue-600 font-black text-xs tracking-widest uppercase flex items-center gap-2 shadow-sm">
                <FaUserShield /> Kontak Aktif
              </span>
            </div>

            <hr className="border-slate-100" />

            {/* INFO GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Nomor HP */}
              <div className="space-y-2 p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-black uppercase tracking-wider">
                  <FaPhone className="w-4 h-4 text-blue-600" />
                  Nomor Telepon / HP
                </div>
                <p className="text-lg font-bold text-slate-800">{detail.nomor_hp}</p>
              </div>

              {/* Email */}
              <div className="space-y-2 p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-black uppercase tracking-wider">
                  <FaEnvelope className="w-4 h-4 text-blue-600" />
                  Alamat Email
                </div>
                <p className="text-lg font-bold text-slate-800 break-all">{detail.email}</p>
              </div>

              {/* Kota */}
              <div className="space-y-2 p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-black uppercase tracking-wider">
                  <FaMapPin className="w-4 h-4 text-blue-600" />
                  Kota
                </div>
                <p className="text-lg font-bold text-slate-800">{detail.kota}</p>
              </div>

              {/* Provinsi */}
              <div className="space-y-2 p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-black uppercase tracking-wider">
                  <FaMapMarkedAlt className="w-4 h-4 text-blue-600" />
                  Provinsi
                </div>
                <p className="text-lg font-bold text-slate-800">{detail.provinsi}</p>
              </div>

            </div>

            {/* ALAMAT LENGKAP */}
            <div className="space-y-3 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
              <div className="flex items-center gap-2 text-slate-600 text-xs font-black uppercase tracking-wider">
                <FaHome className="w-4 h-4 text-blue-600" />
                Alamat Lengkap
              </div>
              <p className="text-base font-semibold text-slate-800 leading-relaxed">
                {detail.alamat || "Alamat tidak diisi."}
              </p>
            </div>

            {/* STATS CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-center">
                <p className="text-xs text-blue-600 font-black uppercase tracking-wider">Status</p>
                <p className="text-xl font-bold text-blue-600 mt-1">Terdaftar</p>
              </div>
              <div className="p-4 bg-green-50 rounded-xl border border-green-100 text-center">
                <p className="text-xs text-green-600 font-black uppercase tracking-wider">Verifikasi</p>
                <p className="text-xl font-bold text-green-600 mt-1">Aktif</p>
              </div>
              <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 text-center">
                <p className="text-xs text-indigo-600 font-black uppercase tracking-wider">Tipe</p>
                <p className="text-xl font-bold text-indigo-600 mt-1">Customer</p>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* ACTION BUTTONS */}
            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => navigate(-1)}
                className="flex-1 px-8 py-3 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-900 transition-all shadow-lg active:scale-95"
              >
                ← Kembali
              </button>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(detail.email);
                  alert("Email berhasil disalin!");
                }}
                className="flex-1 px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg active:scale-95"
              >
                Salin Email
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}