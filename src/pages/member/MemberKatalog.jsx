import { useState, useEffect, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { supabase, getNextId } from "../../lib/supabase";
import { 
  FaGlobe, FaMapMarkerAlt, FaClock, FaTags, 
  FaCheckCircle, FaExclamationCircle 
} from "react-icons/fa";
import Wisatadata from "../../Data/Wisatadata.json";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function MemberKatalog() {
  const { member, membership, refreshData } = useOutletContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [baseDiscount, setBaseDiscount] = useState(() => {
    const saved = localStorage.getItem("member_base_discount");
    return saved ? parseFloat(saved) : 5;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem("member_base_discount");
      setBaseDiscount(saved ? parseFloat(saved) : 5);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const discountPct = useMemo(() => {
    const tier = membership?.level_membership || "Bronze";
    const name = tier.trim().toLowerCase();
    if (name === "platinum") return baseDiscount * 3;
    if (name === "gold") return baseDiscount * 2;
    if (name === "silver") return baseDiscount * 1.2;
    if (name === "bronze") return baseDiscount * 0.5;
    return 0;
  }, [baseDiscount, membership]);
  
  // Booking Modal Simulator States
  const [selectedTour, setSelectedTour] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("Transfer Bank");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState("");

  const handleApplyPromo = (codeStr) => {
    setPromoError("");
    setAppliedPromo(null);
    
    if (!codeStr.trim()) {
      setPromoError("Masukkan kode promo");
      return;
    }
    
    const saved = localStorage.getItem("travelgo_promos");
    const promosList = saved ? JSON.parse(saved) : [];
    const found = promosList.find(p => p.code.trim().toUpperCase() === codeStr.trim().toUpperCase());
    
    if (!found) {
      setPromoError("Kode promo tidak valid");
      return;
    }
    
    const userTier = membership?.level_membership || "Bronze";
    const promoMinTier = found.minTier || "Basic";
    
    const TIER_RANKS = {
      "basic": 0,
      "bronze": 1,
      "silver": 2,
      "gold": 3,
      "platinum": 4
    };
    
    const userRank = TIER_RANKS[userTier.trim().toLowerCase()] ?? 1;
    const promoMinRank = TIER_RANKS[promoMinTier.trim().toLowerCase()] ?? 0;
    
    if (userRank < promoMinRank) {
      setPromoError(`Kode promo ini hanya berlaku untuk member tingkat ${promoMinTier} ke atas!`);
      return;
    }
    
    setAppliedPromo(found);
    setPromoError("");
  };

  const categories = ["All", ...new Set(Wisatadata.map(item => item.category))];

  const filteredTours = Wisatadata.filter(tour => {
    const matchesSearch = tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tour.destination.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "All" || tour.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const formatRupiah = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(value);
  };

  const handleOpenBooking = (tour) => {
    if (tour.status === "Full") {
      alert("Maaf, kuota untuk paket wisata ini sudah penuh.");
      return;
    }
    setSelectedTour(tour);
    setBookingSuccess(false);
    setPromoCodeInput("");
    setAppliedPromo(null);
    setPromoError("");
  };

  const handleConfirmBooking = async () => {
    if (!member || !selectedTour) return;
    try {
      setBookingLoading(true);
      
      const nextTrxId = await getNextId("transaksi", "id_transaksi");
      const today = new Date().toISOString().split("T")[0];
      
      const membershipPrice = Math.round(selectedTour.price * (1 - discountPct / 100));
      const promoPct = appliedPromo ? appliedPromo.discount : 0;
      const finalPrice = Math.round(membershipPrice * (1 - promoPct / 100));

      // Insert new transaction into Supabase CRM
      const { error } = await supabase
        .from("transaksi")
        .insert([
          {
            id_transaksi: nextTrxId,
            id_customer: member.id_customer,
            paket_dibeli: selectedTour.title,
            total_transaksi: finalPrice,
            metode_pembayaran: paymentMethod,
            tanggal_transaksi: today
          }
        ]);

      if (error) throw error;

      setBookingSuccess(true);
      
      // Refresh context profile details (to update level badge, points, spend)
      if (refreshData) {
        setTimeout(async () => {
          await refreshData();
        }, 1000);
      }
    } catch (err) {
      console.error("Error booking tour:", err);
      alert("Gagal memproses booking wisata: " + err.message);
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <FaGlobe className="text-emerald-600" /> Katalog Paket Wisata
          </h2>
          <p className="text-xs text-slate-500 mt-1">Jelajahi berbagai paket tur terbaik dan langsung pesan destinasi impian Anda</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input 
          type="text" 
          placeholder="Cari destinasi atau paket wisata..."
          className="flex-1 bg-white border border-slate-100 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-emerald-500/50 shadow-xs"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <select 
          className="bg-white border border-slate-100 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 outline-none cursor-pointer shadow-xs"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>{cat === "All" ? "Semua Kategori" : cat}</option>
          ))}
        </select>
      </div>

      {/* Tours Grid list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTours.length > 0 ? (
          filteredTours.map((tour) => (
            <Card key={tour.id} className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-xs hover:border-emerald-100 transition-colors">
              <CardContent className="p-6 space-y-4">
                
                <div className="flex justify-between items-start">
                  <div>
                    <span className="bg-emerald-50 text-emerald-600 text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {tour.category}
                    </span>
                    <h3 className="text-base font-black text-slate-800 mt-2">{tour.title}</h3>
                    <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1 mt-1 uppercase">
                      <FaMapMarkerAlt /> {tour.destination}
                    </p>
                  </div>

                  <span className={`text-[9px] font-black px-2.5 py-1 rounded-md border tracking-wider uppercase ${
                    tour.status === "Available" 
                      ? "bg-green-50 text-green-600 border-green-100" 
                      : tour.status === "Full"
                        ? "bg-rose-50 text-rose-600 border-rose-100"
                        : "bg-blue-50 text-blue-600 border-blue-100"
                  }`}>
                    {tour.status}
                  </span>
                </div>

                <div className="flex gap-4 border-t border-b border-slate-50 py-3 text-xs font-semibold text-slate-500">
                  <span className="flex items-center gap-1.5"><FaClock className="text-slate-300" /> {tour.duration}</span>
                  <span className="flex items-center gap-1.5"><FaTags className="text-slate-300" /> Sisa Quota: {tour.quota - tour.booked}/{tour.quota}</span>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Harga Paket</span>
                    <div className="flex flex-col items-start">
                      {discountPct > 0 && (
                        <span className="line-through text-slate-400 text-xs">{formatRupiah(tour.price)}</span>
                      )}
                      <span className="text-lg font-black text-slate-800 leading-none">
                        {formatRupiah(Math.round(tour.price * (1 - discountPct / 100)))}
                      </span>
                    </div>
                  </div>

                  <button 
                    disabled={tour.status === "Full"}
                    onClick={() => handleOpenBooking(tour)}
                    className={`rounded-xl px-4 py-2.5 text-xs font-black transition-all cursor-pointer ${
                      tour.status === "Full" 
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                        : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/10"
                    }`}
                  >
                    Booking Sekarang
                  </button>
                </div>

              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-2 text-center py-12 text-slate-400 font-semibold text-xs">Tidak ada paket wisata ditemukan.</div>
        )}
      </div>

      {/* CHECKOUT BOOKING DIALOG SIMULATOR */}
      <Dialog open={selectedTour !== null} onOpenChange={() => setSelectedTour(null)}>
        <DialogContent className="max-w-md bg-white rounded-3xl border border-slate-100">
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold text-slate-800">
              {bookingSuccess ? "Booking Berhasil!" : "Konfirmasi Booking Wisata"}
            </DialogTitle>
          </DialogHeader>

          {bookingSuccess ? (
            <div className="text-center py-6 space-y-4">
              <FaCheckCircle className="text-emerald-500 text-5xl mx-auto animate-bounce" />
              <div>
                <h4 className="font-extrabold text-slate-800 text-sm">Pesanan Anda Telah Dibuat</h4>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed px-4">
                  Transaksi Anda sebesar <b>
                    {formatRupiah(
                      Math.round(
                        Math.round((selectedTour?.price || 0) * (1 - discountPct / 100)) * 
                        (1 - (appliedPromo ? appliedPromo.discount : 0) / 100)
                      )
                    )}
                  </b> sukses ditambahkan. Poin loyalitas Anda otomatis bertambah!
                </p>
              </div>
              
              <button 
                onClick={() => setSelectedTour(null)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs transition-colors"
              >
                Kembali ke Katalog
              </button>
            </div>
          ) : (
            <div className="space-y-4 pt-2">
              <div className="bg-slate-50 p-4 rounded-2xl space-y-2 border border-slate-100/50">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Detail Paket Wisata</span>
                <h4 className="font-extrabold text-slate-800 text-sm">{selectedTour?.title}</h4>
                <p className="text-xs text-slate-500 font-semibold">{selectedTour?.destination} • {selectedTour?.duration}</p>
                
                {/* Rincian Harga Dinamis */}
                <div className="flex flex-col gap-2 pt-2 border-t border-slate-200/50 mt-2 text-xs">
                  <div className="flex justify-between items-center text-slate-550">
                    <span>Harga Paket</span>
                    <span className="font-semibold text-slate-600">
                      {formatRupiah(selectedTour?.price || 0)}
                    </span>
                  </div>
                  {discountPct > 0 && (
                    <div className="flex justify-between items-center text-rose-600">
                      <span>Diskon Tier ({membership?.level_membership})</span>
                      <span>-{discountPct.toFixed(1).replace(/\.0$/, "")}%</span>
                    </div>
                  )}
                  {appliedPromo && (
                    <div className="flex justify-between items-center text-emerald-600">
                      <span>Promo ({appliedPromo.code})</span>
                      <span>-{appliedPromo.discount}%</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2 border-t border-slate-200 mt-1">
                    <span className="font-bold text-slate-800">Total Bayar</span>
                    <span className="font-black text-emerald-600 text-sm">
                      {formatRupiah(
                        Math.round(
                          Math.round((selectedTour?.price || 0) * (1 - discountPct / 100)) * 
                          (1 - (appliedPromo ? appliedPromo.discount : 0) / 100)
                        )
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Kolom Input Kode Promo */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Kode Promo</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Masukkan kode promo (e.g. GOLDFUN)"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value)}
                    className="flex-1 h-10 bg-white border border-slate-205 rounded-xl px-3 text-xs font-bold text-slate-650 uppercase outline-none focus:border-emerald-500/50 placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyPromo(promoCodeInput)}
                    className="px-4 h-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-md transition-colors cursor-pointer border border-transparent"
                  >
                    Terapkan
                  </button>
                </div>
                {promoError && (
                  <p className="text-[10px] font-semibold text-rose-600 mt-1">{promoError}</p>
                )}
                {appliedPromo && (
                  <p className="text-[10px] font-bold text-emerald-600 mt-1">
                    ✓ Promo {appliedPromo.code} berhasil diterapkan! (Diskon {appliedPromo.discount}%)
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Metode Pembayaran</label>
                <select 
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full h-11 bg-white border border-slate-200 rounded-xl px-3 text-xs font-bold text-slate-650 outline-none cursor-pointer focus:border-emerald-500/50"
                >
                  <option value="Transfer Bank">Transfer Bank (BCA / Mandiri)</option>
                  <option value="QRIS">QRIS E-Wallet</option>
                  <option value="Kartu Kredit">Kartu Kredit</option>
                </select>
              </div>

              <div className="bg-amber-50/50 border border-amber-100/70 p-3 rounded-2xl flex items-start gap-2 text-[10px] font-medium text-amber-700 leading-relaxed">
                <FaExclamationCircle className="mt-0.5 flex-shrink-0" />
                <span>Setelah konfirmasi, pesanan akan langsung didaftarkan ke sistem dan invoice pembayaran diterbitkan secara otomatis.</span>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setSelectedTour(null)}
                  className="flex-1 border border-slate-205 hover:bg-slate-50 text-slate-600 font-bold py-2.5 rounded-xl text-xs transition-colors"
                >
                  Batal
                </button>
                <button 
                  disabled={bookingLoading}
                  onClick={handleConfirmBooking}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition-colors disabled:opacity-60 flex items-center justify-center"
                >
                  {bookingLoading ? "Memproses..." : "Konfirmasi Booking"}
                </button>
              </div>
            </div>
          )}

        </DialogContent>
      </Dialog>

    </div>
  );
}
