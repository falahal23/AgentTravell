import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { supabase, getNextId } from "../../lib/supabase";
import { FaComments, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MemberKomplain() {
  const { member } = useOutletContext();
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form States
  const [topic, setTopic] = useState("Menanyakan Promo");
  const [complaintText, setComplaintText] = useState("");
  const [feedbackRating, setFeedbackRating] = useState("Cukup Puas");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const fetchInteractions = async () => {
    if (!member) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("interaksi")
        .select("*")
        .eq("id_customer", member.id_customer);
      
      if (error) throw error;
      setInteractions(data || []);
    } catch (err) {
      console.error("Error loading interactions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInteractions();
  }, [member]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!member || !complaintText.trim()) return;

    try {
      setSubmitLoading(true);
      setSubmitSuccess(false);

      const nextInteraksiId = await getNextId("interaksi", "id_interaksi");

      const { error } = await supabase
        .from("interaksi")
        .insert([
          {
            id_interaksi: nextInteraksiId,
            id_customer: member.id_customer,
            chat_cs: topic,
            riwayat_komplain: complaintText.trim(),
            feedback_review: feedbackRating,
            catatan_admin: ""
          }
        ]);

      if (error) throw error;

      setSubmitSuccess(true);
      setComplaintText("");
      
      // Reload list
      await fetchInteractions();

      // Reset success status after a delay
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (err) {
      console.error("Error sending complaint:", err);
      alert("Gagal mengirim komplain: " + err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      <div>
        <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
          <FaComments className="text-indigo-600" /> Komplain & Feedback Layanan
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Kirim pengaduan, masukan, atau konsultasikan kebutuhan perjalanan Anda dengan tim CS prioritas kami
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* FORM PANEL (LEFT span 1) */}
        <div className="lg:col-span-1">
          <Card className="bg-white border border-slate-100 rounded-3xl shadow-xs">
            <CardHeader className="border-b border-slate-50 pb-4">
              <CardTitle className="text-sm font-bold text-slate-800">Kirim Feedback Baru</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {submitSuccess && (
                  <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 p-3.5 rounded-2xl flex items-start gap-2 text-xs font-semibold">
                    <FaCheckCircle className="mt-0.5 flex-shrink-0" />
                    <span>Laporan pengaduan Anda berhasil terkirim ke customer support!</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Topik Konsultasi (Chat CS)</label>
                  <select 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full h-10 bg-white border border-slate-200 rounded-xl px-3 text-xs font-bold text-slate-600 outline-none cursor-pointer focus:border-indigo-500/50"
                  >
                    <option value="Menanyakan Promo">Menanyakan Promo & Voucher</option>
                    <option value="Menanyakan Jadwal">Menanyakan Jadwal Tur</option>
                    <option value="Menanyakan Harga">Menanyakan Rincian Harga</option>
                    <option value="Konsultasi Produk">Konsultasi Kustom Perjalanan</option>
                    <option value="Pernah Chat">Lainnya</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Puas dengan Layanan Kami?</label>
                  <select 
                    value={feedbackRating}
                    onChange={(e) => setFeedbackRating(e.target.value)}
                    className="w-full h-10 bg-white border border-slate-200 rounded-xl px-3 text-xs font-bold text-slate-600 outline-none cursor-pointer focus:border-indigo-500/50"
                  >
                    <option value="Sangat Puas">Sangat Puas ⭐⭐⭐⭐⭐</option>
                    <option value="Cukup Puas">Cukup Puas ⭐⭐⭐⭐</option>
                    <option value="Biasa Saja">Biasa Saja ⭐⭐⭐</option>
                    <option value="Kurang Puas">Kurang Puas ⭐⭐</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Isi Komplain / Masukan</label>
                  <textarea 
                    rows={4}
                    placeholder="Tuliskan keluhan atau saran Anda secara rinci..."
                    className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-xs font-semibold outline-none focus:border-indigo-500/50 resize-none placeholder:text-slate-300"
                    value={complaintText}
                    onChange={(e) => setComplaintText(e.target.value)}
                    required
                  />
                </div>

                <button 
                  disabled={submitLoading || !complaintText.trim()}
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs transition-colors disabled:opacity-50 flex items-center justify-center cursor-pointer"
                >
                  {submitLoading ? "Mengirim..." : "Kirim Pengaduan"}
                </button>

              </form>
            </CardContent>
          </Card>
        </div>

        {/* LOG HISTORY PANEL (RIGHT span 2) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white border border-slate-100 rounded-3xl shadow-xs">
            <CardHeader className="border-b border-slate-50 pb-4">
              <CardTitle className="text-sm font-bold text-slate-800">Riwayat Catatan Layanan & Komunikasi</CardTitle>
            </CardHeader>
            <CardContent className="p-6 max-h-[500px] overflow-y-auto space-y-4 scrollbar-hide">
              {interactions.length > 0 ? (
                interactions.map((item, idx) => (
                  <div key={idx} className="bg-slate-50/50 border border-slate-100/50 p-4 rounded-2xl space-y-2 hover:border-indigo-100 transition-colors">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider">
                      <span className="text-indigo-600">Topik: {item.chat_cs || "CS Consultation"}</span>
                      <span className="bg-white border border-slate-100 px-2 py-0.5 rounded-full text-slate-500">
                        {item.feedback_review || "Netral"}
                      </span>
                    </div>
                    
                    <p className="text-xs text-slate-600 font-medium leading-relaxed italic">
                      "{item.riwayat_komplain}"
                    </p>

                    {item.catatan_admin && (
                      <div className="pt-2 border-t border-slate-200/50 text-[10px] text-slate-400 font-bold flex gap-1 items-start">
                        <FaExclamationCircle className="mt-0.5 text-indigo-500 flex-shrink-0" />
                        <span>Catatan Admin: {item.catatan_admin}</span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-slate-400 font-semibold text-xs">Belum ada riwayat keluhan atau konsultasi layanan CS.</div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>

    </div>
  );
}
