import { FaShoppingCart, FaTruck, FaBan, FaDollarSign } from "react-icons/fa";
import PageHeader from "../components/PageHeader";

export default function Dashboard() {
    return (
        <div id="dashboard-container">

            {/* Page Header */}
            <PageHeader />

            {/* Dashboard Grid */}
            <div
                id="dashboard-grid"
                className="p-5 grid sm:grid-cols-2 md:grid-cols-4 gap-4"
            >

                {/* Orders */}
                <div
                    id="dashboard-orders"
                    className="flex items-center space-x-5 bg-white rounded-lg shadow-md p-4 transition transform duration-300 hover:scale-105 hover:shadow-2xl hover:bg-gray-100 hover:-translate-y-1">
                    <div
                        id="orders-icon"
                        className="bg-hijau text-white rounded-full p-4"
                    >
                        <FaShoppingCart />
                    </div>
                    <div id="orders-info" className="flex flex-col">
                        <span id="orders-count" className="text-2xl font-bold">75</span>
                        <span id="orders-text" className="text-gray-400">Total Orders</span>
                    </div>
                </div>

                {/* Delivered */}
                <div
                    id="dashboard-delivered"
                    className="flex items-center space-x-5 bg-white rounded-lg shadow-md p-4 transition transform duration-300 hover:scale-105 hover:shadow-2xl hover:bg-gray-100 hover:-translate-y-1"
                >
                    <div
                        id="delivered-icon"
                        className="bg-biru text-white rounded-full p-4"
                    >
                        <FaTruck />
                    </div>
                    <div id="delivered-info" className="flex flex-col">
                        <span id="delivered-count" className="text-2xl font-bold">175</span>
                        <span id="delivered-text" className="text-gray-400">Total Delivered</span>
                    </div>
                </div>

                {/* Canceled */}
                <div
                    id="dashboard-canceled"
                    className="flex items-center space-x-5 bg-white rounded-lg shadow-md p-4 transition transform duration-300 hover:scale-105 hover:shadow-2xl hover:bg-gray-100 hover:-translate-y-1"
                >
                    <div
                        id="canceled-icon"
                        className="bg-merah text-white rounded-full p-4"
                    >
                        <FaBan />
                    </div>
                    <div id="canceled-info" className="flex flex-col">
                        <span id="canceled-count" className="text-2xl font-bold">40</span>
                        <span id="canceled-text" className="text-gray-400">Total Canceled</span>
                    </div>
                </div>

                {/* Revenue */}
                <div
                    id="dashboard-revenue"
                    className="flex items-center space-x-5 bg-white rounded-lg shadow-md p-4 transition transform duration-300 hover:scale-105 hover:shadow-2xl hover:bg-gray-100 hover:-translate-y-1">
                    <div
                        id="revenue-icon"
                        className="bg-kuning text-white rounded-full p-4"
                    >
                        <FaDollarSign />
                    </div>
                    <div id="revenue-info" className="flex flex-col">
                        <span id="revenue-amount" className="text-2xl font-bold">Rp.128</span>
                        <span id="revenue-text" className="text-gray-400">Total Revenue</span>
                    </div>
                </div>
                {/* Users */}
                <div
                    className="flex items-center space-x-5 bg-white rounded-lg shadow-md p-4 transition transform duration-300 hover:scale-105 hover:shadow-2xl hover:bg-gray-100 hover:-translate-y-1"
                >
                    <div className="bg-biru text-white rounded-full p-4">
                        👤
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-bold">120</span>
                        <span className="text-gray-400">Total Users</span>
                    </div>
                </div>
                {/* Profit */}
                <div
                    className="flex items-center space-x-5 bg-white rounded-lg shadow-md p-4 transition transform duration-300 hover:scale-105 hover:shadow-2xl hover:bg-gray-100 hover:-translate-y-1"
                >
                    <div className="bg-hijau text-white rounded-full p-4">
                        💰
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-bold">Rp.80</span>
                        <span className="text-gray-400">Total Profit</span>
                    </div>
                </div>

                {/* Pending Orders */}
                <div
                    className="flex items-center space-x-5 bg-white rounded-lg shadow-md p-4 transition transform duration-300 hover:scale-105 hover:shadow-2xl hover:bg-gray-100 hover:-translate-y-1"
                >
                    <div className="bg-kuning text-white rounded-full p-4">
                        ⏳
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-bold">25</span>
                        <span className="text-gray-400">Pending Orders</span>
                    </div>
                </div>

                {/* Reviews */}
                <div
                    className="flex items-center space-x-5 bg-white rounded-lg shadow-md p-4 transition transform duration-300 hover:scale-105 hover:shadow-2xl hover:bg-gray-100 hover:-translate-y-1"
                >
                    <div className="bg-biru text-white rounded-full p-4">
                        ⭐
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-bold">320</span>
                        <span className="text-gray-400">Total Reviews</span>
                    </div>
                </div>
            </div>
        </div>
    );
}