import React, { useEffect, useState, useCallback } from "react";
import { AiOutlineClose } from "react-icons/ai";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Suppliers = () => {
  const [addModal, setAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [editSupplierId, setEditSupplierId] = useState(null);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [filteredSupplier, setFilteredSupplier] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchSuppliers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/api/supplier", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });

      setSuppliers(response.data.supplier || []);
      setFilteredSupplier(response.data.supplier || []);
    } catch (error) {
      console.error("Error fetching supplier:", error);
      toast.error("Failed to fetch suppliers");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  useEffect(() => {
    const filtered = suppliers.filter((supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSupplier(filtered);
  }, [searchTerm, suppliers]);

  const handleEdit = (supplier) => {
    setFormData({
      name: supplier.name,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
    });
    setEditSupplierId(supplier._id);
    setAddModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.phone) {
      toast.error("Name and phone are required");
      return;
    }

    setSubmitLoading(true);

    try {
      let response;

      if (editSupplierId) {
        response = await axios.put(
          `http://localhost:3000/api/supplier/${editSupplierId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
            },
          }
        );
      } else {
        response = await axios.post(
          "http://localhost:3000/api/supplier/add",
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
            },
          }
        );
      }

      if (response.data.success) {
        toast.success(
          response.data.message ||
            (editSupplierId
              ? "Supplier updated successfully!"
              : "Supplier added successfully!")
        );
        await fetchSuppliers();
        closeModal();
      } else {
        toast.error(response.data.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("API error: supplier", error);
      toast.error(error.response?.data?.message || "API error! Supplier");
    } finally {
      setSubmitLoading(false);
    }
  };

  const closeModal = () => {
    setAddModal(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
    });
    setEditSupplierId(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this supplier?")) {
      return;
    }

    setDeleteLoadingId(id);
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/supplier/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
          },
        }
      );

      toast.success(response.data.message);
      fetchSuppliers();
    } catch (error) {
      console.log("Error deleting supplier", error);
      toast.error("Failed to delete supplier");
    } finally {
      setDeleteLoadingId(null);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search suppliers..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => setAddModal(true)}
          className="px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg shadow hover:from-purple-600 hover:to-purple-700 transition cursor-pointer"
        >
          Add Supplier
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gradient-to-r from-indigo-500 to-purple-600">
              <tr>
                {[
                  "#",
                  "Supplier Name",
                  "Email",
                  "Phone Number",
                  "Address",
                  "Action",
                ].map((head) => (
                  <th
                    key={head}
                    className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wide"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredSupplier.map((supplier, index) => (
                <tr key={supplier._id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {supplier.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {supplier.email || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {supplier.phone}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {supplier.address || "-"}
                  </td>
                  <td className="px-6 py-4 flex gap-3">
                    <button
                      onClick={() => handleEdit(supplier)}
                      className="px-3 py-1 text-xs font-semibold text-white bg-indigo-500 rounded-lg shadow hover:bg-indigo-600 transition cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(supplier._id)}
                      disabled={deleteLoadingId === supplier._id}
                      className="px-3 py-1 text-xs font-semibold text-white bg-red-500 rounded-lg shadow hover:bg-red-600 disabled:bg-red-300 transition cursor-pointer"
                    >
                      {deleteLoadingId === supplier._id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredSupplier.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {searchTerm
                ? "No matching suppliers found"
                : "No suppliers available"}
            </div>
          )}
        </div>
      )}

      {addModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl font-semibold text-gray-800">
                {editSupplierId ? "Edit Supplier" : "Add Supplier"}
              </h1>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-red-600 text-xl cursor-pointer"
                aria-label="Close modal"
              >
                <AiOutlineClose />
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Supplier Name *"
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Supplier Email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number *"
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Supplier Address"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="flex justify-between items-center mt-6 gap-4">
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-700 disabled:bg-blue-300 transition-all duration-300 shadow-md cursor-pointer"
                >
                  {submitLoading
                    ? "Processing..."
                    : editSupplierId
                    ? "Save Changes"
                    : "Add Supplier"}
                </button>

                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-gray-500 text-white py-3 rounded-lg font-bold text-lg hover:bg-gray-600 transition-all duration-300 shadow-md cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default Suppliers;
