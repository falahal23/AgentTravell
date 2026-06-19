import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import dataKontak from "../Data/DataKontak.json";
import {
  FaEye,
  FaTrash,
  FaSearch,
  FaUsers,
  FaCopy,
  FaMapMarkerAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// Import komponen detail yang baru dipisah
import DetailKontak from "./DetailKontak";

export default function DataKontak() {
  const navigate = useNavigate();
  const [kontak, setKontak] = useState(dataKontak);
  const [search, setSearch] = useState("");
  const [detail, setDetail] = useState(null);
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedProvince, setSelectedProvince] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalKontak, setTotalKontak] = useState(0);
  const searchRef = useRef(null);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const cities = ["All", ...new Set(kontak.map((item) => item.kota))];
  const provinces = ["All", ...new Set(kontak.map((item) => item.provinsi))];

  const handleDelete = (id) => {
    if (window.confirm("Yakin ingin hapus data?")) {
      setKontak(kontak.filter((item) => item.id_customer !== id));
    }
  };

  const filteredData = kontak.filter((item) => {
    const keyword = search.toLowerCase();
    const matchSearch =
      item.id_customer?.toLowerCase().includes(keyword) ||
      item.email?.toLowerCase().includes(keyword) ||
      item.kota?.toLowerCase().includes(keyword) ||
      item.provinsi?.toLowerCase().includes(keyword) ||
      item.nomor_hp?.includes(search);

    const matchCity = selectedCity === "All" || item.kota === selectedCity;
    const matchProvince =
      selectedProvince === "All" || item.provinsi === selectedProvince;

    return matchSearch && matchCity && matchProvince;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  useEffect(() => {
    setTotalKontak(filteredData.length);
  }, [filteredData]);

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCity, selectedProvince]);

  return (
    <div className="p-6 bg-slate-50/50 min-h-screen space-y-6 font-sans">
      {/* HEADER BANNER / ALERT */}
      <Alert className="!hidden bg-gradient-to-r from-blue-700 to-sky-600 text-white border-0 shadow-lg rounded-xl p-5 items-center gap-4">
        <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
          <FaUsers className="w-6 h-6 text-sky-200" />
        </div>
        <div>
          <AlertTitle className="text-xl font-bold tracking-wide">
            Data Kontak Customer
          </AlertTitle>
          <AlertDescription className="text-blue-100 mt-1">
            Total database terdaftar:{" "}
            <span className="font-semibold text-white">{kontak.length}</span>{" "}
            Customer
          </AlertDescription>
        </div>
      </Alert>

      {/* STATISTIC CARDS */}
      <div className="!hidden grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="shadow-sm border border-slate-100 bg-white rounded-xl hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                Kontak Ditemukan
              </p>
              <h2 className="text-3xl font-extrabold text-blue-600 mt-1">
                {totalKontak}
              </h2>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl font-bold">
              Qty
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-slate-100 bg-white rounded-xl hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                Cakupan Kota
              </p>
              <h2 className="text-3xl font-extrabold text-slate-800 mt-1">
                {cities.length - 1}
              </h2>
            </div>
            <div className="p-3 bg-sky-50 text-sky-600 rounded-xl font-bold">
              City
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-slate-100 bg-white rounded-xl hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                Total Provinsi
              </p>
              <h2 className="text-3xl font-extrabold text-indigo-600 mt-1">
                {provinces.length - 1}
              </h2>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl font-bold">
              Prov
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SEARCH & FILTER CONTROLS */}
      <Card className="shadow-sm border border-slate-100 bg-white rounded-xl">
        <CardContent className="p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <h3 className="text-lg font-bold text-slate-800">
              Manajemen Data Kontak
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3.5 top-3 text-slate-400 w-4 h-4" />
              <Input
                ref={searchRef}
                placeholder="Cari ID, email, nomor HP..."
                className="pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg h-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="border border-slate-200 rounded-lg p-2 bg-white text-sm text-slate-700 h-10 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="All">Semua Kota</option>
              {cities
                .filter((c) => c !== "All")
                .map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
            </select>

            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="border border-slate-200 rounded-lg p-2 bg-white text-sm text-slate-700 h-10 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="All">Semua Provinsi</option>
              {provinces
                .filter((p) => p !== "All")
                .map((prov) => (
                  <option key={prov} value={prov}>
                    {prov}
                  </option>
                ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* TABLE DATA */}
      <Card className="shadow-md border border-slate-100 rounded-xl overflow-hidden bg-white">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-800 hover:bg-slate-800 border-b border-slate-700">
                  <TableHead className="text-slate-200 font-semibold w-16 text-center py-3.5">
                    No
                  </TableHead>
                  <TableHead className="text-slate-200 font-semibold">
                    Nomor HP
                  </TableHead>
                  <TableHead className="text-slate-200 font-semibold">
                    Email
                  </TableHead>
                  <TableHead className="text-slate-200 font-semibold">
                    Domisili
                  </TableHead>
                  <TableHead className="text-slate-200 font-semibold text-center w-36">
                    Aksi
                  </TableHead>
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
                        {item.nomor_hp}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {item.email}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <FaMapMarkerAlt className="text-slate-400 w-3 h-3" />
                          <span>
                            {item.kota}, {item.provinsi}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            size="icon"
                            onClick={() =>
                              navigate(`/DataKontak/DetailKontak/${item.id_customer}`)
                            } // Mengarah ke file baru membawa ID
                            className="bg-blue-600 hover:bg-blue-700 text-white w-8 h-8 rounded-lg shadow-sm"
                            title="Lihat Detail"
                          >
                            <FaEye className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            className="bg-sky-500 hover:bg-sky-600 text-white w-8 h-8 rounded-lg shadow-sm"
                            onClick={() => {
                              navigator.clipboard.writeText(item.email);
                              alert("Email berhasil disalin ke clipboard!");
                            }}
                            title="Salin Email"
                          >
                            <FaCopy className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            onClick={() => handleDelete(item.id_customer)}
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
                    <TableCell
                      colSpan={5}
                      className="text-center py-10 text-slate-400 font-medium"
                    >
                      Tidak ada data kontak ditemukan.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* COOL PAGINATION */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 p-5 border-t border-slate-100 bg-slate-50/30">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-xs text-slate-500 font-medium">
                Menampilkan <span className="font-semibold text-slate-800">{filteredData.length === 0 ? 0 : startIndex + 1}</span> sampai{" "}
                <span className="font-semibold text-slate-800">{Math.min(startIndex + itemsPerPage, filteredData.length)}</span> dari{" "}
                <span className="font-semibold text-slate-800">{filteredData.length}</span> data
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

      {/* MODAL COMPONENT DETAIL */}
      <DetailKontak detail={detail} onClose={() => setDetail(null)} />
    </div>
  );
}
