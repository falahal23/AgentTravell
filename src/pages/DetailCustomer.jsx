import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft, FaEnvelope, FaPhone, FaCrown,
  FaCalendarAlt, FaShoppingBag, FaIdCard,
  FaCheckCircle, FaTimesCircle, FaTag
} from "react-icons/fa";
import { supabase } from "../lib/supabase";

export default function DetailCustomer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [membership, setMembership] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data, error: err } = await supabase
          .from("customers")
          .select(`
            id_customer,
            nama_lengkap,
            username,
            jenis_kelamin,
            tanggal_lahir,
            kontak (no_hp, email, alamat, kota, provinsi),
            membership (level_membership, status_member, tanggal_daftar, referral_code, status_aktif)
          `)
          .eq("id_customer", id)
          .single();
        if (err) throw err;

        if (data) {
          setCustomer({
            customerId: data.id_customer,
            customerName: data.nama_lengkap || data.username || "-",
            email: data.kontak?.[0]?.email || "-",
            phone: data.kontak?.[0]?.no_hp || "-",
            loyalty: data.membership?.[0]?.level_membership || "Bronze"
          });
          if (data.membership && data.membership.length > 0) {
            setMembership(data.membership[0]);
          } else {
            setMembership(null);
          }
        }
      } catch (err) {
        console.error(err);
        setError(err.message || "Gagal memuat detail customer");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0d9488]"></div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <h2 className="text-2xl font-bold text-slate-400">{error || "Customer Not Found"}</h2>
        <button onClick={() => navigate(-1)} className="text-[#0d9488] font-bold">
          Back to List
        </button>
      </div>
    );
  }

  const getLoyaltyStyle = (tier) => {
    switch (tier) {
      case "Gold":     return "bg-amber-50 text-amber-600 border-amber-100";
      case "Silver":   return "bg-slate-50 text-slate-500 border-slate-200";
      case "Bronze":   return "bg-orange-50 text-orange-600 border-orange-100";
      default:         return "bg-gray-50 text-gray-400 border-gray-100";
    }
  };

  const getLevelStyle = (level) => {
    switch (level) {
      case "Platinum": return "bg-purple-100 text-purple-700 border-purple-200";
      case "Gold":     return "bg-amber-100 text-amber-700 border-amber-200";
      case "Silver":   return "bg-slate-100 text-slate-600 border-slate-200";
      case "Basic":    return "bg-gray-100 text-gray-600 border-gray-200";
      default:         return "bg-gray-100 text-gray-400 border-gray-100";
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric", month: "long", year: "numeric",
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 p-2">

      {/* BACK BUTTON */}
      <button
        onClick={() => navigate(-1)}
        className="group flex items-center gap-2 text-slate-400 hover:text-[#0d9488] transition-colors font-bold text-sm"
      >
        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
        Back to Customers
      </button>

      {/* MAIN PROFILE CARD */}
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 overflow-hidden border border-slate-50">
        {/* Banner */}
        <div className="h-32 bg-[#1e293b] w-full relative">
          <div className="absolute -bottom-12 left-8 p-1 bg-white rounded-3xl shadow-lg">
            <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-teal-400 to-[#0d9488] flex items-center justify-center text-white text-4xl font-black">
              {customer.customerName.charAt(0)}
            </div>
          </div>
        </div>

        <div className="pt-16 p-8 space-y-8">
          {/* Nama + Loyalty Badge + Membership Status */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-3xl font-black text-[#1e293b] tracking-tight">
                {customer.customerName}
              </h1>
              <p className="text-slate-400 font-bold tracking-widest text-sm uppercase">
                Customer ID: {customer.customerId}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <span className={`px-6 py-2 rounded-2xl border font-black text-xs tracking-widest uppercase flex items-center gap-2 shadow-sm ${getLoyaltyStyle(customer.loyalty)}`}>
                <FaCrown /> {customer.loyalty} Member
              </span>
              {membership && (
                <span className={`px-6 py-2 rounded-2xl border font-black text-xs tracking-widest uppercase text-center shadow-sm ${
                  membership.status_member === "Member"
                    ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                    : "bg-slate-50 text-slate-500 border-slate-200"
                }`}>
                  {membership.status_member}
                </span>
              )}
            </div>
          </div>

          {/* Contact + Activity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.2em]">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="p-3 bg-white rounded-xl text-teal-600 shadow-sm"><FaEnvelope /></div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">Email Address</p>
                    <p className="text-sm font-bold text-slate-700">{customer.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="p-3 bg-white rounded-xl text-teal-600 shadow-sm"><FaPhone /></div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">Phone Number</p>
                    <p className="text-sm font-bold text-slate-700">{customer.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.2em]">Status & Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="p-3 bg-white rounded-xl text-teal-600 shadow-sm"><FaCalendarAlt /></div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">Join Date</p>
                    <p className="text-sm font-bold text-slate-700">12 May 2024</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="p-3 bg-white rounded-xl text-teal-600 shadow-sm"><FaShoppingBag /></div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">Total Transactions</p>
                    <p className="text-sm font-bold text-slate-700">24 Orders</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* ── MEMBERSHIP SECTION ── */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.2em]">
              Informasi Membership
            </h3>

            {membership ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Level Membership */}
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="p-3 bg-white rounded-xl text-teal-600 shadow-sm">
                    <FaCrown />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">Level Membership</p>
                    <span className={`mt-1 inline-block px-3 py-0.5 rounded-full text-xs font-bold border ${getLevelStyle(membership.level_membership)}`}>
                      {membership.level_membership}
                    </span>
                  </div>
                </div>

                {/* Status Member */}
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="p-3 bg-white rounded-xl text-teal-600 shadow-sm">
                    <FaIdCard />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">Status Member</p>
                    <p className="text-sm font-bold text-slate-700">{membership.status_member}</p>
                  </div>
                </div>

                {/* Tanggal Daftar */}
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="p-3 bg-white rounded-xl text-teal-600 shadow-sm">
                    <FaCalendarAlt />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">Tanggal Daftar</p>
                    <p className="text-sm font-bold text-slate-700">{formatDate(membership.tanggal_daftar)}</p>
                  </div>
                </div>

                {/* Referral Code */}
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="p-3 bg-white rounded-xl text-teal-600 shadow-sm">
                    <FaTag />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">Referral Code</p>
                    <p className="text-sm font-bold text-slate-700 tracking-widest">{membership.referral_code}</p>
                  </div>
                </div>

                {/* Status Aktif — full width */}
                <div className="md:col-span-2 flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className={`p-3 rounded-xl shadow-sm ${membership.status_aktif === "Aktif" ? "bg-white text-green-500" : "bg-white text-red-400"}`}>
                    {membership.status_aktif === "Aktif" ? <FaCheckCircle /> : <FaTimesCircle />}
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">Status Aktif</p>
                    <span className={`inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-bold border ${
                      membership.status_aktif === "Aktif"
                        ? "bg-green-50 text-green-600 border-green-200"
                        : "bg-red-50 text-red-500 border-red-200"
                    }`}>
                      {membership.status_aktif}
                    </span>
                  </div>
                </div>

              </div>
            ) : (
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center text-slate-400 text-sm font-bold">
                Tidak ada data membership untuk customer ini.
              </div>
            )}
          </div>

          <hr className="border-slate-100" />

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button className="px-8 py-3 bg-[#1e293b] text-white rounded-2xl font-bold hover:bg-[#0f172a] transition-all shadow-lg active:scale-95">
              Edit Profile
            </button>
            <button className="px-8 py-3 bg-white text-red-500 border border-red-100 rounded-2xl font-bold hover:bg-red-50 transition-all active:scale-95">
              Deactivate Account
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}