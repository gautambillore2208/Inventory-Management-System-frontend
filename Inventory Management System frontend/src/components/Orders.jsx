import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "orderDate",
    direction: "desc",
  });

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/orders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSearch = (e) => setSearch(e.target.value.toLowerCase());

  const sortedOrders = [...orders]
    .filter(
      (order) =>
        order.product?.name?.toLowerCase().includes(search) ||
        order.product?.categoryId?.categoryName?.toLowerCase().includes(search)
    )
    .sort((a, b) => {
      if (!sortConfig.key) return 0;
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (sortConfig.key === "orderDate") {
        return sortConfig.direction === "asc"
          ? new Date(aValue) - new Date(bValue)
          : new Date(bValue) - new Date(aValue);
      } else {
        return sortConfig.direction === "asc"
          ? aValue - bValue
          : bValue - aValue;
      }
    });

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const totalRevenue = orders.reduce((acc, o) => acc + (o.totalPrice || 0), 0);

  return (
    <div className="w-full h-full p-6 bg-gray-50 flex flex-col gap-6">
      <h1 className="text-3xl font-extrabold text-gray-800 tracking-wide">
        Orders Management
      </h1>

      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow">
        <span className="text-gray-700 font-semibold">
          Total Orders: {orders.length}
        </span>
        <span className="text-gray-700 font-semibold">
          Total Revenue: ${totalRevenue}
        </span>
      </div>

      <input
        type="text"
        placeholder="Search by product or category..."
        onChange={handleSearch}
        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-1/3"
      />

      <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
        <table className="min-w-full border border-gray-200">
          <thead className="sticky top-0 bg-gradient-to-r from-indigo-500 to-purple-600">
            <tr>
              {[
                "#",
                "Product Name",
                "Category",
                "Quantity",
                "Total Price",
                "Date",
              ].map((head, idx) => (
                <th
                  key={idx}
                  className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider cursor-pointer select-none"
                  onClick={() =>
                    requestSort(
                      idx === 0 ? null : head.toLowerCase().replace(" ", "")
                    )
                  }
                >
                  {head}
                  {sortConfig.key === head.toLowerCase().replace(" ", "") &&
                    (sortConfig.direction === "asc" ? " 🔼" : " 🔽")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center p-6 text-gray-500">
                  Loading orders...
                </td>
              </tr>
            ) : sortedOrders.length > 0 ? (
              sortedOrders.map((order, index) => (
                <tr
                  key={order._id}
                  className="hover:shadow-md transition duration-200 odd:bg-gray-50 even:bg-white"
                >
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4 font-medium">
                    {order.product?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    {order.product?.categoryId?.categoryName || "-"}
                  </td>
                  <td className="px-6 py-4">{order.quantity}</td>
                  <td className="px-6 py-4">${order.totalPrice}</td>
                  <td className="px-6 py-4">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-6 text-gray-500">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Orders;
