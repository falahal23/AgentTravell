import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import marketingData from "../Data/Marketing.json";
import { FaEye, FaTrash, FaSearch, FaFire, FaChartBar, FaUsers, FaFilter, FaUndo, FaChevronLeft, FaChevronRight } from "react-icons/fa";
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
  const [sourceFilter, setSourceFilter] = useState("Semua");
  const [promoFilter, setPromoFilter] = useState("Semua");
  const [sortBy, setSortBy] = useState("id-asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, sourceFilter, promoFilter, sortBy]);

  const hapusData = () => {
    setData(data.filter((item) => item.id_customer !== deleteData.id_customer));
    setDeleteData(null);
  };

  const sourceOptions = ["Semua", ...new Set(data.map((item) => item.sumber_user))];
  const promoOptions = ["Semua", ...new Set(data.map((item) => item.status_promo))];
  const filterData = data
    .filter((item) => {
      const keyword = search.toLowerCase();
      const matchesSearch =
        item.id_customer?.toLowerCase().includes(keyword) ||
        item.sumber_user?.toLowerCase().includes(keyword) ||
        item.status_promo?.toLowerCase().includes(keyword);
      const matchesSource = sourceFilter === "Semua" || item.sumber_user === sourceFilter;
      const matchesPromo = promoFilter === "Semua" || item.status_promo === promoFilter;
      return matchesSearch && matchesSource && matchesPromo;
    })
    .sort((a, b) => {
      if (sortBy === "id-desc") return b.id_customer.localeCompare(a.id_customer);
      if (sortBy === "source") return a.sumber_user.localeCompare(b.sumber_user);
      if (sortBy === "promo") return a.status_promo.localeCompare(b.status_promo);
      return a.id_customer.localeCompare(b.id_customer);
    });

  const totalPages = Math.ceil(filterData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filterData.slice(startIndex, startIndex + itemsPerPage);

  const hasActiveFilter = search || sourceFilter !== "Semua" || promoFilter !== "Semua" || sortBy !== "id-asc";
  const resetFilters = () => {
    setSearch("");
    setSourceFilter("Semua");
    setPromoFilter("Semua");
    setSortBy("id-asc");
  };

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
      <Alert className="!hidden bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 shadow-lg rounded-xl p-5 items-center gap-4">
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
      <div className="!hidden grid-cols-1 md:grid-cols-3 gap-5">
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
      <Card className="overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-[0_12px_35px_rgba(109,40,217,0.08)]">
        <div className="flex flex-col gap-3 border-b border-slate-100 bg-gradient-to-r from-violet-50 via-fuchsia-50 to-pink-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white shadow-lg shadow-violet-200"><FaFilter /></span>
            <div>
              <h3 className="font-bold text-slate-900">Filter Marketing</h3>
              <p className="text-xs text-slate-500">Menampilkan {filterData.length} dari {data.length} customer</p>
            </div>
          </div>
          {hasActiveFilter && <button type="button" onClick={resetFilters} className="inline-flex items-center justify-center gap-2 rounded-xl border border-violet-200 bg-white px-3 py-2 text-xs font-bold text-violet-700 hover:bg-violet-600 hover:text-white"><FaUndo /> Reset Filter</button>}
        </div>
        <CardContent className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2 xl:grid-cols-4">
          <label className="space-y-1.5 xl:col-span-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Pencarian</span>
            <div className="relative">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Cari ID customer, sumber, atau status promo..."
                className="h-11 rounded-xl border-slate-200 bg-slate-50 pl-10 focus:bg-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            </div>
          </label>
          <MarketingSelect label="Sumber User" value={sourceFilter} onChange={setSourceFilter} options={sourceOptions} />
          <MarketingSelect label="Status Promo" value={promoFilter} onChange={setPromoFilter} options={promoOptions} />
          <MarketingSelect label="Urutkan Data" value={sortBy} onChange={setSortBy} options={[{ value: "id-asc", label: "ID terkecil" }, { value: "id-desc", label: "ID terbesar" }, { value: "source", label: "Nama sumber" }, { value: "promo", label: "Status promo" }]} />
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

function MarketingSelect({ label, value, onChange, options }) {
  return (
    <label className="space-y-1.5">
      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 outline-none focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100">
        {options.map((option) => {
          const item = typeof option === "string" ? { value: option, label: option } : option;
          return <option key={item.value} value={item.value}>{item.label}</option>;
        })}
      </select>
    </label>
  );
}
