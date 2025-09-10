import React, { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineClose } from "react-icons/ai";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Products = () => {
  const [openModal, setOpenModal] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    supplierId: "",
  });

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/products", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });

      setSuppliers(response.data.suppliers || []);
      setCategories(response.data.categories || []);
      setProducts(response.data.products || []);
      setFilteredProducts(response.data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const CloseModal = () => {
    setOpenModal(false);
    setEditProduct(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      stock: "",
      categoryId: "",
      supplierId: "",
    });
  };

  const handleEdit = (product) => {
    setOpenModal(true);
    setEditProduct(product._id);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId || product.category?._id || "",
      supplierId: product.supplierId || product.supplier?._id || "",
    });
  };

  const confirmDelete = (id) => {
    setConfirmDeleteId(id);
  };

  const handleDelete = async () => {
    if (!confirmDeleteId) return;
    setDeleteLoadingId(confirmDeleteId);
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/products/${confirmDeleteId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
          },
        }
      );
      toast.success(response.data.message || "Product deleted successfully");
      fetchProducts();
    } catch (error) {
      console.log("Error deleting product", error);
      toast.error("Failed to delete product");
    } finally {
      setDeleteLoadingId(null);
      setConfirmDeleteId(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name?.trim() || !formData.price?.toString().trim()) {
      toast.error("Name and price are required");
      return;
    }

    if (editProduct) {
      try {
        const response = await axios.put(
          `http://localhost:3000/api/products/${editProduct}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
            },
          }
        );
        if (response.data.success) {
          toast.success("Product Updated Successfully!");
          fetchProducts();
          CloseModal();
        } else {
          toast.error("Error updating Product: please try again");
        }
      } catch (error) {
        toast.error("Error updating Product: please try again");
      }
      return;
    } else {
      setSubmitLoading(true);
      try {
        const response = await axios.post(
          "http://localhost:3000/api/products/add",
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
            },
          }
        );

        if (response?.data?.success) {
          toast.success(response.data.message || "Product added successfully!");
          fetchProducts();
          CloseModal();
        } else {
          toast.error(response?.data?.message || "Failed to add product!");
        }
      } catch (error) {
        console.error("API error (add product):", error);
        toast.error(
          error.response?.data?.message || "API error while adding product"
        );
      } finally {
        setSubmitLoading(false);
      }
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setFilteredProducts(
      products.filter((product) => product.name.toLowerCase().includes(value))
    );
  };

  const getCategoryName = (category) => {
    if (!category) return "-";
    if (typeof category === "object" && category.categoryName) {
      return category.categoryName;
    }
    if (typeof category === "object" && category.name) {
      return category.name;
    }
    if (typeof category === "string") {
      const categoryObj = categories.find((cat) => cat._id === category);
      return categoryObj ? categoryObj.categoryName || categoryObj.name : "-";
    }
    return "-";
  };

  const getSupplierName = (supplier) => {
    if (!supplier) return "-";
    if (typeof supplier === "object" && supplier.name) {
      return supplier.name;
    }
    if (typeof supplier === "string") {
      const supplierObj = suppliers.find((sup) => sup._id === supplier);
      return supplierObj ? supplierObj.name : "-";
    }
    return "-";
  };

  return (
    <div className="w-full h-full flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">Products Management</h1>

      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          onChange={handleSearch}
          placeholder="Search products..."
          className="w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => setOpenModal(true)}
          className="px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg shadow hover:from-purple-600 hover:to-purple-700 transition cursor-pointer"
        >
          Add Product
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gradient-to-r from-indigo-500 to-purple-600">
            <tr>
              {[
                "#",
                "Product Name",
                "Category Name",
                "Supplier Name",
                "Price",
                "In Stock",
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
            {filteredProducts &&
              filteredProducts.map((product, index) => (
                <tr key={product._id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {getCategoryName(product.categoryId || product.category)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {getSupplierName(product.supplierId || product.supplier)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    ${product.price || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {Number(product.stock) === 0 ? (
                      <span className="px-2 py-1 text-red-600 bg-red-100 rounded-md font-semibold">
                        {product.stock}
                      </span>
                    ) : Number(product.stock) < 5 ? (
                      <span className="px-2 py-1 text-yellow-600 bg-yellow-100 rounded-md font-semibold">
                        {product.stock}
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-green-600 bg-green-100 rounded-md font-semibold">
                        {product.stock}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 flex gap-3">
                    <button
                      onClick={() => handleEdit(product)}
                      className="px-3 py-1 text-xs font-semibold text-white bg-indigo-500 rounded-lg shadow hover:bg-indigo-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => confirmDelete(product._id)}
                      disabled={deleteLoadingId === product._id}
                      className="px-3 py-1 text-xs font-semibold text-white bg-red-500 rounded-lg shadow hover:bg-red-600 disabled:bg-red-300 transition"
                    >
                      {deleteLoadingId === product._id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {filteredProducts.length === 0 && (
          <div className="p-4 text-center text-gray-500">No Record</div>
        )}
      </div>

      {confirmDeleteId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete this product?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {openModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl font-semibold text-gray-800">
                {editProduct ? "Save Change" : "Add Product"}
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
                type="text"
                name="name"
                placeholder="Product Name *"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={formData.description}
                onChange={handleChange}
                name="description"
                placeholder="Description"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                name="price"
                placeholder="Enter Price *"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                name="stock"
                min="0"
                placeholder="Enter Stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.categoryName || category.name}
                  </option>
                ))}
              </select>

              <select
                name="supplierId"
                value={formData.supplierId}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Supplier</option>
                {suppliers.map((supplier) => (
                  <option key={supplier._id} value={supplier._id}>
                    {supplier.name}
                  </option>
                ))}
              </select>

              <div className="flex justify-between items-center mt-6 gap-4">
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition-all duration-300 shadow-md disabled:opacity-50"
                >
                  {editProduct
                    ? "Update Product"
                    : submitLoading
                    ? "Adding..."
                    : "Add Product"}
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
    </div>
  );
};

export default Products;
