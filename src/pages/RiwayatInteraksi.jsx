import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { FaEye, FaTrash, FaSearch, FaFilter, FaSyncAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Button } from "@/components/ui/button";

function getInitials(name) {
  return name
    ?.split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function FeedbackBadge({ value }) {
  const map = {
    positif: "bg-green-100 text-green-700",
    negatif: "bg-red-100 text-red-600",
    netral: "bg-yellow-100 text-yellow-700",
  };
  return (
    <span
      className={`text-xs px-3 py-1 rounded-full font-medium ${map[value?.toLowerCase()] || "bg-gray-100 text-gray-500"}`}
    >
      {value}
    </span>
  );
}

const FEEDBACK_OPTIONS = ["Semua", "Positif", "Negatif", "Netral"];
const SORT_OPTIONS = [
  { value: "", label: "— Urutkan —" },
  { value: "id-asc", label: "ID: A → Z" },
  { value: "id-desc", label: "ID: Z → A" },
  { value: "cs-asc", label: "CS: A → Z" },
  { value: "pos-first", label: "Positif dulu" },
  { value: "neg-first", label: "Negatif dulu" },
];

export default function RiwayatInteraksi() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [activeFeedback, setActiveFeedback] = useState("Semua");
  const [activeCS, setActiveCS] = useState("Semua");
  const [sortBy, setSortBy] = useState("");
  const [detail, setDetail] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  const fetchInteraksi = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data: dbData, error: err } = await supabase.from("interaksi").select("*");
      if (err) throw err;

      const mapped = (dbData || []).map((item) => ({
        id_customer: item.id_customer,
        customer_service: item.chat_cs || "Tidak Pernah Chat",
        riwayat_komplain: item.riwayat_komplain || "-",
        feedback: item.feedback_review || "Netral",
        catatan_admin: item.catatan_admin || "",
        id_interaksi: item.id_interaksi,
      }));
      setData(mapped);
    } catch (err) {
      console.error(err);
      setError(err.message || "Gagal memuat data interaksi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInteraksi();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, activeFeedback, activeCS, sortBy]);

  const csOptions = useMemo(
    () => ["Semua", ...new Set(data.map((i) => i.customer_service))],
    [data],
  );

  const filtered = useMemo(() => {
    let result = data.filter((item) => {
      const matchFeed =
        activeFeedback === "Semua" ||
        item.feedback?.toLowerCase() === activeFeedback.toLowerCase();
      const matchCS =
        activeCS === "Semua" || item.customer_service === activeCS;
      const q = search.toLowerCase();
      const matchQ =
        !q ||
        item.id_customer?.toLowerCase().includes(q) ||
        item.customer_service?.toLowerCase().includes(q) ||
        item.feedback?.toLowerCase().includes(q) ||
        item.riwayat_komplain?.toLowerCase().includes(q);
      return matchFeed && matchCS && matchQ;
    });

    if (sortBy === "id-asc")
      result.sort((a, b) => a.id_customer.localeCompare(b.id_customer));
    else if (sortBy === "id-desc")
      result.sort((a, b) => b.id_customer.localeCompare(a.id_customer));
    else if (sortBy === "cs-asc")
      result.sort((a, b) =>
        a.customer_service.localeCompare(b.customer_service),
      );
    else if (sortBy === "pos-first")
      result.sort((a) => (a.feedback === "Positif" ? -1 : 1));
    else if (sortBy === "neg-first")
      result.sort((a) => (a.feedback === "Negatif" ? -1 : 1));

    return result;
  }, [data, search, activeFeedback, activeCS, sortBy]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filtered.slice(startIndex, startIndex + itemsPerPage);

  const resetFilters = () => {
    setSearch("");
    setActiveFeedback("Semua");
    setActiveCS("Semua");
    setSortBy("");
  };

  const hapus = async (id) => {
    if (window.confirm("Hapus riwayat interaksi ini?")) {
      try {
        const { error: err } = await supabase
          .from("interaksi")
          .delete()
          .eq("id_customer", id);
        if (err) throw err;
        setData((prev) => prev.filter((i) => i.id_customer !== id));
      } catch (err) {
        console.error(err);
        alert("Gagal menghapus interaksi: " + err.message);
      }
    }
  };

  const hasFilter =
    activeFeedback !== "Semua" || activeCS !== "Semua" || search;

  const pillFeedback = {
    Semua: "bg-[#1018A8] text-white",
    Positif: "bg-green-100 text-green-700",
    Negatif: "bg-red-100 text-red-600",
    Netral: "bg-yellow-100 text-yellow-700",
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
    <div className="min-h-screen bg-[#EAF2FF] p-6">
      {/* HEADER */}
      <div className="flex flex-wrap justify-between items-start gap-4 mb-5">
        <div className="!hidden">
          <h1 className="text-2xl font-semibold">Riwayat Interaksi</h1>
          <p className="text-gray-400 text-sm">
            Monitoring komunikasi pelanggan
          </p>
        </div>
        <div className="bg-white px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm">
          <FaSearch className="text-gray-400 text-sm" />
          <input
            placeholder="Cari ID, CS, atau feedback..."
            className="outline-none text-sm w-48"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* STATS */}
      <div className="!hidden grid-cols-3 gap-3 mb-5">
        {[
          { label: "Total Interaksi", value: filtered.length, color: "" },
          {
            label: "Feedback Positif",
            value: filtered.filter((i) => i.feedback === "Positif").length,
            color: "text-green-600",
          },
          {
            label: "Perlu Tindak Lanjut",
            value: filtered.filter((i) => i.feedback === "Negatif").length,
            color: "text-red-500",
          },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-gray-400 mb-1">{s.label}</p>
            <p className={`text-2xl font-semibold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* FILTER BAR */}
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-5 flex flex-wrap gap-5 items-end">
        {/* Filter Feedback */}
        <div className="flex flex-col gap-2">
          <p className="text-xs text-gray-400 font-medium flex items-center gap-1">
            <FaFilter className="text-xs" /> Feedback
          </p>
          <div className="flex flex-wrap gap-2">
            {FEEDBACK_OPTIONS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFeedback(f)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                  activeFeedback === f
                    ? pillFeedback[f] + " border-transparent"
                    : "bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-400"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Filter CS */}
        <div className="flex flex-col gap-2">
          <p className="text-xs text-gray-400 font-medium">Customer Service</p>
          <div className="flex flex-wrap gap-2">
            {csOptions.map((cs) => (
              <button
                key={cs}
                onClick={() => setActiveCS(cs)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                  activeCS === cs
                    ? cs === "Semua"
                      ? "bg-[#1018A8] text-white border-transparent"
                      : "bg-blue-100 text-blue-700 border-transparent"
                    : "bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-400"
                }`}
              >
                {cs === "Semua" ? cs : cs.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div className="flex flex-col gap-2">
          <p className="text-xs text-gray-400 font-medium">Urutkan</p>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 bg-gray-50 text-gray-700 outline-none"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* Reset */}
        {hasFilter && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 text-xs text-red-500 border border-red-200 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-all self-end"
          >
            <FaSyncAlt /> Reset
          </button>
        )}
      </div>

      {/* CARD GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {paginatedData.length === 0 && (
          <p className="text-gray-400 text-sm col-span-full text-center py-12">
            Tidak ada data yang cocok dengan filter.
          </p>
        )}
        {paginatedData.map((item) => (
          <div
            key={item.id_customer}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:border-blue-200 transition-colors"
          >
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                {item.id_customer}
              </span>
              <FeedbackBadge value={item.feedback} />
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-semibold flex-shrink-0">
                {getInitials(item.customer_service)}
              </div>
              <div>
                <p className="text-sm font-medium">{item.customer_service}</p>
                <p className="text-xs text-gray-400">Customer Service</p>
              </div>
            </div>
            <hr className="border-gray-100 mb-3" />
            <div className="space-y-1.5 text-xs text-gray-600">
              <div className="flex gap-2">
                <span className="text-gray-400 w-16 flex-shrink-0">
                  Komplain
                </span>
                <span>{item.riwayat_komplain}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-400 w-16 flex-shrink-0">
                  Catatan
                </span>
                <span>{item.catatan_admin}</span>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() =>
                  navigate(`/detail-interaksi/${item.id_customer}`)
                }
                className="flex-1 flex items-center justify-center gap-1.5 bg-blue-50 text-blue-600 text-xs py-2 rounded-xl hover:bg-blue-100 transition-colors"
              >
                <FaEye /> Detail
              </button>
              <button
                onClick={() => hapus(item.id_customer)}
                className="flex-1 flex items-center justify-center gap-1.5 bg-red-50 text-red-500 text-xs py-2 rounded-xl hover:bg-red-100 transition-colors"
              >
                <FaTrash /> Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* COOL PAGINATION */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 p-5 rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-xs text-slate-500 font-medium">
            Menampilkan <span className="font-semibold text-slate-800">{filtered.length === 0 ? 0 : startIndex + 1}</span> sampai{" "}
            <span className="font-semibold text-slate-800">{Math.min(startIndex + itemsPerPage, filtered.length)}</span> dari{" "}
            <span className="font-semibold text-slate-800">{filtered.length}</span> data
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
              className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg p-1 text-slate-700 outline-none focus:border-blue-600 transition-colors shadow-xs"
            >
              <option value={6}>6</option>
              <option value={12}>12</option>
              <option value={24}>24</option>
              <option value={60}>60</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Button 
            variant="outline" 
            size="icon"
            className="w-8 h-8 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-55 transition-all"
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
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
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
            className="w-8 h-8 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-55 transition-all"
            disabled={currentPage === totalPages || totalPages === 0} 
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            <FaChevronRight className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* MODAL */}
      {detail && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[420px] shadow-xl">
            <h2 className="font-semibold text-lg mb-4">Detail Interaksi</h2>
            {[
              { label: "ID Customer", value: detail.id_customer },
              { label: "Customer Service", value: detail.customer_service },
              { label: "Komplain", value: detail.riwayat_komplain },
              {
                label: "Feedback",
                value: <FeedbackBadge value={detail.feedback} />,
              },
              { label: "Catatan Admin", value: detail.catatan_admin },
            ].map((row, i) => (
              <div
                key={i}
                className="flex gap-3 py-2.5 border-b border-gray-100 text-sm last:border-none"
              >
                <span className="text-gray-400 w-32 flex-shrink-0">
                  {row.label}
                </span>
                <span className="font-medium text-gray-800">{row.value}</span>
              </div>
            ))}
            <button
              onClick={() => setDetail(null)}
              className="bg-[#1018A8] text-white w-full py-3 rounded-xl mt-5 text-sm font-medium"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
