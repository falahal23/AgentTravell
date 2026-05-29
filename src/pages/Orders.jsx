import { FaShoppingCart } from "react-icons/fa";
import PageHeader from "../components/PageHeader";
import ordersData from "../Data/orders.json";
import { useState } from "react";

export default function Orders() {

  const [orders, setOrders] = useState(ordersData);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    customerName: "",
    status: "Pending",
    totalPrice: "",
    orderDate: ""
  });

  // handle input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // submit
  const handleSubmit = () => {
    const newOrder = {
      orderId: "ORD" + (orders.length + 1).toString().padStart(3, "0"),
      ...formData,
      totalPrice: Number(formData.totalPrice)
    };

    setOrders([...orders, newOrder]);
    setShowForm(false);

    // reset
    setFormData({
      customerName: "",
      status: "Pending",
      totalPrice: "",
      orderDate: ""
    });
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <PageHeader 
        title="Orders" 
        breadcrumb="Order List"
      >
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:opacity-90"
        >
          Add Orders
        </button>
      </PageHeader>

      {/* FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow w-[400px] space-y-4">

            <h2 className="text-lg font-semibold">Add Order</h2>

            <input
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              placeholder="Customer Name"
              className="w-full border p-2 rounded"
            />

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option>Pending</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>

            <input
              name="totalPrice"
              value={formData.totalPrice}
              onChange={handleChange}
              placeholder="Total Price"
              type="number"
              className="w-full border p-2 rounded"
            />

            <input
              name="orderDate"
              value={formData.orderDate}
              onChange={handleChange}
              type="date"
              className="w-full border p-2 rounded"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowForm(false)}
                className="px-3 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="px-3 py-2 bg-blue-500 text-white rounded"
              >
                Submit
              </button>
            </div>

          </div>
        </div>
      )}

      {/* CONTENT */}
      <div className="bg-white p-6 rounded-xl shadow overflow-x-auto">
        
        <div className="flex items-center gap-2 mb-4">
          <FaShoppingCart className="text-gray-500" />
          <h2 className="text-lg font-semibold">Order Data</h2>
        </div>

        <table className="w-full text-left border-collapse">

          <thead>
            <tr className="border-b text-gray-600">
              <th className="py-3">Order ID</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Total Price</th>
              <th>Order Date</th>
            </tr>
          </thead>

          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr
                  key={order.orderId}
                  className="border-b hover:bg-gray-50 transition"
                >

                  <td className="py-3">{order.orderId}</td>

                  <td>{order.customerName}</td>

                  <td>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : order.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {order.status}
                    </span>
                  </td>

                  <td>
                    Rp {order.totalPrice.toLocaleString("id-ID")}
                  </td>

                  <td>{order.orderDate}</td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-400">
                  No orders available
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
}