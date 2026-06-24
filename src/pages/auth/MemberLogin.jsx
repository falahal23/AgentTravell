import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaPlane, FaEnvelope, FaLock } from "react-icons/fa";
import { BsFillExclamationDiamondFill } from "react-icons/bs";
import { ImSpinner2 } from "react-icons/im";
import { supabase } from "../../lib/supabase";

const backgroundImageUrl = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1920&auto=format&fit=crop";

export default function MemberLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: ""
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

    try {
      const { data, error: authErr } = await supabase.auth.signInWithPassword({
        email: formData.email.trim(),
        password: formData.password
      });

      if (authErr) throw authErr;

      // Check if email exists in kontak table (which maps to customer/member)
      const { data: kontakData, error: kontakErr } = await supabase
        .from("kontak")
        .select("id_customer")
        .eq("email", formData.email.trim())
        .maybeSingle();

      if (kontakErr) {
        console.error("Error checking user role:", kontakErr);
      }

      if (kontakData) {
        // User is a member
        localStorage.setItem("member_user", JSON.stringify(data.user));
        localStorage.setItem("member_session", JSON.stringify(data.session));
        localStorage.removeItem("user");
        localStorage.removeItem("session");
        navigate("/member/dashboard");
      } else {
        // User is an admin
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("session", JSON.stringify(data.session));
        localStorage.removeItem("member_user");
        localStorage.removeItem("member_session");
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Email atau password salah.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center flex items-center justify-center font-sans relative px-4"
      style={{ backgroundImage: `url(${backgroundImageUrl})` }}
    >
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"></div>
      
      {/* Glow ball */}
      <div className="absolute w-[350px] h-[350px] bg-blue-500/10 rounded-full blur-[80px] pointer-events-none z-0"></div>

      <div className="relative z-10 bg-white/20 backdrop-blur-xl border border-white/20 p-8 sm:p-10 rounded-[35px] w-full max-w-md shadow-2xl space-y-8">
        
        <div className="flex flex-col items-center text-center">
          <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 mb-3">
            <FaPlane className="text-white text-3xl transform -rotate-45" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">TravelGo Member</h1>
          <p className="text-white/80 mt-1 text-xs font-medium">Masuk untuk melihat poin & voucher perjalanan Anda</p>
        </div>

        {error && (
          <div className="bg-red-500/80 border border-red-400 p-4 text-xs text-white rounded-2xl flex items-center shadow-sm">
            <BsFillExclamationDiamondFill className="mr-3 text-lg shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-white text-xs font-bold uppercase tracking-wider">Email</label>
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 text-base" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Masukkan email Anda"
                required
                className="w-full bg-white/10 border border-white/20 rounded-2xl pl-11 pr-4 py-3.5 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/20 transition-all text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-white text-xs font-bold uppercase tracking-wider">Password</label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 text-base" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Masukkan password Anda"
                required
                className="w-full bg-white/10 border border-white/20 rounded-2xl pl-11 pr-4 py-3.5 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/20 transition-all text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-blue-500/25 transition active:scale-95 flex justify-center items-center disabled:opacity-70 cursor-pointer"
          >
            {loading ? (
              <>
                <ImSpinner2 className="animate-spin mr-2 text-lg" />
                Masuk...
              </>
            ) : (
              "Masuk Portal"
            )}
          </button>
        </form>

        <div className="text-center text-xs text-white/70">
          Belum punya akun member?{" "}
          <Link to="/member/register" className="text-white underline font-bold hover:text-blue-200 transition-colors">
            Daftar Sekarang
          </Link>
        </div>

      </div>
    </div>
  );
}
