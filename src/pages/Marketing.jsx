import { useState } from "react";
import { useNavigate } from "react-router-dom";
import marketingData from "../Data/Marketing.json";
import { FaEye, FaTrash, FaSearch, FaFire, FaChartBar, FaUsers } from "react-icons/fa";
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

export default function Marketing() {
  const navigate = useNavigate();
  const [data, setData] = useState(marketingData);
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
      item.sumber_user?.toLowerCase().includes(keyword) ||
      item.status_promo?.toLowerCase().includes(keyword)
    );
  });

  const getSourceBadgeStyle = (sumber) => {
    switch(sumber) {
      case "Marketplace": return "bg-blue-100 text-blue-700 border-blue-200";
      case "YouTube": return "bg-red-100 text-red-700 border-red-200";
      case "Google Search": return "bg-green-100 text-green-700 border-green-200";
      case "Instagram": return "bg-pink-100 text-pink-700 border-pink-200";
      case "Facebook": return "bg-indigo-100 text-indigo-700 border-indigo-200";
      case "TikTok": return "bg-purple-100 text-purple-700 border-purple-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getPromoBadgeStyle = (status) => {
    switch(status) {
      case "Promo Aktif": return "bg-green-100 text-green-700 border-green-200";
      case "Promo Member": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Promo Kedaluwarsa": return "bg-orange-100 text-orange-700 border-orange-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getSourceIcon = (sumber) => {
    switch(sumber) {
      case "Marketplace": return "🛒";
      case "YouTube": return "📺";
      case "Google Search": return "🔍";
      case "Instagram": return "📸";
      case "Facebook": return "f";
      case "TikTok": return "🎵";
      default: return "📊";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6 space-y-6">
      {/* HEADER BANNER */}
      <Alert className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 shadow-lg rounded-xl p-5 flex items-center gap-4">
        <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
          <FaFire className="w-6 h-6 text-blue-200" />
        </div>
        <div>
          <AlertTitle className="text-xl font-bold tracking-wide">
            Marketing & Engagement
          </AlertTitle>
          <AlertDescription className="text-blue-100 mt-1">
            Data sumber customer dan promo:{" "}
            <span className="font-semibold text-white">{data.length}</span> data
          </AlertDescription>
        </div>
      </Alert>

      {/* STATISTICS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="shadow-sm border border-slate-100 bg-white rounded-xl hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Customer</p>
                <h2 className="text-3xl font-extrabold text-blue-600 mt-1">{filterData.length}</h2>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl font-bold text-xl">
                👥
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-slate-100 bg-white rounded-xl hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Promo Aktif</p>
                <h2 className="text-3xl font-extrabold text-green-600 mt-1">
                  {data.filter(item => item.status_promo === "Promo Aktif").length}
                </h2>
              </div>
              <div className="p-3 bg-green-50 text-green-600 rounded-xl font-bold text-xl">
                🎉
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-slate-100 bg-white rounded-xl hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Sumber Terpopuler</p>
                <h2 className="text-2xl font-extrabold text-indigo-600 mt-1">Marketplace</h2>
              </div>
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-xl">
                📊
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SEARCH CARD */}
      <Card className="shadow-sm border border-slate-100 bg-white rounded-xl">
        <CardContent className="p-5">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Data Marketing & Engagement</h3>
          <div className="relative max-w-md">
            <FaSearch className="absolute left-3.5 top-3 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Cari ID customer, sumber, atau status promo..."
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
                  <TableHead className="text-slate-200 font-semibold">Sumber User</TableHead>
                  <TableHead className="text-slate-200 font-semibold">Status Promo</TableHead>
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
                      <TableCell>
                        <Badge className={`${getSourceBadgeStyle(item.sumber_user)} border font-bold text-xs`}>
                          <span className="mr-1 text-lg">{getSourceIcon(item.sumber_user)}</span>
                          {item.sumber_user}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getPromoBadgeStyle(item.status_promo)} border font-bold text-xs`}>
                          {item.status_promo}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          <Button
                            size="icon"
                            onClick={() => navigate(`/marketing/${item.id_customer}`)}
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
                      Tidak ada data marketing ditemukan.
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
            <AlertDialogTitle>Hapus Data Marketing?</AlertDialogTitle>
            <AlertDialogDescription>
              Data marketing <b>{deleteData?.id_customer}</b> akan dihapus permanen dan tidak dapat dikembalikan.
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
