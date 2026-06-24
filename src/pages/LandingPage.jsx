import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaPlane,
  FaBell,
  FaClock,
  FaUser,
  FaCalendarAlt,
  FaCheck,
  FaTimes,
  FaChevronRight,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaInfoCircle,
  FaUserCheck,
  FaUsers,
  FaChartLine,
  FaArrowRight,
  FaExclamationCircle,
  FaMobileAlt,
  FaPaperPlane,
  FaAward
} from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState("customer");
  const [showToast, setShowToast] = useState(false);
  const [toastContent, setToastContent] = useState({});
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Reminder states
  const [reminderActivity, setReminderActivity] = useState("Follow-up Budi Santoso");
  const [reminderTime, setReminderTime] = useState("30");
  const [reminderList, setReminderList] = useState([
    { id: 1, activity: "Follow-up Pelanggan", time: "30 menit sebelumnya", status: "Terjadwal" },
    { id: 2, activity: "Konfirmasi Pembayaran", time: "1 jam sebelumnya", status: "Terjadwal" },
    { id: 3, activity: "Pengingat Keberangkatan", time: "10 menit sebelumnya", status: "Selesai" }
  ]);
  const [isReminderRunning, setIsReminderRunning] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Notifications List
  const notifications = [
    { id: 1, title: "Booking Baru Masuk", desc: "Booking Paket Wisata Bali oleh Budi Santoso berhasil dibuat.", time: "1 menit yang lalu", type: "booking" },
    { id: 2, title: "Pembayaran Berhasil", desc: "Pembayaran Rp 4.500.000 terverifikasi untuk invoice #TRG-902.", time: "5 menit yang lalu", type: "payment" },
    { id: 3, title: "Follow-up Dibutuhkan", desc: "Customer Andy Wijaya membutuhkan follow-up membership.", time: "20 menit yang lalu", type: "follow-up" }
  ];

  // Simulated Booking Details
  const simulatedBookingData = {
    id: "BKG-TRG-091",
    customer: "Budi Santoso",
    package: "Paket Bali Beach Escape (4 Hari / 3 Malam)",
    date: "12 Juni - 16 Juni 2026",
    price: "Rp 4.500.000",
    paymentStatus: "Lunas",
    bookingStatus: "Dikonfirmasi"
  };

  // Trigger simulated local notification
  const triggerNotification = (title, desc, data = simulatedBookingData) => {
    setToastContent({ title, desc, data });
    setShowToast(true);
    // Play alert sound if wanted, or just trigger UI change
    setTimeout(() => {
      // Auto dismiss after 7 seconds if not clicked
    }, 7000);
  };

  // Handle clicking the notification toast
  const handleToastClick = () => {
    setShowToast(false);
    setSelectedBooking(toastContent.data);
    setShowDetailModal(true);
  };

  // Reminder creator simulator
  const handleSetReminder = (e) => {
    e.preventDefault();
    if (!reminderActivity.trim()) return;
    
    setIsReminderRunning(true);
    setCountdown(3); // 3 seconds simulator countdown
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && isReminderRunning) {
      setIsReminderRunning(false);
      
      // Fire notification
      triggerNotification(
        "⏰ Pengingat Aktivitas",
        `Waktunya melakukan "${reminderActivity}" (Sistem menjadwalkan notifikasi sesuai pilihan waktu Anda)`,
        {
          id: "REM-092",
          customer: "Budi Santoso",
          package: reminderActivity,
          date: "Hari Ini - 15.00 WIB",
          price: "-",
          paymentStatus: "Menunggu",
          bookingStatus: "Perlu Tindakan"
        }
      );

      // Add to list
      setReminderList(prev => [
        {
          id: Date.now(),
          activity: reminderActivity,
          time: `${reminderTime} menit sebelumnya`,
          status: "Selesai"
        },
        ...prev
      ]);
    }
  }, [countdown, isReminderRunning]);

  return (
    <div className="bg-slate-50 text-slate-900 font-sans min-h-screen relative overflow-x-hidden selection:bg-blue-600 selection:text-white">
      
      {/* LOCAL NOTIFICATION TOAST SIMULATOR */}
      {showToast && (
        <div 
          onClick={handleToastClick}
          className="fixed bottom-6 right-6 z-[9999] max-w-sm w-full bg-slate-900 text-white rounded-2xl shadow-2xl border border-blue-500/30 p-4 cursor-pointer hover:scale-105 transition-all duration-300 animate-in slide-in-from-bottom-5 duration-300"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 border border-blue-400/20 shadow-md shadow-blue-500/10">
              <FaBell className="animate-swing" />
            </div>
            <div className="flex-1 space-y-1.5 pr-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] bg-blue-500/25 text-blue-300 px-2 py-0.5 rounded-md font-black tracking-widest uppercase">Notifikasi Lokal</span>
                <span className="text-[8px] text-slate-500 font-extrabold">SEKARANG</span>
              </div>
              <h4 className="font-extrabold text-xs text-white">{toastContent.title}</h4>
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed">{toastContent.desc}</p>
              <div className="text-[9px] text-blue-400 font-bold flex items-center gap-1 pt-1.5">
                <span>Klik untuk ke Detail Booking</span> <FaArrowRight className="text-[7px]" />
              </div>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowToast(false);
              }}
              className="text-slate-500 hover:text-white transition-colors"
            >
              <FaTimes />
            </button>
          </div>
        </div>
      )}

      {/* DETAIL BOOKING MODAL FROM NOTIFICATION CLICK */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-md bg-white rounded-3xl border border-slate-100 shadow-2xl p-6 text-slate-800">
          <DialogHeader className="border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
            <DialogTitle className="text-base font-extrabold text-slate-800">Detail Booking Wisata (CRM Terverifikasi)</DialogTitle>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-4 pt-3 text-xs font-semibold text-slate-600">
              <div className="bg-slate-50 p-4 rounded-xl space-y-2 border border-slate-100/50">
                <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Nomor Booking</span>
                <p className="font-extrabold text-slate-900">{selectedBooking.id}</p>
                
                <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider pt-1.5">Nama Pelanggan</span>
                <p className="font-extrabold text-slate-900">{selectedBooking.customer}</p>

                <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider pt-1.5">Paket Wisata</span>
                <p className="font-extrabold text-blue-600">{selectedBooking.package}</p>
              </div>

              <div className="space-y-2 px-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Jadwal Perjalanan:</span>
                  <span className="text-slate-800">{selectedBooking.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Nilai Transaksi:</span>
                  <span className="text-slate-800 font-black">{selectedBooking.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status Pembayaran:</span>
                  <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full font-black text-[9px]">{selectedBooking.paymentStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status Booking:</span>
                  <span className="px-2.5 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-full font-black text-[9px]">{selectedBooking.bookingStatus}</span>
                </div>
              </div>

              <button 
                onClick={() => setShowDetailModal(false)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs transition-colors mt-2 cursor-pointer"
              >
                Tutup Detail Booking
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <a href="#home" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center shadow-md shadow-blue-500/20">
              <FaPlane className="text-sm transform -rotate-45" />
            </div>
            <span className="text-lg font-black text-slate-800 tracking-tight">TravelGo<span className="text-cyan-500">.</span></span>
          </a>

          <div className="hidden lg:flex gap-7 font-bold text-xs text-slate-600">
            <a href="#home" className="hover:text-blue-600 transition-colors">Home</a>
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#problem-solution" className="hover:text-blue-600 transition-colors">Customers</a>
            <a href="#booking-section" className="hover:text-blue-600 transition-colors">Booking</a>
            <a href="#notifications-flow" className="hover:text-blue-600 transition-colors">Notifications</a>
            <a href="#reminder-flow" className="hover:text-blue-600 transition-colors">Reminder</a>
            <a href="#contact" className="hover:text-blue-600 transition-colors">Contact</a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-blue-600 transition-all border border-slate-200 hover:border-slate-350 rounded-xl"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 transition-all"
            >
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header id="home" className="relative pt-32 pb-20 md:pt-40 md:pb-24 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Background glow decoration */}
        <div className="absolute top-10 right-10 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none z-0"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none z-0"></div>

        {/* Hero Text Content (5 Columns) */}
        <div className="lg:col-span-5 space-y-6 relative z-10 text-left">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-blue-600 font-extrabold text-[10px] tracking-wider uppercase">
            🚀 Travel CRM B2B Platform
          </span>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight">
            Kelola Pelanggan dan Booking Wisata Lebih Mudah dengan <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">TravelGo CRM</span>
          </h1>
          
          <p className="text-sm md:text-base text-slate-500 leading-relaxed font-medium">
            Sistem CRM modern untuk travel agent yang membantu mengelola pelanggan, transaksi, booking wisata, serta pengingat aktivitas penting secara otomatis.
          </p>

          <div className="flex items-center gap-4 pt-2">
            <Link
              to="/register"
              className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-black text-xs rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
            >
              <span>Get Started Free</span> <FaChevronRight className="text-[9px]" />
            </Link>
            
            <a 
              href="#features"
              className="px-6 py-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-black text-xs rounded-xl transition-all shadow-xs"
            >
              View Demo
            </a>
          </div>

          <div className="pt-6 border-t border-slate-200/60 flex items-center gap-8">
            <div>
              <h4 className="text-2xl font-black text-slate-800 leading-none">800+</h4>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-1">Data Seeded</span>
            </div>
            <div>
              <h4 className="text-2xl font-black text-slate-800 leading-none">99.9%</h4>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-1">On-Time Alert</span>
            </div>
            <div>
              <h4 className="text-2xl font-black text-slate-800 leading-none">24/7</h4>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-1">Active Sync</span>
            </div>
          </div>
        </div>

        {/* Hero Interactive CRM Mockup Dashboard (7 Columns) */}
        <div className="lg:col-span-7 relative z-10">
          
          <div className="bg-slate-900 text-slate-100 rounded-[2.5rem] border border-slate-800 shadow-2xl p-5 md:p-6 space-y-5 relative group hover:border-blue-500/20 transition-all duration-300">
            {/* Glowing tab header overlay */}
            <div className="absolute top-0 right-10 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>

            {/* Simulated UI Window Bar */}
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/70 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500/70 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500/70 inline-block"></span>
                <span className="text-[10px] text-slate-500 font-bold ml-2">TravelGo CRM - Admin Panel</span>
              </div>
              <span className="text-[9px] bg-slate-800 text-slate-400 px-3 py-1 rounded-md font-bold">V1.0 Live</span>
            </div>

            {/* Tab Swappers */}
            <div className="flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-wider border-b border-slate-800/60 pb-3">
              {[
                { id: "customer", label: "Data Customer", icon: <FaUsers /> },
                { id: "booking", label: "Booking Wisata", icon: <FaPlane /> },
                { id: "membership", label: "Membership", icon: <FaAward /> },
                { id: "notifications", label: "Notifikasi", icon: <FaBell /> },
                { id: "reminder", label: "Reminder", icon: <FaClock /> }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                    activeTab === t.id 
                      ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/10" 
                      : "bg-slate-800/40 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {t.icon}
                  <span>{t.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="h-64 overflow-y-auto pr-1">
              
              {/* Tab 1: Customer Data */}
              {activeTab === "customer" && (
                <div className="space-y-3.5 text-xs text-left animate-in fade-in duration-200">
                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    <span>Nama Lengkap / Username</span>
                    <span>Level Member</span>
                  </div>

                  <div className="divide-y divide-slate-800/60 space-y-2">
                    {[
                      { name: "Cayadi Latupono", user: "@cayadi_1", level: "Silver", color: "bg-slate-500/20 text-slate-300 border-slate-700" },
                      { name: "Jelita Suryatmi", user: "@jelita_suryatmi_2", level: "Platinum", color: "bg-purple-500/20 text-purple-300 border-purple-800/30" },
                      { name: "Cakrawangsa Nashiruddin", user: "@cakrawangsa_3", level: "Gold", color: "bg-amber-500/20 text-amber-300 border-amber-800/30" }
                    ].map((c, i) => (
                      <div key={i} className="flex justify-between items-center pt-2">
                        <div>
                          <p className="font-extrabold text-white">{c.name}</p>
                          <span className="text-[9px] text-slate-500 font-medium">{c.user}</span>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-wider ${c.color}`}>
                          {c.level}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 2: Booking Wisata */}
              {activeTab === "booking" && (
                <div className="space-y-3.5 text-xs text-left animate-in fade-in duration-200">
                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    <span>Destinasi / Tanggal</span>
                    <span>Status Transaksi</span>
                  </div>

                  <div className="divide-y divide-slate-800/60 space-y-2">
                    {[
                      { dest: "Paket Bali Beach Escape", date: "12 Juni - 16 Juni 2026", price: "Rp 4.500.000", status: "Lunas", color: "bg-emerald-500/20 text-emerald-400 border-emerald-800/30" },
                      { dest: "Paket Bromo Sunrise Trip", date: "20 Juli - 22 Juli 2026", price: "Rp 2.250.000", status: "Menunggu", color: "bg-amber-500/20 text-amber-400 border-amber-800/30" },
                      { dest: "Paket Lombok Eksotis", date: "08 Mei - 12 Mei 2026", price: "Rp 2.000.000", status: "Lunas", color: "bg-emerald-500/20 text-emerald-400 border-emerald-800/30" }
                    ].map((b, i) => (
                      <div key={i} className="flex justify-between items-center pt-2">
                        <div>
                          <p className="font-extrabold text-white">{b.dest}</p>
                          <span className="text-[9px] text-slate-500 font-medium">{b.date} • {b.price}</span>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-wider ${b.color}`}>
                          {b.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Membership Level Statistics */}
              {activeTab === "membership" && (
                <div className="space-y-4 text-xs text-left animate-in fade-in duration-200">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-3 text-center">
                      <span className="text-[9px] font-black text-slate-500 block uppercase">Gold Members</span>
                      <h4 className="text-xl font-black text-amber-400 mt-1">128</h4>
                    </div>
                    <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-3 text-center">
                      <span className="text-[9px] font-black text-slate-500 block uppercase">Silver Members</span>
                      <h4 className="text-xl font-black text-slate-300 mt-1">340</h4>
                    </div>
                    <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-3 text-center">
                      <span className="text-[9px] font-black text-slate-500 block uppercase">Bronze Members</span>
                      <h4 className="text-xl font-black text-amber-700 mt-1">332</h4>
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-2 border-t border-slate-800/60">
                    <h5 className="font-extrabold text-[10px] text-slate-400 uppercase tracking-widest">Upgrade Rules</h5>
                    <div className="flex items-center justify-between text-[11px] text-slate-300 bg-slate-800/20 px-3 py-2 rounded-xl border border-slate-800/40">
                      <span>Bronze → Silver</span>
                      <span className="text-indigo-400 font-bold">500 Points</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-300 bg-slate-800/20 px-3 py-2 rounded-xl border border-slate-800/40">
                      <span>Silver → Gold</span>
                      <span className="text-indigo-400 font-bold">1000 Points</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Notifikasi */}
              {activeTab === "notifications" && (
                <div className="space-y-3.5 text-xs text-left animate-in fade-in duration-200">
                  <div className="space-y-3">
                    {notifications.map((n) => (
                      <div key={n.id} className="flex gap-3 bg-slate-800/30 border border-slate-800/80 rounded-xl p-3 items-start hover:border-blue-500/20 transition-all">
                        <span className="w-7 h-7 rounded-full bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400 shrink-0 text-[10px] mt-0.5">
                          <FaBell />
                        </span>
                        <div>
                          <div className="flex justify-between items-center w-full">
                            <h5 className="font-extrabold text-white text-[11px]">{n.title}</h5>
                            <span className="text-[8px] text-slate-500 font-extrabold">{n.time}</span>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5 font-medium leading-relaxed">{n.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 5: Reminder List */}
              {activeTab === "reminder" && (
                <div className="space-y-3.5 text-xs text-left animate-in fade-in duration-200">
                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">
                    <span>Aktivitas Pengingat</span>
                    <span>Waktu & Status</span>
                  </div>

                  <div className="space-y-2">
                    {reminderList.map(r => (
                      <div key={r.id} className="flex justify-between items-center bg-slate-800/20 border border-slate-800/60 p-2.5 rounded-xl">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                          <span className="font-extrabold text-white">{r.activity}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] text-slate-400 font-bold">{r.time}</span>
                          <span className={`px-2 py-0.5 text-[8px] font-black rounded uppercase ${
                            r.status === "Terjadwal" ? "bg-blue-500/25 text-blue-300" : "bg-emerald-500/25 text-emerald-300"
                          }`}>{r.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

      </header>

      {/* SECTION 1 - PROBLEM & SOLUTION */}
      <section id="problem-solution" className="py-20 bg-white border-t border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs font-black text-blue-600 uppercase tracking-widest">Problem & Solution</h2>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              Mengapa Sistem Pengingat & Notifikasi CRM Sangat Krusial?
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-medium">
              Kelalaian kecil dalam bisnis travel agent dapat merugikan reputasi. Kami mendengarkan kendala operasional Anda dan membangun solusinya.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Problems Column (5 cols) */}
            <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3">
                Kendala Operasional Klasik Agen Travel:
              </h4>
              
              <div className="space-y-4">
                {[
                  { text: "Follow-up pelanggan sering terlupakan karena tumpukan chat manual." },
                  { text: "Jadwal keberangkatan wisata terlewat tanpa koordinasi admin." },
                  { text: "Pembayaran tagihan pelanggan terlambat diproses." },
                  { text: "Sulit memonitor aktivitas pelanggan loyal secara real-time." }
                ].map((p, i) => (
                  <div key={i} className="flex items-start gap-3 bg-rose-500/5 border border-rose-500/10 p-4 rounded-2xl">
                    <span className="w-5 h-5 rounded-full bg-rose-500/15 text-rose-500 flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                      <FaTimes />
                    </span>
                    <p className="text-xs text-slate-700 font-bold leading-normal">{p.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Solution Column (7 cols) */}
            <div className="lg:col-span-7 bg-gradient-to-br from-blue-600 to-cyan-500 text-white rounded-[2.5rem] p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-xl shadow-blue-500/10">
              {/* Glowing gradient element */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="space-y-5 relative z-10 text-left">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 backdrop-blur-md text-white text-[9px] font-black tracking-widest rounded-full uppercase border border-white/10">
                  ✔ Solusi Terpadu
                </span>
                <h3 className="text-xl sm:text-2xl font-black leading-snug">
                  TravelGo CRM Menyediakan Sistem Reminder & Local Notification Otomatis
                </h3>
                <p className="text-xs sm:text-sm text-blue-50 leading-relaxed font-medium">
                  Sistem kami beroperasi secara background untuk memindai jadwal keberangkatan, memonitor status transaksi, dan mengirimkan peringatan instan secara lokal ke komputer/HP admin, mencegah semua kelalaian operasional sebelum terjadi.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-white/20 pt-6 mt-6 relative z-10">
                <div className="space-y-1.5">
                  <h4 className="text-lg font-black leading-none">Instant Alert</h4>
                  <p className="text-[10px] text-blue-100 font-medium">Notifikasi dikirim otomatis tepat waktu.</p>
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-lg font-black leading-none">1 Click Redirect</h4>
                  <p className="text-[10px] text-blue-100 font-medium">Klik alert untuk membuka detail transaksi.</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 2 - FITUR UTAMA */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-6 space-y-16">
        
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-xs font-black text-blue-600 uppercase tracking-widest">Fitur Utama</h2>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
            Peralatan Canggih Khusus Untuk Bisnis Travel Anda
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-medium">
            Dikembangkan secara cermat agar sejalan dengan kebutuhan workflow travel agent skala UMKM hingga korporasi besar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* FEATURE 1: LOCAL NOTIFICATION ENGINE (INTERACTIVE SIMULATOR) */}
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-xl relative overflow-hidden flex flex-col justify-between group hover:border-blue-500/20 transition-all duration-300">
            <div className="space-y-4">
              <span className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 text-sm font-extrabold shadow-sm group-hover:scale-110 transition-transform">
                <FaBell />
              </span>
              <h3 className="text-lg font-black text-slate-800">1. Local Notification Engine</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Sistem mengirim notifikasi otomatis kepada admin travel di perangkat lokal secara langsung begitu terdapat event yang membutuhkan perhatian.
              </p>

              <div className="border-t border-slate-50 pt-4 space-y-2">
                <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Daftar Pemicu Notifikasi:</h5>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-600">
                  <p className="flex items-center gap-1.5"><FaCheck className="text-emerald-500 text-[8px]" /> Booking baru masuk</p>
                  <p className="flex items-center gap-1.5"><FaCheck className="text-emerald-500 text-[8px]" /> Pembayaran berhasil</p>
                  <p className="flex items-center gap-1.5"><FaCheck className="text-emerald-500 text-[8px]" /> Pembayaran belum lunas</p>
                  <p className="flex items-center gap-1.5"><FaCheck className="text-emerald-500 text-[8px]" /> Keberangkatan besok</p>
                  <p className="flex items-center gap-1.5"><FaCheck className="text-emerald-500 text-[8px]" /> Membership berakhir</p>
                  <p className="flex items-center gap-1.5"><FaCheck className="text-emerald-500 text-[8px]" /> Perlu follow-up</p>
                </div>
              </div>
            </div>

            {/* LIVE SIMULATOR ACTION */}
            <div className="border-t border-slate-50 pt-5 mt-6 space-y-3">
              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold bg-slate-50 p-2.5 rounded-xl border border-slate-100/50">
                <FaInfoCircle className="text-blue-500 shrink-0" />
                <p>Klik tombol simulasi di bawah untuk menguji respons notifikasi!</p>
              </div>

              <button 
                onClick={() => triggerNotification(
                  "🆕 Booking Baru Masuk",
                  "Booking Paket Wisata Bali oleh Budi Santoso berhasil dibuat. Klik notifikasi ini untuk mengonfirmasi data!"
                )}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md shadow-blue-500/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <FaBell className="text-[10px]" />
                <span>Simulasikan Notifikasi Lokal</span>
              </button>
            </div>
          </div>

          {/* FEATURE 2: REMINDER MANAGEMENT (INTERACTIVE BUILDER) */}
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-xl relative overflow-hidden flex flex-col justify-between group hover:border-blue-500/20 transition-all duration-300">
            <div className="space-y-4">
              <span className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center border border-cyan-100 text-sm font-extrabold shadow-sm group-hover:scale-110 transition-transform">
                <FaClock />
              </span>
              <h3 className="text-lg font-black text-slate-800">2. Reminder Management</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Buat dan jadwalkan pengingat aktivitas spesifik untuk dikirimkan ke tim admin. Mengantisipasi kelalaian penagihan invoice atau rapat klien.
              </p>

              <div className="border-t border-slate-50 pt-4 space-y-2">
                <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Pengingat Dapat Digunakan Untuk:</h5>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-600">
                  <p className="flex items-center gap-1.5"><FaClock className="text-cyan-500 text-[8px]" /> Follow-up pelanggan</p>
                  <p className="flex items-center gap-1.5"><FaClock className="text-cyan-500 text-[8px]" /> Konfirmasi bayar</p>
                  <p className="flex items-center gap-1.5"><FaClock className="text-cyan-500 text-[8px]" /> Meeting dengan customer</p>
                  <p className="flex items-center gap-1.5"><FaClock className="text-cyan-500 text-[8px]" /> Promo membership</p>
                </div>
              </div>
            </div>

            {/* INTERACTIVE REMINDER FORM BUILDER */}
            <div className="border-t border-slate-50 pt-5 mt-6 space-y-3.5">
              <form onSubmit={handleSetReminder} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9.5px] font-black text-slate-400 uppercase block">Aktivitas</label>
                    <input 
                      type="text" 
                      className="w-full h-9 border border-slate-200 rounded-lg px-2.5 text-xs font-semibold outline-none focus:border-blue-500"
                      placeholder="Contoh: Follow-up Budi Santoso"
                      value={reminderActivity}
                      onChange={(e) => setReminderActivity(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[9.5px] font-black text-slate-400 uppercase block">Pilihan Waktu</label>
                    <select 
                      value={reminderTime}
                      onChange={(e) => setReminderTime(e.target.value)}
                      className="w-full h-9 border border-slate-200 rounded-lg px-2 text-xs font-bold text-slate-650 outline-none cursor-pointer focus:border-blue-500"
                    >
                      <option value="5">5 menit sebelumnya</option>
                      <option value="10">10 menit sebelumnya</option>
                      <option value="15">15 menit sebelumnya</option>
                      <option value="30">30 menit sebelumnya</option>
                      <option value="60">1 jam sebelumnya</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isReminderRunning}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isReminderRunning ? `Menjadwalkan Pengingat (${countdown}s)...` : "Jadwalkan & Simpan Reminder"}
                </button>
              </form>
            </div>
          </div>

        </div>

        {/* FEATURES 3 & 4: CUSTOMER & BOOKING MANAGEMENT SHOWCASE */}
        <div id="booking-section" className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* FEATURE 3: CUSTOMER MANAGEMENT */}
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-xl relative overflow-hidden group hover:border-blue-500/20 transition-all duration-300">
            <div className="space-y-4">
              <span className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 text-sm font-extrabold shadow-sm group-hover:scale-110 transition-transform">
                <FaUser />
              </span>
              <h3 className="text-lg font-black text-slate-800">3. Customer Management Database</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Pusatkan semua berkas, riwayat pesanan, preferensi pembayaran, dan catatan interaksi pelanggan dalam satu dasbor profil terpadu.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] font-extrabold text-slate-700 pt-2 border-t border-slate-50">
                <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Data Profil Pelanggan
                </div>
                <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Riwayat Booking Detail
                </div>
                <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Level Keanggotaan Member
                </div>
                <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Riwayat Log Komplain & Chat
                </div>
              </div>
            </div>
          </div>

          {/* FEATURE 4: BOOKING MANAGEMENT */}
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-xl relative overflow-hidden group hover:border-blue-500/20 transition-all duration-300">
            <div className="space-y-4">
              <span className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 text-sm font-extrabold shadow-sm group-hover:scale-110 transition-transform">
                <FaPlane />
              </span>
              <h3 className="text-lg font-black text-slate-800">4. Comprehensive Booking & Billing</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Kelola paket wisata, proses verifikasi pembayaran transfer bank/QRIS, serta buat grafik laporan statistik omzet secara terotomatisasi.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] font-extrabold text-slate-700 pt-2 border-t border-slate-50">
                <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Kelola Katalog Paket Wisata
                </div>
                <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Monitor Status Pembayaran
                </div>
                <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Jadwal Keberangkatan Tur
                </div>
                <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Grafik Laporan Omzet Bulanan
                </div>
              </div>
            </div>
          </div>

        </div>

      </section>

      {/* SECTION 3 - ALUR LOCAL NOTIFICATION */}
      <section id="notifications-flow" className="py-20 bg-slate-900 text-white relative">
        {/* Glow decoration */}
        <div className="absolute top-1/2 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 space-y-16 relative z-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs font-black text-cyan-400 uppercase tracking-widest">Workflow</h2>
            <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              Alur Pengiriman Local Notification Otomatis
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-medium">
              Bagaimana sistem notifikasi memangkas jarak antara pemesanan pelanggan dengan respons cepat admin travel.
            </p>
          </div>

          {/* Timeline workflow */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 relative">
            
            {[
              { step: "1", title: "Customer Booking", desc: "Pelanggan memilih destinasi & checkout." },
              { step: "2", title: "Data Masuk Sistem", desc: "Data masuk ke database cloud Supabase." },
              { step: "3", title: "Generate Alert", desc: "Sistem mendeteksi event & menjadwalkan notifikasi." },
              { step: "4", title: "Admin Terima Notif", desc: "Notifikasi lokal pop-up di desktop/HP admin." },
              { step: "5", title: "Klik Notifikasi", desc: "Admin mengklik pesan notifikasi tersebut." },
              { step: "6", title: "Halaman Detail", desc: "Admin langsung diarahkan ke halaman detail booking." }
            ].map((w, idx) => (
              <div key={idx} className="bg-slate-800/40 border border-slate-800 rounded-3xl p-5 relative overflow-hidden group hover:border-blue-500/20 transition-all flex flex-col justify-between">
                <span className="w-7 h-7 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center text-xs font-black border border-blue-500/25 mb-4 group-hover:scale-110 transition-transform">
                  {w.step}
                </span>
                
                <div className="space-y-1.5 text-left">
                  <h4 className="font-extrabold text-xs text-white leading-snug">{w.title}</h4>
                  <p className="text-[10px] text-slate-400 font-medium leading-relaxed">{w.desc}</p>
                </div>
              </div>
            ))}

          </div>

        </div>
      </section>

      {/* SECTION 4 - ALUR REMINDER */}
      <section id="reminder-flow" className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs font-black text-blue-600 uppercase tracking-widest">Workflow</h2>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              Alur Pembuatan Reminder & Scheduled Alert
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-medium">
              Langkah sederhana bagi admin untuk menjadwalkan pengingat keberangkatan atau follow-up membership.
            </p>
          </div>

          {/* Timeline workflow */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4 relative">
            
            {[
              { step: "01", title: "Buat Reminder", desc: "Admin membuka tab reminder builder." },
              { step: "02", title: "Pilih Aktivitas", desc: "Pilih kategori (meeting/follow-up/bayar)." },
              { step: "03", title: "Tanggal & Jam", desc: "Tentukan tanggal & jam keberangkatan." },
              { step: "04", title: "Waktu Pengingat", desc: "Pilih opsi (30 menit, 1 jam, dll. sebelum)." },
              { step: "05", title: "Simpan Pengingat", desc: "Simpan data reminder ke sistem." },
              { step: "06", title: "Sistem Menjadwalkan", desc: "Sistem mereset timer di scheduler engine." },
              { step: "07", title: "Notifikasi Muncul", desc: "Pesan pop-up muncul di layar tepat waktu." }
            ].map((w, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-150 rounded-2xl p-4.5 relative overflow-hidden group hover:border-blue-500/20 transition-all flex flex-col justify-between">
                <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-black border border-blue-100 mb-3 group-hover:scale-110 transition-transform">
                  {w.step}
                </span>
                
                <div className="space-y-1 text-left">
                  <h4 className="font-extrabold text-xs text-slate-800 leading-snug">{w.title}</h4>
                  <p className="text-[9.5px] text-slate-500 font-semibold leading-normal">{w.desc}</p>
                </div>
              </div>
            ))}

          </div>

        </div>
      </section>

      {/* SECTION 5 - BENEFITS */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text (5 cols) */}
          <div className="lg:col-span-5 space-y-5 text-left">
            <span className="text-xs font-black text-blue-600 uppercase tracking-widest block">Core Benefits</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              Mengapa Ratusan Agensi Travel Mempercayakan Operasionalnya pada Kami?
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-medium">
              Bukan sekadar mencatat data, TravelGo CRM aktif membantu Anda mengamankan setiap transaksi dan melayani customer secara maksimal.
            </p>
            <div className="pt-2">
              <Link 
                to="/register"
                className="inline-flex items-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black rounded-xl transition-all shadow-md cursor-pointer"
              >
                <span>Coba Sekarang Gratis</span> <FaArrowRight className="text-[8px]" />
              </Link>
            </div>
          </div>

          {/* Right Cards (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {[
              { title: "Tidak ada follow-up terlewat", desc: "Notifikasi otomatis mengingatkan tagihan dan penawaran tepat waktu." },
              { title: "Monitoring pelanggan mudah", desc: "Seluruh log riwayat interaksi tersimpan rapi tanpa tercecer." },
              { title: "Booking terorganisir", desc: "Tabel booking & status pembayaran tervisualisasi dengan sangat detail." },
              { title: "Meningkatkan loyalitas", desc: "Memberikan notifikasi pengingat ulang tahun atau promo eksklusif." },
              { title: "Repeat Order Tinggi", desc: "Penawaran promo membership tepat sasaran meningkatkan konversi." },
              { title: "Mobile-First Design", desc: "Nyaman diakses kapan pun melalui HP atau tablet admin lapangan." }
            ].map((b, idx) => (
              <div key={idx} className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex gap-3.5 items-start">
                <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 text-[10px] mt-0.5">
                  <FaCheck />
                </span>
                <div className="space-y-1 text-left">
                  <h4 className="font-extrabold text-xs text-slate-850 leading-tight">{b.title}</h4>
                  <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}

          </div>

        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="py-20 bg-blue-600 text-white text-center relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-400/20 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-3xl mx-auto px-6 space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tight">
            Kelola Travel Agent Lebih Profesional dengan TravelGo CRM
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed font-medium max-w-xl mx-auto">
            Pantau pelanggan, booking, transaksi, dan aktivitas penting dalam satu dashboard modern B2B SaaS.
          </p>

          <div className="flex justify-center items-center gap-4 pt-3">
            <Link
              to="/register"
              className="bg-white hover:bg-slate-100 text-blue-600 px-6 py-3.5 rounded-xl text-xs font-black shadow-lg transition-all"
            >
              Start 14-Day Free Trial
            </Link>
            
            <a 
              href="mailto:sales@travelgo.com"
              className="bg-blue-700/60 hover:bg-blue-700/80 border border-white/20 text-white px-6 py-3.5 rounded-xl text-xs font-black transition-all cursor-pointer"
            >
              Contact Sales Agent
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="footer" className="bg-slate-900 text-slate-400 border-t border-slate-800 py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 text-left">
          
          {/* Logo Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center shadow-md">
                <FaPlane className="text-sm transform -rotate-45" />
              </div>
              <span className="text-lg font-black text-white tracking-tight">TravelGo<span className="text-cyan-400">.</span></span>
            </div>
            <p className="text-[11px] font-medium leading-relaxed text-slate-450">
              Sistem B2B CRM terkemuka untuk membantu agensi travel mengelola booking, data pelanggan, dan invoice penagihan secara otomatis.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Quick Links</h4>
            <div className="flex flex-col gap-2.5 text-xs font-bold">
              <a href="#home" className="hover:text-white transition-colors">Home Dashboard</a>
              <a href="#features" className="hover:text-white transition-colors">Core Features</a>
              <a href="#problem-solution" className="hover:text-white transition-colors">Client Database</a>
              <a href="#booking-section" className="hover:text-white transition-colors">Pricing Options</a>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Contact Support</h4>
            <div className="flex flex-col gap-3 text-xs font-semibold text-slate-400">
              <p className="flex items-center gap-2"><FaEnvelope className="text-blue-500 shrink-0" /> support@travelgo.com</p>
              <p className="flex items-center gap-2"><FaPhone className="text-blue-500 shrink-0" /> +62 812 3456 7890</p>
              <p className="flex items-center gap-2"><FaMapMarkerAlt className="text-blue-500 shrink-0" /> Jl. Melati No. 12, Pekanbaru, Riau</p>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Follow Us</h4>
            <div className="flex gap-3 text-xl">
              <a href="https://instagram.com" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center border border-slate-750 transition-colors"><FaInstagram /></a>
              <a href="https://facebook.com" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center border border-slate-750 transition-colors"><FaFacebook /></a>
              <a href="https://linkedin.com" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center border border-slate-750 transition-colors"><FaLinkedin /></a>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-6 text-center mt-12 border-t border-slate-800 pt-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          © 2026 TravelGo CRM. All Rights Reserved. Designed for Travel Agents.
        </div>
      </footer>

    </div>
  );
}