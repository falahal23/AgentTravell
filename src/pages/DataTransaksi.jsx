import { useState } from "react";

import transaksiData from "../Data/DataTransaksi.json";

import { FaEye, FaTrash, FaSearch } from "react-icons/fa";

export default function DataTransaksi() {
  const [data, setData] = useState(transaksiData);

  const [search, setSearch] = useState("");

  const [detail, setDetail] = useState(null);

  // HAPUS DATA
  const hapusData = (id) => {
    if (window.confirm("Hapus data transaksi?")) {
      setData(data.filter((item) => item.id_transaksi !== id));
    }
  };

  // SEARCH
  const filterData = data.filter(
    (item) =>
      item.id_customer?.toLowerCase().includes(search.toLowerCase()) ||
      item.id_transaksi?.toLowerCase().includes(search.toLowerCase()) ||
      item.produk_dibeli?.toLowerCase().includes(search.toLowerCase()),
  );

  // FORMAT RUPIAH
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(angka);
  };

  return (
    <div className="min-h-screen bg-[#EAF2FF] p-6">
      {/* HEADER */}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Data Transaksi</h1>

          <p className="text-gray-400">Riwayat transaksi customer</p>
        </div>

        {/* SEARCH */}

        <div className="bg-white px-4 py-3 rounded-xl flex gap-3">
          <FaSearch className="text-gray-400" />

          <input
            placeholder="Cari transaksi..."
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

              <th>ID Transaksi</th>

              <th>Total</th>

              <th>Pembayaran</th>

              <th>Produk</th>

              <th>Tanggal</th>

              <th>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {filterData.map((item) => (
              <tr
                key={item.id_transaksi}
                className="
                                    border-b
                                    hover:bg-blue-50
                                    transition
                                    "
              >
                <td className="p-4 font-semibold">{item.id_customer}</td>

                <td>{item.id_transaksi}</td>

                <td className="font-semibold text-green-600">
                  {formatRupiah(item.total_transaksi)}
                </td>

                <td>
                  <span
                    className="
                                            bg-blue-100
                                            text-blue-600
                                            px-3
                                            py-1
                                            rounded-full
                                            "
                  >
                    {item.metode_pembayaran}
                  </span>
                </td>

                <td>{item.produk_dibeli}</td>

                <td>{item.tanggal_transaksi}</td>

                {/* ACTION */}

                <td>
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => setDetail(item)}
                      className="
                                                bg-blue-100
                                                text-blue-600
                                                p-3
                                                rounded-lg
                                                hover:bg-blue-600
                                                hover:text-white
                                                "
                    >
                      <FaEye />
                    </button>

                    <button
                      onClick={() => hapusData(item.id_transaksi)}
                      className="
                                                bg-red-100
                                                text-red-600
                                                p-3
                                                rounded-lg
                                                hover:bg-red-600
                                                hover:text-white
                                                "
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

      {/* MODAL DETAIL */}

      {detail && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white rounded-xl p-6 w-[450px]">
            <h2 className="font-bold text-xl mb-5">Detail Transaksi</h2>

            <div className="space-y-3">
              <p>ID Customer : {detail.id_customer}</p>

              <p>ID Transaksi : {detail.id_transaksi}</p>

              <p>Total : {formatRupiah(detail.total_transaksi)}</p>

              <p>Pembayaran : {detail.metode_pembayaran}</p>

              <p>Produk : {detail.produk_dibeli}</p>

              <p>Tanggal : {detail.tanggal_transaksi}</p>
            </div>

            <button
              onClick={() => setDetail(null)}
              className="
                                bg-[#1018A8]
                                text-white
                                w-full
                                py-3
                                rounded-xl
                                mt-5
                                "
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
