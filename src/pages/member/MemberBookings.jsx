import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { FaCalendarAlt, FaCreditCard, FaTicketAlt, FaClock } from "react-icons/fa";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MemberBookings() {
  const { member } = useOutletContext();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    if (!member) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("transaksi")
        .select("*")
        .eq("id_customer", member.id_customer)
        .order("tanggal_transaksi", { ascending: false });
      
      if (error) throw error;
      setBookings(data || []);
    } catch (err) {
      console.error("Error loading member bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [member]);

  const formatRupiah = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(value);
  };

  const getPaymentBadge = (metode) => {
    switch (metode) {
      case "Transfer Bank": return "bg-blue-50 text-blue-600 border border-blue-100";
      case "QRIS": return "bg-green-50 text-green-600 border border-green-100";
      default: return "bg-slate-50 text-slate-600 border border-slate-100";
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
          <FaCalendarAlt className="text-blue-500" /> Jadwal Keberangkatan & Histori Booking
        </h2>
        <p className="text-xs text-slate-500 mt-1">Daftar lengkap jadwal perjalanan wisata yang pernah Anda booking</p>
      </div>

      {/* UPCOMING TRAVEL HIGHLIGHT */}
      {bookings.length > 0 && (
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl border-0 overflow-hidden shadow-lg shadow-blue-500/10">
          <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-1.5">
              <span className="bg-white/20 text-white font-extrabold text-[10px] tracking-wider px-3 py-1 rounded-full uppercase">
                Upcoming Tour Highlight
              </span>
              <h3 className="text-lg font-black">{bookings[0].paket_dibeli || "Paket Wisata"}</h3>
              <p className="text-xs text-blue-100 flex items-center gap-2 font-medium">
                <FaCalendarAlt /> Jadwal Transaksi: {bookings[0].tanggal_transaksi}
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center gap-3">
              <FaClock className="text-white text-xl animate-pulse" />
              <div>
                <span className="text-[10px] text-blue-200 font-bold uppercase">Status Keberangkatan</span>
                <p className="font-extrabold text-sm text-white mt-0.5">Terkonfirmasi (Ready)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TABLE HISTORY */}
      <Card className="bg-white border border-slate-100 rounded-3xl shadow-xs overflow-hidden">
        <CardHeader className="border-b border-slate-100 pb-4">
          <CardTitle className="text-sm font-bold text-slate-800">Daftar Seluruh Booking</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-bold text-xs uppercase py-4">ID Transaksi</TableHead>
                  <TableHead className="font-bold text-xs uppercase">Produk Wisata</TableHead>
                  <TableHead className="font-bold text-xs uppercase">Tanggal Pembelian</TableHead>
                  <TableHead className="font-bold text-xs uppercase">Metode Pembayaran</TableHead>
                  <TableHead className="font-bold text-xs uppercase text-right">Total Biaya</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <TableRow key={booking.id_transaksi} className="hover:bg-slate-50/20 transition-colors">
                      <TableCell className="font-bold text-slate-800 text-xs py-4">{booking.id_transaksi}</TableCell>
                      <TableCell className="font-semibold text-slate-700 text-xs">
                        <div className="flex items-center gap-1.5">
                          <FaTicketAlt className="text-slate-400 text-[10px]" />
                          {booking.paket_dibeli}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-slate-500 text-xs">{booking.tanggal_transaksi}</TableCell>
                      <TableCell>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1 w-fit ${getPaymentBadge(booking.metode_pembayaran)}`}>
                          <FaCreditCard className="text-[9px]" /> {booking.metode_pembayaran}
                        </span>
                      </TableCell>
                      <TableCell className="font-black text-slate-800 text-sm text-right">{formatRupiah(booking.total_transaksi)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-slate-400 font-semibold text-xs">Belum ada transaksi keberangkatan.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
