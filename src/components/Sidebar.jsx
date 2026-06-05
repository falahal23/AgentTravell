import { NavLink } from "react-router-dom";

import {
  MdSpaceDashboard,
  MdPayments,
  MdOutlineMessage,
  MdFavoriteBorder,
  MdOutlineExplore,
} from "react-icons/md";

import {
  FaFileInvoiceDollar,
  FaUsers,
  FaPuzzlePiece,
  FaPlane,
  FaArrowRight,
} from "react-icons/fa";

import { HiOutlineLogout } from "react-icons/hi";

export default function Sidebar() {
  const menuItems = [
    {
      path: "/",
      icon: MdSpaceDashboard,
      label: "Dashboard",
    },

    {
      path: "/customers",
      icon: FaUsers,
      label: "Data Customers",
    },

    {
      path: "/data-kontak",
      icon: FaFileInvoiceDollar,
      label: "Data Kontak",
    },

    {
      path: "/membership",
      icon: MdFavoriteBorder,
      label: "Membership",
    },

    {
      path: "/riwayat-interaksi",
      icon: MdOutlineMessage,
      label: "Interaksi",
    },

    {
      path: "/data-transaksi",
      icon: MdPayments,
      label: "Transaksi",
    },

    {
      path: "/aktivitas-user",
      icon: MdOutlineExplore,
      label: "Aktivitas",
    },

    {
      path: "/marketing",
      icon: FaPuzzlePiece,
      label: "Marketing",
    },
  ];

  const menuClass = ({ isActive }) =>
    `flex items-center gap-4 h-[42px] rounded-xl px-4 text-sm font-semibold transition-all ${
      isActive
        ? "bg-[#0A257F] text-white"
        : "text-gray-400 hover:bg-blue-50 hover:text-[#0A257F]"
    }`;

  return (
    <aside className="h-screen bg-white px-5 py-6 flex flex-col justify-between">
      {/* ATAS */}

      <div>
        {/* LOGO */}

        <div className="flex justify-center items-center gap-2 mb-10">
          <FaPlane className="text-[#0A257F] text-lg -rotate-45" />
          <h1 className="text-[22px] font-black text-[#0A257F]">GoTravel</h1>
        </div>

        {/* MENU */}

        <nav>
          <ul className="space-y-3">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.path === "/"}
                    className={menuClass}
                  >
                    <Icon className="text-lg" />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* BAWAH */}

      <div>
        {/* CARD */}

        <div className="relative bg-[#D6E9FF] rounded-[28px] h-[145px] overflow-hidden mb-10">
          <div className="absolute top-0 left-0 bg-[#0A257F] text-white w-[85%] h-[95px] rounded-br-[50px] p-4">
            <h3 className="font-bold text-sm">50% Discount!</h3>

            <p className="text-[10px] mt-3">
              Get a discount on certain days and dont miss it.
            </p>
          </div>

          <button
            type="button"
            className="absolute bottom-4 left-4 bg-[#0A257F] text-white w-7 h-7 rounded-full flex items-center justify-center"
          >
            <FaArrowRight size={10} />
          </button>
        </div>

        {/* LOGOUT */}

        <button
          type="button"
          onClick={() => {
            console.log("Logout clicked");
            // TODO: Implement logout functionality
          }}
          className="flex items-center gap-4 text-gray-400 hover:text-red-500 text-sm px-3"
          title="Click to logout"
        >
          <HiOutlineLogout size={20} />
          Log Out
        </button>
      </div>
    </aside>
  );
}
