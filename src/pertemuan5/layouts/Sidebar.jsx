import { AiOutlineHome } from "react-icons/ai";
import { FaHome } from "react-icons/fa";
import { MdHeadsetMic } from "react-icons/md";
import { useState } from "react"; // 🔥 TAMBAHAN

export default function Sidebar() {

    const [active, setActive] = useState("dashboard"); // 🔥 TAMBAHAN

    return (
        <div id="sidebar" className="flex min-h-screen w-[360px] flex-col bg-white p-10 shadow-lg">

            {/* Logo */}
            <div id="sidebar-logo" className="flex flex-col">
                <span id="logo-title" className="font-poppins text-[48px] text-gray-900">
                    Sedap <b id="logo-dot" className="text-hijau">.</b>
                </span>
                <span id="logo-subtitle" className="font-semibold text-gray-400">
                    Modern Admin Dashboard
                </span>
            </div>

            {/* List Menu */}
            <div id="sidebar-menu" className="mt-10">
                <ul id="menu-list" className="space-y-3">

                    <li>
                        <div
                            id="menu-1"
                            onClick={() => setActive("dashboard")} // 🔥 TAMBAHAN
                            className={`flex cursor-pointer items-center rounded-xl p-4 font-medium 
                            ${active === "dashboard"
                                    ? "bg-green-200 text-hijau font-extrabold"
                                    : "text-gray-600 hover:bg-green-200 hover:text-hijau hover:font-extrabold"
                                }`}
                        >
                            <span className="mr-4 text-xl"><AiOutlineHome /></span>
                            Dashboard
                        </div>
                    </li>

                    <li>
                        <div
                            id="menu-2"
                            onClick={() => setActive("orders")} // 🔥 TAMBAHAN
                            className={`flex cursor-pointer items-center rounded-xl p-4 font-medium 
                            ${active === "orders"
                                    ? "bg-green-200 text-hijau font-extrabold"
                                    : "text-gray-600 hover:bg-green-200 hover:text-hijau hover:font-extrabold"
                                }`}
                        >
                            <span className="mr-4 text-xl"><FaHome /></span>
                            Orders
                        </div>
                    </li>

                    <li>
                        <div
                            id="menu-3"
                            onClick={() => setActive("customers")} // 🔥 TAMBAHAN
                            className={`flex cursor-pointer items-center rounded-xl p-4 font-medium 
                            ${active === "customers"
                                    ? "bg-green-200 text-hijau font-extrabold"
                                    : "text-gray-600 hover:bg-green-200 hover:text-hijau hover:font-extrabold"
                                }`}
                        >
                            <span className="mr-4 text-xl">
                                <MdHeadsetMic />
                            </span>
                            Customers
                        </div>
                    </li>

                </ul>
            </div>

            {/* Footer */}
            <div id="sidebar-footer" className="mt-auto">
                <div
                    id="footer-card"
                    className="bg-hijau px-4 py-2 rounded-md shadow-lg mb-10 flex items-center"
                >
                    <div id="footer-text" className="pr-3">
                        <span className="text-white text-sm leading-relaxed">
                            Please organize your menus through button below!
                        </span>

                        <div
                            id="add-menu-button"
                            className="flex justify-center items-center p-2 mt-3 bg-white rounded-md space-x-2 w-fit"
                        >
                            <span className="text-gray-600 flex items-center">
                                Add Menus
                            </span>
                        </div>
                    </div>

                    <img
                        id="footer-avatar"
                        className="w-20 h-20 min-w-[80px] min-h-[80px] rounded-full object-cover ml-auto border-4 border-white"
                        src="/image/foto.png"
                    />
                </div>

                <span id="footer-brand" className="font-bold text-gray-400">
                    Sedap Restaurant Admin Dashboard
                </span>

                <p id="footer-copyright" className="font-light text-gray-400">
                    &copy; 2025 All Right Reserved
                </p>
            </div>
        </div>
    );
}