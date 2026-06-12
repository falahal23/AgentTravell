import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaReceipt, FaUser, FaCreditCard, FaMoneyBill, FaBoxOpen, FaCalendarAlt, FaCheckCircle } from "react-icons/fa";
import transaksiData from "../Data/DataTransaksi.json";

export default function DetailTransaksi() {
  const { id } = useParams();
  const navigate = useNavigate();
  const detail = transaksiData.find((item) => item.id_transaksi === id);

  if (!detail) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 space-y-4">
        <div className="p-6 bg-white rounded-2xl shadow-xl text-center">
          <h2 className="text-3xl font-bold text-slate-400 mb-2">Transaksi Tidak Ditemukan</h2>
          <p className="text-slate-500 mb-4">ID: {id}</p>
          <button 
            onClick={() => navigate(-1)} 
            className="inline-flex items-center gap-2 px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl"
          >
            <FaArrowLeft /> Kembali ke Data Transaksi
          </button>
        </div>
      </div>
    );
  }

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(angka);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric", month: "long", year: "numeric",
    });
  };

  const getPaymentIcon = (metode) => {
    switch(metode) {
      case "Transfer Bank": return "🏦";
      case "Kartu Kredit": return "💳";
      case "QRIS": return "📱";
      case "COD": return "📦";
      default: return "💰";
    }
  };

  const getPaymentColor = (metode) => {
    switch(metode) {
      case "Transfer Bank": return "from-blue-600 to-blue-700";
      case "Kartu Kredit": return "from-purple-600 to-purple-700";
      case "QRIS": return "from-green-600 to-green-700";
      case "COD": return "from-orange-600 to-orange-700";
      default: return "from-slate-600 to-slate-700";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors font-bold text-sm"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Kembali ke Data Transaksi
        </button>

        {/* MAIN CARD */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 overflow-hidden border border-slate-50">
          
          {/* BANNER */}
          <div className={`h-40 bg-gradient-to-r ${getPaymentColor(detail.metode_pembayaran)} w-full relative`}>
            <div className="absolute -bottom-16 left-8 p-1 bg-white rounded-3xl shadow-lg">
              <div className="h-32 w-32 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-5xl">
                {getPaymentIcon(detail.metode_pembayaran)}
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div className="pt-20 p-8 space-y-8">
            
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-4xl font-black text-slate-800 tracking-tight">
                  Detail Transaksi
                </h1>
                <p className="text-slate-400 font-bold tracking-widest text-sm uppercase mt-2">
                  ID: {detail.id_transaksi}
                </p>
              </div>
              <span className="px-6 py-3 rounded-2xl border border-green-200 bg-green-50 text-green-600 font-black text-xs tracking-widest uppercase flex items-center gap-2 shadow-sm">
                <FaCheckCircle /> Selesai
              </span>
            </div>

            <hr className="border-slate-100" />

            {/* MAIN INFO GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* ID Transaksi */}
              <div className="space-y-2 p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-black uppercase tracking-wider">
                  <FaReceipt className="w-4 h-4 text-blue-600" />
                  ID Transaksi
                </div>
                <p className="text-lg font-bold text-slate-800">{detail.id_transaksi}</p>
              </div>

              {/* ID Customer */}
              <div className="space-y-2 p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-black uppercase tracking-wider">
                  <FaUser className="w-4 h-4 text-blue-600" />
                  ID Customer
                </div>
                <p className="text-lg font-bold text-slate-800 font-mono">{detail.id_customer}</p>
              </div>

              {/* Metode Pembayaran */}
              <div className="space-y-2 p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-black uppercase tracking-wider">
                  <FaCreditCard className="w-4 h-4 text-blue-600" />
                  Metode Pembayaran
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getPaymentIcon(detail.metode_pembayaran)}</span>
                  <p className="text-lg font-bold text-slate-800">{detail.metode_pembayaran}</p>
                </div>
              </div>

              {/* Tanggal Transaksi */}
              <div className="space-y-2 p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-black uppercase tracking-wider">
                  <FaCalendarAlt className="w-4 h-4 text-blue-600" />
                  Tanggal Transaksi
                </div>
                <p className="text-lg font-bold text-slate-800">{formatDate(detail.tanggal_transaksi)}</p>
              </div>

            </div>

            {/* PRODUCT & TOTAL SECTION */}
            <div className="space-y-4 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
              
              {/* Produk */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-600 text-xs font-black uppercase tracking-wider">
                  <FaBoxOpen className="w-4 h-4 text-blue-600" />
                  Produk Dibeli
                </div>
                <p className="text-base font-semibold text-slate-800">{detail.produk_dibeli}</p>
              </div>

              <hr className="border-blue-200" />

              {/* Total */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-600 text-xs font-black uppercase tracking-wider">
                  <FaMoneyBill className="w-4 h-4 text-blue-600" />
                  Total Transaksi
                </div>
                <p className="text-3xl font-black text-emerald-600 tracking-tight">
                  {formatRupiah(detail.total_transaksi)}
                </p>
              </div>

            </div>

            {/* TRANSACTION DETAILS CARD */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
              <h3 className="text-sm font-black text-slate-600 uppercase tracking-wider">Ringkasan Transaksi</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                  <span className="text-slate-600 font-medium">Subtotal</span>
                  <span className="text-slate-800 font-bold">{formatRupiah(detail.total_transaksi * 0.95)}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                  <span className="text-slate-600 font-medium">Pajak (5%)</span>
                  <span className="text-slate-800 font-bold">{formatRupiah(detail.total_transaksi * 0.05)}</span>
                </div>
                <div className="flex justify-between items-center pt-3 bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                  <span className="text-emerald-700 font-bold">Total Bayar</span>
                  <span className="text-2xl font-black text-emerald-600">{formatRupiah(detail.total_transaksi)}</span>
                </div>
              </div>
            </div>

            {/* STATUS BADGES */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-green-50 rounded-xl border border-green-100 text-center">
                <p className="text-xs text-green-600 font-black uppercase tracking-wider">Status</p>
                <p className="text-xl font-bold text-green-600 mt-1">✓ Selesai</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-center">
                <p className="text-xs text-blue-600 font-black uppercase tracking-wider">Verifikasi</p>
                <p className="text-xl font-bold text-blue-600 mt-1">✓ Terverifikasi</p>
              </div>
              <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 text-center">
                <p className="text-xs text-indigo-600 font-black uppercase tracking-wider">Pengiriman</p>
                <p className="text-xl font-bold text-indigo-600 mt-1">📦 Siap</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-xl border border-purple-100 text-center">
                <p className="text-xs text-purple-600 font-black uppercase tracking-wider">Invoice</p>
                <p className="text-xl font-bold text-purple-600 mt-1">📄 Aktif</p>
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
                  navigator.clipboard.writeText(detail.id_transaksi);
                  alert("ID Transaksi berhasil disalin!");
                }}
                className="flex-1 px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg active:scale-95"
              >
                Salin ID Transaksi
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
