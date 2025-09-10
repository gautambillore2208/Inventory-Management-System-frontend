import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { AiOutlineClose } from "react-icons/ai";
import "react-toastify/dist/ReactToastify.css";

const CustomerProducts = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [orderData, setOrderData] = useState({
    productId: "",
    quantity: 1,
    total: 0,
    stock: 0,
    price: 0,
  });

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/products", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });
      setProducts(res.data.products || []);
      setFiltered(res.data.products || []);
    } catch (err) {
      toast.error("Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    setFiltered(products.filter((p) => p.name.toLowerCase().includes(value)));
  };

  const IncreaseQuantity = (e) => {
    const value = parseInt(e.target.value);
    if (value > orderData.stock) {
      toast.error("Not enough stock");
    } else {
      setOrderData((prev) => ({
        ...prev,
        quantity: value,
        total: value * prev.price,
      }));
    }
  };

  const CloseModal = () => {
    setOpenModal(false);
    setOrderData({
      productId: "",
      quantity: 1,
      total: 0,
      stock: 0,
      price: 0,
    });
  };

  const handleOrderChange = (product) => {
    setOrderData({
      productId: product._id,
      quantity: 1,
      total: product.price,
      stock: product.stock,
      price: product.price,
    });
    setOpenModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:3000/api/orders/add",
        orderData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
          },
        }
      );
      if (res.data.success) {
        toast.success(res.data.message || "Order placed successfully");
        CloseModal();
        fetchProducts();
      } else {
        toast.error(res.data.error || "Order failed");
      }
    } catch (error) {
      toast.error("Order failed");
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-3">
        <h2 className="text-2xl font-bold text-gray-800">🛍️ Products</h2>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={handleSearch}
          className="w-full md:w-1/3 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Product Grid */}
      {filtered.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-5 flex flex-col"
            >
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {product.description || "No description available"}
                </p>
                <p className="font-bold text-indigo-600 text-lg mb-2">
                  ${product.price || "-"}
                </p>
              </div>
              <div className="mt-auto">
                {Number(product.stock) === 0 ? (
                  <span className="px-3 py-1 text-sm font-semibold bg-red-100 text-red-600 rounded-full">
                    Out of Stock
                  </span>
                ) : Number(product.stock) < 5 ? (
                  <span className="px-3 py-1 text-sm font-semibold bg-yellow-100 text-yellow-600 rounded-full">
                    Low Stock ({product.stock})
                  </span>
                ) : (
                  <span className="px-3 py-1 text-sm font-semibold bg-green-100 text-green-600 rounded-full">
                    In Stock ({product.stock})
                  </span>
                )}
              </div>
              <button
                onClick={() => handleOrderChange(product)}
                disabled={Number(product.stock) === 0}
                className={`mt-4 px-4 py-2 w-full rounded-lg text-white font-medium shadow ${
                  Number(product.stock) === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-500 hover:bg-indigo-600"
                }`}
              >
                Order
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-10">No products found 🚫</p>
      )}

      {/* Order Modal */}
      {openModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl font-semibold text-gray-800">
                Place Order
              </h1>
              <button
                onClick={CloseModal}
                className="text-gray-500 hover:text-red-600 text-xl cursor-pointer"
                aria-label="Close modal"
              >
                <AiOutlineClose />
              </button>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={orderData.quantity}
                onChange={IncreaseQuantity}
                min="1"
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="font-bold text-lg">
                Total: ${orderData.quantity * orderData.price}
              </p>
              <div className="flex justify-between items-center mt-6 gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition-all duration-300 shadow-md"
                >
                  Save Order
                </button>
                <button
                  type="button"
                  onClick={CloseModal}
                  className="flex-1 bg-gray-500 text-white py-3 rounded-lg font-bold text-lg hover:bg-gray-600 transition-all duration-300 shadow-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toasts */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default CustomerProducts;
