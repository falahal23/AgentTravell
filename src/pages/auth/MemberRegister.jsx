import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaPlane, FaEnvelope, FaLock, FaUser, FaPhoneAlt } from "react-icons/fa";
import { BsFillExclamationDiamondFill, BsCheckCircleFill } from "react-icons/bs";
import { ImSpinner2 } from "react-icons/im";
import { supabase, getNextId } from "../../lib/supabase";

const backgroundImageUrl = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1920&auto=format&fit=crop";

export default function MemberRegister() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Konfirmasi password tidak cocok.");
      setLoading(false);
      return;
    }

    try {
      // 1. Sign Up in Supabase Auth
      const { data: authData, error: authErr } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password
      });

      if (authErr) throw authErr;

      // Generate random CUST ID
      const newId = "CUST" + Math.floor(1000 + Math.random() * 9000);
      const username = formData.fullName.toLowerCase().replace(/\s+/g, "_");

      // Fetch next IDs
      const nextKontakId = await getNextId("kontak", "id_kontak");
      const nextMembershipId = await getNextId("membership", "id_membership");

      // 2. Insert into customers CRM table
      const { error: custErr } = await supabase.from("customers").insert([
        {
          id_customer: newId,
          nama_lengkap: formData.fullName,
          username: username,
          jenis_kelamin: "Laki-laki",
          tanggal_lahir: "2000-01-01"
        }
      ]);
      if (custErr) throw custErr;

      // 3. Insert into kontak CRM table
      const { error: kontakErr } = await supabase.from("kontak").insert([
        {
          id_kontak: nextKontakId,
          id_customer: newId,
          email: formData.email.trim(),
          no_hp: formData.phone,
          alamat: "-",
          kota: "-",
          provinsi: "-"
        }
      ]);
      if (kontakErr) throw kontakErr;

      // 4. Insert into membership CRM table (default Bronze member)
      const refCode = "REF-" + Math.random().toString(36).substring(2, 7).toUpperCase();
      const { error: memberErr } = await supabase.from("membership").insert([
        {
          id_membership: nextMembershipId,
          id_customer: newId,
          level_membership: "Bronze",
          status_member: "Member",
          status_aktif: "Aktif",
          tanggal_daftar: new Date().toISOString().split("T")[0],
          referral_code: refCode
        }
      ]);
      if (memberErr) throw memberErr;


      setSuccess(true);
      setTimeout(() => {
        navigate("/member/login");
      }, 3000);

    } catch (err) {
      console.error(err);
      setError(err.message || "Registrasi gagal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center flex items-center justify-center font-sans relative px-4 py-8"
      style={{ backgroundImage: `url(${backgroundImageUrl})` }}
    >
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"></div>
      
      {/* Glow ball */}
      <div className="absolute w-[350px] h-[350px] bg-blue-500/10 rounded-full blur-[80px] pointer-events-none z-0"></div>

      <div className="relative z-10 bg-white/20 backdrop-blur-xl border border-white/20 p-8 sm:p-10 rounded-[35px] w-full max-w-md shadow-2xl space-y-6">
        
        <div className="flex flex-col items-center text-center">
          <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 mb-3">
            <FaPlane className="text-white text-2xl transform -rotate-45" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Daftar Akun Member</h1>
          <p className="text-white/80 mt-1 text-xs font-medium">Buat akun untuk klaim voucher diskon & poin</p>
        </div>

        {error && (
          <div className="bg-red-500/80 border border-red-400 p-4 text-xs text-white rounded-2xl flex items-center shadow-sm">
            <BsFillExclamationDiamondFill className="mr-3 text-lg shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-emerald-500/80 border border-emerald-400 p-4 text-xs text-white rounded-2xl flex items-center shadow-sm">
            <BsCheckCircleFill className="mr-3 text-lg shrink-0" />
            <span>Pendaftaran sukses! Mengalihkan ke login...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-white text-[10px] font-bold uppercase tracking-wider">Nama Lengkap</label>
            <div className="relative">
              <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 text-sm" />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Masukkan nama lengkap Anda"
                required
                className="w-full bg-white/10 border border-white/20 rounded-2xl pl-11 pr-4 py-3 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/20 transition-all text-xs"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-white text-[10px] font-bold uppercase tracking-wider">Nomor HP</label>
            <div className="relative">
              <FaPhoneAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 text-sm" />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Contoh: 08123456789"
                required
                className="w-full bg-white/10 border border-white/20 rounded-2xl pl-11 pr-4 py-3 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/20 transition-all text-xs"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-white text-[10px] font-bold uppercase tracking-wider">Email</label>
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 text-sm" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Masukkan email Anda"
                required
                className="w-full bg-white/10 border border-white/20 rounded-2xl pl-11 pr-4 py-3 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/20 transition-all text-xs"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-white text-[10px] font-bold uppercase tracking-wider">Password</label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 text-sm" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Buat password baru"
                required
                className="w-full bg-white/10 border border-white/20 rounded-2xl pl-11 pr-4 py-3 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/20 transition-all text-xs"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-white text-[10px] font-bold uppercase tracking-wider">Konfirmasi Password</label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 text-sm" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Ulangi password"
                required
                className="w-full bg-white/10 border border-white/20 rounded-2xl pl-11 pr-4 py-3 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/20 transition-all text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3.5 rounded-2xl font-bold text-xs shadow-lg shadow-blue-500/25 transition active:scale-95 flex justify-center items-center disabled:opacity-70 cursor-pointer pt-3"
          >
            {loading ? (
              <>
                <ImSpinner2 className="animate-spin mr-2 text-base" />
                Mendaftar...
              </>
            ) : (
              "Daftar Akun Member"
            )}
          </button>
        </form>

        <div className="text-center text-xs text-white/70">
          Sudah punya akun member?{" "}
          <Link to="/member/login" className="text-white underline font-bold hover:text-blue-200 transition-colors">
            Masuk di Sini
          </Link>
        </div>

      </div>
    </div>
  );
}
