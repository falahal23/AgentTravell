import { useState, useEffect, useRef, useMemo } from "react";
import { supabase, getNextId } from "../lib/supabase";
import { 
  FaEye, FaTrash, FaSearch, FaUsers, FaChevronLeft, FaChevronRight, 
  FaPlus, FaEdit, FaCrown, FaUserAlt, FaPhoneAlt, FaEnvelope, 
  FaCalendarAlt, FaToggleOn, FaToggleOff, FaDownload, FaSyncAlt,
  FaAward, FaGift, FaTicketAlt, FaChartPie, FaChartLine, FaChartBar, FaExchangeAlt, FaLock, FaCheckCircle
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, 
  BarChart, Bar 
} from "recharts";

export default function Membership() {
  const [isAdminView, setIsAdminView] = useState(true);
  const [memberships, setMemberships] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [kontaks, setKontaks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Detailed Member View states (loaded on-demand)
  const [selectedMemberBookings, setSelectedMemberBookings] = useState([]);
  const [selectedMemberInteractions, setSelectedMemberInteractions] = useState([]);
  const [selectedMemberActivities, setSelectedMemberActivities] = useState([]);

  // Filters & State
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  
  // Selected Member for Portal View & Details
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [detailMember, setDetailMember] = useState(null);
  
  // Modals CRUD
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [targetMember, setTargetMember] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    customerId: "",
    namaLengkap: "",
    email: "",
    phone: "",
    levelMembership: "Bronze",
    statusMember: "Member",
    statusAktif: "Aktif",
    referralCode: ""
  });

  // Simulated Points & Vouchers for Member Portal
  const [claimedVouchers, setClaimedVouchers] = useState([]);
  const [poppingPoint, setPoppingPoint] = useState(null);
  const [poppingText, setPoppingText] = useState("");

  const searchInputRef = useRef(null);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch only necessary tables and columns in parallel
      const [
        { data: memberData, error: memberErr },
        { data: custData, error: custErr },
        { data: kontakData, error: kontakErr },
        { data: trxData, error: trxErr }
      ] = await Promise.all([
        supabase.from("membership").select("*"),
        supabase.from("customers").select("id_customer, nama_lengkap, username, jenis_kelamin, tanggal_lahir"),
        supabase.from("kontak").select("id_customer, email, no_hp"),
        supabase.from("transaksi").select("id_customer, total_transaksi")
      ]);

      if (memberErr) throw memberErr;
      if (custErr) throw custErr;
      if (kontakErr) throw kontakErr;
      if (trxErr) throw trxErr;
      
      setMemberships(memberData || []);
      setCustomers(custData || []);
      setKontaks(kontakData || []);
      setTransactions(trxData || []);

      // Set default selected member for portal view if not set
      if (memberData && memberData.length > 0 && !selectedCustomerId) {
        setSelectedCustomerId(memberData[0].id_customer);
      }

    } catch (err) {
      console.error(err);
      setError(err.message || "Gagal memuat database membership.");
    } finally {
      setLoading(false);
    }
  };

  // On-demand fetch of detailed customer data for Member View
  useEffect(() => {
    if (!selectedCustomerId) return;

    const fetchSelectedMemberDetails = async () => {
      try {
        const [
          { data: trxData },
          { data: intData },
          { data: aktData }
        ] = await Promise.all([
          supabase.from("transaksi").select("*").eq("id_customer", selectedCustomerId),
          supabase.from("interaksi").select("*").eq("id_customer", selectedCustomerId),
          supabase.from("aktivitas").select("*").eq("id_customer", selectedCustomerId)
        ]);

        setSelectedMemberBookings(trxData || []);
        setSelectedMemberInteractions(intData || []);
        setSelectedMemberActivities(aktData || []);
      } catch (err) {
        console.error("Gagal memuat detail data member:", err);
      }
    };

    fetchSelectedMemberDetails();
  }, [selectedCustomerId]);

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, levelFilter, statusFilter]);

  // Combine Member + Customer + Kontak in Memory
  const combinedMembers = useMemo(() => {
    return memberships.map(m => {
      const cust = customers.find(c => c.id_customer === m.id_customer);
      const kontak = kontaks.find(k => k.id_customer === m.id_customer);
      const custTrx = transactions.filter(t => t.id_customer === m.id_customer);
      const totalSpend = custTrx.reduce((sum, t) => sum + (t.total_transaksi || 0), 0);
      
      return {
        ...m,
        namaLengkap: cust?.nama_lengkap || cust?.username || m.id_customer,
        username: cust?.username || "",
        jenisKelamin: cust?.jenis_kelamin || "Laki-laki",
        tanggalLahir: cust?.tanggal_lahir || "2000-01-01",
        email: kontak?.email || "-",
        phone: kontak?.no_hp || "-",
        totalSpend,
        bookingCount: custTrx.length
      };
    });
  }, [memberships, customers, kontaks, transactions]);

  // Filtered members for Directory Table
  const filteredMembers = useMemo(() => {
    return combinedMembers.filter(m => {
      const keyword = search.toLowerCase();
      const matchSearch = 
        m.namaLengkap.toLowerCase().includes(keyword) ||
        m.id_customer.toLowerCase().includes(keyword) ||
        m.email.toLowerCase().includes(keyword) ||
        m.phone.includes(keyword) ||
        m.referral_code?.toLowerCase().includes(keyword);

      const matchLevel = levelFilter === "All" || m.level_membership === levelFilter;
      const matchStatus = statusFilter === "All" || m.status_member === statusFilter;

      return matchSearch && matchLevel && matchStatus;
    });
  }, [combinedMembers, search, levelFilter, statusFilter]);

  // Paginated Data
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMembers = useMemo(() => {
    return filteredMembers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredMembers, startIndex, itemsPerPage]);

  // Simulated Logged-In Member Data
  const currentMemberPortalData = useMemo(() => {
    if (!selectedCustomerId) return null;
    return combinedMembers.find(m => m.id_customer === selectedCustomerId);
  }, [combinedMembers, selectedCustomerId]);

  // Booking & Interaction History for the Portal View (Loaded on-demand)
  const memberPortalBookings = selectedMemberBookings;
  const memberPortalInteractions = selectedMemberInteractions;
  const memberPortalActivities = selectedMemberActivities;

  // Calculated Points (1 point per Rp 10.000 spent)
  const memberPoints = useMemo(() => {
    if (!currentMemberPortalData) return 0;
    const pointsEarned = Math.floor(currentMemberPortalData.totalSpend / 10000);
    // Deduct claimed points
    const pointsClaimed = claimedVouchers.reduce((sum, v) => sum + v.cost, 0);
    return Math.max(0, pointsEarned - pointsClaimed);
  }, [currentMemberPortalData, claimedVouchers]);

  // Analytics Math
  const totalMemberCount = combinedMembers.filter(m => m.status_member === "Member").length;
  const activeMemberCount = combinedMembers.filter(m => m.status_aktif === "Aktif" && m.status_member === "Member").length;
  const repeatCustomerCount = useMemo(() => {
    // customers with bookingCount > 1
    return combinedMembers.filter(m => m.bookingCount > 1).length;
  }, [combinedMembers]);
  const totalRevenueFromMembers = useMemo(() => {
    return combinedMembers.reduce((sum, m) => sum + m.totalSpend, 0);
  }, [combinedMembers]);

  // 1. Level Distribution (Pie Chart)
  const pieData = useMemo(() => {
    const gold = combinedMembers.filter(m => m.level_membership === "Gold").length;
    const silver = combinedMembers.filter(m => m.level_membership === "Silver").length;
    const bronze = combinedMembers.filter(m => m.level_membership === "Bronze").length;
    return [
      { name: "Gold", value: gold, color: "#eab308" },
      { name: "Silver", value: silver, color: "#94a3b8" },
      { name: "Bronze", value: bronze, color: "#f97316" }
    ];
  }, [combinedMembers]);

  // 2. Growth over Time (Line Chart)
  const lineData = useMemo(() => {
    const countsByMonth = {};
    combinedMembers.forEach(m => {
      if (m.tanggal_daftar) {
        const month = m.tanggal_daftar.slice(0, 7); // YYYY-MM
        countsByMonth[month] = (countsByMonth[month] || 0) + 1;
      }
    });
    // Sort keys and build cumulative growth
    const sortedMonths = Object.keys(countsByMonth).sort();
    let cumulative = 0;
    return sortedMonths.map(month => {
      cumulative += countsByMonth[month];
      return { month, members: cumulative };
    });
  }, [combinedMembers]);

  // 3. Top Customer Revenue (Bar Chart)
  const barData = useMemo(() => {
    return [...combinedMembers]
      .sort((a, b) => b.totalSpend - a.totalSpend)
      .slice(0, 5)
      .map(m => ({
        name: m.namaLengkap.split(" ")[0],
        spend: m.totalSpend / 1000000 // Convert to Millions
      }));
  }, [combinedMembers]);

  // 4. Marketing Insight (Acquisition Source)
  const acquisitionData = useMemo(() => {
    // Mock acquisition data based on user id suffix or random spread matching Supabase seed
    const sources = { "Google Search": 0, "Instagram": 0, "YouTube": 0, "Marketplace": 0, "TikTok": 0 };
    combinedMembers.forEach(m => {
      const idx = m.id_customer.charCodeAt(m.id_customer.length - 1) % 5;
      const keys = Object.keys(sources);
      sources[keys[idx]]++;
    });
    return Object.keys(sources).map(key => ({ name: key, count: sources[key] }));
  }, [combinedMembers]);

  // CRUD Operations
  const handleOpenAdd = () => {
    const randomId = "CUST" + Math.floor(1000 + Math.random() * 9000);
    setFormData({
      customerId: randomId,
      namaLengkap: "",
      email: "",
      phone: "",
      levelMembership: "Bronze",
      statusMember: "Member",
      statusAktif: "Aktif",
      referralCode: "REF-" + Math.random().toString(36).substring(2, 7).toUpperCase()
    });
    setShowAddModal(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      // Fetch next IDs
      const nextKontakId = await getNextId("kontak", "id_kontak");
      const nextMembershipId = await getNextId("membership", "id_membership");

      // 1. Insert customer
      const { error: custErr } = await supabase.from("customers").insert([
        {
          id_customer: formData.customerId,
          nama_lengkap: formData.namaLengkap,
          username: formData.namaLengkap.toLowerCase().replace(/\s+/g, "_"),
          jenis_kelamin: "Laki-laki",
          tanggal_lahir: "2000-01-01"
        }
      ]);
      if (custErr) throw custErr;

      // 2. Insert kontak
      const { error: kontakErr } = await supabase.from("kontak").insert([
        {
          id_kontak: nextKontakId,
          id_customer: formData.customerId,
          email: formData.email,
          no_hp: formData.phone,
          alamat: "-",
          kota: "-",
          provinsi: "-"
        }
      ]);
      if (kontakErr) throw kontakErr;

      // 3. Insert membership
      const { error: memberErr } = await supabase.from("membership").insert([
        {
          id_membership: nextMembershipId,
          id_customer: formData.customerId,
          level_membership: formData.levelMembership,
          status_member: formData.statusMember,
          status_aktif: formData.statusAktif,
          tanggal_daftar: new Date().toISOString().split("T")[0],
          referral_code: formData.referralCode
        }
      ]);
      if (memberErr) throw memberErr;

      await fetchAllData();
      setShowAddModal(false);
    } catch (err) {
      console.error(err);
      alert("Gagal menambahkan member: " + err.message);
    }
  };

  const handleOpenEdit = (member) => {
    setFormData({
      customerId: member.id_customer,
      namaLengkap: member.namaLengkap,
      email: member.email,
      phone: member.phone,
      levelMembership: member.level_membership,
      statusMember: member.status_member,
      statusAktif: member.status_aktif,
      referralCode: member.referral_code || ""
    });
    setTargetMember(member);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      // Update customer name
      const { error: custErr } = await supabase
        .from("customers")
        .update({ nama_lengkap: formData.namaLengkap })
        .eq("id_customer", formData.customerId);
      if (custErr) throw custErr;

      // Update kontak
      const { error: kontakErr } = await supabase
        .from("kontak")
        .update({ email: formData.email, no_hp: formData.phone })
        .eq("id_customer", formData.customerId);
      if (kontakErr) throw kontakErr;

      // Update membership
      const { error: memberErr } = await supabase
        .from("membership")
        .update({
          level_membership: formData.levelMembership,
          status_member: formData.statusMember,
          status_aktif: formData.statusAktif,
          referral_code: formData.referralCode
        })
        .eq("id_customer", formData.customerId);
      if (memberErr) throw memberErr;

      await fetchAllData();
      setShowEditModal(false);
    } catch (err) {
      console.error(err);
      alert("Gagal merubah data member: " + err.message);
    }
  };

  const handleUpgradeClick = (member) => {
    setFormData({
      customerId: member.id_customer,
      namaLengkap: member.namaLengkap,
      levelMembership: member.level_membership === "Bronze" ? "Silver" : "Gold",
      statusMember: member.status_member,
      statusAktif: member.status_aktif,
      email: member.email,
      phone: member.phone,
      referralCode: member.referral_code
    });
    setTargetMember(member);
    setShowUpgradeModal(true);
  };

  const handleUpgradeSubmit = async (e) => {
    e.preventDefault();
    try {
      const { error: memberErr } = await supabase
        .from("membership")
        .update({ level_membership: formData.levelMembership })
        .eq("id_customer", formData.customerId);
      if (memberErr) throw memberErr;

      // Display animated points pop
      setPoppingText("UPGRADED!");
      setPoppingPoint(formData.levelMembership);
      setTimeout(() => {
        setPoppingPoint(null);
      }, 2500);

      await fetchAllData();
      setShowUpgradeModal(false);
    } catch (err) {
      console.error(err);
      alert("Gagal memperbarui level membership: " + err.message);
    }
  };

  const handleToggleStatus = async (member) => {
    try {
      const newStatus = member.status_aktif === "Aktif" ? "Nonaktif" : "Aktif";
      const { error: err } = await supabase
        .from("membership")
        .update({ status_aktif: newStatus })
        .eq("id_customer", member.id_customer);
      if (err) throw err;

      await fetchAllData();
    } catch (err) {
      console.error(err);
      alert("Gagal memperbarui status aktif: " + err.message);
    }
  };

  const handleDeleteClick = (member) => {
    setTargetMember(member);
    setShowDeleteConfirm(true);
  };

  const handleDeleteSubmit = async () => {
    try {
      const { error: err } = await supabase
        .from("membership")
        .delete()
        .eq("id_customer", targetMember.id_customer);
      if (err) throw err;

      // Also clean from customers and kontak to avoid orphans
      await supabase.from("kontak").delete().eq("id_customer", targetMember.id_customer);
      await supabase.from("customers").delete().eq("id_customer", targetMember.id_customer);

      await fetchAllData();
      setShowDeleteConfirm(false);
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus data membership: " + err.message);
    }
  };

  // Export Data to CSV
  const handleExportCSV = () => {
    const headers = ["ID Customer", "Nama Lengkap", "Email", "No HP", "Level", "Status Member", "Status Aktif", "Tanggal Daftar", "Total Belanja"];
    const csvRows = [
      headers.join(","),
      ...filteredMembers.map(m => [
        m.id_customer,
        `"${m.namaLengkap}"`,
        m.email,
        m.phone,
        m.level_membership,
        m.status_member,
        m.status_aktif,
        m.tanggal_daftar,
        m.totalSpend
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvRows], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `Data_Membership_Export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Simulated Loyalty Voucher Claim
  const handleClaimVoucher = (voucher) => {
    if (memberPoints < voucher.cost) {
      alert("Poin Anda tidak mencukupi untuk klaim voucher ini.");
      return;
    }
    const alreadyClaimed = claimedVouchers.some(v => v.id === voucher.id);
    if (alreadyClaimed) {
      alert("Anda sudah mengklaim voucher ini.");
      return;
    }

    // Deduct points via local state and trigger visual popping point animation
    setClaimedVouchers([...claimedVouchers, voucher]);
    setPoppingText(`-${voucher.cost} POIN`);
    setPoppingPoint(voucher.cost);
    setTimeout(() => {
      setPoppingPoint(null);
    }, 2000);
  };

  // Apple & Gemini Styles
  const getLevelStyle = (level) => {
    switch (level) {
      case "Gold": 
        return "bg-gradient-to-br from-yellow-400 to-amber-600 text-white border-transparent shadow-[0_4px_12px_rgba(234,179,8,0.25)] shadow-yellow-500/10";
      case "Silver": 
        return "bg-gradient-to-br from-slate-300 to-slate-500 text-white border-transparent shadow-[0_4px_12px_rgba(148,163,184,0.2)]";
      case "Bronze": 
        return "bg-gradient-to-br from-orange-400 to-orange-600 text-white border-transparent shadow-[0_4px_12px_rgba(249,115,22,0.2)]";
      default: 
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusBadgeStyle = (status) => {
    return status === "Member" 
      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
      : "bg-rose-500/10 text-rose-600 border-rose-500/20";
  };

  const getActiveBadgeStyle = (status) => {
    return status === "Aktif" 
      ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
      : "bg-slate-500/10 text-slate-600 border-slate-500/20";
  };

  const formatRupiah = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(value);
  };

  // Mock rewards data
  const rewardsCatalog = [
    { id: "v1", title: "Diskon 10% Tiket Raja Ampat", cost: 100, desc: "Potongan harga langsung untuk paket wisata Raja Ampat." },
    { id: "v2", title: "Voucher Cashback Rp 500rb", cost: 350, desc: "Cashback langsung ditambahkan pada transaksi berikutnya." },
    { id: "v3", title: "Gratis Akses Lounge Bandara", cost: 500, desc: "Akses VIP lounge bandara domestik sekali jalan." },
    { id: "v4", title: "Diskon Hotel Ubud 2 Malam", cost: 200, desc: "Diskon menginap 2 malam di resort Ubud terpilih." }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin"></div>
          <div className="absolute inset-0 m-auto w-6 h-6 bg-blue-500/10 rounded-full blur-xs"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-lg mx-auto mt-12 bg-rose-50/50 backdrop-blur-md rounded-3xl border border-rose-100 text-center space-y-4">
        <div className="text-rose-500 text-4xl">⚠️</div>
        <h3 className="font-bold text-rose-800 text-lg">Gagal Memuat Data</h3>
        <p className="text-sm text-rose-600/80">{error}</p>
        <Button onClick={fetchAllData} variant="outline" className="rounded-xl border-rose-200 text-rose-700 bg-white hover:bg-rose-50">
          <FaSyncAlt className="mr-2" /> Coba Lagi
        </Button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-50/60 p-1 sm:p-4 space-y-8 overflow-hidden font-sans">
      
      {/* BACKGROUND FLOATING GRADIENT LIGHTS (GEMINI STYLE) */}
      <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-blue-400/8 rounded-full blur-[110px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] bg-purple-400/8 rounded-full blur-[130px] pointer-events-none" />

      {/* FLOATING POINT POPPING NOTIFICATION */}
      {poppingPoint && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold px-6 py-3 rounded-full shadow-2xl shadow-blue-500/30 border border-white/20 flex items-center gap-2 animate-bounce z-50">
          <FaCrown className="text-yellow-300" />
          <span>{poppingText}</span>
        </div>
      )}

      {/* HEADER WITH APPLE MINIMAL TOGGLE */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 bg-clip-text text-transparent">
            Membership Program
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            {isAdminView ? "Dashboard Summary & Direktori Member CRM" : "Simulasi Portal Loyalitas Anggota Aktif"}
          </p>
        </div>

        {/* APPLE-STYLE TAB SELECTOR */}
        <div className="bg-slate-100/80 backdrop-blur-md p-1.5 rounded-2xl flex border border-slate-200/50 shadow-inner">
          <button 
            onClick={() => setIsAdminView(true)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
              isAdminView 
                ? "bg-white text-slate-900 shadow-sm border-t border-slate-100" 
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <FaCrown className={isAdminView ? "text-amber-500" : ""} /> Admin View
          </button>
          <button 
            onClick={() => setIsAdminView(false)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
              !isAdminView 
                ? "bg-white text-slate-900 shadow-sm border-t border-slate-100" 
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <FaUserAlt className={!isAdminView ? "text-blue-500" : ""} /> Member View
          </button>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* ADMIN VIEW CONTAINER */}
      {/* ────────────────────────────────────────────────────────── */}
      {isAdminView ? (
        <div className="space-y-8 animate-in fade-in duration-500">
          
          {/* KPI CARDS (APPLE ACCENT) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Total Member", value: totalMemberCount, desc: "Terdaftar dalam Program", icon: FaUsers, color: "from-blue-600 to-sky-500", glow: "shadow-blue-500/10" },
              { label: "Member Aktif", value: activeMemberCount, desc: "Status Akun Aktif", icon: FaCheckCircle, color: "from-emerald-600 to-teal-500", glow: "shadow-emerald-500/10" },
              { label: "Repeat Customer", value: repeatCustomerCount, desc: "Lebih dari 1 Transaksi", icon: FaExchangeAlt, color: "from-indigo-600 to-purple-500", glow: "shadow-indigo-500/10" },
              { label: "Total Revenue Member", value: formatRupiah(totalRevenueFromMembers), desc: "Kontribusi Anggota", icon: FaCrown, color: "from-amber-500 to-yellow-600", glow: "shadow-amber-500/10" }
            ].map((kpi, idx) => (
              <Card 
                key={idx} 
                className={`relative overflow-hidden bg-white/70 backdrop-blur-md border border-slate-100 rounded-3xl hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-xl ${kpi.glow}`}
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{kpi.label}</span>
                    <span className={`w-8 h-8 rounded-xl bg-gradient-to-br ${kpi.color} text-white flex items-center justify-center text-sm shadow-md`}>
                      <kpi.icon />
                    </span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">{kpi.value}</h2>
                    <p className="text-xs font-medium text-slate-500 mt-1">{kpi.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* ANALYTICS SECTION (CHARTS) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Pie Chart: Level Distribution */}
            <Card className="bg-white/70 backdrop-blur-md border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="border-b border-slate-50 pb-4">
                <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <FaChartPie className="text-amber-500" /> Distribusi Tier Membership
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 flex flex-col items-center justify-center min-h-[300px]">
                <div className="w-full h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie 
                        data={pieData} 
                        cx="50%" 
                        cy="50%" 
                        innerRadius={60} 
                        outerRadius={80} 
                        paddingAngle={5} 
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} Members`, "Jumlah"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex gap-6 mt-4">
                  {pieData.map((d, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></span>
                      <span>{d.name} ({d.value})</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Line Chart: Member Growth */}
            <Card className="bg-white/70 backdrop-blur-md border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="border-b border-slate-50 pb-4">
                <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <FaChartLine className="text-blue-500" /> Pertumbuhan Anggota Baru
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 min-h-[300px]">
                <div className="w-full h-56">
                  {lineData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={lineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                        <Tooltip />
                        <Line type="monotone" dataKey="members" stroke="#2563eb" strokeWidth={3} dot={{ fill: "#2563eb", r: 4 }} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-xs text-slate-400 font-semibold">Tidak cukup data pendaftaran</div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Bar Chart: Top Spenders */}
            <Card className="bg-white/70 backdrop-blur-md border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="border-b border-slate-50 pb-4">
                <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <FaChartBar className="text-indigo-500" /> Pengeluaran Terbesar Anggota (Rp Juta)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 min-h-[300px]">
                <div className="w-full h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                      <Tooltip formatter={(value) => [`Rp ${Number(value).toFixed(2)} Juta`, "Pengeluaran"]} />
                      <Bar dataKey="spend" fill="#4f46e5" radius={[6, 6, 0, 0]} maxBarSize={30}>
                        {barData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? "#4f46e5" : "#6366f1"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* MEMBER DIRECTORY (TABLE & DIRECT ACTIONS) */}
          <Card className="overflow-hidden rounded-3xl border border-slate-100 bg-white/70 backdrop-blur-md shadow-lg shadow-slate-100/50">
            
            {/* Header + Search/Filters */}
            <CardHeader className="border-b border-slate-100 bg-slate-50/20 p-6 space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <CardTitle className="text-base font-extrabold text-slate-800">Direktori Member CRM</CardTitle>
                  <p className="text-xs text-slate-500 font-medium">Menampilkan {filteredMembers.length} dari {memberships.length} customer</p>
                </div>
                
                {/* Actions */}
                <div className="flex gap-2 w-full md:w-auto">
                  <Button onClick={handleOpenAdd} className="bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/10 flex-1 md:flex-none">
                    <FaPlus className="mr-1.5" /> Tambah Member
                  </Button>
                  <Button onClick={handleExportCSV} variant="outline" className="border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-600 flex-1 md:flex-none">
                    <FaDownload className="mr-1.5" /> Export CSV
                  </Button>
                </div>
              </div>

              {/* Filters Area */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <div className="relative flex-1">
                  <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                  <Input 
                    ref={searchInputRef}
                    placeholder="Cari ID, nama member, email, atau referral..." 
                    className="pl-10 h-10 border-slate-200/80 bg-white/80 focus:bg-white rounded-xl text-sm"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                
                <div className="flex gap-3">
                  <select 
                    value={levelFilter} 
                    onChange={(e) => setLevelFilter(e.target.value)}
                    className="h-10 text-xs font-bold border border-slate-200/80 rounded-xl px-3 bg-white outline-none text-slate-600"
                  >
                    <option value="All">Semua Tier</option>
                    <option value="Gold">Gold</option>
                    <option value="Silver">Silver</option>
                    <option value="Bronze">Bronze</option>
                  </select>

                  <select 
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="h-10 text-xs font-bold border border-slate-200/80 rounded-xl px-3 bg-white outline-none text-slate-600"
                  >
                    <option value="All">Semua Status</option>
                    <option value="Member">Member Only</option>
                    <option value="Non-Member">Non-Member Only</option>
                  </select>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                      <TableHead className="w-12 text-center py-4 font-bold text-slate-500 text-xs uppercase">No</TableHead>
                      <TableHead className="font-bold text-slate-500 text-xs uppercase">Identitas Member</TableHead>
                      <TableHead className="font-bold text-slate-500 text-xs uppercase">Tier Level</TableHead>
                      <TableHead className="font-bold text-slate-500 text-xs uppercase">Status Akun</TableHead>
                      <TableHead className="font-bold text-slate-500 text-xs uppercase">Referral Code</TableHead>
                      <TableHead className="font-bold text-slate-500 text-xs uppercase">Tanggal Join</TableHead>
                      <TableHead className="font-bold text-slate-500 text-xs uppercase text-right">Total Spend</TableHead>
                      <TableHead className="w-44 text-center font-bold text-slate-500 text-xs uppercase">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedMembers.length > 0 ? (
                      paginatedMembers.map((member, index) => (
                        <TableRow key={member.id_customer} className="hover:bg-slate-50/30 transition-colors">
                          <TableCell className="text-center font-semibold text-slate-400">{startIndex + index + 1}</TableCell>
                          <TableCell>
                            <div className="font-extrabold text-slate-800 text-sm">{member.namaLengkap}</div>
                            <span className="text-[11px] font-bold text-slate-400 mr-2">ID: {member.id_customer}</span>
                            <span className="text-[11px] font-medium text-slate-500">{member.email}</span>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${getLevelStyle(member.level_membership)} border px-3 py-1 font-extrabold text-[10px] rounded-full`}>
                              <FaCrown className="inline mr-1" /> {member.level_membership}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <Badge variant="outline" className={`${getStatusBadgeStyle(member.status_member)} font-extrabold text-[10px] rounded-full w-fit`}>
                                {member.status_member}
                              </Badge>
                              <Badge variant="outline" className={`${getActiveBadgeStyle(member.status_aktif)} font-bold text-[9px] rounded-full w-fit`}>
                                {member.status_aktif}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold text-slate-700 tracking-wider text-xs">{member.referral_code || "-"}</TableCell>
                          <TableCell className="font-semibold text-slate-500 text-xs">{member.tanggal_daftar || "-"}</TableCell>
                          <TableCell className="font-black text-slate-800 text-sm text-right">{formatRupiah(member.totalSpend)}</TableCell>
                          <TableCell>
                            <div className="flex justify-center gap-1.5">
                              <Button 
                                size="icon" 
                                variant="outline"
                                onClick={() => {
                                  setSelectedCustomerId(member.id_customer);
                                  setDetailMember(member);
                                }}
                                className="w-8 h-8 rounded-xl border-slate-200 text-slate-500 hover:text-slate-800"
                                title="Lihat Detail & History"
                              >
                                <FaEye className="w-3.5 h-3.5" />
                              </Button>
                              <Button 
                                size="icon" 
                                variant="outline"
                                onClick={() => handleOpenEdit(member)}
                                className="w-8 h-8 rounded-xl border-slate-200 text-blue-500 hover:text-blue-700 hover:bg-blue-50/20"
                                title="Edit Member"
                              >
                                <FaEdit className="w-3.5 h-3.5" />
                              </Button>
                              <Button 
                                size="icon" 
                                variant="outline"
                                onClick={() => handleUpgradeClick(member)}
                                className="w-8 h-8 rounded-xl border-slate-200 text-amber-500 hover:text-amber-700 hover:bg-amber-50/20"
                                title="Upgrade Tier"
                              >
                                <FaCrown className="w-3.5 h-3.5" />
                              </Button>
                              <Button 
                                size="icon" 
                                variant="outline"
                                onClick={() => handleToggleStatus(member)}
                                className={`w-8 h-8 rounded-xl border-slate-200 ${member.status_aktif === 'Aktif' ? 'text-red-500 hover:bg-red-50/20' : 'text-emerald-500 hover:bg-emerald-50/20'}`}
                                title={member.status_aktif === 'Aktif' ? "Nonaktifkan" : "Aktifkan"}
                              >
                                {member.status_aktif === 'Aktif' ? <FaToggleOff className="w-4 h-4" /> : <FaToggleOn className="w-4 h-4" />}
                              </Button>
                              <Button 
                                size="icon" 
                                variant="outline"
                                onClick={() => handleDeleteClick(member)}
                                className="w-8 h-8 rounded-xl border-slate-200 text-rose-600 hover:bg-rose-50/20"
                                title="Hapus Member"
                              >
                                <FaTrash className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-12 text-slate-400 font-semibold">Tidak ada member ditemukan.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* COOL PAGINATION */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 border-t border-slate-100 bg-slate-50/30">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-xs text-slate-500 font-medium">
                    Menampilkan <span className="font-semibold text-slate-800">{filteredMembers.length === 0 ? 0 : startIndex + 1}</span> sampai{" "}
                    <span className="font-semibold text-slate-800">{Math.min(startIndex + itemsPerPage, filteredMembers.length)}</span> dari{" "}
                    <span className="font-semibold text-slate-800">{filteredMembers.length}</span> data
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-300 text-xs">|</span>
                    <span className="text-xs text-slate-500">Tampilkan:</span>
                    <select 
                      value={itemsPerPage} 
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="text-xs font-semibold bg-white border border-slate-200/80 rounded-lg p-1 text-slate-700 outline-none focus:border-blue-600 transition-colors shadow-xs"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="w-8 h-8 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-55 transition-all"
                    disabled={currentPage === 1} 
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    <FaChevronLeft className="h-3 w-3" />
                  </Button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)
                    .map((page, idx, arr) => {
                      const prevPage = arr[idx - 1];
                      const isCurrent = currentPage === page;
                      return (
                        <div key={page} className="flex items-center">
                          {prevPage && page - prevPage > 1 && (
                            <span className="text-slate-300 text-xs px-1.5 font-medium">...</span>
                          )}
                          <Button
                            variant={isCurrent ? "default" : "outline"}
                            className={`w-8 h-8 rounded-xl font-bold text-xs p-0 transition-all ${
                              isCurrent 
                                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/15" 
                                : "border-slate-200 text-slate-600 hover:bg-slate-100"
                            }`}
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </Button>
                        </div>
                      );
                    })}

                  <Button 
                    variant="outline" 
                    size="icon"
                    className="w-8 h-8 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-55 transition-all"
                    disabled={currentPage === totalPages || totalPages === 0} 
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    <FaChevronRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* MARKETING INSIGHT AREA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Acquisition Sources */}
            <Card className="bg-white/70 backdrop-blur-md border border-slate-100 rounded-3xl shadow-sm">
              <CardHeader className="border-b border-slate-50 pb-4">
                <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <FaUsers className="text-indigo-500" /> Sumber Akuisisi Member Baru
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {acquisitionData.map((item, idx) => {
                    const pct = Math.round((item.count / memberships.length) * 100);
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs font-bold text-slate-600">
                          <span>{item.name}</span>
                          <span>{item.count} Member ({pct}%)</span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-1000"
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Promo Codes Used */}
            <Card className="bg-white/70 backdrop-blur-md border border-slate-100 rounded-3xl shadow-sm">
              <CardHeader className="border-b border-slate-50 pb-4">
                <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <FaTicketAlt className="text-purple-500" /> Performa Penggunaan Promo CRM
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 flex flex-col justify-center min-h-[190px]">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Promo Aktif Diklaim", value: "320 Kali", color: "text-green-600", bg: "bg-green-50" },
                    { label: "Voucher Terpakai", value: "245 Kupon", color: "text-indigo-600", bg: "bg-indigo-50" },
                    { label: "Rata-rata Diskon", value: "Rp 150.000", color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "Total Penghematan", value: "Rp 36,7 Juta", color: "text-amber-600", bg: "bg-amber-50" }
                  ].map((stat, idx) => (
                    <div key={idx} className={`${stat.bg} p-4 rounded-2xl flex flex-col justify-center`}>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{stat.label}</span>
                      <span className={`text-lg font-black ${stat.color} mt-1`}>{stat.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      ) : (
        // ──────────────────────────────────────────────────────────
        // MEMBER VIEW CONTAINER (MEMBER PORTAL)
        // ──────────────────────────────────────────────────────────
        <div className="space-y-8 animate-in fade-in duration-500">
          
          {/* SIMULATED ACCOUNT SELECTOR */}
          <Card className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-0 rounded-3xl text-white shadow-xl relative overflow-hidden">
            
            {/* Design circle overlay */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <CardContent className="p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
              <div className="space-y-2">
                <span className="bg-blue-500/20 text-blue-300 font-extrabold text-[10px] tracking-widest px-3 py-1 rounded-full uppercase border border-blue-500/30">
                  Simulasi Akun Pelanggan
                </span>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  Selamat Datang di Portal, <span className="bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">{currentMemberPortalData?.namaLengkap}</span>!
                </h2>
                <p className="text-xs text-slate-300/80 font-medium">
                  Halaman ini menampilkan visualisasi portal sebagaimana yang akan dilihat oleh member {currentMemberPortalData?.namaLengkap}.
                </p>
              </div>

              {/* Selector Dropdown */}
              <div className="space-y-1.5 w-full md:w-auto flex-shrink-0">
                <label className="text-[10px] font-black tracking-wider text-slate-400 uppercase">Pilih Anggota Aktif:</label>
                <select 
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full md:w-64 h-11 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-3 text-sm font-bold text-white outline-none cursor-pointer focus:border-blue-400"
                >
                  {combinedMembers.map(m => (
                    <option key={m.id_customer} value={m.id_customer} className="text-slate-800 font-bold">
                      {m.namaLengkap} ({m.level_membership})
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* PORTAL MAIN BODY */}
          {currentMemberPortalData ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Member Card & Loyalty */}
              <div className="lg:col-span-1 space-y-8">
                
                {/* Apple-style Member Tier Card */}
                <div className={`relative rounded-3xl p-6 overflow-hidden border border-white/10 text-white shadow-2xl flex flex-col justify-between min-h-[220px] transition-transform duration-300 hover:scale-[1.02] ${getLevelStyle(currentMemberPortalData.level_membership)}`}>
                  
                  {/* Decorative shines */}
                  <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/70">Loyalty Pass</p>
                      <h3 className="text-xl font-black mt-1">{currentMemberPortalData.namaLengkap}</h3>
                    </div>
                    <span className="text-3xl"><FaPlane className="transform -rotate-45" /></span>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/60">ID Customer</p>
                    <p className="font-semibold text-sm tracking-wider">{currentMemberPortalData.id_customer}</p>
                    
                    <div className="flex justify-between items-end pt-2">
                      <div>
                        <p className="text-[9px] font-bold text-white/50 uppercase">Level Tier</p>
                        <div className="flex items-center gap-1 font-black text-sm tracking-wide mt-0.5">
                          <FaCrown /> {currentMemberPortalData.level_membership}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] font-bold text-white/50 uppercase">Referral Code</p>
                        <p className="font-extrabold text-sm tracking-wider mt-0.5">{currentMemberPortalData.referral_code || "-"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Simulated Points Panel (Apple Ring/Bar Tracker) */}
                <Card className="bg-white/70 backdrop-blur-md border border-slate-100 rounded-3xl shadow-md overflow-hidden relative">
                  
                  {/* Glowing background */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 bg-blue-400/5 rounded-full blur-xl pointer-events-none" />

                  <CardContent className="p-6 space-y-6 flex flex-col items-center relative z-10 text-center">
                    
                    {/* Ring Tracker */}
                    <div className="relative w-36 h-36 flex items-center justify-center rounded-full border-8 border-slate-100 shadow-inner bg-slate-50/50">
                      
                      {/* Simulated filling percentage */}
                      <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                        <circle 
                          cx="72" cy="72" r="64" 
                          fill="transparent" 
                          stroke="#3b82f6" 
                          strokeWidth="8" 
                          strokeDasharray="402"
                          strokeDashoffset={402 - (Math.min(100, (memberPoints / 600) * 100) / 100) * 402}
                          strokeLinecap="round"
                          className="transition-all duration-1000"
                        />
                      </svg>

                      <div className="space-y-0.5">
                        <h2 className="text-3xl font-black text-slate-800">{memberPoints}</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Poin Saya</p>
                      </div>
                    </div>

                    <div className="space-y-2 w-full">
                      <div className="flex justify-between text-xs font-bold text-slate-500">
                        <span>Tier {currentMemberPortalData.level_membership}</span>
                        <span>Goal: 600 Poin</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-1000"
                          style={{ width: `${Math.min(100, (memberPoints / 600) * 100)}%` }}
                        ></div>
                      </div>
                      <p className="text-[10px] font-medium text-slate-400 text-center mt-1">
                        Kumpulkan {Math.max(0, 600 - memberPoints)} poin lagi untuk mempertahankan/upgrade tier.
                      </p>
                    </div>

                  </CardContent>
                </Card>

              </div>

              {/* Right Column: Booking History, Loyalty vouchers, etc. */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* Profile Details & Contacts */}
                <Card className="bg-white/70 backdrop-blur-md border border-slate-100 rounded-3xl shadow-md">
                  <CardHeader className="border-b border-slate-100 pb-4">
                    <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <FaUserAlt className="text-blue-500" /> Profil & Kontak Anggota
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { label: "Nama Lengkap", value: currentMemberPortalData.namaLengkap, icon: FaUserAlt },
                        { label: "Nomor Handphone", value: currentMemberPortalData.phone, icon: FaPhoneAlt },
                        { label: "Alamat Email", value: currentMemberPortalData.email, icon: FaEnvelope },
                        { label: "Tanggal Daftar", value: currentMemberPortalData.tanggal_daftar, icon: FaCalendarAlt }
                      ].map((item, idx) => (
                        <div key={idx} className="bg-slate-50/50 border border-slate-100 p-4 rounded-2xl flex items-start gap-3">
                          <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                            <item.icon />
                          </span>
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{item.label}</span>
                            <p className="font-extrabold text-slate-700 text-sm mt-0.5">{item.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Loyalty Vouchers & Reward Claim */}
                <Card className="bg-white/70 backdrop-blur-md border border-slate-100 rounded-3xl shadow-md">
                  <CardHeader className="border-b border-slate-100 pb-4">
                    <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <FaGift className="text-red-500" /> Katalog Voucher & Rewards
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {rewardsCatalog.map((reward) => {
                        const isClaimed = claimedVouchers.some(v => v.id === reward.id);
                        return (
                          <div 
                            key={reward.id} 
                            className="bg-white border border-slate-100 p-4 rounded-2xl flex flex-col justify-between gap-4 shadow-xs hover:border-blue-100 transition-colors"
                          >
                            <div className="space-y-1">
                              <span className="bg-red-50 text-red-500 font-extrabold text-[9px] px-2 py-0.5 rounded-full w-fit">
                                {reward.cost} POIN
                              </span>
                              <h4 className="font-extrabold text-slate-800 text-sm">{reward.title}</h4>
                              <p className="text-xs text-slate-500 font-medium leading-relaxed">{reward.desc}</p>
                            </div>
                            
                            <Button 
                              size="sm"
                              disabled={isClaimed || memberPoints < reward.cost}
                              onClick={() => handleClaimVoucher(reward)}
                              className={`w-full rounded-xl text-xs font-bold transition-all ${
                                isClaimed 
                                  ? "bg-slate-100 text-slate-400 border-0" 
                                  : memberPoints < reward.cost
                                    ? "bg-slate-50 text-slate-400 border border-slate-100"
                                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/10"
                              }`}
                            >
                              {isClaimed ? "✓ Sudah Diklaim" : memberPoints < reward.cost ? "Poin Tidak Cukup" : "Tukarkan Poin"}
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Booking History list */}
                <Card className="bg-white/70 backdrop-blur-md border border-slate-100 rounded-3xl shadow-md">
                  <CardHeader className="border-b border-slate-100 pb-4">
                    <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <FaCalendarAlt className="text-emerald-500" /> Riwayat Booking Saya ({memberPortalBookings.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="hover:bg-transparent">
                            <TableHead className="font-bold text-xs uppercase">ID Booking</TableHead>
                            <TableHead className="font-bold text-xs uppercase">Produk Wisata</TableHead>
                            <TableHead className="font-bold text-xs uppercase">Tanggal Transaksi</TableHead>
                            <TableHead className="font-bold text-xs uppercase text-right">Total Transaksi</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {memberPortalBookings.length > 0 ? (
                            memberPortalBookings.map((booking) => (
                              <TableRow key={booking.id_transaksi} className="hover:bg-slate-50/20">
                                <TableCell className="font-bold text-slate-800 text-xs">{booking.id_transaksi}</TableCell>
                                <TableCell className="font-semibold text-slate-600 text-xs">{booking.produk_dibeli}</TableCell>
                                <TableCell className="font-semibold text-slate-500 text-xs">{booking.tanggal_transaksi}</TableCell>
                                <TableCell className="font-black text-slate-800 text-xs text-right">{formatRupiah(booking.total_transaksi)}</TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center py-6 text-slate-400 font-semibold text-xs">Belum ada riwayat booking.</TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>

                {/* Interaction logs & Login Activity logs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Interactions */}
                  <Card className="bg-white/70 backdrop-blur-md border border-slate-100 rounded-3xl shadow-sm">
                    <CardHeader className="border-b border-slate-50 pb-3">
                      <CardTitle className="text-xs font-bold text-slate-800 flex items-center gap-2">
                        📞 Catatan Layanan (CS)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 max-h-[220px] overflow-y-auto space-y-3">
                      {memberPortalInteractions.length > 0 ? (
                        memberPortalInteractions.map((item, idx) => (
                          <div key={idx} className="border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                            <div className="flex justify-between text-[10px] font-bold">
                              <span className="text-slate-700">CS: {item.chat_cs || "Support"}</span>
                              <span className="text-slate-400">{item.feedback_review || "Netral"}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 font-medium mt-1 italic">"{item.riwayat_komplain}"</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-[11px] text-slate-400 font-medium text-center py-6">Tidak ada catatan layanan.</p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Logins */}
                  <Card className="bg-white/70 backdrop-blur-md border border-slate-100 rounded-3xl shadow-sm">
                    <CardHeader className="border-b border-slate-50 pb-3">
                      <CardTitle className="text-xs font-bold text-slate-800 flex items-center gap-2">
                        🔐 Riwayat Login & Keamanan
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 max-h-[220px] overflow-y-auto space-y-3">
                      {memberPortalActivities.length > 0 ? (
                        memberPortalActivities.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-[11px] border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                            <span className="font-semibold text-slate-600">Sesi Login Sukses</span>
                            <span className="font-bold text-slate-400">{item.login_terakhir ? new Date(item.login_terakhir).toLocaleString() : "-"}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-[11px] text-slate-400 font-medium text-center py-6">Tidak ada riwayat aktivitas login.</p>
                      )}
                    </CardContent>
                  </Card>
                </div>

              </div>

            </div>
          ) : (
            <div className="text-center py-16 text-slate-400 font-bold">Silakan pilih member di dropdown atas untuk melihat portal.</div>
          )}

        </div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* MODALS AREA (CRUD) */}
      {/* ────────────────────────────────────────────────────────── */}
      
      {/* 1. DIALOG TAMBAH MEMBER */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-md bg-white rounded-3xl border border-slate-100">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-slate-800">Tambah Member Baru</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddSubmit} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">ID Customer</label>
                <Input value={formData.customerId} disabled className="bg-slate-50 text-slate-500 rounded-xl" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Kode Referral</label>
                <Input value={formData.referralCode} disabled className="bg-slate-50 text-slate-500 rounded-xl" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Lengkap</label>
              <Input placeholder="Nama Lengkap" value={formData.namaLengkap} onChange={(e) => setFormData({...formData, namaLengkap: e.target.value})} required className="rounded-xl border-slate-200" />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Email Kontak</label>
              <Input type="email" placeholder="example@mail.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required className="rounded-xl border-slate-200" />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Nomor HP</label>
              <Input placeholder="08xxxxxxxxxx" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required className="rounded-xl border-slate-200" />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Level</label>
                <select value={formData.levelMembership} onChange={(e) => setFormData({...formData, levelMembership: e.target.value})} className="w-full h-10 text-xs font-bold border border-slate-200 rounded-xl px-2 bg-white outline-none">
                  <option value="Bronze">Bronze</option>
                  <option value="Silver">Silver</option>
                  <option value="Gold">Gold</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Status Member</label>
                <select value={formData.statusMember} onChange={(e) => setFormData({...formData, statusMember: e.target.value})} className="w-full h-10 text-xs font-bold border border-slate-200 rounded-xl px-2 bg-white outline-none">
                  <option value="Member">Member</option>
                  <option value="Non-Member">Non-Member</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Status Aktif</label>
                <select value={formData.statusAktif} onChange={(e) => setFormData({...formData, statusAktif: e.target.value})} className="w-full h-10 text-xs font-bold border border-slate-200 rounded-xl px-2 bg-white outline-none">
                  <option value="Aktif">Aktif</option>
                  <option value="Nonaktif">Nonaktif</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} className="rounded-xl text-xs font-bold text-slate-600 border-slate-200">Batal</Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/10">Simpan Data</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* 2. DIALOG EDIT MEMBER */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-md bg-white rounded-3xl border border-slate-100">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-slate-800">Edit Data Member</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">ID Customer</label>
                <Input value={formData.customerId} disabled className="bg-slate-50 text-slate-500 rounded-xl" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Kode Referral</label>
                <Input value={formData.referralCode} onChange={(e) => setFormData({...formData, referralCode: e.target.value})} className="rounded-xl border-slate-200" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Lengkap</label>
              <Input value={formData.namaLengkap} onChange={(e) => setFormData({...formData, namaLengkap: e.target.value})} required className="rounded-xl border-slate-200" />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Email Kontak</label>
              <Input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required className="rounded-xl border-slate-200" />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Nomor HP</label>
              <Input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required className="rounded-xl border-slate-200" />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Level</label>
                <select value={formData.levelMembership} onChange={(e) => setFormData({...formData, levelMembership: e.target.value})} className="w-full h-10 text-xs font-bold border border-slate-200 rounded-xl px-2 bg-white outline-none">
                  <option value="Bronze">Bronze</option>
                  <option value="Silver">Silver</option>
                  <option value="Gold">Gold</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Status Member</label>
                <select value={formData.statusMember} onChange={(e) => setFormData({...formData, statusMember: e.target.value})} className="w-full h-10 text-xs font-bold border border-slate-200 rounded-xl px-2 bg-white outline-none">
                  <option value="Member">Member</option>
                  <option value="Non-Member">Non-Member</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Status Aktif</label>
                <select value={formData.statusAktif} onChange={(e) => setFormData({...formData, statusAktif: e.target.value})} className="w-full h-10 text-xs font-bold border border-slate-200 rounded-xl px-2 bg-white outline-none">
                  <option value="Aktif">Aktif</option>
                  <option value="Nonaktif">Nonaktif</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowEditModal(false)} className="rounded-xl text-xs font-bold text-slate-600 border-slate-200">Batal</Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/10">Simpan Perubahan</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* 3. DIALOG UPGRADE MEMBERSHIP */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="max-w-xs bg-white rounded-3xl border border-slate-100">
          <DialogHeader>
            <DialogTitle className="text-center text-sm font-black text-slate-800">Upgrade Membership Tier</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpgradeSubmit} className="space-y-4 pt-2 text-center">
            <p className="text-xs text-slate-500">Pilih level baru untuk status loyalitas customer <b>{formData.namaLengkap}</b>:</p>
            
            <div className="flex justify-center gap-2 py-4">
              {["Bronze", "Silver", "Gold"].map(tier => (
                <button
                  key={tier}
                  type="button"
                  onClick={() => setFormData({...formData, levelMembership: tier})}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold border transition-all ${
                    formData.levelMembership === tier
                      ? "bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-900/15"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>

            <div className="flex justify-center gap-2">
              <Button type="button" variant="outline" onClick={() => setShowUpgradeModal(false)} className="rounded-xl text-xs font-bold text-slate-600 border-slate-200">Batal</Button>
              <Button type="submit" className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-xl text-xs font-bold shadow-md">Simpan Upgrade</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* 4. CONFIRM DELETE DIALOG */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="max-w-xs bg-white rounded-3xl border border-slate-100 text-center">
          <DialogHeader>
            <DialogTitle className="text-center text-sm font-black text-rose-600">Hapus Data Membership?</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <p className="text-xs text-slate-500">
              Apakah Anda yakin ingin menghapus data membership <b>{targetMember?.namaLengkap}</b> ({targetMember?.id_customer}) secara permanen? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-center gap-2">
              <Button type="button" variant="outline" onClick={() => setShowDeleteConfirm(false)} className="rounded-xl text-xs font-bold text-slate-600 border-slate-200">Batal</Button>
              <Button type="button" onClick={handleDeleteSubmit} className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md">Hapus Permanen</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
