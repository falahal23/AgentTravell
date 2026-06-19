import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { FaEye, FaTrash, FaSearch, FaClock, FaUser, FaChartLine, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

export default function AktivitasUser() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [deleteData, setDeleteData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const fetchAktivitas = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data: dbData, error: err } = await supabase.from("aktivitas").select("*");
      if (err) throw err;
      setData(dbData || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Gagal memuat data aktivitas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAktivitas();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const hapusData = async () => {
    try {
      const { error: err } = await supabase
        .from("aktivitas")
        .delete()
        .eq("id_customer", deleteData.id_customer);
      if (err) throw err;
      setData(data.filter((item) => item.id_customer !== deleteData.id_customer));
      setDeleteData(null);
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus data aktivitas: " + err.message);
    }
  };

  const filterData = data.filter((item) => {
    const keyword = search.toLowerCase();
    return (
      item.id_customer?.toLowerCase().includes(keyword) ||
      item.login_terakhir?.toLowerCase().includes(keyword)
    );
  });

  const totalPages = Math.ceil(filterData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filterData.slice(startIndex, startIndex + itemsPerPage);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadgeStyle = (status) => {
    const loginDate = new Date(status);
    const now = new Date();
    const daysDiff = (now - loginDate) / (1000 * 60 * 60 * 24);
    
    if (daysDiff < 1) return "bg-green-100 text-green-700 border-green-200";
    if (daysDiff < 7) return "bg-blue-100 text-blue-700 border-blue-200";
    return "bg-orange-100 text-orange-700 border-orange-200";
  };

  const getStatusText = (status) => {
    const loginDate = new Date(status);
    const now = new Date();
    const daysDiff = (now - loginDate) / (1000 * 60 * 60 * 24);
    
    if (daysDiff < 1) return "🟢 Aktif";
    if (daysDiff < 7) return "🟡 Aktif (Seminggu)";
    return "🔴 Tidak Aktif";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6 space-y-6">
      {/* HEADER BANNER */}
      <Alert className="!hidden bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 shadow-lg rounded-xl p-5 items-center gap-4">
        <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
          <FaClock className="w-6 h-6 text-blue-200" />
        </div>
        <div>
          <AlertTitle className="text-xl font-bold tracking-wide">
            Aktivitas User
          </AlertTitle>
          <AlertDescription className="text-blue-100 mt-1">
            Monitoring aktivitas login customer:{" "}
            <span className="font-semibold text-white">{data.length}</span> data
          </AlertDescription>
        </div>
      </Alert>

      {/* STATISTICS CARDS */}
      <div className="!hidden grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="shadow-sm border border-slate-100 bg-white rounded-xl hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total User Aktif</p>
                <h2 className="text-3xl font-extrabold text-green-600 mt-1">{filterData.length}</h2>
              </div>
              <div className="p-3 bg-green-50 text-green-600 rounded-xl font-bold text-xl">
                👥
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-slate-100 bg-white rounded-xl hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Login Hari Ini</p>
                <h2 className="text-3xl font-extrabold text-blue-600 mt-1">
                  {data.filter(item => {
                    const loginDate = new Date(item.login_terakhir);
                    const now = new Date();
                    return (now - loginDate) / (1000 * 60 * 60 * 24) < 1;
                  }).length}
                </h2>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl font-bold text-xl">
                📱
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-slate-100 bg-white rounded-xl hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Tidak Aktif</p>
                <h2 className="text-3xl font-extrabold text-orange-600 mt-1">
                  {data.filter(item => {
                    const loginDate = new Date(item.login_terakhir);
                    const now = new Date();
                    return (now - loginDate) / (1000 * 60 * 60 * 24) > 7;
                  }).length}
                </h2>
              </div>
              <div className="p-3 bg-orange-50 text-orange-600 rounded-xl font-bold text-xl">
                ⏱️
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SEARCH CARD */}
      <Card className="shadow-sm border border-slate-100 bg-white rounded-xl">
        <CardContent className="p-5">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Riwayat Aktivitas User</h3>
          <div className="relative max-w-md">
            <FaSearch className="absolute left-3.5 top-3 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Cari ID customer atau login terakhir..."
              className="pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg h-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card className="shadow-md border border-slate-100 rounded-xl overflow-hidden bg-white">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-800 hover:bg-slate-800 border-b border-slate-700">
                  <TableHead className="text-slate-200 font-semibold text-center py-3.5 w-12">No</TableHead>
                  <TableHead className="text-slate-200 font-semibold">ID Customer</TableHead>
                  <TableHead className="text-slate-200 font-semibold">Login Terakhir</TableHead>
                  <TableHead className="text-slate-200 font-semibold">Status</TableHead>
                  <TableHead className="text-slate-200 font-semibold text-center w-28">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((item, index) => (
                    <TableRow
                      key={item.id_customer}
                      className="border-b border-slate-100 hover:bg-blue-50/40 transition-colors"
                    >
                      <TableCell className="text-center font-medium text-slate-500 py-3.5">
                        {startIndex + index + 1}
                      </TableCell>
                      <TableCell className="font-medium text-slate-800">
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold">
                          {item.id_customer}
                        </span>
                      </TableCell>
                      <TableCell className="text-slate-600 font-medium">
                        <div className="flex items-center gap-2">
                          <FaClock className="w-3 h-3 text-slate-400" />
                          {formatDate(item.login_terakhir)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusBadgeStyle(item.login_terakhir)} border font-bold text-xs`}>
                          {getStatusText(item.login_terakhir)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          <Button
                            size="icon"
                            onClick={() => navigate(`/aktivitas-user/${item.id_customer}`)}
                            className="bg-blue-600 hover:bg-blue-700 text-white w-8 h-8 rounded-lg shadow-sm"
                            title="Lihat Detail"
                          >
                            <FaEye className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            onClick={() => setDeleteData(item)}
                            className="bg-rose-500 hover:bg-rose-600 text-white w-8 h-8 rounded-lg shadow-sm"
                            title="Hapus Data"
                          >
                            <FaTrash className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-slate-400 font-medium">
                      Tidak ada data aktivitas ditemukan.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* COOL PAGINATION */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 border-t border-slate-100 bg-slate-50/30">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-xs text-slate-500 font-medium">
                Menampilkan <span className="font-semibold text-slate-800">{filterData.length === 0 ? 0 : startIndex + 1}</span> sampai{" "}
                <span className="font-semibold text-slate-800">{Math.min(startIndex + itemsPerPage, filterData.length)}</span> dari{" "}
                <span className="font-semibold text-slate-800">{filterData.length}</span> data
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
                  className="text-xs font-semibold bg-white border border-slate-200 rounded-lg p-1 text-slate-700 outline-none focus:border-blue-600 transition-colors shadow-xs"
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

      {/* ALERT DELETE */}
      <AlertDialog open={!!deleteData} onOpenChange={() => setDeleteData(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Aktivitas User?</AlertDialogTitle>
            <AlertDialogDescription>
              Data aktivitas <b>{deleteData?.id_customer}</b> akan dihapus permanen dan tidak dapat dikembalikan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={hapusData}
              className="bg-red-600 hover:bg-red-700"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
