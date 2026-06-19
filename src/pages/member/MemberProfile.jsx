import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { FaUser, FaPhoneAlt, FaEnvelope, FaCalendarAlt, FaShieldAlt, FaComments } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MemberProfile() {
  const { member, membership } = useOutletContext();
  const [interactions, setInteractions] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    if (!member) return;
    try {
      setLoading(true);
      const [
        { data: intData },
        { data: aktData }
      ] = await Promise.all([
        supabase.from("interaksi").select("*").eq("id_customer", member.id_customer),
        supabase.from("aktivitas").select("*").eq("id_customer", member.id_customer)
      ]);
      setInteractions(intData || []);
      setActivities(aktData || []);
    } catch (err) {
      console.error("Error loading profile logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [member]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      <div>
        <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
          <FaUser className="text-blue-500" /> Profil & Pengaturan Keamanan
        </h2>
        <p className="text-xs text-slate-500 mt-1">Kelola detail identitas pribadi dan periksa log keamanan sesi login Anda</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* PROFILE CARD */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-white/70 backdrop-blur-md border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
            <CardHeader className="border-b border-slate-100 pb-4 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center text-3xl font-black mx-auto shadow-md shadow-blue-500/10">
                {member?.nama_lengkap ? member.nama_lengkap[0].toUpperCase() : "U"}
              </div>
              <h3 className="text-lg font-black text-slate-800 mt-3">{member?.nama_lengkap}</h3>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: {member?.id_customer}</span>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-slate-400 text-base" />
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wide">Alamat Email</span>
                  <span className="text-slate-700 font-extrabold">{member?.email}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FaPhoneAlt className="text-slate-400 text-base" />
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wide">Nomor Handphone</span>
                  <span className="text-slate-700 font-extrabold">{member?.phone || member?.kontak?.[0]?.no_hp || "-"}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FaCalendarAlt className="text-slate-400 text-base" />
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wide">Terdaftar Sejak</span>
                  <span className="text-slate-700 font-extrabold">{membership?.tanggal_daftar || "-"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* LOG FILES COLS */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Support Ticket history */}
          <Card className="bg-white/70 backdrop-blur-md border border-slate-100 rounded-3xl shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <FaComments className="text-indigo-500" /> Riwayat Komunikasi & Catatan CS
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 max-h-[250px] overflow-y-auto space-y-4">
              {interactions.length > 0 ? (
                interactions.map((item, idx) => (
                  <div key={idx} className="bg-slate-50/50 border border-slate-100/50 p-4 rounded-2xl space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-wider">
                      <span className="text-indigo-600">Customer Support: {item.chat_cs || "Priority Support"}</span>
                      <span className="text-slate-400">Feedback: {item.feedback_review || "Netral"}</span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed italic">"{item.riwayat_komplain}"</p>
                    {item.catatan_admin && (
                      <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-medium">
                        Catatan Admin: {item.catatan_admin}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 font-semibold text-center py-8">Belum ada riwayat keluhan atau obrolan dengan customer support.</p>
              )}
            </CardContent>
          </Card>

          {/* Login activity logs */}
          <Card className="bg-white/70 backdrop-blur-md border border-slate-100 rounded-3xl shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <FaShieldAlt className="text-emerald-500" /> Log Aktivitas Login Keamanan
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 max-h-[220px] overflow-y-auto space-y-3">
              {activities.length > 0 ? (
                activities.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                    <span className="font-semibold text-slate-600 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Sesi Login Sukses (Web App)
                    </span>
                    <span className="font-bold text-slate-400">{item.login_terakhir ? new Date(item.login_terakhir).toLocaleString("id-ID") : "-"}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 font-semibold text-center py-6">Tidak ada log login tersimpan.</p>
              )}
            </CardContent>
          </Card>

        </div>

      </div>

    </div>
  );
}
