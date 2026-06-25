import { useState, useEffect, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { supabase, getNextId } from "../../lib/supabase";
import { 
  FaPlane, FaHeadset, FaUser, FaCrown, FaCalendarAlt, 
  FaWallet, FaEdit, FaGift, FaSearch, FaChevronDown, 
  FaTicketAlt, FaStar, FaComments, FaPaperPlane, FaTimes, 
  FaMapMarkerAlt, FaClock, FaCheckCircle, FaUserCheck, FaArrowRight, FaQrcode
} from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function MemberDashboard() {
  const { member, membership, refreshData } = useOutletContext();
  const [bookings, setBookings] = useState([]);
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Search & Filter state for table
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Feedback form states
  const [feedbackType, setFeedbackType] = useState("Feedback");
  const [selectedBookingForFeedback, setSelectedBookingForFeedback] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const [totalPesanTerkirim, setTotalPesanTerkirim] = useState(0);
  const [submitFeedbackSuccess, setSubmitFeedbackSuccess] = useState(false);
  const [submitFeedbackLoading, setSubmitFeedbackLoading] = useState(false);

  // Edit Profile modal states
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [profileFormData, setProfileFormData] = useState({
    nama: "",
    phone: "",
    alamat: "",
    pembayaranFavorit: "QRIS"
  });
  const [editLoading, setEditLoading] = useState(false);

  // Booking Detail modal states
  const [selectedBookingDetails, setSelectedBookingDetails] = useState(null);

  // Recommend package checkout simulator
  const [selectedRecommendPackage, setSelectedRecommendPackage] = useState(null);
  const [checkoutPaymentMethod, setCheckoutPaymentMethod] = useState("QRIS");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
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

  // Load member transactions, interactions, and details
  const fetchAllMemberData = async () => {
    if (!member) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const [
        { data: trxData },
        { data: intData }
      ] = await Promise.all([
        supabase
          .from("transaksi")
          .select("*")
          .eq("id_customer", member.id_customer)
          .order("tanggal_transaksi", { ascending: false }),
        supabase
          .from("interaksi")
          .select("*")
          .eq("id_customer", member.id_customer)
      ]);

      setBookings(trxData || []);
      setInteractions(intData || []);
      setTotalPesanTerkirim(intData?.length || 0);

      // Set default selected booking for feedback dropdown
      if (trxData && trxData.length > 0) {
        setSelectedBookingForFeedback(trxData[0].paket_dibeli || trxData[0].produk_dibeli);
      } else {
        setSelectedBookingForFeedback("Umum / Non-Booking");
      }
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllMemberData();
  }, [member]);

  // Handle opening of Edit Profile modal
  const handleOpenEditProfile = () => {
    setProfileFormData({
      nama: member?.nama_lengkap || "",
      phone: member?.phone || "",
      alamat: member?.alamat || "Pekanbaru, Riau",
      pembayaranFavorit: localStorage.getItem(`fav_pay_${member?.id_customer}`) || "QRIS"
    });
    setEditProfileOpen(true);
  };

  // Submit profile updates to Supabase
  const handleEditProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setEditLoading(true);
      
      const { error: custErr } = await supabase
        .from("customers")
        .update({ nama_lengkap: profileFormData.nama })
        .eq("id_customer", member.id_customer);
      if (custErr) throw custErr;

      const { error: kontakErr } = await supabase
        .from("kontak")
        .update({ no_hp: profileFormData.phone, alamat: profileFormData.alamat })
        .eq("id_customer", member.id_customer);
      if (kontakErr) throw kontakErr;

      localStorage.setItem(`fav_pay_${member.id_customer}`, profileFormData.pembayaranFavorit);

      setEditProfileOpen(false);
      if (refreshData) await refreshData();
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Gagal memperbarui profil: " + err.message);
    } finally {
      setEditLoading(false);
    }
  };

  // Submit Feedback / Complaint to Supabase
  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    try {
      setSubmitFeedbackLoading(true);
      
      const nextInteraksiId = await getNextId("interaksi", "id_interaksi");
      
      const { error } = await supabase
        .from("interaksi")
        .insert([
          {
            id_interaksi: nextInteraksiId,
            id_customer: member.id_customer,
            chat_cs: `${feedbackType}: ${selectedBookingForFeedback}`,
            riwayat_komplain: feedbackText.trim(),
            feedback_review: feedbackType === "Feedback" ? "Sangat Puas" : "Netral",
            catatan_admin: ""
          }
        ]);

      if (error) throw error;

      setSubmitFeedbackSuccess(true);
      setFeedbackText("");
      setTotalPesanTerkirim(prev => prev + 1);

      // Reload interactions log
      const { data } = await supabase
        .from("interaksi")
        .select("*")
        .eq("id_customer", member.id_customer);
      setInteractions(data || []);

      setTimeout(() => setSubmitFeedbackSuccess(false), 3000);
    } catch (err) {
      console.error("Error submitting feedback:", err);
      alert("Gagal mengirim feedback: " + err.message);
    } finally {
      setSubmitFeedbackLoading(false);
    }
  };

  // Simulated recommendation package purchase
  const handleConfirmCheckout = async () => {
    if (!member || !selectedRecommendPackage) return;
    try {
      setCheckoutLoading(true);
      
      const nextTrxId = await getNextId("transaksi", "id_transaksi");
      const today = new Date().toISOString().split("T")[0];
      
      const membershipPrice = Math.round(selectedRecommendPackage.price * (1 - discountPct / 100));
      const promoPct = appliedPromo ? appliedPromo.discount : 0;
      const finalPrice = Math.round(membershipPrice * (1 - promoPct / 100));

      const { error } = await supabase
        .from("transaksi")
        .insert([
          {
            id_transaksi: nextTrxId,
            id_customer: member.id_customer,
            paket_dibeli: selectedRecommendPackage.title,
            total_transaksi: finalPrice,
            metode_pembayaran: checkoutPaymentMethod,
            tanggal_transaksi: today
          }
        ]);

      if (error) throw error;

      setCheckoutSuccess(true);
      
      // Update UI and database context
      setTimeout(async () => {
        await fetchAllMemberData();
        if (refreshData) await refreshData();
      }, 1000);
    } catch (err) {
      console.error(err);
      alert("Gagal melakukan pembelian paket: " + err.message);
    } finally {
      setCheckoutLoading(false);
    }
  };

  // Aggregate stats
  const totalSpend = useMemo(() => {
    return bookings.reduce((sum, t) => sum + (t.total_transaksi || 0), 0);
  }, [bookings]);

  const memberPoints = useMemo(() => {
    return Math.floor(totalSpend / 10000);
  }, [totalSpend]);

  const bookingCount = useMemo(() => {
    return bookings.length;
  }, [bookings]);

  const lunasCount = useMemo(() => {
    return bookings.filter(b => b.id_transaksi % 3 !== 0).length;
  }, [bookings]);

  const nextTrip = useMemo(() => {
    if (bookings.length === 0) return null;
    return bookings[0];
  }, [bookings]);

  const favoritePayment = useMemo(() => {
    return localStorage.getItem(`fav_pay_${member?.id_customer}`) || "QRIS";
  }, [member]);

  // Filtered bookings table
  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const title = (b.paket_dibeli || b.produk_dibeli || "").toLowerCase();
      const code = String(b.id_transaksi).toLowerCase();
      const query = searchQuery.toLowerCase();
      const matchesSearch = title.includes(query) || code.includes(query);

      const matchesStatus = statusFilter === "All" || 
        (statusFilter === "Dikonfirmasi" && b.id_transaksi % 3 === 2) || 
        (statusFilter === "Selesai" && b.id_transaksi % 3 === 1) ||
        (statusFilter === "Menunggu" && b.id_transaksi % 3 === 0);
      
      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchQuery, statusFilter]);

  const formatRupiah = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(value);
  };

  // Mock static promotion values based on tier
  const tierInfo = useMemo(() => {
    const tier = membership?.level_membership || "Bronze";
    const discStr = `${discountPct.toFixed(1).replace(/\.0$/, "")}%`;
    if (tier === "Platinum") {
      return { disc: discStr, name: "Platinum Member Premium Deal", color: "from-indigo-500 to-purple-600", text: "text-indigo-400" };
    } else if (tier === "Gold") {
      return { disc: discStr, name: "Gold Member Holiday Deal", color: "from-amber-500 to-yellow-600", text: "text-amber-400" };
    } else if (tier === "Silver") {
      return { disc: discStr, name: "Silver Member Holiday Deal", color: "from-slate-400 to-slate-500", text: "text-slate-300" };
    } else if (tier === "Bronze") {
      return { disc: discStr, name: "Bronze Member Holiday Deal", color: "from-amber-700 to-amber-900", text: "text-amber-650" };
    } else {
      return { disc: "0%", name: "Basic Member Deal", color: "from-slate-600 to-slate-700", text: "text-slate-400" };
    }
  }, [membership, discountPct]);

  const staticRecommendPackages = [
    {
      id: "rec1",
      title: "Paket Labuan Bajo Premium",
      location: "Labuan Bajo",
      rating: 4.9,
      duration: "4 Hari / 3 Malam",
      price: 6200000,
      badge: "Rekomendasi Gold",
      img: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: "rec2",
      title: "Paket Jogja Heritage",
      location: "Yogyakarta",
      rating: 4.7,
      duration: "3 Hari / 2 Malam",
      price: 2800000,
      badge: "Best Seller",
      img: "https://images.unsplash.com/photo-1584810359583-96fc3448beaa?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: "rec3",
      title: "Paket Bandung Family Trip",
      location: "Bandung",
      rating: 4.8,
      duration: "3 Hari / 2 Malam",
      price: 2400000,
      badge: "Family Choice",
      img: "https://images.unsplash.com/photo-1626125345510-4603468eedfb?q=80&w=600&auto=format&fit=crop"
    }
  ];

  // Logic to show progress to next membership tier
  const progressToNextTier = useMemo(() => {
    const tier = membership?.level_membership || "Bronze";
    if (tier === "Bronze") {
      const needed = 500;
      const pct = Math.min(100, Math.floor((memberPoints / needed) * 100));
      return { pct, next: "Silver", needed: needed - memberPoints };
    } else if (tier === "Silver") {
      const needed = 1000;
      const pct = Math.min(100, Math.floor((memberPoints / needed) * 100));
      return { pct, next: "Gold", needed: needed - memberPoints };
    } else if (tier === "Gold") {
      const needed = 2000;
      const pct = Math.min(100, Math.floor((memberPoints / needed) * 100));
      return { pct, next: "Platinum", needed: needed - memberPoints };
    } else {
      return { pct: 100, next: "Max Tier", needed: 0 };
    }
  }, [memberPoints, membership]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-8 h-8 rounded-full border-4 border-slate-800 border-t-indigo-500 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* GRID LAYOUT: LEFT SIDE (INFO, TIER, PROMOS) & RIGHT SIDE (HERO, TABLES, RECS, FEEDBACK) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: USER ID CARD, MEMBERSHIP AND PROMO PANEL (4 COLS) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* 1. PREMIUM USER IDENTITY CARD */}
          <div className="bg-[#0F1426]/90 border border-slate-800/80 rounded-[2rem] p-6 shadow-2xl relative overflow-hidden group hover:border-slate-700/85 transition-all duration-300">
            {/* Gloss shine */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-white/2 rounded-full blur-3xl pointer-events-none group-hover:bg-white/5 transition-all duration-500"></div>
            
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black tracking-wider rounded-full uppercase">
                  <FaUserCheck className="text-[10px]" /> Verified Account
                </span>
                <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase">ID: {member?.id_customer}</span>
              </div>
              
              <div className="flex items-center gap-4 pt-1">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-xl font-black border border-indigo-400/20 shadow-md">
                  {member?.nama_lengkap?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <h3 className="text-base font-black text-white leading-tight">{member?.nama_lengkap}</h3>
                  <p className="text-xs font-semibold text-slate-400 mt-1">{member?.email}</p>
                </div>
              </div>

              <div className="border-t border-slate-800/80 my-4 pt-4 space-y-3.5 text-xs font-semibold">
                <div className="flex justify-between items-start">
                  <span className="text-slate-400">No. HP</span>
                  <span className="text-slate-200 text-right">{member?.phone}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-slate-400">Alamat</span>
                  <span className="text-slate-200 text-right max-w-[180px] truncate-3-lines leading-snug">{member?.alamat}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-slate-400">Pembayaran Favorit</span>
                  <span className="text-indigo-400 flex items-center gap-1"><FaQrcode className="text-[10px]" /> {favoritePayment}</span>
                </div>
              </div>

              <button 
                onClick={handleOpenEditProfile}
                className="w-full bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white font-bold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2 border border-slate-700/50 cursor-pointer"
              >
                <FaEdit className="text-[10px]" />
                <span>Edit Profil Saya</span>
              </button>
            </div>
          </div>

          {/* 2. MEMBERSHIP TIER PROGRESS CARD */}
          <div className="bg-[#0F1426]/90 border border-slate-800/80 rounded-[2rem] p-6 shadow-2xl relative overflow-hidden group hover:border-slate-700/85 transition-all duration-300">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Level Keanggotaan</span>
                  <h4 className={`text-xl font-black mt-1 capitalize flex items-center gap-2 ${tierInfo.text}`}>
                    <FaCrown className="text-lg" />
                    <span>{membership?.level_membership}</span>
                  </h4>
                </div>
                <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500/10 to-amber-600/10 text-yellow-500 flex items-center justify-center border border-yellow-500/20 shadow-inner">
                  <FaCrown className="text-sm" />
                </span>
              </div>

              {/* Progress Bar to next tier */}
              <div className="space-y-2 pt-2 border-t border-slate-800/50">
                <div className="flex justify-between text-[11px] font-extrabold text-slate-400">
                  <span>Loyalty Points ({memberPoints} pts)</span>
                  <span>{progressToNextTier.needed > 0 ? `${progressToNextTier.pct}%` : "Maksimal"}</span>
                </div>
                <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500" 
                    style={{ width: `${progressToNextTier.pct}%` }}
                  ></div>
                </div>
                {progressToNextTier.needed > 0 ? (
                  <p className="text-[10px] font-semibold text-slate-400 leading-normal pt-1">
                    Butuh <span className="text-indigo-400 font-bold">{progressToNextTier.needed} poin</span> lagi untuk naik ke level <span className="text-pink-400 font-black uppercase">{progressToNextTier.next}</span>.
                  </p>
                ) : (
                  <p className="text-[10px] font-bold text-emerald-400 leading-normal pt-1">
                    Anda sudah berada pada kasta membership tertinggi!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* 3. ACTIVE MEMBER VOUCHERS */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <FaGift className="text-pink-500" /> Voucher Aktif Anda
            </h4>
            
            <div className="space-y-4">
              {/* Voucher 1: Tier base discount voucher */}
              <div className="bg-gradient-to-br from-indigo-950/60 to-purple-950/60 border border-indigo-500/20 rounded-2xl p-5 relative overflow-hidden shadow-md flex justify-between items-center group hover:border-indigo-500/40 transition-all">
                {/* Boarding ticket left cut notch */}
                <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-5 h-5 bg-[#070A13] border-r border-indigo-500/20 rounded-full"></div>
                {/* Boarding ticket right cut notch */}
                <div className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 bg-[#070A13] border-l border-indigo-500/20 rounded-full"></div>

                <div className="space-y-1 pl-3">
                  <span className="text-[9px] font-black bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 px-2 py-0.5 rounded-md uppercase">Voucher Level</span>
                  <h4 className="font-extrabold text-sm text-white pt-1">{tierInfo.name}</h4>
                  <p className="text-[10px] text-slate-400 font-semibold">Diskon member aktif s.d. 31 Juli 2026</p>
                </div>
                
                <div className="text-right pr-3 flex-shrink-0">
                  <div className="text-2xl font-black text-indigo-400">{tierInfo.disc}</div>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Diskon</span>
                </div>
              </div>

              {/* Voucher 2: General Escape Voucher */}
              <div className="bg-gradient-to-br from-slate-900/60 to-slate-900/40 border border-slate-800 rounded-2xl p-5 relative overflow-hidden shadow-md flex justify-between items-center group hover:border-slate-700 transition-all">
                {/* Boarding ticket left cut notch */}
                <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-5 h-5 bg-[#070A13] border-r border-slate-800 rounded-full"></div>
                {/* Boarding ticket right cut notch */}
                <div className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 bg-[#070A13] border-l border-slate-800 rounded-full"></div>

                <div className="space-y-1 pl-3">
                  <span className="text-[9px] font-black bg-slate-800 text-slate-400 border border-slate-700 px-2 py-0.5 rounded-md uppercase">Weekend Escape</span>
                  <h4 className="font-extrabold text-sm text-white pt-1">Weekend Getaway Promo</h4>
                  <p className="text-[10px] text-slate-400 font-semibold">Berlaku untuk liburan akhir pekan</p>
                </div>
                
                <div className="text-right pr-3 flex-shrink-0">
                  <div className="text-2xl font-black text-slate-400">10%</div>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Diskon</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: HERO BANNER, ACTIONS, BOOKING HISTORY, RECS, FEEDBACK (8 COLS) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* 1. HERO WELCOME & UPCOMING TRIP COUNTDOWN TICKET */}
          <div className="bg-gradient-to-br from-indigo-950/40 via-slate-900/40 to-purple-950/40 border border-slate-800 rounded-[2rem] p-6 shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-stretch gap-6">
            
            {/* Banner Left Details */}
            <div className="space-y-4 max-w-lg flex flex-col justify-center py-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 font-extrabold text-[10px] tracking-wider rounded-full uppercase w-max">
                🛡️ TravelGo Premium Portal
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight text-white">
                Halo, {member?.nama_lengkap}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                Cek status pemesanan, kumpulkan poin loyalitas, klaim voucher, dan hubungi tim representatif CS prioritas kami.
              </p>
              <div className="flex items-center gap-3 pt-1">
                <a 
                  href="#bookings"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all shadow-md shadow-indigo-500/20 border border-indigo-400/20 cursor-pointer"
                >
                  📅 Cek Riwayat Booking
                </a>
                <a 
                  href="#feedback"
                  className="bg-slate-850 hover:bg-slate-800 text-slate-200 font-black px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 border border-slate-700/80 transition-all cursor-pointer"
                >
                  💬 Kirim Masukan CS
                </a>
              </div>
            </div>

            {/* Banner Right: Next Trip Boarding Ticket */}
            <div className="flex-shrink-0 flex items-center justify-center">
              {nextTrip ? (
                <div className="bg-[#0C1020]/95 border border-indigo-500/20 p-5 rounded-2xl w-full md:w-72 space-y-4 shadow-xl relative overflow-hidden group hover:border-indigo-500/40 transition-all">
                  {/* Glowing background blob */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none"></div>
                  
                  <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-800/80 pb-2.5">
                    <span>Boarding Pass</span>
                    <span className="text-indigo-400">Active</span>
                  </div>

                  <div className="space-y-1.5 relative z-10">
                    <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-wider block">Trip Berikutnya</span>
                    <h4 className="font-extrabold text-sm text-white leading-snug truncate">{nextTrip.paket_dibeli}</h4>
                    
                    <div className="space-y-1.5 text-xs text-slate-300 font-medium pt-2">
                      <p className="flex items-center gap-2"><FaMapMarkerAlt className="text-[10px] text-slate-500" /> Bali, Indonesia</p>
                      <p className="flex items-center gap-2"><FaClock className="text-[10px] text-slate-500" /> {nextTrip.tanggal_transaksi}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-[9px] font-black text-slate-500 pt-2.5 border-t border-slate-800/80 uppercase tracking-wider">
                    <span>Gate Open</span>
                    <span className="text-slate-400">CRM Verified</span>
                  </div>
                </div>
              ) : (
                <div className="bg-[#0C1020]/90 border border-slate-800 p-5 rounded-2xl w-full md:w-72 text-center py-8 space-y-3 flex flex-col justify-center items-center shadow-xl">
                  <span className="w-10 h-10 rounded-full bg-slate-800/50 text-slate-500 flex items-center justify-center border border-slate-800">
                    <FaPlane className="transform -rotate-45 text-sm" />
                  </span>
                  <div>
                    <h4 className="font-extrabold text-xs text-white uppercase tracking-wider">Belum Ada Trip</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-1">Jelajahi destinasi pilihan kami</p>
                  </div>
                  <a href="#recommendations" className="text-[10px] text-indigo-400 font-extrabold hover:text-indigo-300 transition-colors flex items-center gap-1">
                    <span>Lihat Rekomendasi</span> <FaArrowRight className="text-[8px]" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* 2. THREE SUMMARY METRIC CARDS ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            {/* Card 1: Total Booking */}
            <Card className="bg-[#0F1426]/90 border border-slate-800/85 rounded-2xl shadow-md hover:border-slate-700/80 transition-all duration-300">
              <CardContent className="p-5 flex justify-between items-start">
                <div className="space-y-3.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Booking</span>
                  <h2 className="text-xl font-black text-white">{bookingCount}</h2>
                </div>
                <div className="flex flex-col items-end gap-3.5">
                  <span className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-xs border border-indigo-500/20 shadow-inner">
                    <FaCalendarAlt />
                  </span>
                  <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {bookingCount > 0 ? `${lunasCount} Lunas` : "0 Booking"}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: Total Transaksi */}
            <Card className="bg-[#0F1426]/90 border border-slate-800/85 rounded-2xl shadow-md hover:border-slate-700/80 transition-all duration-300">
              <CardContent className="p-5 flex justify-between items-start">
                <div className="space-y-3.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Transaksi</span>
                  <h2 className="text-lg sm:text-xl font-black text-white truncate w-32">{formatRupiah(totalSpend)}</h2>
                </div>
                <div className="flex flex-col items-end gap-3.5">
                  <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs border border-emerald-500/20 shadow-inner">
                    <FaWallet />
                  </span>
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Spend
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Card 3: Loyalty Points */}
            <Card className="bg-[#0F1426]/90 border border-slate-800/85 rounded-2xl shadow-md hover:border-slate-700/80 transition-all duration-300">
              <CardContent className="p-5 flex justify-between items-start">
                <div className="space-y-3.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Loyalty Points</span>
                  <h2 className="text-xl font-black text-white">{memberPoints}</h2>
                </div>
                <div className="flex flex-col items-end gap-3.5">
                  <span className="w-8 h-8 rounded-lg bg-pink-500/10 text-pink-400 flex items-center justify-center text-xs border border-pink-500/20 shadow-inner">
                    <FaGift />
                  </span>
                  <span className="bg-pink-500/10 text-pink-400 border border-pink-500/20 text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Points
                  </span>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* 3. BOOKING HISTORY TABLE */}
          <Card id="bookings" className="bg-[#0F1426]/90 border border-slate-800/80 rounded-[2rem] shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-800/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <FaTicketAlt className="text-indigo-400 text-xs" /> Riwayat Booking Saya
                </h3>
                <p className="text-[10px] font-medium text-slate-400 mt-1">Cek jadwal, harga, dan status konfirmasi transaksi secara real-time</p>
              </div>

              {/* Table Filters */}
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-[10px]" />
                  <input 
                    type="text" 
                    placeholder="Cari kode/paket..."
                    className="w-full sm:w-44 h-8 bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 text-[10px] text-white placeholder:text-slate-500 outline-none focus:border-indigo-500 transition-all font-semibold"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="relative">
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="h-8 bg-slate-900 border border-slate-800 rounded-lg px-3 text-[10px] text-white font-bold outline-none cursor-pointer focus:border-indigo-500 transition-all"
                  >
                    <option value="All" className="bg-[#0F1426] text-white">Semua Status</option>
                    <option value="Dikonfirmasi" className="bg-[#0F1426] text-white">Dikonfirmasi</option>
                    <option value="Selesai" className="bg-[#0F1426] text-white">Selesai</option>
                    <option value="Menunggu" className="bg-[#0F1426] text-white">Menunggu</option>
                  </select>
                </div>
              </div>
            </div>

              <CardContent className="p-0">
              <div className="overflow-x-auto w-full border border-slate-800/80 rounded-2xl bg-[#0F1426]/40">
                <table className="w-full text-slate-350 border-collapse text-left">
                  <thead className="bg-[#0C1020]/95 border-b border-slate-800/80">
                    <tr className="hover:bg-transparent">
                      <th className="py-4 px-6 text-[9px] font-black text-slate-400 uppercase tracking-widest text-left whitespace-nowrap">Kode</th>
                      <th className="py-4 px-6 text-[9px] font-black text-slate-400 uppercase tracking-widest text-left whitespace-nowrap">Paket</th>
                      <th className="py-4 px-6 text-[9px] font-black text-slate-400 uppercase tracking-widest text-left whitespace-nowrap">Tanggal</th>
                      <th className="py-4 px-6 text-[9px] font-black text-slate-400 uppercase tracking-widest text-left whitespace-nowrap">Harga</th>
                      <th className="py-4 px-6 text-[9px] font-black text-slate-400 uppercase tracking-widest text-left whitespace-nowrap">Booking</th>
                      <th className="py-4 px-6 text-[9px] font-black text-slate-400 uppercase tracking-widest text-left whitespace-nowrap">Pembayaran</th>
                      <th className="py-4 px-6 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center whitespace-nowrap">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50 bg-transparent">
                    {filteredBookings.length > 0 ? (
                      filteredBookings.map((b) => (
                        <tr key={b.id_transaksi} className="border-b border-slate-800/30 hover:bg-slate-900/30 transition-colors">
                          <td className="py-4 px-6 font-bold text-indigo-400 text-xs text-left whitespace-nowrap">
                            BKG-TRG-{String(b.id_transaksi).slice(-3)}
                          </td>
                          <td className="py-4 px-6 text-left whitespace-nowrap">
                            <div className="font-extrabold text-slate-100 text-xs">{b.paket_dibeli}</div>
                            <span className="text-[9px] font-semibold text-slate-500">Bali, Indonesia</span>
                          </td>
                          <td className="py-4 px-6 font-semibold text-slate-400 text-xs text-left whitespace-nowrap">{b.tanggal_transaksi}</td>
                          <td className="py-4 px-6 font-black text-slate-200 text-xs text-left whitespace-nowrap">{formatRupiah(b.total_transaksi)}</td>
                          <td className="py-4 px-6 text-left whitespace-nowrap">
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black border ${
                              b.id_transaksi % 3 === 0 
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                : b.id_transaksi % 3 === 1 
                                ? "bg-slate-500/10 text-slate-400 border-slate-550"
                                : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                            }`}>
                              {b.id_transaksi % 3 === 0 ? "Menunggu" : b.id_transaksi % 3 === 1 ? "Selesai" : "Dikonfirmasi"}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-left whitespace-nowrap">
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black border ${
                              b.id_transaksi % 3 === 0 
                                ? "bg-orange-500/10 text-orange-400 border-orange-500/20"
                                : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            }`}>
                              {b.id_transaksi % 3 === 0 ? "Menunggu Verifikasi" : "Lunas"}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-center whitespace-nowrap">
                            <button 
                              onClick={() => setSelectedBookingDetails(b)}
                              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 mx-auto cursor-pointer"
                            >
                              👁️ Detail
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className="hover:bg-transparent">
                        <td colSpan={7} className="text-center py-10 text-slate-500 font-bold text-xs bg-transparent">Belum ada riwayat booking.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* 4. PAKET REKOMENDASI (GRID CARDS) */}
          <div id="recommendations" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <FaStar className="text-yellow-500 text-[10px]" /> Rekomendasi Wisata
                </h3>
                <p className="text-[10px] font-semibold text-slate-500 mt-1">Paket destinasi terpilih yang dicocokkan khusus dengan minat Anda</p>
              </div>
              <button 
                onClick={() => alert("Daftar rekomendasi telah diperbarui!")}
                className="px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Refresh Rekomendasi
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {staticRecommendPackages.map(pkg => (
                <Card key={pkg.id} className="bg-[#0F1426]/90 border border-slate-800/80 rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:border-slate-700 transition-all duration-300">
                  {/* Cover Image with Badges */}
                  <div className="h-40 relative bg-slate-950 overflow-hidden">
                    <img 
                      src={pkg.img} 
                      alt={pkg.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <span className="absolute top-3 left-3 bg-[#0F1426]/90 backdrop-blur-md text-white text-[9px] font-black px-2.5 py-1 rounded-md shadow-sm border border-slate-850">
                      {pkg.id === "rec1" ? `Rekomendasi ${membership?.level_membership || "Bronze"}` : pkg.badge}
                    </span>
                    
                    <span className="absolute bottom-3 right-3 bg-slate-950/70 backdrop-blur-md text-white text-[9px] font-black px-2.5 py-1 rounded-md border border-white/5">
                      {pkg.duration}
                    </span>
                  </div>

                  <CardContent className="p-5 space-y-3.5">
                    <h4 className="font-extrabold text-sm text-white">{pkg.title}</h4>
                    
                    <div className="flex justify-between items-center text-xs font-bold text-slate-200">
                      <span className="flex items-center gap-1"><FaMapMarkerAlt className="text-[10px] text-slate-400" /> {pkg.location}</span>
                      <span className="flex items-center gap-1 text-yellow-400"><FaStar className="text-[10px]" /> {pkg.rating}</span>
                    </div>

                    <div className="pt-3 border-t border-slate-800/50 space-y-3">
                      <div className="flex justify-between items-baseline">
                        <span className="text-[10px] font-black text-white/60 uppercase tracking-wider">Harga Paket</span>
                        <div className="text-right">
                          {discountPct > 0 && (
                            <span className="line-through text-slate-550 text-xs mr-2">{formatRupiah(pkg.price)}</span>
                          )}
                          <span className="font-black text-white text-base">
                            {formatRupiah(Math.round(pkg.price * (1 - discountPct / 100)))}
                          </span>
                        </div>
                      </div>

                      <button 
                        onClick={() => {
                          setSelectedRecommendPackage(pkg);
                          setCheckoutSuccess(false);
                          setPromoCodeInput("");
                          setAppliedPromo(null);
                          setPromoError("");
                        }}
                        className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-black rounded-xl transition-all shadow-md shadow-indigo-500/15 cursor-pointer text-center flex items-center justify-center gap-1.5 border border-indigo-500/20"
                      >
                        <span>Pesan Paket</span>
                        <span>→</span>
                      </button>
                    </div>
                  </CardContent>

                </Card>
              ))}
            </div>
          </div>

          {/* 5. FEEDBACK COMPLAINT FORM & CHAT HISTORY */}
          <div id="feedback" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Form feedback (7 Columns) */}
            <Card className="lg:col-span-7 bg-[#0F1426]/90 border border-slate-800/80 rounded-[2rem] shadow-2xl p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <FaComments className="text-indigo-400 text-xs" /> Hubungi Layanan CS / Komplain
                  </h3>
                  <p className="text-[10px] font-medium text-slate-400 mt-1">Kami berkomitmen merespons pesan pelanggan prioritas kami dalam hitungan menit</p>
                </div>

                <form onSubmit={handleSubmitFeedback} className="space-y-4 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Topik Layanan</label>
                      <select 
                        value={feedbackType}
                        onChange={(e) => setFeedbackType(e.target.value)}
                        className="w-full h-10 bg-slate-900 border border-slate-800 rounded-xl px-3 text-xs font-bold text-white outline-none cursor-pointer focus:border-indigo-500 transition-all"
                      >
                        <option value="Feedback" className="bg-[#0F1426] text-white">Feedback Wisata</option>
                        <option value="Komplain" className="bg-[#0F1426] text-white">Komplain Kendala</option>
                        <option value="Pertanyaan" className="bg-[#0F1426] text-white">Pertanyaan Umum</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Produk / Booking Terkait</label>
                      <select 
                        value={selectedBookingForFeedback}
                        onChange={(e) => setSelectedBookingForFeedback(e.target.value)}
                        className="w-full h-10 bg-slate-900 border border-slate-800 rounded-xl px-3 text-xs font-bold text-white outline-none cursor-pointer focus:border-indigo-500 transition-all"
                      >
                        {bookings.map(b => (
                          <option key={b.id_transaksi} value={b.paket_dibeli} className="bg-[#0F1426] text-white">
                            BKG-TRG-{String(b.id_transaksi).slice(-3)} • {b.paket_dibeli}
                          </option>
                        ))}
                        <option value="Umum / Non-Booking" className="bg-[#0F1426] text-white">Layanan Umum (Non-Booking)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Isi Laporan / Pesan</label>
                    <textarea 
                      rows="4"
                      className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-3 text-xs font-medium text-white placeholder:text-slate-600 outline-none focus:border-indigo-500 transition-all"
                      placeholder="Jelaskan kebutuhan, kendala pembayaran, reschedule perjalanan, atau feedback kepuasan Anda di sini..."
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  {submitFeedbackSuccess && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3.5 rounded-xl text-xs font-bold flex items-center gap-2">
                      <FaCheckCircle className="shrink-0 text-sm" />
                      <span>Pesan Anda berhasil dikirim langsung ke CS prioritizer!</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-1">
                    <span className="text-[10px] font-bold text-slate-500">Pesan terkirim: {totalPesanTerkirim}</span>
                    <button 
                      disabled={submitFeedbackLoading}
                      type="submit"
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all shadow-md shadow-indigo-500/10 cursor-pointer"
                    >
                      {submitFeedbackLoading ? "Mengirim..." : <><FaPaperPlane className="text-[10px]" /> <span>Kirim Pesan CS</span></>}
                    </button>
                  </div>
                </form>
              </div>
            </Card>

            {/* Chat History simulation (5 Columns) */}
            <Card className="lg:col-span-5 bg-[#0F1426]/90 border border-slate-800/80 rounded-[2rem] shadow-2xl p-6 flex flex-col justify-between h-[360px] lg:h-auto">
              <div className="space-y-4 flex flex-col h-full justify-between">
                <div>
                  <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> Riwayat Obrolan CS
                  </h4>
                  <p className="text-[9.5px] font-bold text-slate-500 mt-1">Status: Customer Agent Terkoneksi</p>
                </div>

                {/* Simulated message log */}
                <div className="flex-1 my-3 overflow-y-auto space-y-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-850 max-h-[220px] scrollbar-thin scrollbar-thumb-slate-800">
                  <div className="flex flex-col gap-1 items-start text-[10px] text-slate-400">
                    <span className="bg-slate-800 text-slate-200 px-3 py-2 rounded-2xl rounded-tl-xs leading-relaxed max-w-[200px]">
                      Halo {member?.nama_lengkap}! Ada yang bisa dibantu untuk jadwal perjalanannya?
                    </span>
                    <span className="text-[8px] text-slate-600 font-bold ml-1">09:00 AM • Customer Support</span>
                  </div>

                  {interactions.map((int) => (
                    <div key={int.id_interaksi} className="flex flex-col gap-1 items-end text-[10px] text-right">
                      <span className="bg-indigo-600 text-white px-3 py-2 rounded-2xl rounded-tr-xs leading-relaxed max-w-[200px] text-left">
                        <span className="text-[8px] font-black text-indigo-250 block border-b border-indigo-500/40 pb-0.5 mb-1 uppercase tracking-wider">{int.chat_cs}</span>
                        {int.riwayat_komplain}
                      </span>
                      <span className="text-[8px] text-slate-600 font-bold mr-1">Terkirim • CRM Log #{int.id_interaksi}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex justify-between items-center text-[10px] font-bold text-slate-400">
                  <span className="truncate">Menunggu konfirmasi agent CS prioritizer...</span>
                  <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline shrink-0">Buka WA →</a>
                </div>
              </div>
            </Card>

          </div>

        </div>

      </div>

      {/* ================= MODAL DIALOGS ================= */}

      {/* 1. EDIT PROFILE DIALOG */}
      <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
        <DialogContent className="max-w-md bg-[#0F1426] rounded-3xl border border-slate-800 text-slate-100 shadow-2xl">
          <DialogHeader className="border-b border-slate-800/80 pb-3">
            <DialogTitle className="text-base font-extrabold text-white">Edit Profil Member CRM</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleEditProfileSubmit} className="space-y-4 pt-3 text-xs font-semibold text-slate-350">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Nama Lengkap</label>
              <input 
                type="text"
                className="w-full h-11 bg-slate-900 border border-slate-850 rounded-xl px-3 text-xs font-semibold text-white outline-none focus:border-indigo-500 transition-all"
                value={profileFormData.nama}
                onChange={(e) => setProfileFormData({...profileFormData, nama: e.target.value})}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider">No. Handphone</label>
              <input 
                type="text"
                className="w-full h-11 bg-slate-900 border border-slate-850 rounded-xl px-3 text-xs font-semibold text-white outline-none focus:border-indigo-500 transition-all"
                value={profileFormData.phone}
                onChange={(e) => setProfileFormData({...profileFormData, phone: e.target.value})}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Alamat Rumah</label>
              <input 
                type="text"
                className="w-full h-11 bg-slate-900 border border-slate-850 rounded-xl px-3 text-xs font-semibold text-white outline-none focus:border-indigo-500 transition-all"
                value={profileFormData.alamat}
                onChange={(e) => setProfileFormData({...profileFormData, alamat: e.target.value})}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Pembayaran Terfavorit</label>
              <select 
                value={profileFormData.pembayaranFavorit}
                onChange={(e) => setProfileFormData({...profileFormData, pembayaranFavorit: e.target.value})}
                className="w-full h-11 bg-slate-900 border border-slate-850 rounded-xl px-3 text-xs font-bold text-white outline-none cursor-pointer focus:border-indigo-500 transition-all"
              >
                <option value="QRIS" className="bg-[#0F1426] text-white">QRIS E-Wallet</option>
                <option value="Transfer Bank" className="bg-[#0F1426] text-white">Transfer Bank</option>
                <option value="Kartu Kredit" className="bg-[#0F1426] text-white">Kartu Kredit</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-800/80 mt-6">
              <button 
                type="button"
                onClick={() => setEditProfileOpen(false)}
                className="flex-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button 
                disabled={editLoading}
                type="submit"
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-2.5 rounded-xl text-xs transition-colors disabled:opacity-60 flex items-center justify-center cursor-pointer border border-indigo-500/20"
              >
                {editLoading ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* 2. BOOKING DETAILS DIALOG */}
      <Dialog open={selectedBookingDetails !== null} onOpenChange={() => setSelectedBookingDetails(null)}>
        <DialogContent className="max-w-md bg-[#0F1426] rounded-3xl border border-slate-800 text-slate-200 shadow-2xl">
          <DialogHeader className="border-b border-slate-800/80 pb-3">
            <DialogTitle className="text-base font-extrabold text-white">Detail Tiket Perjalanan</DialogTitle>
          </DialogHeader>

          {selectedBookingDetails && (
            <div className="space-y-5 pt-3 text-xs font-semibold text-slate-350">
              
              {/* Boarding Pass Styling */}
              <div className="bg-[#070A13] p-5 rounded-2xl space-y-3.5 border border-indigo-500/20 relative overflow-hidden">
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-4 h-4 bg-[#0F1426] rounded-full border-r border-indigo-500/25"></div>
                <div className="absolute top-1/2 right-0 -translate-y-1/2 w-4 h-4 bg-[#0F1426] rounded-full border-l border-indigo-500/25"></div>
                
                <div className="flex justify-between items-center text-[9px] font-black text-slate-500 uppercase tracking-widest">
                  <span>TravelGo Boarding Ticket</span>
                  <span className="text-indigo-400">Class A</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider">Identitas Booking</span>
                  <p className="font-extrabold text-sm text-white">BKG-TRG-{String(selectedBookingDetails.id_transaksi).slice(-3)}</p>
                </div>

                <div className="space-y-1 pt-1">
                  <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider">Nama Paket</span>
                  <p className="font-extrabold text-sm text-indigo-400">{selectedBookingDetails.paket_dibeli}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-1">
                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider">Destinasi</span>
                    <p className="font-extrabold text-xs text-white">Bali, Indonesia</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider">Jadwal Perjalanan</span>
                    <p className="font-extrabold text-xs text-white">{selectedBookingDetails.tanggal_transaksi}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 px-1.5 pt-1">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Harga Paket Wisata</span>
                  <span className="text-white font-black text-sm">{formatRupiah(selectedBookingDetails.total_transaksi)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Metode Pembayaran</span>
                  <span className="text-slate-300 font-black">{selectedBookingDetails.metode_pembayaran}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Status Pembayaran</span>
                  <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full font-black text-[10px]">Lunas (Terverifikasi)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Status Booking</span>
                  <span className={`px-2.5 py-0.5 rounded-full font-black text-[10px] border ${
                    selectedBookingDetails.id_transaksi % 3 === 0 
                      ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      : selectedBookingDetails.id_transaksi % 3 === 1 
                      ? "bg-slate-500/10 text-slate-405 border-slate-500/20"
                      : "bg-blue-500/10 text-blue-404 border-blue-500/20"
                  }`}>
                    {selectedBookingDetails.id_transaksi % 3 === 0 ? "Menunggu" : selectedBookingDetails.id_transaksi % 3 === 1 ? "Selesai" : "Dikonfirmasi"}
                  </span>
                </div>
              </div>

              <button 
                onClick={() => setSelectedBookingDetails(null)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs transition-colors mt-4 border border-slate-800 cursor-pointer"
              >
                Tutup Detail Tiket
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 3. SIMULATOR CHECKOUT RECOMMENDATION TOUR */}
      <Dialog open={selectedRecommendPackage !== null} onOpenChange={() => setSelectedRecommendPackage(null)}>
        <DialogContent className="max-w-md bg-[#0F1426] rounded-3xl border border-slate-800 text-slate-200 shadow-2xl">
          <DialogHeader className="border-b border-slate-800/80 pb-3">
            <DialogTitle className="text-base font-extrabold text-white">
              {checkoutSuccess ? "Pemesanan Berhasil!" : "Pesan Tiket Perjalanan"}
            </DialogTitle>
          </DialogHeader>

          {checkoutSuccess ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto text-2xl animate-bounce">
                <FaCheckCircle />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-white text-sm">Tiket Booking Tercatat di CRM</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed px-4 pt-1">
                  Transaksi Anda sebesar <b className="text-indigo-400">
                    {formatRupiah(
                      Math.round(
                        Math.round((selectedRecommendPackage?.price || 0) * (1 - discountPct / 100)) * 
                        (1 - (appliedPromo ? appliedPromo.discount : 0) / 100)
                      )
                    )}
                  </b> berhasil diverifikasi. Poin loyalitas dan statistik total transaksi Anda diperbarui secara real-time di sistem TravelGo.
                </p>
              </div>
              <button 
                onClick={() => setSelectedRecommendPackage(null)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Kembali ke Dashboard
              </button>
            </div>
          ) : (
            <div className="space-y-4 pt-3">
              <div className="bg-[#070A13] p-4 rounded-xl space-y-2 border border-slate-800/50">
                <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider">Destinasi Terpilih</span>
                <h4 className="font-black text-white text-sm">{selectedRecommendPackage?.title}</h4>
                <p className="text-[11px] text-slate-400 font-bold">{selectedRecommendPackage?.location} • {selectedRecommendPackage?.duration}</p>
                
                {/* Rincian Harga Dinamis */}
                <div className="flex flex-col gap-2 pt-2.5 border-t border-slate-850 mt-2 text-xs">
                  <div className="flex justify-between items-center text-slate-400">
                    <span>Harga Awal</span>
                    <span className="font-semibold text-slate-300">
                      {formatRupiah(selectedRecommendPackage?.price || 0)}
                    </span>
                  </div>
                  {discountPct > 0 && (
                    <div className="flex justify-between items-center text-rose-400">
                      <span>Diskon Tier ({membership?.level_membership})</span>
                      <span>-{discountPct.toFixed(1).replace(/\.0$/, "")}%</span>
                    </div>
                  )}
                  {appliedPromo && (
                    <div className="flex justify-between items-center text-emerald-400">
                      <span>Promo ({appliedPromo.code})</span>
                      <span>-{appliedPromo.discount}%</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2 border-t border-slate-800/60 mt-1">
                    <span className="font-bold text-white">Total Bayar</span>
                    <span className="font-black text-indigo-400 text-sm">
                      {formatRupiah(
                        Math.round(
                          Math.round((selectedRecommendPackage?.price || 0) * (1 - discountPct / 100)) * 
                          (1 - (appliedPromo ? appliedPromo.discount : 0) / 100)
                        )
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Kolom Kode Promo */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">Kode Promo</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Masukkan kode promo (e.g. GOLDFUN)"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value)}
                    className="flex-1 h-10 bg-slate-900 border border-slate-850 rounded-xl px-3 text-xs font-bold text-white uppercase outline-none focus:border-indigo-500 transition-all placeholder:text-slate-600"
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyPromo(promoCodeInput)}
                    className="px-4 h-10 bg-indigo-600 hover:bg-indigo-505 text-white rounded-xl text-xs font-black shadow-md transition-colors cursor-pointer border border-transparent"
                  >
                    Terapkan
                  </button>
                </div>
                {promoError && (
                  <p className="text-[10px] font-semibold text-rose-400 mt-1">{promoError}</p>
                )}
                {appliedPromo && (
                  <p className="text-[10px] font-bold text-emerald-400 mt-1">
                    ✓ Promo {appliedPromo.code} berhasil diterapkan! (Diskon {appliedPromo.discount}%)
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Metode Pembayaran</label>
                <select 
                  value={checkoutPaymentMethod}
                  onChange={(e) => setCheckoutPaymentMethod(e.target.value)}
                  className="w-full h-11 bg-slate-900 border border-slate-850 rounded-xl px-3 text-xs font-bold text-white outline-none cursor-pointer focus:border-indigo-500 transition-all"
                >
                  <option value="QRIS" className="bg-[#0F1426] text-white">QRIS E-Wallet</option>
                  <option value="Transfer Bank" className="bg-[#0F1426] text-white">Transfer Bank</option>
                  <option value="Kartu Kredit" className="bg-[#0F1426] text-white">Kartu Kredit</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-800/80 mt-6">
                <button 
                  onClick={() => setSelectedRecommendPackage(null)}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button 
                  disabled={checkoutLoading}
                  onClick={handleConfirmCheckout}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-2.5 rounded-xl text-xs transition-colors disabled:opacity-60 flex justify-center items-center cursor-pointer border border-indigo-500/20"
                >
                  {checkoutLoading ? "Memproses..." : "Konfirmasi & Bayar"}
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}
