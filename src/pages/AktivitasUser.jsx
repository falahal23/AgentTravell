import { useState } from "react";
import { useNavigate } from "react-router-dom";
import aktivitasData from "../Data/AktivitasUser.json";
import { FaEye, FaTrash, FaSearch, FaClock, FaUser, FaChartLine } from "react-icons/fa";
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
  const [data, setData] = useState(aktivitasData);
  const [search, setSearch] = useState("");
  const [deleteData, setDeleteData] = useState(null);

  const hapusData = () => {
    setData(data.filter((item) => item.id_customer !== deleteData.id_customer));
    setDeleteData(null);
  };

  const filterData = data.filter((item) => {
    const keyword = search.toLowerCase();
    return (
      item.id_customer?.toLowerCase().includes(keyword) ||
      item.login_terakhir?.toLowerCase().includes(keyword)
    );
  });

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
    // status based on recent login
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
                {filterData.length > 0 ? (
                  filterData.map((item, index) => (
                    <TableRow
                      key={item.id_customer}
                      className="border-b border-slate-100 hover:bg-blue-50/40 transition-colors"
                    >
                      <TableCell className="text-center font-medium text-slate-500 py-3.5">
                        {index + 1}
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
