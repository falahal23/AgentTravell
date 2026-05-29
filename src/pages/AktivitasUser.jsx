import { useState } from "react";

import aktivitasData from "../Data/AktivitasUser.json";

import { FaEye, FaTrash, FaSearch, FaClock } from "react-icons/fa";

export default function AktivitasUser() {
  const [data, setData] = useState(aktivitasData);

  const [search, setSearch] = useState("");

  const [detail, setDetail] = useState(null);

  // HAPUS DATA
  const hapusData = (id) => {
    if (window.confirm("Hapus aktivitas user?")) {
      const result = data.filter((item) => item.id_customer !== id);

      setData(result);
    }
  };

  // SEARCH DATA (FIX)
  const filterData = data.filter((item) => {
    const keyword = search.toLowerCase();

    return (
      item.id_customer?.toLowerCase().includes(keyword) ||
      item.login_terakhir?.toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="min-h-screen bg-[#EAF2FF] p-6">
      {/* HEADER */}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Aktivitas User</h1>

          <p className="text-gray-400">Monitoring aktivitas login customer</p>
        </div>

        {/* SEARCH */}

        <div
          className="
                    bg-white
                    px-4
                    py-3
                    rounded-xl
                    flex
                    items-center
                    gap-3
                    shadow-sm
                    "
        >
          <FaSearch className="text-gray-400" />

          <input
            type="text"
            placeholder="Cari user..."
            className="outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}

      <div
        className="
                bg-white
                rounded-2xl
                overflow-hidden
                shadow-sm
                "
      >
        <table className="w-full text-center">
          <thead
            className="
                        bg-[#1018A8]
                        text-white
                        "
          >
            <tr>
              <th className="p-4">ID Customer</th>

              <th>Login Terakhir</th>

              <th>Status</th>

              <th>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {filterData.map((item) => (
              <tr
                key={item.id_customer}
                className="
                                    border-b
                                    hover:bg-blue-50
                                    transition
                                    "
              >
                <td className="p-4 font-semibold">{item.id_customer}</td>

                <td>
                  <div className="flex justify-center items-center gap-2">
                    <FaClock className="text-blue-500" />

                    <span>{item.login_terakhir}</span>
                  </div>
                </td>

                <td>
                  <span
                    className="
                                            bg-green-100
                                            text-green-600
                                            px-3
                                            py-1
                                            rounded-full
                                            "
                  >
                    Aktif
                  </span>
                </td>

                <td>
                  <div className="flex justify-center gap-3">
                    {/* DETAIL */}

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

                    {/* HAPUS */}

                    <button
                      onClick={() => hapusData(item.id_customer)}
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
        <div
          className="
                        fixed
                        inset-0
                        bg-black/40
                        flex
                        justify-center
                        items-center
                        "
        >
          <div
            className="
                            bg-white
                            rounded-xl
                            p-6
                            w-[420px]
                            "
          >
            <h2 className="font-bold text-xl mb-5">Detail Aktivitas User</h2>

            <div className="space-y-3">
              <p>ID Customer : {detail.id_customer}</p>

              <p>Login Terakhir : {detail.login_terakhir}</p>

              <p>Status : Aktif</p>
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
