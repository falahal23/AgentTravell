import { useState } from "react";

import dataInteraksi from "../Data/RiwayatInteraksi.json";

import { FaEye, FaTrash, FaSearch } from "react-icons/fa";

export default function RiwayatInteraksi() {
  const [data, setData] = useState(dataInteraksi);

  const [search, setSearch] = useState("");

  const [detail, setDetail] = useState(null);

  // HAPUS DATA
  const hapusData = (id) => {
    if (window.confirm("Hapus riwayat interaksi?")) {
      setData(data.filter((item) => item.id_customer !== id));
    }
  };

  // SEARCH
  const filterData = data.filter(
    (item) =>
      item.id_customer?.toLowerCase().includes(search.toLowerCase()) ||
      item.customer_service?.toLowerCase().includes(search.toLowerCase()) ||
      item.feedback?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#EAF2FF] p-6">
      {/* HEADER */}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Riwayat Interaksi</h1>

          <p className="text-gray-400">Monitoring komunikasi pelanggan</p>
        </div>

        <div className="bg-white px-4 py-3 rounded-xl flex gap-3">
          <FaSearch className="text-gray-400" />

          <input
            placeholder="Cari interaksi..."
            className="outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}

      <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-center">
          <thead className="bg-[#1018A8] text-white">
            <tr>
              <th className="p-4">ID Customer</th>

              <th>Customer Service</th>

              <th>Riwayat Komplain</th>

              <th>Feedback</th>

              <th>Catatan Admin</th>

              <th>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {filterData.map((item) => (
              <tr key={item.id_customer} className="border-b hover:bg-blue-50">
                <td className="p-4 font-semibold">{item.id_customer}</td>

                <td>{item.customer_service}</td>

                <td>{item.riwayat_komplain}</td>

                <td>
                  <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                    {item.feedback}
                  </span>
                </td>

                <td>{item.catatan_admin}</td>

                <td>
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => setDetail(item)}
                      className="bg-blue-100 text-blue-600 p-3 rounded-lg"
                    >
                      <FaEye />
                    </button>

                    <button
                      onClick={() => hapusData(item.id_customer)}
                      className="bg-red-100 text-red-600 p-3 rounded-lg"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}

      {detail && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white rounded-xl p-6 w-[450px]">
            <h2 className="font-bold text-xl mb-5">Detail Interaksi</h2>

            <p>ID : {detail.id_customer}</p>

            <p>CS : {detail.customer_service}</p>

            <p>Komplain : {detail.riwayat_komplain}</p>

            <p>Feedback : {detail.feedback}</p>

            <p>Catatan : {detail.catatan_admin}</p>

            <button
              onClick={() => setDetail(null)}
              className="bg-[#1018A8] text-white w-full py-3 rounded-xl mt-5"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
