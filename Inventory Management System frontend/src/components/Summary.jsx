import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Summary = () => {
  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    totalStock: 0,
    ordersToday: 0,
    revenue: 0,
    outStock: [],
    highestSaleProduct: null,
    lowStock: [],
  });
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3000/api/dashboard", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });

      if (response.data.success) {
        console.log(response.data);

        setDashboardData(response.data.dashboardData);
      } else {
        toast.error("Failed to load dashboard data");
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Error fetching dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="text-center text-lg font-semibold">Loading...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-400 text-white p-4 rounded-lg shadow-md text-center">
          <p className="text-lg font-semibold">Total Products</p>
          <p className="text-2xl font-bold">{dashboardData.totalProducts}</p>
        </div>
        <div className="bg-green-400 text-white p-4 rounded-lg shadow-md text-center">
          <p className="text-lg font-semibold">Total Stock</p>
          <p className="text-2xl font-bold">{dashboardData.totalStock}</p>
        </div>
        <div className="bg-purple-400 text-white p-4 rounded-lg shadow-md text-center">
          <p className="text-lg font-semibold">Orders Today</p>
          <p className="text-2xl font-bold">{dashboardData.ordersToday}</p>
        </div>
        <div className="bg-blue-600 text-white p-4 rounded-lg shadow-md text-center">
          <p className="text-lg font-semibold">Revenue</p>
          <p className="text-2xl font-bold">${dashboardData.revenue}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-3">
          Out of Stock Products
        </h3>
        {dashboardData.outStock.length > 0 ? (
          <ul className="space-y-2">
            {dashboardData.outStock.map((product, index) => (
              <li key={index} className="text-gray-700">
                {product.name} -
                <span className="text-sm text-gray-500 ml-1">
                  ({product.brand || "N/A"}) -
                  {product.categoryId?.categoryName || "N/A"}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No products out of stock</p>
        )}
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-3">
          Highest Sale Product
        </h3>
        {dashboardData?.highestSaleProduct ? (
          dashboardData.highestSaleProduct.name ? (
            <div className="text-gray-700">
              <p>
                <strong>Name:</strong> {dashboardData.highestSaleProduct.name}
              </p>
              <p>
                <strong>Category:</strong>{" "}
                {dashboardData.highestSaleProduct.category || "N/A"}
              </p>
              <p>
                <strong>Quantity Sold:</strong>{" "}
                {dashboardData.highestSaleProduct.totalQuantity}
              </p>
            </div>
          ) : (
            <p className="text-gray-500">
              {dashboardData.highestSaleProduct.message ||
                "No sale data available"}
            </p>
          )
        ) : (
          <p className="text-gray-500">No sales data</p>
        )}
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-3">
          Low Stock Products
        </h3>
        {dashboardData.lowStock.length > 0 ? (
          <ul className="space-y-2">
            {dashboardData.lowStock.map((product, index) => (
              <li key={index} className="text-gray-700">
                <strong>{product.name}</strong> - {product.stock} left
                <span className="text-sm text-gray-500 ml-1">
                  ({product.brand || "N/A"}) -
                  {product.categoryId?.categoryName || "N/A"}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No products are low in stock</p>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Summary;
