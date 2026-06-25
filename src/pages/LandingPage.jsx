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
  FaAward,
  FaHeart,
  FaRegHeart,
  FaTrash,
  FaSearch,
  FaSun,
  FaMoon
} from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import products from "../Data/Products.json";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState("customer");
  const [showToast, setShowToast] = useState(false);
  const [toastContent, setToastContent] = useState({});
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem("landing_theme");
      return saved ? saved === "dark" : false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("landing_theme", isDarkMode ? "dark" : "light");
    } catch {
      // Ignore write errors
    }
  }, [isDarkMode]);

  // States for Destination & Ticket Explorer
  const [activeProductTab, setActiveProductTab] = useState("all");
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [savedProducts, setSavedProducts] = useState(() => {
    try {
      const saved = localStorage.getItem("saved_travel_products");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showSavedDrawer, setShowSavedDrawer] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);

  useEffect(() => {
    localStorage.setItem("saved_travel_products", JSON.stringify(savedProducts));
  }, [savedProducts]);

  const handleToggleSave = (productId, e) => {
    if (e) e.stopPropagation();
    if (savedProducts.includes(productId)) {
      setSavedProducts(savedProducts.filter(id => id !== productId));
    } else {
      setSavedProducts([...savedProducts, productId]);
    }
  };

  // Filter products based on search and active tab
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(productSearchQuery.toLowerCase()) || 
                          product.brand.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
                          product.category.toLowerCase().includes(productSearchQuery.toLowerCase());
    
    if (activeProductTab === "destinations") {
      // destinations are non-ticket categories
      return matchesSearch && !["Flight Ticket", "Transportation"].includes(product.category);
    } else if (activeProductTab === "tickets") {
      // tickets are flight or transportation
      return matchesSearch && ["Flight Ticket", "Transportation"].includes(product.category);
    }
    
    return matchesSearch;
  });

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
      setTimeout(() => {
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
      }, 0);
    }
  }, [countdown, isReminderRunning]);

  const theme = {
    bg: isDarkMode ? "bg-[#070A13] text-slate-200 selection:bg-indigo-600" : "bg-slate-50 text-slate-800 selection:bg-blue-600",
    nav: isDarkMode ? "bg-[#070A13]/80 border-slate-800/80 shadow-2xl" : "bg-white/80 border-slate-100/80 shadow-sm",
    navLogoText: isDarkMode ? "text-white" : "text-slate-800",
    navLinks: isDarkMode ? "text-slate-400" : "text-slate-650",
    navLinkHover: isDarkMode ? "hover:text-indigo-400" : "hover:text-blue-600",
    navBtnToggle: isDarkMode 
      ? "bg-slate-900 hover:bg-slate-850 border-slate-800 hover:border-slate-700 text-slate-300" 
      : "bg-white hover:bg-slate-55 border-slate-200 hover:border-slate-300 text-slate-700",
    navBtnLogin: isDarkMode 
      ? "text-slate-300 hover:text-indigo-400 border-slate-800 hover:border-slate-700" 
      : "text-slate-700 hover:text-blue-600 border-slate-200 hover:border-slate-350",
    navBtnRegister: isDarkMode 
      ? "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-750" 
      : "bg-blue-600 hover:bg-blue-700",
    heroTitle: isDarkMode ? "text-white" : "text-slate-900",
    heroDesc: isDarkMode ? "text-slate-400" : "text-slate-550",
    heroBtnSec: isDarkMode ? "bg-slate-900 border-slate-800 hover:bg-slate-850 text-slate-300" : "bg-white border-slate-200 hover:bg-slate-50 text-slate-750",
    heroBtnPri: isDarkMode ? "bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-95" : "bg-blue-600 hover:bg-blue-700",
    heroBadge: isDarkMode ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400" : "bg-indigo-50 border-indigo-100 text-indigo-600",
    heroStats: isDarkMode ? "text-white border-slate-805/40" : "text-slate-900 border-slate-200",
    heroStatsSub: isDarkMode ? "text-slate-450" : "text-slate-550",
    card: isDarkMode ? "bg-[#0F1426]/90 border-slate-805/80 text-slate-300 shadow-2xl" : "bg-white border-slate-200 text-slate-700 shadow-md",
    cardTitle: isDarkMode ? "text-white" : "text-slate-900",
    cardDesc: isDarkMode ? "text-slate-400" : "text-slate-550",
    probBg: isDarkMode ? "bg-rose-500/10 border-rose-550/20 text-slate-300" : "bg-rose-50 border-rose-100 text-slate-700",
    solBg: isDarkMode ? "bg-gradient-to-br from-[#0F1426] via-slate-900 to-purple-950 border border-slate-800 text-slate-300 shadow-2xl" : "bg-white border border-slate-200 text-slate-700 shadow-md",
    sectionDark: isDarkMode ? "bg-[#0B0F1E] border-slate-900/60" : "bg-slate-100 border-slate-200",
    sectionLight: isDarkMode ? "bg-[#070A13]" : "bg-slate-50",
    border: isDarkMode ? "border-slate-805/80" : "border-slate-200",
    search: isDarkMode ? "bg-slate-950/85 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-800",
    filterTab: isDarkMode ? "bg-slate-950/80 border-slate-800" : "bg-slate-100 border-slate-200",
    activeTab: isDarkMode ? "bg-[#0F1426] text-indigo-400 border-slate-800" : "bg-white text-blue-600 border-slate-200 shadow-xs",
    inactiveTab: isDarkMode ? "text-slate-450 hover:text-slate-200" : "text-slate-500 hover:text-slate-900",
    drawerPanel: isDarkMode ? "bg-[#0F1426] border-slate-805" : "bg-white border-slate-200",
    drawerHeader: isDarkMode ? "border-slate-800" : "border-slate-150",
    drawerText: isDarkMode ? "text-white" : "text-slate-900",
    drawerCard: isDarkMode ? "bg-slate-950/80 border-slate-800/60" : "bg-slate-50 border-slate-200/60",
    drawerCloseBtn: isDarkMode ? "hover:bg-slate-800" : "hover:bg-slate-100",
    dialog: isDarkMode ? "bg-[#0F1426] border-slate-800 text-slate-200" : "bg-white border-slate-150 text-slate-800",
    dialogTitle: isDarkMode ? "text-white" : "text-slate-900",
    dialogSub: isDarkMode ? "bg-slate-950/80 border-slate-800/60" : "bg-slate-50 border-slate-150",
    dialogText: isDarkMode ? "text-slate-350" : "text-slate-650",
    dialogCloseBtn: isDarkMode ? "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850" : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200",
    input: isDarkMode ? "bg-slate-900 border-slate-800 text-white focus:border-indigo-500" : "bg-white border-slate-200 text-slate-800 focus:border-blue-500",
    bottomCta: isDarkMode ? "bg-gradient-to-br from-[#0F1426] via-slate-900 to-[#070A13] text-white border-slate-855/60" : "bg-gradient-to-br from-indigo-50 via-slate-50 to-purple-50 text-slate-850 border-slate-200",
    bottomCtaSec: isDarkMode ? "bg-slate-800/80 hover:bg-slate-700/90 border-slate-700 text-slate-205" : "bg-white hover:bg-slate-50 border-slate-250 text-slate-700 shadow-xs"
  };

  return (
    <div className={`font-sans min-h-screen relative overflow-x-hidden ${theme.bg} ${isDarkMode ? "dark" : ""}`}>
      
      {/* LOCAL NOTIFICATION TOAST SIMULATOR */}
      {showToast && (
        <div 
          onClick={handleToastClick}
          className={`fixed bottom-6 right-6 z-[9999] max-w-sm w-full ${theme.card} p-4 cursor-pointer hover:scale-105 transition-all duration-300 animate-in slide-in-from-bottom-5 duration-300`}
        >
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-full ${isDarkMode ? "bg-indigo-600 text-white border-indigo-400/20 shadow-indigo-500/10" : "bg-blue-600 text-white border-blue-400/20 shadow-blue-500/10"} flex items-center justify-center shrink-0 border shadow-md`}>
              <FaBell className="animate-swing" />
            </div>
            <div className="flex-1 space-y-1.5 pr-2">
              <div className="flex justify-between items-center">
                <span className={`text-[10px] ${isDarkMode ? "bg-indigo-500/25 text-indigo-300" : "bg-blue-500/10 text-blue-600 border border-blue-100"} px-2 py-0.5 rounded-md font-black tracking-widest uppercase`}>Notifikasi Lokal</span>
                <span className="text-[8px] text-slate-500 font-extrabold">SEKARANG</span>
              </div>
              <h4 className={`font-extrabold text-xs ${theme.dialogTitle}`}>{toastContent.title}</h4>
              <p className={`text-[10px] ${theme.dialogText} font-medium leading-relaxed`}>{toastContent.desc}</p>
              <div className={`text-[9px] ${isDarkMode ? "text-indigo-400" : "text-blue-600"} font-bold flex items-center gap-1 pt-1.5`}>
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
        <DialogContent className={`max-w-md ${theme.dialog} rounded-3xl border shadow-2xl p-6`}>
          <DialogHeader className={`border-b ${theme.drawerHeader} pb-3 flex flex-row items-center justify-between`}>
            <DialogTitle className={`text-base font-extrabold ${theme.dialogTitle}`}>Detail Booking Wisata (CRM Terverifikasi)</DialogTitle>
          </DialogHeader>

          {selectedBooking && (
            <div className={`space-y-4 pt-3 text-xs font-semibold ${theme.dialogText}`}>
              <div className={`p-4 rounded-xl space-y-2 border ${theme.dialogSub}`}>
                <span className={`text-[9px] ${isDarkMode ? "text-slate-500" : "text-slate-400"} font-bold block uppercase tracking-wider`}>Nomor Booking</span>
                <p className={`font-extrabold ${theme.dialogTitle}`}>{selectedBooking.id}</p>
                
                <span className={`text-[9px] ${isDarkMode ? "text-slate-500" : "text-slate-400"} font-bold block uppercase tracking-wider pt-1.5`}>Nama Pelanggan</span>
                <p className={`font-extrabold ${theme.dialogTitle}`}>{selectedBooking.customer}</p>

                <span className={`text-[9px] ${isDarkMode ? "text-slate-500" : "text-slate-400"} font-bold block uppercase tracking-wider pt-1.5`}>Paket Wisata</span>
                <p className={`font-extrabold ${isDarkMode ? "text-indigo-400" : "text-blue-600"}`}>{selectedBooking.package}</p>
              </div>

              <div className="space-y-2 px-1">
                <div className="flex justify-between">
                  <span className={isDarkMode ? "text-slate-450" : "text-slate-500"}>Jadwal Perjalanan:</span>
                  <span className={theme.dialogTitle}>{selectedBooking.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className={isDarkMode ? "text-slate-450" : "text-slate-500"}>Nilai Transaksi:</span>
                  <span className={`font-black ${theme.dialogTitle}`}>{selectedBooking.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className={isDarkMode ? "text-slate-450" : "text-slate-500"}>Status Pembayaran:</span>
                  <span className={`px-2.5 py-0.5 border rounded-full font-black text-[9px] ${isDarkMode ? "bg-emerald-500/10 text-emerald-455 border-emerald-500/20" : "bg-emerald-50 text-emerald-600 border-emerald-100"}`}>{selectedBooking.paymentStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className={isDarkMode ? "text-slate-450" : "text-slate-500"}>Status Booking:</span>
                  <span className={`px-2.5 py-0.5 border rounded-full font-black text-[9px] ${isDarkMode ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" : "bg-blue-50 text-blue-600 border-blue-100"}`}>{selectedBooking.bookingStatus}</span>
                </div>
              </div>

              <button 
                onClick={() => setShowDetailModal(false)}
                className={`w-full ${theme.dialogCloseBtn} font-bold py-2.5 rounded-xl text-xs transition-colors mt-2 cursor-pointer`}
              >
                Tutup Detail Booking
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-50 ${theme.nav} backdrop-blur-md border-b transition-all duration-300`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <a href="#home" className="flex items-center gap-2.5">
            <div className={`w-8 h-8 ${isDarkMode ? "bg-indigo-600 text-white shadow-indigo-500/20" : "bg-blue-600 text-white shadow-blue-500/20"} rounded-lg flex items-center justify-center shadow-md`}>
              <FaPlane className="text-sm transform -rotate-45" />
            </div>
            <span className={`text-lg font-black ${theme.navLogoText} tracking-tight`}>TravelGo<span className={isDarkMode ? "text-purple-500" : "text-cyan-500"}>.</span></span>
          </a>

          <div className={`hidden lg:flex gap-7 font-bold text-xs ${theme.navLinks}`}>
            <a href="#home" className={`transition-colors ${theme.navLinkHover}`}>Home</a>
            <a href="#recommendations-section" className={`transition-colors ${theme.navLinkHover}`}>Rekomendasi</a>
            <a href="#features" className={`transition-colors ${theme.navLinkHover}`}>Features</a>
            <a href="#problem-solution" className={`transition-colors ${theme.navLinkHover}`}>Customers</a>
            <a href="#booking-section" className={`transition-colors ${theme.navLinkHover}`}>Booking</a>
            <a href="#notifications-flow" className={`transition-colors ${theme.navLinkHover}`}>Notifications</a>
            <a href="#reminder-flow" className={`transition-colors ${theme.navLinkHover}`}>Reminder</a>
            <a href="#contact" className={`transition-colors ${theme.navLinkHover}`}>Contact</a>
          </div>

          <div className="flex items-center gap-3">
            {/* BOOKMARK BUTTON */}
            <button
              onClick={() => setShowSavedDrawer(true)}
              className={`relative p-2 border ${theme.navBtnToggle} rounded-xl transition-all cursor-pointer flex items-center gap-1.5`}
            >
              <FaHeart className={savedProducts.length > 0 ? "text-rose-500 animate-pulse" : "text-slate-500"} />
              <span className="text-[10px] font-extrabold hidden sm:inline uppercase tracking-wider">Simpanan</span>
              {savedProducts.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white">
                  {savedProducts.length}
                </span>
              )}
            </button>

            {/* THEME TOGGLE BUTTON */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 border ${theme.navBtnToggle} rounded-xl transition-all cursor-pointer flex items-center justify-center`}
              title={isDarkMode ? "Aktifkan Mode Terang" : "Aktifkan Mode Gelap"}
            >
              {isDarkMode ? <FaSun className="text-yellow-400 text-sm" /> : <FaMoon className="text-indigo-500 text-sm" />}
            </button>

            <Link
              to="/login"
              className={`px-4 py-2 text-xs font-bold border rounded-xl transition-all ${theme.navBtnLogin}`}
            >
              Login
            </Link>

            <Link
              to="/register"
              className={`px-4 py-2 text-xs font-bold text-white rounded-xl shadow-md transition-all ${theme.navBtnRegister}`}
            >
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header id="home" className="relative pt-32 pb-20 md:pt-40 md:pb-24 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Background glow decoration */}
        <div className="absolute top-10 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none z-0"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

        {/* Hero Text Content (5 Columns) */}
        <div className="lg:col-span-5 space-y-6 relative z-10 text-left">
          <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 ${theme.heroBadge} rounded-full font-extrabold text-[10px] tracking-wider uppercase`}>
            🚀 Travel CRM B2B Platform
          </span>
          
          <h1 className={`text-3xl sm:text-4xl md:text-5xl font-black ${theme.heroTitle} leading-tight tracking-tight`}>
            Kelola Pelanggan dan Booking Wisata Lebih Mudah dengan <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500">TravelGo CRM</span>
          </h1>
          
          <p className={`text-sm md:text-base ${theme.heroDesc} leading-relaxed font-medium`}>
            Sistem CRM modern untuk travel agent yang membantu mengelola pelanggan, transaksi, booking wisata, serta pengingat aktivitas penting secara otomatis.
          </p>

          <div className="flex items-center gap-4 pt-2">
            <Link
              to="/register"
              className={`px-6 py-3.5 ${theme.heroBtnPri} text-white font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-2`}
            >
              <span>Get Started Free</span> <FaChevronRight className="text-[9px]" />
            </Link>
            
            <a 
              href="#features"
              className={`px-6 py-3.5 border ${theme.heroBtnSec} font-black text-xs rounded-xl transition-all shadow-md`}
            >
              View Demo
            </a>
          </div>

          <div className={`pt-6 border-t ${isDarkMode ? "border-slate-805/40" : "border-slate-200"} flex items-center gap-8`}>
            <div>
              <h4 className={`text-2xl font-black ${theme.heroTitle} leading-none`}>800+</h4>
              <span className={`text-[10px] ${theme.heroStatsSub} font-bold uppercase tracking-wider block mt-1`}>Data Seeded</span>
            </div>
            <div>
              <h4 className={`text-2xl font-black ${theme.heroTitle} leading-none`}>99.9%</h4>
              <span className={`text-[10px] ${theme.heroStatsSub} font-bold uppercase tracking-wider block mt-1`}>On-Time Alert</span>
            </div>
            <div>
              <h4 className={`text-2xl font-black ${theme.heroTitle} leading-none`}>24/7</h4>
              <span className={`text-[10px] ${theme.heroStatsSub} font-bold uppercase tracking-wider block mt-1`}>Active Sync</span>
            </div>
          </div>
        </div>

        {/* Hero Interactive CRM Mockup Dashboard (7 Columns) */}
        <div className="lg:col-span-7 relative z-10">
          
          <div className={`rounded-[2.5rem] border shadow-2xl p-5 md:p-6 space-y-5 relative group transition-all duration-300 ${isDarkMode ? "bg-[#0F1426]/90 text-slate-100 border-slate-800/80 hover:border-indigo-500/20" : "bg-white text-slate-800 border-slate-200 hover:border-blue-500/20 shadow-xl"}`}>
            {/* Glowing tab header overlay */}
            {isDarkMode && <div className="absolute top-0 right-10 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>}

            {/* Simulated UI Window Bar */}
            <div className={`flex justify-between items-center border-b pb-4 ${isDarkMode ? "border-slate-805/30" : "border-slate-200"}`}>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/70 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500/70 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500/70 inline-block"></span>
                <span className="text-[10px] text-slate-500 font-bold ml-2">TravelGo CRM - Admin Panel</span>
              </div>
              <span className={`text-[9px] ${isDarkMode ? "bg-slate-800/80 text-slate-400" : "bg-slate-100 text-slate-655"} px-3 py-1 rounded-md font-bold`}>V1.0 Live</span>
            </div>

            {/* Tab Swappers */}
            <div className={`flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-wider border-b pb-3 ${isDarkMode ? "border-slate-805/30" : "border-slate-200"}`}>
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
                      ? (isDarkMode ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/10" : "bg-blue-600 text-white shadow-md shadow-blue-500/10") 
                      : (isDarkMode ? "bg-slate-800/40 text-slate-400 hover:text-slate-200" : "bg-slate-100 text-slate-600 hover:text-slate-800 hover:bg-slate-200/60")
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

                  <div className={`divide-y ${isDarkMode ? "divide-slate-800/60" : "divide-slate-200"} space-y-2`}>
                    {[
                      { name: "Cayadi Latupono", user: "@cayadi_1", level: "Silver", color: isDarkMode ? "bg-slate-500/20 text-slate-300 border-slate-700" : "bg-slate-100 text-slate-650 border-slate-200" },
                      { name: "Jelita Suryatmi", user: "@jelita_suryatmi_2", level: "Platinum", color: isDarkMode ? "bg-purple-500/20 text-purple-300 border-purple-800/30" : "bg-purple-50 text-purple-600 border-purple-100" },
                      { name: "Cakrawangsa Nashiruddin", user: "@cakrawangsa_3", level: "Gold", color: isDarkMode ? "bg-amber-500/20 text-amber-300 border-amber-800/30" : "bg-amber-50 text-amber-600 border-amber-100" }
                    ].map((c, i) => (
                      <div key={i} className="flex justify-between items-center pt-2">
                        <div>
                          <p className={`font-extrabold ${theme.dialogTitle}`}>{c.name}</p>
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

                  <div className={`divide-y ${isDarkMode ? "divide-slate-800/60" : "divide-slate-200"} space-y-2`}>
                    {[
                      { dest: "Paket Bali Beach Escape", date: "12 Juni - 16 Juni 2026", price: "Rp 4.500.000", status: "Lunas", color: isDarkMode ? "bg-emerald-500/20 text-emerald-400 border-emerald-800/30" : "bg-emerald-50 text-emerald-600 border-emerald-100" },
                      { dest: "Paket Bromo Sunrise Trip", date: "20 Juli - 22 Juli 2026", price: "Rp 2.250.000", status: "Menunggu", color: isDarkMode ? "bg-amber-500/20 text-amber-400 border-amber-800/30" : "bg-amber-50 text-amber-600 border-amber-100" },
                      { dest: "Paket Lombok Eksotis", date: "08 Mei - 12 Mei 2026", price: "Rp 2.000.000", status: "Lunas", color: isDarkMode ? "bg-emerald-500/20 text-emerald-400 border-emerald-800/30" : "bg-emerald-50 text-emerald-600 border-emerald-100" }
                    ].map((b, i) => (
                      <div key={i} className="flex justify-between items-center pt-2">
                        <div>
                          <p className={`font-extrabold ${theme.dialogTitle}`}>{b.dest}</p>
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
                    <div className={`border rounded-xl p-3 text-center ${isDarkMode ? "bg-slate-800/40 border-slate-800" : "bg-slate-50 border-slate-150"}`}>
                      <span className="text-[9px] font-black text-slate-500 block uppercase">Gold Members</span>
                      <h4 className={`text-xl font-black ${isDarkMode ? "text-amber-400" : "text-amber-600"} mt-1`}>128</h4>
                    </div>
                    <div className={`border rounded-xl p-3 text-center ${isDarkMode ? "bg-slate-800/40 border-slate-800" : "bg-slate-50 border-slate-150"}`}>
                      <span className="text-[9px] font-black text-slate-500 block uppercase">Silver Members</span>
                      <h4 className={`text-xl font-black ${isDarkMode ? "text-slate-300" : "text-slate-500"} mt-1`}>340</h4>
                    </div>
                    <div className={`border rounded-xl p-3 text-center ${isDarkMode ? "bg-slate-800/40 border-slate-800" : "bg-slate-50 border-slate-150"}`}>
                      <span className="text-[9px] font-black text-slate-500 block uppercase">Bronze Members</span>
                      <h4 className={`text-xl font-black ${isDarkMode ? "text-amber-700" : "text-amber-800"} mt-1`}>332</h4>
                    </div>
                  </div>

                  <div className={`space-y-2.5 pt-2 border-t ${isDarkMode ? "border-slate-800/60" : "border-slate-200"}`}>
                    <h5 className="font-extrabold text-[10px] text-slate-500 uppercase tracking-widest">Upgrade Rules</h5>
                    <div className={`flex items-center justify-between text-[11px] px-3 py-2 rounded-xl border ${isDarkMode ? "text-slate-300 bg-slate-800/20 border-slate-800/40" : "text-slate-700 bg-slate-50 border-slate-200"}`}>
                      <span>Bronze → Silver</span>
                      <span className={isDarkMode ? "text-indigo-400 font-bold" : "text-blue-600 font-bold"}>500 Points</span>
                    </div>
                    <div className={`flex items-center justify-between text-[11px] px-3 py-2 rounded-xl border ${isDarkMode ? "text-slate-300 bg-slate-800/20 border-slate-800/40" : "text-slate-700 bg-slate-50 border-slate-200"}`}>
                      <span>Silver → Gold</span>
                      <span className={isDarkMode ? "text-indigo-400 font-bold" : "text-blue-600 font-bold"}>1000 Points</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Notifikasi */}
              {activeTab === "notifications" && (
                <div className="space-y-3.5 text-xs text-left animate-in fade-in duration-200">
                  <div className="space-y-3">
                    {notifications.map((n) => (
                      <div key={n.id} className={`flex gap-3 border rounded-xl p-3 items-start transition-all ${isDarkMode ? "bg-slate-800/30 border-slate-800/80 hover:border-indigo-500/20" : "bg-slate-50 border-slate-150 hover:border-blue-500/20 shadow-xs"}`}>
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[10px] mt-0.5 border ${isDarkMode ? "bg-indigo-500/10 border-indigo-500/25 text-indigo-400" : "bg-blue-50 border-blue-200 text-blue-600"}`}>
                          <FaBell />
                        </span>
                        <div className="flex-1">
                          <div className="flex justify-between items-center w-full">
                            <h5 className={`font-extrabold text-[11px] ${theme.dialogTitle}`}>{n.title}</h5>
                            <span className="text-[8px] text-slate-500 font-extrabold">{n.time}</span>
                          </div>
                          <p className={`text-[10px] ${theme.dialogText} mt-0.5 font-medium leading-relaxed`}>{n.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 5: Reminder List */}
              {activeTab === "reminder" && (
                <div className="space-y-3.5 text-xs text-left animate-in fade-in duration-200">
                  <div className="flex justify-between items-center text-[10px] text-slate-550 font-bold uppercase tracking-wider mb-2">
                    <span>Aktivitas Pengingat</span>
                    <span>Waktu & Status</span>
                  </div>

                  <div className="space-y-2">
                    {reminderList.map(r => (
                      <div key={r.id} className={`flex justify-between items-center p-2.5 rounded-xl border ${isDarkMode ? "bg-slate-800/20 border-slate-800/60" : "bg-slate-50 border-slate-200"}`}>
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${isDarkMode ? "bg-indigo-500" : "bg-blue-600"}`}></span>
                          <span className={`font-extrabold ${theme.dialogTitle}`}>{r.activity}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] text-slate-400 font-bold">{r.time}</span>
                          <span className={`px-2 py-0.5 text-[8px] font-black rounded uppercase ${
                            r.status === "Terjadwal" 
                              ? (isDarkMode ? "bg-indigo-500/25 text-indigo-300" : "bg-blue-50 text-blue-600 border border-blue-100") 
                              : (isDarkMode ? "bg-emerald-500/25 text-emerald-300" : "bg-emerald-50 text-emerald-600 border border-emerald-100")
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
      <section id="problem-solution" className={`py-20 ${theme.sectionDark}`}>
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className={`text-xs font-black ${isDarkMode ? "text-indigo-400" : "text-blue-600"} uppercase tracking-widest`}>Problem & Solution</h2>
            <h3 className={`text-2xl sm:text-3xl font-black ${theme.dialogTitle} leading-tight`}>
              Mengapa Sistem Pengingat & Notifikasi CRM Sangat Krusial?
            </h3>
            <p className={`text-xs sm:text-sm leading-relaxed font-medium ${theme.dialogText}`}>
              Kelalaian kecil dalam bisnis travel agent dapat merugikan reputasi. Kami mendengarkan kendala operasional Anda dan membangun solusinya.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Problems Column (5 cols) */}
            <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
              <h4 className={`text-xs font-black ${isDarkMode ? "text-slate-500" : "text-slate-450"} uppercase tracking-widest border-b pb-3 text-left ${isDarkMode ? "border-slate-805/30" : "border-slate-200"}`}>
                Kendala Operasional Klasik Agen Travel:
              </h4>
              
              <div className="space-y-4">
                {[
                  { text: "Follow-up pelanggan sering terlupakan karena tumpukan chat manual." },
                  { text: "Jadwal keberangkatan wisata terlewat tanpa koordinasi admin." },
                  { text: "Pembayaran tagihan pelanggan terlambat diproses." },
                  { text: "Sulit memonitor aktivitas pelanggan loyal secara real-time." }
                ].map((p, i) => (
                  <div key={i} className={`flex items-start gap-3 p-4 rounded-2xl text-left border ${theme.probBg}`}>
                    <span className={`w-5 h-5 rounded-full ${isDarkMode ? "bg-rose-500/15 text-rose-455" : "bg-rose-100 text-rose-600"} flex items-center justify-center shrink-0 text-[10px] mt-0.5`}>
                      <FaTimes />
                    </span>
                    <p className={`text-xs font-bold leading-normal ${isDarkMode ? "text-slate-300" : "text-slate-750"}`}>{p.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Solution Column (7 cols) */}
            <div className={`lg:col-span-7 rounded-[2.5rem] p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-2xl border ${theme.solBg}`}>
              {/* Glowing gradient element */}
              {isDarkMode && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>}
              
              <div className="space-y-5 relative z-10 text-left">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[9px] font-black tracking-widest rounded-full uppercase ${theme.heroBadge}`}>
                  ✔ Solusi Terpadu
                </span>
                <h3 className={`text-xl sm:text-2xl font-black leading-snug ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                  TravelGo CRM Menyediakan Sistem Reminder & Local Notification Otomatis
                </h3>
                <p className={`text-xs sm:text-sm leading-relaxed font-medium ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                  Sistem kami beroperasi secara background untuk memindai jadwal keberangkatan, memonitor status transaksi, dan mengirimkan peringatan instan secara lokal ke komputer/HP admin, mencegah semua kelalaian operasional sebelum terjadi.
                </p>
              </div>

              <div className={`grid grid-cols-2 gap-4 border-t pt-6 mt-6 relative z-10 ${isDarkMode ? "border-slate-800/60" : "border-slate-100"}`}>
                <div className="space-y-1.5 text-left">
                  <h4 className={`text-lg font-black leading-none ${isDarkMode ? "text-white" : "text-slate-900"}`}>Instant Alert</h4>
                  <p className={`text-[10px] font-medium ${isDarkMode ? "text-slate-400" : "text-slate-550"}`}>Notifikasi dikirim otomatis tepat waktu.</p>
                </div>
                <div className="space-y-1.5 text-left">
                  <h4 className={`text-lg font-black leading-none ${isDarkMode ? "text-white" : "text-slate-900"}`}>1 Click Redirect</h4>
                  <p className={`text-[10px] font-medium ${isDarkMode ? "text-slate-400" : "text-slate-550"}`}>Klik alert untuk membuka detail transaksi.</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 2 - FITUR UTAMA */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-6 space-y-16">
        
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className={`text-xs font-black ${isDarkMode ? "text-indigo-400" : "text-blue-600"} uppercase tracking-widest`}>Fitur Utama</h2>
          <h3 className={`text-2xl sm:text-3xl font-black ${theme.dialogTitle} leading-tight`}>
            Peralatan Canggih Khusus Untuk Bisnis Travel Anda
          </h3>
          <p className={`text-xs sm:text-sm leading-relaxed font-medium ${theme.dialogText}`}>
            Dikembangkan secara cermat agar sejalan dengan kebutuhan workflow travel agent skala UMKM hingga korporasi besar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* FEATURE 1: LOCAL NOTIFICATION ENGINE (INTERACTIVE SIMULATOR) */}
          <div className={`rounded-[2.5rem] p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between group transition-all duration-300 ${theme.card}`}>
            <div className="space-y-4 text-left">
              <span className={`w-10 h-10 rounded-2xl flex items-center justify-center border text-sm font-extrabold shadow-sm group-hover:scale-110 transition-transform ${isDarkMode ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" : "bg-blue-50 text-blue-600 border-blue-100"}`}>
                <FaBell />
              </span>
              <h3 className={`text-lg font-black ${theme.dialogTitle}`}>1. Local Notification Engine</h3>
              <p className={`text-xs ${theme.dialogText} font-medium leading-relaxed`}>
                Sistem mengirim notifikasi otomatis kepada admin travel di perangkat lokal secara langsung begitu terdapat event yang membutuhkan perhatian.
              </p>

              <div className={`border-t pt-4 space-y-2 ${isDarkMode ? "border-slate-800/60" : "border-slate-150"}`}>
                <h5 className={`text-[9px] font-black ${isDarkMode ? "text-slate-500" : "text-slate-450"} uppercase tracking-widest`}>Daftar Pemicu Notifikasi:</h5>
                <div className={`grid grid-cols-2 gap-2 text-[10px] font-bold ${isDarkMode ? "text-slate-350" : "text-slate-650"}`}>
                  <p className="flex items-center gap-1.5"><FaCheck className={`${isDarkMode ? "text-emerald-450" : "text-emerald-600"} text-[8px]`} /> Booking baru masuk</p>
                  <p className="flex items-center gap-1.5"><FaCheck className={`${isDarkMode ? "text-emerald-455" : "text-emerald-600"} text-[8px]`} /> Pembayaran berhasil</p>
                  <p className="flex items-center gap-1.5"><FaCheck className={`${isDarkMode ? "text-emerald-455" : "text-emerald-600"} text-[8px]`} /> Pembayaran belum lunas</p>
                  <p className="flex items-center gap-1.5"><FaCheck className={`${isDarkMode ? "text-emerald-455" : "text-emerald-600"} text-[8px]`} /> Keberangkatan besok</p>
                  <p className="flex items-center gap-1.5"><FaCheck className={`${isDarkMode ? "text-emerald-455" : "text-emerald-600"} text-[8px]`} /> Membership berakhir</p>
                  <p className="flex items-center gap-1.5"><FaCheck className={`${isDarkMode ? "text-emerald-455" : "text-emerald-600"} text-[8px]`} /> Perlu follow-up</p>
                </div>
              </div>
            </div>

            {/* LIVE SIMULATOR ACTION */}
            <div className={`border-t pt-5 mt-6 space-y-3 ${isDarkMode ? "border-slate-800/60" : "border-slate-150"}`}>
              <div className={`flex items-center gap-2 text-[10px] p-2.5 rounded-xl border ${isDarkMode ? "text-slate-400 bg-slate-950/80 border-slate-805/50" : "text-slate-600 bg-slate-50 border-slate-200"}`}>
                <FaInfoCircle className={`${isDarkMode ? "text-indigo-400" : "text-blue-600"} shrink-0`} />
                <p className="text-left">Klik tombol simulasi di bawah untuk menguji respons notifikasi!</p>
              </div>

              <button 
                onClick={() => triggerNotification(
                  "🆕 Booking Baru Masuk",
                  "Booking Paket Wisata Bali oleh Budi Santoso berhasil dibuat. Klik notifikasi ini untuk mengonfirmasi data!"
                )}
                className={`w-full py-3 ${theme.heroBtnPri} text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border ${isDarkMode ? "border-indigo-400/20 shadow-indigo-500/10" : "border-transparent"}`}
              >
                <FaBell className="text-[10px]" />
                <span>Simulasikan Notifikasi Lokal</span>
              </button>
            </div>
          </div>

          {/* FEATURE 2: REMINDER MANAGEMENT (INTERACTIVE BUILDER) */}
          <div className={`rounded-[2.5rem] p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between group transition-all duration-300 ${theme.card}`}>
            <div className="space-y-4 text-left">
              <span className={`w-10 h-10 rounded-2xl flex items-center justify-center border text-sm font-extrabold shadow-sm group-hover:scale-110 transition-transform ${isDarkMode ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" : "bg-cyan-50 text-cyan-600 border-cyan-100"}`}>
                <FaClock />
              </span>
              <h3 className={`text-lg font-black ${theme.dialogTitle}`}>2. Reminder Management</h3>
              <p className={`text-xs ${theme.dialogText} font-medium leading-relaxed`}>
                Buat dan jadwalkan pengingat aktivitas spesifik untuk dikirimkan ke tim admin. Mengantisipasi kelalaian penagihan invoice atau rapat klien.
              </p>

              <div className={`border-t pt-4 space-y-2 ${isDarkMode ? "border-slate-800/60" : "border-slate-150"}`}>
                <h5 className={`text-[9px] font-black ${isDarkMode ? "text-slate-500" : "text-slate-450"} uppercase tracking-widest`}>Pengingat Dapat Digunakan Untuk:</h5>
                <div className={`grid grid-cols-2 gap-2 text-[10px] font-bold ${isDarkMode ? "text-slate-350" : "text-slate-650"}`}>
                  <p className="flex items-center gap-1.5"><FaClock className={`${isDarkMode ? "text-cyan-400" : "text-cyan-600"} text-[8px]`} /> Follow-up pelanggan</p>
                  <p className="flex items-center gap-1.5"><FaClock className={`${isDarkMode ? "text-cyan-400" : "text-cyan-600"} text-[8px]`} /> Konfirmasi bayar</p>
                  <p className="flex items-center gap-1.5"><FaClock className={`${isDarkMode ? "text-cyan-400" : "text-cyan-600"} text-[8px]`} /> Meeting dengan customer</p>
                  <p className="flex items-center gap-1.5"><FaClock className={`${isDarkMode ? "text-cyan-400" : "text-cyan-600"} text-[8px]`} /> Promo membership</p>
                </div>
              </div>
            </div>

            {/* INTERACTIVE REMINDER FORM BUILDER */}
            <div className={`border-t pt-5 mt-6 space-y-3.5 ${isDarkMode ? "border-slate-800/60" : "border-slate-150"}`}>
              <form onSubmit={handleSetReminder} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                  <div className="space-y-1">
                    <label className={`text-[9.5px] font-black ${isDarkMode ? "text-slate-500" : "text-slate-450"} uppercase block`}>Aktivitas</label>
                    <input 
                      type="text" 
                      className={`w-full h-9 rounded-lg px-2.5 text-xs font-semibold outline-none transition-all ${isDarkMode ? "bg-slate-950/80 border-slate-800 text-white focus:border-indigo-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500"}`}
                      placeholder="Contoh: Follow-up Budi Santoso"
                      value={reminderActivity}
                      onChange={(e) => setReminderActivity(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className={`text-[9.5px] font-black ${isDarkMode ? "text-slate-500" : "text-slate-450"} uppercase block`}>Pilihan Waktu</label>
                    <select 
                      value={reminderTime}
                      onChange={(e) => setReminderTime(e.target.value)}
                      className={`w-full h-9 rounded-lg px-2 text-xs font-bold outline-none cursor-pointer transition-all ${isDarkMode ? "bg-slate-950/80 border-slate-800 text-slate-300 focus:border-indigo-500" : "bg-slate-50 border-slate-200 text-slate-700 focus:border-blue-500"}`}
                    >
                      <option value="5" className={isDarkMode ? "bg-[#0F1426] text-white" : "bg-white text-slate-700"}>5 menit sebelumnya</option>
                      <option value="10" className={isDarkMode ? "bg-[#0F1426] text-white" : "bg-white text-slate-700"}>10 menit sebelumnya</option>
                      <option value="15" className={isDarkMode ? "bg-[#0F1426] text-white" : "bg-white text-slate-700"}>15 menit sebelumnya</option>
                      <option value="30" className={isDarkMode ? "bg-[#0F1426] text-white" : "bg-white text-slate-700"}>30 menit sebelumnya</option>
                      <option value="60" className={isDarkMode ? "bg-[#0F1426] text-white" : "bg-white text-slate-700"}>1 jam sebelumnya</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isReminderRunning}
                  className={`w-full py-3 ${theme.heroBtnPri} text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 border ${isDarkMode ? "border-indigo-400/10" : "border-transparent"}`}
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
          <div className={`rounded-[2.5rem] p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between group transition-all duration-300 ${theme.card}`}>
            <div className="space-y-4 text-left">
              <span className={`w-10 h-10 rounded-2xl flex items-center justify-center border text-sm font-extrabold shadow-sm group-hover:scale-110 transition-transform ${isDarkMode ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" : "bg-blue-50 text-blue-600 border-blue-100"}`}>
                <FaUser />
              </span>
              <h3 className={`text-lg font-black ${theme.dialogTitle}`}>3. Customer Management Database</h3>
              <p className={`text-xs ${theme.dialogText} font-medium leading-relaxed`}>
                Pusatkan semua berkas, riwayat pesanan, preferensi pembayaran, dan catatan interaksi pelanggan dalam satu dasbor profil terpadu.
              </p>

              <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] font-extrabold pt-2 border-t ${isDarkMode ? "text-slate-350 border-slate-800/60" : "text-slate-650 border-slate-150"}`}>
                <div className={`flex items-center gap-2 p-2.5 rounded-xl border ${isDarkMode ? "bg-slate-950/80 border-slate-805/50" : "bg-slate-50 border-slate-150"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isDarkMode ? "bg-indigo-500" : "bg-blue-600"}`}></span> Data Profil Pelanggan
                </div>
                <div className={`flex items-center gap-2 p-2.5 rounded-xl border ${isDarkMode ? "bg-slate-950/80 border-slate-805/50" : "bg-slate-50 border-slate-150"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isDarkMode ? "bg-indigo-500" : "bg-blue-600"}`}></span> Riwayat Booking Detail
                </div>
                <div className={`flex items-center gap-2 p-2.5 rounded-xl border ${isDarkMode ? "bg-slate-950/80 border-slate-805/50" : "bg-slate-50 border-slate-150"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isDarkMode ? "bg-indigo-500" : "bg-blue-600"}`}></span> Level Keanggotaan Member
                </div>
                <div className={`flex items-center gap-2 p-2.5 rounded-xl border ${isDarkMode ? "bg-slate-950/80 border-slate-805/50" : "bg-slate-50 border-slate-150"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isDarkMode ? "bg-indigo-500" : "bg-blue-600"}`}></span> Riwayat Log Komplain & Chat
                </div>
              </div>
            </div>
          </div>

          {/* FEATURE 4: BOOKING MANAGEMENT */}
          <div className={`rounded-[2.5rem] p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between group transition-all duration-300 ${theme.card}`}>
            <div className="space-y-4 text-left">
              <span className={`w-10 h-10 rounded-2xl flex items-center justify-center border text-sm font-extrabold shadow-sm group-hover:scale-110 transition-transform ${isDarkMode ? "bg-emerald-500/10 text-emerald-450 border-emerald-500/20" : "bg-emerald-50 text-emerald-600 border-emerald-100"}`}>
                <FaPlane />
              </span>
              <h3 className={`text-lg font-black ${theme.dialogTitle}`}>4. Comprehensive Booking & Billing</h3>
              <p className={`text-xs ${theme.dialogText} font-medium leading-relaxed`}>
                Kelola paket wisata, proses verifikasi pembayaran transfer bank/QRIS, serta buat grafik laporan statistik omzet secara terotomatisasi.
              </p>

              <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] font-extrabold pt-2 border-t ${isDarkMode ? "text-slate-350 border-slate-800/60" : "text-slate-650 border-slate-150"}`}>
                <div className={`flex items-center gap-2 p-2.5 rounded-xl border ${isDarkMode ? "bg-slate-950/80 border-slate-805/50" : "bg-slate-50 border-slate-150"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isDarkMode ? "bg-emerald-400" : "bg-emerald-600"}`}></span> Kelola Katalog Paket Wisata
                </div>
                <div className={`flex items-center gap-2 p-2.5 rounded-xl border ${isDarkMode ? "bg-slate-950/80 border-slate-805/50" : "bg-slate-50 border-slate-150"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isDarkMode ? "bg-emerald-400" : "bg-emerald-600"}`}></span> Monitor Status Pembayaran
                </div>
                <div className={`flex items-center gap-2 p-2.5 rounded-xl border ${isDarkMode ? "bg-slate-950/80 border-slate-805/50" : "bg-slate-50 border-slate-150"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isDarkMode ? "bg-emerald-400" : "bg-emerald-600"}`}></span> Jadwal Keberangkatan Tur
                </div>
                <div className={`flex items-center gap-2 p-2.5 rounded-xl border ${isDarkMode ? "bg-slate-950/80 border-slate-805/50" : "bg-slate-50 border-slate-150"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isDarkMode ? "bg-emerald-400" : "bg-emerald-600"}`}></span> Grafik Laporan Omzet Bulanan
                </div>
              </div>
            </div>
          </div>

        </div>

      </section>

      <section id="recommendations-section" className={`py-20 ${theme.sectionLight} border-t border-b ${theme.border}`}>
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className={`text-xs font-black ${isDarkMode ? "text-indigo-400" : "text-blue-600"} uppercase tracking-widest`}>Explore the World</h2>
            <h3 className={`text-2xl sm:text-3xl font-black ${theme.dialogTitle} leading-tight`}>
              Rekomendasi Destinasi & Tiket Perjalanan
            </h3>
            <p className={`text-xs sm:text-sm leading-relaxed font-medium ${theme.dialogText}`}>
              Temukan penawaran terbaik untuk liburan impian Anda dan tiket transportasi termurah di platform CRM TravelGo.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className={`flex flex-col md:flex-row gap-4 items-center justify-between p-4 rounded-2xl border ${theme.card}`}>
            {/* Search */}
            <div className="relative w-full md:max-w-md group">
              <FaSearch className={`absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 ${isDarkMode ? "group-focus-within:text-indigo-400" : "group-focus-within:text-blue-600"} transition-colors`} />
              <input
                type="text"
                placeholder="Cari destinasi, maskapai, brand..."
                className={`w-full pl-11 pr-4 py-2.5 rounded-xl text-xs font-semibold outline-none transition-all placeholder:text-slate-500 border ${theme.search} ${isDarkMode ? "focus:border-indigo-500 focus:bg-slate-900" : "focus:border-blue-500 focus:bg-slate-50"}`}
                value={productSearchQuery}
                onChange={(e) => setProductSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter Tabs */}
            <div className={`flex gap-1.5 p-1 rounded-xl w-full md:w-auto border ${theme.filterTab}`}>
              {[
                { id: "all", label: "Semua" },
                { id: "destinations", label: "Destinasi Impian" },
                { id: "tickets", label: "Tiket Perjalanan" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveProductTab(tab.id);
                    setVisibleCount(8); // Reset count on tab change
                  }}
                  className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                    activeProductTab === tab.id
                      ? theme.activeTab
                      : theme.inactiveTab
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid Products */}
          {filteredProducts.length === 0 ? (
            <div className={`text-center py-20 rounded-3xl border shadow-2xl space-y-2 ${theme.card}`}>
              <p className="text-slate-450 font-extrabold text-sm">Tidak ada produk ditemukan</p>
              <p className="text-slate-500 text-xs font-semibold">Coba gunakan kata kunci pencarian yang lain.</p>
            </div>
          ) : (
            <div className="space-y-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.slice(0, visibleCount).map((product) => {
                  const isSaved = savedProducts.includes(product.id);
                  return (
                    <div 
                      key={product.id}
                      className={`rounded-[2.5rem] border shadow-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col group ${theme.card}`}
                    >
                      {/* Image container */}
                      <div className="relative h-48 overflow-hidden bg-slate-950">
                        <img 
                          src={product.gambar} 
                          alt={product.title} 
                          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-65" />
                        
                        {/* Category Badge */}
                        <span className={`absolute top-3.5 left-3.5 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border shadow-xs ${isDarkMode ? "bg-slate-900/90 backdrop-blur-md text-indigo-400 border-slate-800" : "bg-white/90 backdrop-blur-md text-blue-600 border-slate-200"}`}>
                          {product.category}
                        </span>

                        {/* Save Button */}
                        <button
                          onClick={(e) => handleToggleSave(product.id, e)}
                          className={`absolute top-3.5 right-3.5 w-8 h-8 rounded-full flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-all cursor-pointer border ${isDarkMode ? "bg-slate-900/90 backdrop-blur-md text-slate-300 border-slate-800" : "bg-white/90 backdrop-blur-md text-slate-600 border-slate-200"}`}
                        >
                          {isSaved ? (
                            <FaHeart className="text-rose-500 animate-pulse text-xs" />
                          ) : (
                            <FaRegHeart className={`text-xs ${isDarkMode ? "text-slate-500" : "text-slate-400"}`} />
                          )}
                        </button>
                      </div>

                      {/* Content */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4 font-poppins">
                        <div className="space-y-1.5 text-left">
                          <div className="flex justify-between items-center text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                            <span>{product.brand}</span>
                            <span>Stock: {product.stock}</span>
                          </div>
                          <h4 className={`font-extrabold text-xs transition-colors line-clamp-2 leading-snug ${isDarkMode ? "text-white group-hover:text-indigo-400" : "text-slate-900 group-hover:text-blue-600"}`}>
                            {product.title}
                          </h4>
                        </div>

                        <div className={`space-y-3.5 pt-2 border-t text-left ${isDarkMode ? "border-slate-800/60" : "border-slate-100"}`}>
                          <div>
                            <span className="text-[8px] text-slate-550 font-bold uppercase block tracking-wider">Mulai dari</span>
                            <span className={`text-sm font-black ${isDarkMode ? "text-indigo-400" : "text-blue-600"}`}>
                              Rp {product.price.toLocaleString("id-ID")}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 pt-0.5">
                            <button
                              onClick={() => {
                                setSelectedProduct(product);
                                setShowProductModal(true);
                              }}
                              className={`py-2 border font-extrabold text-[10px] rounded-xl transition-all cursor-pointer text-center ${theme.dialogCloseBtn}`}
                            >
                              Detail
                            </button>
                            <button
                              onClick={() => {
                                alert(`Pemesanan ${product.title} berhasil diajukan ke CRM!`);
                              }}
                              disabled={product.stock === 0}
                              className={`py-2 text-white font-extrabold text-[10px] rounded-xl shadow-xs transition-all cursor-pointer text-center ${theme.heroBtnPri} ${isDarkMode ? "disabled:bg-slate-850" : "disabled:bg-slate-200 disabled:text-slate-400"}`}
                            >
                              Pesan
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Show More / Show Less Controls */}
              {filteredProducts.length > 8 && (
                <div className="flex justify-center items-center gap-3 pt-4">
                  {visibleCount < filteredProducts.length ? (
                    <button
                      onClick={() => setVisibleCount(prev => Math.min(prev + 8, filteredProducts.length))}
                      className={`px-6 py-3 border font-black text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5 ${theme.dialogCloseBtn}`}
                    >
                      <span>Tampilkan Lebih Banyak ({filteredProducts.length - visibleCount} lagi)</span>
                      <FaChevronRight className="text-[8px] rotate-90" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setVisibleCount(8)}
                      className={`px-6 py-3 border font-black text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5 ${theme.dialogCloseBtn}`}
                    >
                      <span>Sembunyikan Sebagian</span>
                      <FaChevronRight className="text-[8px] -rotate-90" />
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

        </div>
      </section>

      {/* SECTION 3 - ALUR LOCAL NOTIFICATION */}
      <section id="notifications-flow" className={`py-20 ${theme.sectionDark} relative border-t ${theme.border}`}>
        {/* Glow decoration */}
        <div className="absolute top-1/2 left-0 w-80 h-80 bg-indigo-550/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 space-y-16 relative z-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className={`text-xs font-black ${isDarkMode ? "text-indigo-400" : "text-blue-600"} uppercase tracking-widest`}>Workflow</h2>
            <h3 className={`text-2xl sm:text-3xl font-black ${theme.dialogTitle} leading-tight`}>
              Alur Pengiriman Local Notification Otomatis
            </h3>
            <p className={`text-xs sm:text-sm leading-relaxed font-medium ${theme.cardDesc}`}>
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
              <div key={idx} className={`border rounded-3xl p-5 relative overflow-hidden group transition-all flex flex-col justify-between ${theme.card} ${isDarkMode ? "hover:border-indigo-550/25" : "hover:border-blue-500/20"}`}>
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black mb-4 group-hover:scale-110 transition-transform ${isDarkMode ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" : "bg-blue-50 text-blue-600 border border-blue-100"}`}>
                  {w.step}
                </span>
                
                <div className="space-y-1.5 text-left">
                  <h4 className={`font-extrabold text-xs leading-snug ${theme.cardTitle}`}>{w.title}</h4>
                  <p className={`text-[10px] font-medium leading-relaxed ${theme.cardDesc}`}>{w.desc}</p>
                </div>
              </div>
            ))}

          </div>

        </div>
      </section>

      {/* SECTION 4 - ALUR REMINDER */}
      <section id="reminder-flow" className={`py-20 ${theme.sectionLight} border-b ${theme.border}`}>
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className={`text-xs font-black ${isDarkMode ? "text-indigo-400" : "text-blue-600"} uppercase tracking-widest`}>Workflow</h2>
            <h3 className={`text-2xl sm:text-3xl font-black ${theme.dialogTitle} leading-tight`}>
              Alur Pembuatan Reminder & Scheduled Alert
            </h3>
            <p className={`text-xs sm:text-sm leading-relaxed font-medium ${theme.cardDesc}`}>
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
              <div key={idx} className={`border rounded-2xl p-4.5 relative overflow-hidden group transition-all flex flex-col justify-between ${theme.card} ${isDarkMode ? "hover:border-indigo-550/25" : "hover:border-blue-500/20"}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black mb-3 group-hover:scale-110 transition-transform ${isDarkMode ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" : "bg-blue-50 text-blue-600 border border-blue-100"}`}>
                  {w.step}
                </span>
                
                <div className="space-y-1 text-left">
                  <h4 className={`font-extrabold text-xs leading-snug ${theme.cardTitle}`}>{w.title}</h4>
                  <p className={`text-[9.5px] font-semibold leading-normal ${theme.cardDesc}`}>{w.desc}</p>
                </div>
              </div>
            ))}

          </div>

        </div>
      </section>

      {/* SECTION 5 - BENEFITS */}
      <section className={`py-20 ${theme.sectionDark} border-b ${theme.border}`}>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text (5 cols) */}
          <div className="lg:col-span-5 space-y-5 text-left">
            <span className={`text-xs font-black ${isDarkMode ? "text-indigo-400" : "text-blue-600"} uppercase tracking-widest block`}>Core Benefits</span>
            <h2 className={`text-2xl sm:text-3xl font-black ${theme.dialogTitle} leading-tight`}>
              Mengapa Ratusan Agensi Travel Mempercayakan Operasionalnya pada Kami?
            </h2>
            <p className={`text-xs sm:text-sm leading-relaxed font-medium ${theme.cardDesc}`}>
              Bukan sekadar mencatat data, TravelGo CRM aktif membantu Anda mengamankan setiap transaksi dan melayani customer secara maksimal.
            </p>
            <div className="pt-2">
              <Link 
                to="/register"
                className={`inline-flex items-center gap-2 px-5 py-3 ${theme.heroBtnPri} text-white text-xs font-black rounded-xl transition-all shadow-md cursor-pointer border ${isDarkMode ? "border-indigo-400/10" : "border-transparent"}`}
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
              <div key={idx} className={`border p-5 rounded-2xl transition-all flex gap-3.5 items-start ${theme.card} ${isDarkMode ? "hover:border-slate-700 shadow-2xl" : "hover:border-slate-300 shadow-sm"}`}>
                <span className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20 text-[10px] mt-0.5">
                  <FaCheck />
                </span>
                <div className="space-y-1 text-left">
                  <h4 className={`font-extrabold text-xs leading-tight ${theme.cardTitle}`}>{b.title}</h4>
                  <p className={`text-[10px] font-semibold leading-relaxed ${theme.cardDesc}`}>{b.desc}</p>
                </div>
              </div>
            ))}

          </div>

        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className={`py-20 ${theme.bottomCta} text-center relative overflow-hidden border-t border-b ${theme.border}`}>
        {/* Glow decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-3xl mx-auto px-6 space-y-6 relative z-10">
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tight ${theme.heroTitle}`}>
            Kelola Travel Agent Lebih Profesional dengan TravelGo CRM
          </h2>
          <p className={`text-xs sm:text-sm leading-relaxed font-medium max-w-xl mx-auto ${theme.cardDesc}`}>
            Pantau pelanggan, booking, transaksi, dan aktivitas penting dalam satu dashboard modern B2B SaaS.
          </p>

          <div className="flex justify-center items-center gap-4 pt-3">
            <Link
              to="/register"
              className={`text-white px-6 py-3.5 rounded-xl text-xs font-black shadow-lg transition-all border ${theme.heroBtnPri} ${isDarkMode ? "border-indigo-400/20" : "border-transparent"}`}
            >
              Start 14-Day Free Trial
            </Link>
            
            <a 
              href="mailto:sales@travelgo.com"
              className={`px-6 py-3.5 rounded-xl text-xs font-black transition-all cursor-pointer border ${theme.bottomCtaSec}`}
            >
              Contact Sales Agent
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="footer" className="bg-[#070A13] text-slate-400 border-t border-slate-800/80 py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 text-left">
          
          {/* Logo Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center shadow-md">
                <FaPlane className="text-sm transform -rotate-45" />
              </div>
              <span className="text-lg font-black text-white tracking-tight">TravelGo<span className="text-purple-400">.</span></span>
            </div>
            <p className="text-[11px] font-medium leading-relaxed text-slate-500">
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
              <p className="flex items-center gap-2"><FaEnvelope className="text-indigo-500 shrink-0" /> support@travelgo.com</p>
              <p className="flex items-center gap-2"><FaPhone className="text-indigo-500 shrink-0" /> +62 812 3456 7890</p>
              <p className="flex items-center gap-2"><FaMapMarkerAlt className="text-indigo-500 shrink-0" /> Jl. Melati No. 12, Pekanbaru, Riau</p>
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
      </footer>

      {/* SAVED BOOKMARKS DRAWER */}
      {showSavedDrawer && (
        <div className="fixed inset-0 z-[9999] overflow-hidden">
          {/* Backdrop */}
          <div 
            onClick={() => setShowSavedDrawer(false)}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300"
          />
          
          {/* Content panel */}
          <div className={`absolute inset-y-0 right-0 max-w-md w-full border-l shadow-2xl flex flex-col animate-in slide-in-from-right duration-350 ${theme.drawerPanel}`}>
            {/* Header */}
            <div className={`p-6 border-b flex items-center justify-between ${theme.drawerHeader}`}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center border border-rose-500/20">
                  <FaHeart />
                </div>
                <h3 className={`text-base font-extrabold ${theme.drawerText}`}>Item Tersimpan ({savedProducts.length})</h3>
              </div>
              <button 
                onClick={() => setShowSavedDrawer(false)}
                className={`p-2 rounded-xl transition-colors cursor-pointer ${theme.navLinks} ${theme.drawerCloseBtn}`}
              >
                <FaTimes />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {savedProducts.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto text-xl border ${isDarkMode ? "bg-slate-900/50 text-slate-500 border-slate-800" : "bg-slate-100 text-slate-400 border-slate-200"}`}>
                    <FaRegHeart />
                  </div>
                  <h4 className={`font-extrabold text-sm ${theme.drawerText}`}>Belum ada item disimpan</h4>
                  <p className={`text-xs max-w-xs mx-auto ${theme.cardDesc}`}>Cari destinasi atau tiket perjalanan impian Anda dan simpan untuk diakses nanti.</p>
                </div>
              ) : (
                products.filter(p => savedProducts.includes(p.id)).map(p => (
                  <div key={p.id} className={`flex gap-3 border p-3 rounded-2xl group transition-all ${theme.drawerCard} ${isDarkMode ? "hover:border-indigo-500/20" : "hover:border-blue-500/20"}`}>
                    <img 
                      src={p.gambar} 
                      alt={p.title} 
                      className="w-16 h-16 object-cover rounded-xl shrink-0" 
                    />
                    <div className="flex-1 min-w-0 space-y-1 text-left">
                      <span className={`text-[9px] font-black uppercase tracking-wider ${isDarkMode ? "text-indigo-400" : "text-blue-600"}`}>{p.category}</span>
                      <h4 className={`font-extrabold text-xs truncate ${theme.drawerText}`}>{p.title}</h4>
                      <p className={`font-black text-xs ${isDarkMode ? "text-indigo-400" : "text-blue-600"}`}>Rp {p.price.toLocaleString("id-ID")}</p>
                    </div>
                    <div className="flex flex-col gap-2 justify-between items-end">
                      <button 
                        onClick={() => handleToggleSave(p.id)}
                        className="text-rose-500 hover:text-rose-600 p-1.5 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                        title="Hapus"
                      >
                        <FaTrash />
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedProduct(p);
                          setShowProductModal(true);
                        }}
                        className={`text-[10px] font-bold flex items-center gap-0.5 cursor-pointer ${isDarkMode ? "text-indigo-400 hover:text-indigo-300" : "text-blue-600 hover:text-blue-750"}`}
                      >
                        <span>Detail</span>
                        <FaChevronRight className="text-[7px]" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {savedProducts.length > 0 && (
              <div className={`p-6 border-t ${isDarkMode ? "border-slate-800 bg-slate-950/90" : "border-slate-150 bg-slate-50"}`}>
                <button
                  onClick={() => {
                    setShowSavedDrawer(false);
                    // scroll to the recommendation section
                    document.getElementById("recommendations-section")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`w-full py-3 text-white font-black text-xs rounded-xl shadow-md transition-colors cursor-pointer border ${theme.heroBtnPri} ${isDarkMode ? "border-indigo-400/10" : "border-transparent"}`}
                >
                  Pesan Semua ({savedProducts.length} Item)
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* GORGEOUS PRODUCT DETAIL MODAL */}
      <Dialog open={showProductModal} onOpenChange={setShowProductModal}>
        <DialogContent className={`max-w-2xl rounded-3xl border shadow-2xl p-0 overflow-hidden ${theme.dialog}`}>
          {selectedProduct && (
            <div className="flex flex-col md:flex-row h-full">
              {/* Image side */}
              <div className="relative w-full md:w-1/2 h-64 md:h-auto min-h-[300px]">
                <img 
                  src={selectedProduct.gambar} 
                  alt={selectedProduct.title} 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <span className="absolute top-4 left-4 bg-indigo-600 text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md">
                  {selectedProduct.category}
                </span>
                
                <button
                  onClick={(e) => handleToggleSave(selectedProduct.id, e)}
                  className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all cursor-pointer border ${theme.navBtnToggle}`}
                >
                  {savedProducts.includes(selectedProduct.id) ? (
                    <FaHeart className="text-rose-500 animate-pulse text-sm" />
                  ) : (
                    <FaRegHeart className="text-slate-400 text-sm" />
                  )}
                </button>
              </div>

              {/* Info side */}
              <div className="w-full md:w-1/2 p-6 flex flex-col justify-between space-y-4 text-left">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className={`text-[10px] border px-2 py-0.5 rounded font-black tracking-widest uppercase ${theme.dialogSub} ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                      Code: {selectedProduct.code}
                    </span>
                    <span className={`text-[10px] font-extrabold ${theme.cardDesc}`}>
                      Brand: {selectedProduct.brand}
                    </span>
                  </div>

                  <h3 className={`text-xl font-black leading-tight ${theme.dialogTitle}`}>
                    {selectedProduct.title}
                  </h3>

                  <div className={`pt-2 border-t ${isDarkMode ? "border-slate-800/60" : "border-slate-150"}`}>
                    <span className={`text-[9px] font-bold uppercase block tracking-wider font-poppins ${theme.cardDesc}`}>Harga Spesial</span>
                    <p className={`text-2xl font-black ${isDarkMode ? "text-indigo-400" : "text-blue-600"}`}>
                      Rp {selectedProduct.price.toLocaleString("id-ID")}
                    </p>
                  </div>

                  <div className="pt-2 font-poppins">
                    <span className={`text-[9px] font-bold uppercase tracking-wider block mb-1 ${theme.cardDesc}`}>Status Ketersediaan</span>
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${selectedProduct.stock > 0 ? "bg-emerald-500 animate-ping" : "bg-rose-500"}`} />
                      <span className={`text-xs font-bold ${isDarkMode ? "text-slate-300" : "text-slate-750"}`}>
                        {selectedProduct.stock > 0 ? `Tersedia (Sisa ${selectedProduct.stock} pax)` : "Penuh / Habis"}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 text-xs font-semibold leading-relaxed font-poppins">
                    <span className={`text-[9px] font-bold uppercase tracking-wider block mb-1 ${theme.cardDesc}`}>Deskripsi</span>
                    <p className={theme.dialogText}>
                      Nikmati perjalanan tak terlupakan ke {selectedProduct.title.replace(/Paket Wisata|Tour|Open Trip|Tiket Pesawat|Tiket Kapal|Tiket Bus/g, '').trim()} bersama TravelGo. Paket ini sudah termasuk akomodasi, pemandu profesional, tiket masuk destinasi, serta pelayanan eksklusif 24 jam dari tim kami.
                    </p>
                  </div>
                </div>

                <div className={`pt-4 border-t flex gap-2 ${isDarkMode ? "border-slate-800/60" : "border-slate-150"}`}>
                  <button 
                    onClick={() => setShowProductModal(false)}
                    className={`flex-1 py-2 font-black text-xs rounded-xl transition-all cursor-pointer border ${theme.dialogCloseBtn}`}
                  >
                    Tutup
                  </button>
                  <button 
                    onClick={() => {
                      alert(`Pemesanan ${selectedProduct.title} berhasil diajukan! Admin CRM kami akan segera menghubungi Anda.`);
                      setShowProductModal(false);
                    }}
                    disabled={selectedProduct.stock === 0}
                    className={`flex-1 py-2 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer border ${theme.heroBtnPri} ${isDarkMode ? "border-indigo-400/10" : "border-transparent"} disabled:opacity-50`}
                  >
                    Pesan Sekarang
                  </button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}