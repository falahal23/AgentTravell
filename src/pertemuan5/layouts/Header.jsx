import { FaBell, FaSearch } from "react-icons/fa";
import { FcAreaChart } from "react-icons/fc";
import { SlSettings } from "react-icons/sl";
import { useState } from "react";

export default function Header() {

    // 🔥 TAMBAHAN STATE
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <div id="header-container" className="flex justify-between items-center p-4">

                {/* Search Bar */}
                <div id="search-bar" className="relative w-full max-w-lg">
                    <input
                        id="search-input"
                        type="text"
                        placeholder="Search Here..."
                        onClick={() => setShowModal(true)}  // 🔥 TAMBAHAN
                        className="border border-gray-100 p-2 pr-10 bg-white w-full max-w-lg rounded-md outline-none"
                    />
                    <FaSearch
                        id="search-icon"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-300"
                    />
                </div>

                {/* Icon & Profile Section */}
                <div id="icons-container" className="flex items-center space-x-4">

                    {/* Icons */}
                    <div
                        id="notification-icon"
                        className="relative p-3 bg-blue-100 rounded-2xl text-blue-500 cursor-pointer"
                    >
                        <FaBell />
                        <span
                            id="notification-badge"
                            className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-blue-200 rounded-full px-2 py-1 text-xs"
                        >
                            50
                        </span>
                    </div>

                    <div
                        id="chart-icon"
                        className="p-3 bg-blue-100 rounded-2xl cursor-pointer"
                    >
                        <FcAreaChart />
                    </div>

                    <div
                        id="settings-icon"
                        className="p-3 bg-red-100 rounded-2xl text-red-500 cursor-pointer"
                    >
                        <SlSettings />
                    </div>

                    {/* Profile Section */}
                    <div
                        id="profile-container"
                        className="flex items-center space-x-4 border-l pl-4 border-gray-300"
                    >
                        <span id="profile-text">
                            Hello, <b>Falahal Nabil</b>
                        </span>
                        <img
                            id="profile-avatar"
                            src="/image/foto.png"
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    </div>
                </div>
            </div>

            {/* 🔥 TAMBAHAN MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                        <h2 className="font-bold text-lg mb-2">Search</h2>
                        <p className="text-gray-500">Fitur search diklik!</p>

                        <button
                            onClick={() => setShowModal(false)}
                            className="mt-4 bg-hijau text-white px-3 py-1 rounded"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

        </>
    );
}