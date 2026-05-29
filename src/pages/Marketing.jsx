import { useState } from "react";

import marketingData from "../Data/Marketing.json";

import { FaEye, FaTrash, FaSearch } from "react-icons/fa";

export default function Marketing() {
  const [data, setData] = useState(marketingData);

  const [search, setSearch] = useState("");

  const [detail, setDetail] = useState(null);

  // DELETE
  const hapusData = (id) => {
    if (window.confirm("Hapus data marketing?")) {
      setData(data.filter((item) => item.id_customer !== id));
    }
  };

  // FILTER
  const filterData = data.filter((item) => {
    const keyword = search.toLowerCase();

    return (
      item.id_customer?.toLowerCase().includes(keyword) ||
      item.sumber_user?.toLowerCase().includes(keyword) ||
      item.status_promo?.toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="min-h-screen bg-[#EAF2FF] p-6">
      {/* HEADER */}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Marketing & Engagement</h1>

          <p className="text-gray-400">Data sumber customer dan promo</p>
        </div>

        <div className="bg-white px-4 py-3 rounded-xl flex items-center gap-3">
          <FaSearch className="text-gray-400" />

          <input
            placeholder="Cari marketing..."
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

              <th>Sumber User</th>

              <th>Status Promo</th>

              <th>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {filterData.map((item) => (
              <tr key={item.id_customer} className="border-b hover:bg-blue-50">
                <td className="p-4 font-semibold">{item.id_customer}</td>

                <td>{item.sumber_user}</td>

                <td>
                  <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full">
                    {item.status_promo}
                  </span>
                </td>

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

      {/* DETAIL */}

      {detail && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white rounded-xl p-6 w-[400px]">
            <h2 className="font-bold text-xl mb-5">Detail Marketing</h2>

            <p>ID Customer : {detail.id_customer}</p>

            <p>Sumber User : {detail.sumber_user}</p>

            <p>Status Promo : {detail.status_promo}</p>

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
