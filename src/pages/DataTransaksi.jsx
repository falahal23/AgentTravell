import { useState } from "react";
import { useNavigate } from "react-router-dom";
import transaksiData from "../Data/DataTransaksi.json";
import { FaEye, FaTrash, FaSearch, FaMoneyBill, FaCreditCard, FaCalendarAlt, FaFilter, FaUndo } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export default function DataTransaksi() {
  const navigate = useNavigate();
  const [data, setData] = useState(transaksiData);
  const [search, setSearch] = useState("");
  const [deleteData, setDeleteData] = useState(null);
  const [paymentFilter, setPaymentFilter] = useState("Semua");
  const [productFilter, setProductFilter] = useState("Semua");
  const [yearFilter, setYearFilter] = useState("Semua");
  const [amountFilter, setAmountFilter] = useState("Semua");
  const [sortBy, setSortBy] = useState("terbaru");

  const hapusData = () => {
    setData(
      data.filter((item) => item.id_transaksi !== deleteData.id_transaksi),
    );
    setDeleteData(null);
  };

  const paymentOptions = ["Semua", ...new Set(data.map((item) => item.metode_pembayaran))];
  const productOptions = ["Semua", ...new Set(data.map((item) => item.produk_dibeli))];
  const yearOptions = ["Semua", ...new Set(data.map((item) => item.tanggal_transaksi.slice(0, 4)))];

  const filterData = data
    .filter((item) => {
      const keyword = search.toLowerCase();
      const matchesSearch =
        item.id_customer?.toLowerCase().includes(keyword) ||
        item.id_transaksi?.toLowerCase().includes(keyword) ||
        item.produk_dibeli?.toLowerCase().includes(keyword);
      const matchesPayment = paymentFilter === "Semua" || item.metode_pembayaran === paymentFilter;
      const matchesProduct = productFilter === "Semua" || item.produk_dibeli === productFilter;
      const matchesYear = yearFilter === "Semua" || item.tanggal_transaksi.startsWith(yearFilter);
      const matchesAmount =
        amountFilter === "Semua" ||
        (amountFilter === "rendah" && item.total_transaksi < 1000000) ||
        (amountFilter === "menengah" && item.total_transaksi >= 1000000 && item.total_transaksi <= 5000000) ||
        (amountFilter === "tinggi" && item.total_transaksi > 5000000);
      return matchesSearch && matchesPayment && matchesProduct && matchesYear && matchesAmount;
    })
    .sort((a, b) => {
      if (sortBy === "terlama") return new Date(a.tanggal_transaksi) - new Date(b.tanggal_transaksi);
      if (sortBy === "nominal-tinggi") return b.total_transaksi - a.total_transaksi;
      if (sortBy === "nominal-rendah") return a.total_transaksi - b.total_transaksi;
      return new Date(b.tanggal_transaksi) - new Date(a.tanggal_transaksi);
    });

  const hasActiveFilter = search || paymentFilter !== "Semua" || productFilter !== "Semua" || yearFilter !== "Semua" || amountFilter !== "Semua" || sortBy !== "terbaru";
  const resetFilters = () => {
    setSearch("");
    setPaymentFilter("Semua");
    setProductFilter("Semua");
    setYearFilter("Semua");
    setAmountFilter("Semua");
    setSortBy("terbaru");
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(angka);
  };

  const getPaymentBadgeStyle = (metode) => {
    switch(metode) {
      case "Transfer Bank": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Kartu Kredit": return "bg-purple-100 text-purple-700 border-purple-200";
      case "QRIS": return "bg-green-100 text-green-700 border-green-200";
      case "COD": return "bg-orange-100 text-orange-700 border-orange-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6 space-y-6">
      {/* HEADER BANNER */}
      <Alert className="!hidden bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 shadow-lg rounded-xl p-5 items-center gap-4">
        <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
          <FaMoneyBill className="w-6 h-6 text-blue-200" />
        </div>
        <div>
          <AlertTitle className="text-xl font-bold tracking-wide">
            Data Transaksi CRM
          </AlertTitle>
          <AlertDescription className="text-blue-100 mt-1">
            Total transaksi tersimpan:{" "}
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
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Transaksi</p>
                <h2 className="text-3xl font-extrabold text-blue-600 mt-1">{filterData.length}</h2>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl font-bold text-xl">
                Qty
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-slate-100 bg-white rounded-xl hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Nilai</p>
                <h2 className="text-2xl font-extrabold text-emerald-600 mt-1">
                  {formatRupiah(data.reduce((sum, item) => sum + item.total_transaksi, 0) / 1000000)}M
                </h2>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl font-bold">
                💰
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-slate-100 bg-white rounded-xl hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Metode Populer</p>
                <h2 className="text-2xl font-extrabold text-indigo-600 mt-1">Transfer Bank</h2>
              </div>
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-xl">
                🏦
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SEARCH CARD */}
      <Card className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-[0_12px_35px_rgba(30,64,175,0.08)]">
        <div className="flex flex-col gap-3 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-200"><FaFilter /></span>
            <div>
              <h3 className="font-bold text-slate-900">Filter Transaksi</h3>
              <p className="text-xs text-slate-500">Menampilkan {filterData.length} dari {data.length} transaksi</p>
            </div>
          </div>
          {hasActiveFilter && <button type="button" onClick={resetFilters} className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-600 hover:text-white"><FaUndo /> Reset Filter</button>}
        </div>
        <CardContent className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
          <label className="space-y-1.5 xl:col-span-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Pencarian</span>
            <div className="relative">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Cari ID customer, transaksi, atau produk..."
                className="h-11 rounded-xl border-slate-200 bg-slate-50 pl-10 focus:bg-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            </div>
          </label>
          <FilterSelect label="Metode Pembayaran" value={paymentFilter} onChange={setPaymentFilter} options={paymentOptions} />
          <FilterSelect label="Produk" value={productFilter} onChange={setProductFilter} options={productOptions} />
          <FilterSelect label="Tahun" value={yearFilter} onChange={setYearFilter} options={yearOptions} />
          <FilterSelect label="Rentang Nominal" value={amountFilter} onChange={setAmountFilter} options={[{ value: "Semua", label: "Semua nominal" }, { value: "rendah", label: "< Rp1 juta" }, { value: "menengah", label: "Rp1–5 juta" }, { value: "tinggi", label: "> Rp5 juta" }]} />
          <FilterSelect label="Urutkan" value={sortBy} onChange={setSortBy} options={[{ value: "terbaru", label: "Tanggal terbaru" }, { value: "terlama", label: "Tanggal terlama" }, { value: "nominal-tinggi", label: "Nominal tertinggi" }, { value: "nominal-rendah", label: "Nominal terendah" }]} />
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
                  <TableHead className="text-slate-200 font-semibold">ID Transaksi</TableHead>
                  <TableHead className="text-slate-200 font-semibold">Total</TableHead>
                  <TableHead className="text-slate-200 font-semibold">Pembayaran</TableHead>
                  <TableHead className="text-slate-200 font-semibold">Produk</TableHead>
                  <TableHead className="text-slate-200 font-semibold">Tanggal</TableHead>
                  <TableHead className="text-slate-200 font-semibold text-center w-28">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filterData.length > 0 ? (
                  filterData.map((item, index) => (
                    <TableRow
                      key={item.id_transaksi}
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
                      <TableCell className="font-medium text-slate-800">{item.id_transaksi}</TableCell>
                      <TableCell>
                        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 font-bold">
                          {formatRupiah(item.total_transaksi)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getPaymentBadgeStyle(item.metode_pembayaran)} border font-bold text-xs`}>
                          <FaCreditCard className="w-3 h-3 mr-1 inline" />
                          {item.metode_pembayaran}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-600 font-medium">{item.produk_dibeli}</TableCell>
                      <TableCell className="text-slate-600 flex items-center gap-1.5">
                        <FaCalendarAlt className="w-3 h-3 text-slate-400" />
                        {item.tanggal_transaksi}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          <Button
                            size="icon"
                            onClick={() => navigate(`/data-transaksi/${item.id_transaksi}`)}
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
                    <TableCell colSpan={8} className="text-center py-10 text-slate-400 font-medium">
                      Tidak ada data transaksi ditemukan.
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
            <AlertDialogTitle>Hapus Transaksi?</AlertDialogTitle>
            <AlertDialogDescription>
              Transaksi <b>{deleteData?.id_transaksi}</b> akan dihapus permanen dan tidak dapat dikembalikan.
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

function FilterSelect({ label, value, onChange, options }) {
  return (
    <label className="space-y-1.5">
      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100">
        {options.map((option) => {
          const item = typeof option === "string" ? { value: option, label: option } : option;
          return <option key={item.value} value={item.value}>{item.label}</option>;
        })}
      </select>
    </label>
  );
}
