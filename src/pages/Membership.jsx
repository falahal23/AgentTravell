import { useState } from "react";

import membershipData from "../Data/Membership.json";

import { FaEye, FaTrash, FaSearch } from "react-icons/fa";

export default function Membership() {
  const [data, setData] = useState(membershipData);

  const [search, setSearch] = useState("");

  const [detail, setDetail] = useState(null);

  // HAPUS DATA
  const hapusData = (id) => {
    if (window.confirm("Hapus data membership?")) {
      const result = data.filter((item) => item.id_customer !== id);

      setData(result);
    }
  };

  // SEARCH DATA
  const filterData = data.filter(
    (item) =>
      item.id_customer?.toLowerCase().includes(search.toLowerCase()) ||
      item.status_member?.toLowerCase().includes(search.toLowerCase()) ||
      item.level_membership?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#EAF2FF] p-6">
      {/* HEADER */}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Membership Customer
          </h1>

          <p className="text-gray-400">Data status pelanggan CRM</p>
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
            placeholder="Cari membership..."
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

              <th>Tanggal Daftar</th>

              <th>Status Member</th>

              <th>Level Membership</th>

              <th>Referral Code</th>

              <th>Status Aktif</th>

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

                <td>{item.tanggal_daftar}</td>

                {/* STATUS MEMBER */}

                <td>
                  <span
                    className={
                      item.status_member === "Member"
                        ? "bg-green-100 text-green-600 px-3 py-1 rounded-full"
                        : "bg-red-100 text-red-600 px-3 py-1 rounded-full"
                    }
                  >
                    {item.status_member}
                  </span>
                </td>

                <td>{item.level_membership}</td>

                <td>{item.referral_code}</td>

                <td>
                  <span
                    className={
                      item.status_aktif === "Aktif"
                        ? "bg-blue-100 text-blue-600 px-3 py-1 rounded-full"
                        : "bg-gray-100 text-gray-500 px-3 py-1 rounded-full"
                    }
                  >
                    {item.status_aktif}
                  </span>
                </td>

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
                            w-[430px]
                            rounded-2xl
                            p-6
                            "
          >
            <h2 className="font-bold text-xl mb-5">Detail Membership</h2>

            <div className="space-y-3">
              <p>ID : {detail.id_customer}</p>

              <p>Tanggal : {detail.tanggal_daftar}</p>

              <p>Status : {detail.status_member}</p>

              <p>Level : {detail.level_membership}</p>

              <p>Referral : {detail.referral_code}</p>

              <p>Status Aktif : {detail.status_aktif}</p>
            </div>

            <button
              onClick={() => setDetail(null)}
              className="
                                mt-6
                                bg-[#1018A8]
                                text-white
                                w-full
                                py-3
                                rounded-xl
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
