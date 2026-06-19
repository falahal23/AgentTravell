import { useState, useEffect } from "react";
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { supabase, getNextId } from "../lib/supabase";
import { FaPlane, FaHeadset, FaUser, FaSignOutAlt } from "react-icons/fa";

export default function MemberLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [member, setMember] = useState(null);
  const [membership, setMembership] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const fetchProfile = async (email) => {
    try {
      // 1. Get id_customer and address fields from kontak table
      const { data: kontakData, error: kontakErr } = await supabase
        .from("kontak")
        .select("id_customer, no_hp, alamat, kota, provinsi")
        .eq("email", email)
        .maybeSingle();

      if (kontakErr) throw kontakErr;

      if (!kontakData) {
        // Create matching CRM records if not exist yet for this auth user
        const newId = "CUST" + Math.floor(1000 + Math.random() * 9000);
        const name = email.split("@")[0];
        
        // Fetch next IDs
        const nextKontakId = await getNextId("kontak", "id_kontak");
        const nextMembershipId = await getNextId("membership", "id_membership");

        const { error: custErr } = await supabase.from("customers").insert([
          { id_customer: newId, nama_lengkap: name, username: name, jenis_kelamin: "Laki-laki", tanggal_lahir: "2000-01-01" }
        ]);
        if (custErr) throw custErr;

        const { error: kErr } = await supabase.from("kontak").insert([
          { id_kontak: nextKontakId, id_customer: newId, email, no_hp: "-", alamat: "Pekanbaru", kota: "Pekanbaru", provinsi: "Riau" }
        ]);
        if (kErr) throw kErr;

        const { error: mErr } = await supabase.from("membership").insert([
          { id_membership: nextMembershipId, id_customer: newId, level_membership: "Bronze", status_member: "Member", status_aktif: "Aktif", tanggal_daftar: new Date().toISOString().split("T")[0] }
        ]);
        if (mErr) throw mErr;

        // Fetch profile again after successful inserts
        await fetchProfile(email);
        return;
      }


      const id_customer = kontakData.id_customer;

      // 2. Fetch customer details
      const { data: custData, error: custErr } = await supabase
        .from("customers")
        .select("*")
        .eq("id_customer", id_customer)
        .single();
      if (custErr) throw custErr;

      // 3. Fetch membership details
      const { data: memberData, error: memberErr } = await supabase
        .from("membership")
        .select("*")
        .eq("id_customer", id_customer)
        .maybeSingle();
      if (memberErr) throw memberErr;

      setMember({
        ...custData,
        email,
        phone: kontakData.no_hp || "-",
        alamat: kontakData.alamat || "-",
        kota: kontakData.kota || "-",
        provinsi: kontakData.provinsi || "-"
      });
      setMembership(memberData || {
        level_membership: "Bronze",
        status_member: "Member",
        status_aktif: "Aktif"
      });
    } catch (err) {
      console.error("Error loading member profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        const storedUser = localStorage.getItem("member_user");
        if (!storedUser) {
          navigate("/member/login");
          return;
        }
        const parsed = JSON.parse(storedUser);
        fetchProfile(parsed.email);
      } else {
        localStorage.setItem("member_user", JSON.stringify(session.user));
        fetchProfile(session.user.email);
      }
    } catch (err) {
      console.error(err);
      navigate("/member/login");
    }
  };

  useEffect(() => {
    checkAuth();
  }, [location.pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("member_user");
    localStorage.removeItem("member_session");
    navigate("/member/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#070A13]">
        <div className="w-10 h-10 rounded-full border-4 border-slate-800 border-t-indigo-500 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070A13] text-slate-100 flex flex-col font-sans relative overflow-x-hidden">
      
      {/* GLOW DECORATIONS */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-50 bg-[#0C1020]/75 backdrop-blur-xl border-b border-slate-800/80 px-6 py-4 flex items-center justify-between shadow-lg shadow-black/20 relative">
        {/* Left Brand */}
        <Link to="/member/dashboard" className="flex items-center gap-3 relative z-10">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl flex items-center justify-center border border-indigo-400/20 shadow-md shadow-indigo-500/20">
            <FaPlane className="text-sm transform -rotate-45" />
          </div>
          <div>
            <h1 className="text-base font-black text-white leading-none tracking-tight flex items-center gap-1">
              TravelGo<span className="text-indigo-500 font-extrabold">.</span>
            </h1>
            <span className="text-[9px] font-black text-indigo-400/85 uppercase tracking-widest block mt-0.5">Club Member</span>
          </div>
        </Link>

        {/* Right Menu & Profile */}
        <div className="flex items-center gap-3 relative z-10">
          <a 
            href="#feedback"
            className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-bold border border-slate-700/50 hover:border-slate-600 transition-all cursor-pointer"
          >
            <FaHeadset className="text-indigo-400" />
            <span>Customer Service</span>
          </a>

          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-500/15 border border-indigo-500/20 cursor-pointer"
          >
            <FaUser className="text-[10px]" />
            <span>{member?.nama_lengkap}</span>
          </button>

          {/* Profile Dropdown Action Menu */}
          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
              <div className="absolute right-0 top-12 w-48 bg-[#0F1426] border border-slate-800 rounded-2xl shadow-2xl z-20 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-2 border-b border-slate-800/80">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Signed in as</p>
                  <p className="text-xs font-black text-slate-300 truncate">{member?.email}</p>
                </div>
                
                <button 
                  onClick={() => {
                    setDropdownOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-2.5 w-full px-4 py-2.5 text-xs font-bold text-slate-400 hover:text-rose-400 hover:bg-rose-500/5 transition-all text-left"
                >
                  <FaSignOutAlt className="text-slate-500" />
                  <span>Log Out</span>
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 relative z-10">
        <Outlet context={{ member, membership, refreshData: () => fetchProfile(member.email) }} />
      </main>

      {/* FOOTER */}
      <footer className="bg-[#0C1020]/40 border-t border-slate-800/80 py-6 text-center text-xs font-bold text-slate-500 relative z-10">
        © 2026 TravelGo. Semua Hak Dilindungi.
      </footer>

    </div>
  );
}

