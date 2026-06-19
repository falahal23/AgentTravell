import React from "react";

import {
  FaStar,
  FaChevronDown,
  FaArrowRight,
  FaEllipsisH,
  FaWallet,
  FaUsers,
  FaRoute,
} from "react-icons/fa";

import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

// ================= DATA =================

const tripData = [{ value: 67 }, { value: 26 }, { value: 7 }];

const revenueData = [
  { m: "Jan", v: 25 },
  { m: "Feb", v: 40 },
  { m: "Mar", v: 15 },
  { m: "Apr", v: 82 },
  { m: "May", v: 35 },
  { m: "Jun", v: 60 },
  { m: "Jul", v: 25 },
  { m: "Aug", v: 75 },
];

// ================= DASHBOARD =================

export default function Dashboard() {
  return (
    <div className="bg-[#EAF2FF] min-h-screen p-5 space-y-5">
      {/* ================= TRAVEL PACKAGE ================= */}

      <div className="bg-white rounded-xl p-5 shadow-sm">
        <div className="flex justify-between mb-5">
          <h2 className="font-bold">Travel Packages</h2>

          <button className="text-xs bg-blue-50 px-3 py-1 rounded">
            Latest
            <FaChevronDown className="inline ml-2" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <PackageCard
            title="Raja Ampat"
            img="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
          />

          <PackageCard
            title="Labuan Bajo"
            img="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
          />

          <PackageCard
            title="Gunung Bromo"
            img="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429"
          />
        </div>
      </div>

      {/* ================= OVERVIEW ================= */}

      <div className="grid grid-cols-2 gap-5">
        {/* TRIP */}

        <div className="bg-white rounded-xl p-5">
          <div className="flex justify-between">
            <h2 className="font-bold">Trip Overview</h2>

            <button className="bg-blue-50 p-1 rounded">
              <FaEllipsisH />
            </button>
          </div>

          <div className="relative flex justify-center">
            <PieChart width={250} height={210}>
              <Pie
                data={tripData}
                innerRadius={65}
                outerRadius={90}
                startAngle={90}
                endAngle={450}
                dataKey="value"
              >
                <Cell fill="#1018A8" />

                <Cell fill="#6270FF" />

                <Cell fill="#DCEAFF" />
              </Pie>
            </PieChart>

            <div className="absolute top-[78px] text-center">
              <h1 className="font-black text-2xl">2,839</h1>

              <p className="text-xs text-gray-400">Total Trips</p>
            </div>
          </div>

          <div className="grid grid-cols-3 text-center text-xs">
            <p>
              <b>6.5%</b>
              <br />
              Canceled
            </p>

            <p>
              <b>26.5%</b>
              <br />
              Booked
            </p>

            <p>
              <b>67%</b>
              <br />
              Done
            </p>
          </div>
        </div>

        {/* DESTINATION */}

        <div className="bg-white rounded-xl p-5">
          <div className="flex justify-between">
            <h2 className="font-bold">Top Destinations</h2>

            <button className="bg-blue-50 p-1 rounded">
              <FaEllipsisH />
            </button>
          </div>

          <div
            className="
bg-blue-100
rounded-lg
p-4
flex
justify-between
items-center
mt-4
"
          >
            <div>
              <h1 className="font-bold text-xl">245,930</h1>

              <p className="text-xs text-gray-500">Total Customers</p>
            </div>

            <div
              className="
border
border-black
rounded-full
p-2
"
            >
              <FaArrowRight />
            </div>
          </div>

          <div className="space-y-4 mt-5">
            <Destination name="Raja Ampat" percent={75} />

            <Destination name="Labuan Bajo" percent={55} />

            <Destination name="Gunung Bromo" percent={35} />
          </div>
        </div>
      </div>

      {/* ================= REVENUE ================= */}

      <div className="bg-white rounded-xl p-5">
        <div className="flex justify-between">
          <h2 className="font-bold">Revenue Overview</h2>

          <button className="bg-blue-50 px-3 py-1 rounded text-xs">
            Last 8 Months
          </button>
        </div>

        <div className="flex gap-5 mt-5">
          <div className="flex-1 h-64">
            <ResponsiveContainer>
              <LineChart data={revenueData}>
                <XAxis dataKey="m" />

                <YAxis />

                <Line
                  type="monotone"
                  dataKey="v"
                  stroke="#1018A8"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="w-40 space-y-3 mt-8">
            <Revenue
              icon={<FaWallet />}
              title="Total Earnings"
              value="$82,938"
            />

            <Revenue icon={<FaRoute />} title="Total Trips" value="31,684" />

            <Revenue icon={<FaUsers />} title="Customers" value="834,245" />
          </div>
        </div>
      </div>

      {/* ================= BOOKING ================= */}

      <div className="bg-white rounded-xl p-5">
        <h2 className="font-bold mb-5">Booking History</h2>

        <table className="w-full text-center text-sm">
          <thead className="bg-blue-100">
            <tr>
              <th className="p-3">ID</th>

              <th>Date</th>

              <th>Amount</th>

              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {[1, 2, 3, 4].map((i) => (
              <tr key={i} className="border-b">
                <td className="p-3">BL692F</td>

                <td>Apr 16, 2025</td>

                <td>$5,000</td>

                <td>
                  <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full">
                    Completed
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ================= COMPONENT =================

function PackageCard({ title, img }) {
  return (
    <div>
      <div className="relative">
        <img src={img} className="h-40 w-full object-cover rounded-lg" />

        <span className="absolute right-2 top-2 bg-white px-2 rounded-full text-xs">
          4.3 ⭐
        </span>
      </div>

      <h2 className="font-bold mt-2">{title}</h2>

      <p className="text-xs text-gray-400">8 Days, 7 Nights</p>

      <div className="flex justify-between mt-2">
        <b>$2,200</b>

        <button className="bg-[#1018A8] text-white px-5 rounded">View</button>
      </div>
    </div>
  );
}

function Destination({ name, percent }) {
  return (
    <div>
      <div className="flex justify-between text-xs">
        <b>{name}</b>

        <span>{percent}%</span>
      </div>

      <div className="bg-gray-200 h-2 rounded">
        <div
          className="bg-[#1018A8] h-2 rounded"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function Revenue({ icon, title, value }) {
  return (
    <div className="bg-[#1018A8] text-white rounded-lg p-3 flex gap-3">
      <div>{icon}</div>

      <div>
        <p className="text-[10px]">{title}</p>

        <b>{value}</b>
      </div>
    </div>
  );
}
