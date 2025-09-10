import axios from "axios";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Categories = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editcategory, setEditCategory] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/api/category", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });

      setCategories(response.data.categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editcategory) {
      try {
        const response = await axios.put(
          `http://localhost:3000/api/category/${editcategory}`,
          { categoryName, categoryDescription },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
            },
          }
        );

        if (response.data.success) {
          toast.success(
            response.data.message || "Category Updated successfully!"
          );
          setEditCategory(null);
          setCategoryName("");
          setCategoryDescription("");
          if (response.data.category) {
            setCategories([...categories, response.data.category]);
          } else {
            fetchCategories();
          }
        } else {
          toast.error(response.data.message || "Error Editing category!");
        }
      } catch (error) {
        toast.error("API error!");
        console.error("API error editing:", error);
      }
    } else {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/category/add",
          { categoryName, categoryDescription },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
            },
          }
        );

        if (response.data.success) {
          toast.success(
            response.data.message || "Category added successfully!"
          );
          setCategoryName("");
          setCategoryDescription("");
          if (response.data.category) {
            setCategories([...categories, response.data.category]);
          } else {
            fetchCategories();
          }
        } else {
          toast.error(response.data.message || "Error adding category!");
        }
      } catch (error) {
        toast.error("API error!");
        console.error("API error:", error);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/category/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
          },
        }
      );
      if (response.data.success) {
        toast.success(response.data.message || "Category added successfully!");
        if (response.data.success) {
          setCategories(categories.filter((category) => category._id !== id));
        } else {
          fetchCategories();
        }
      } else {
        console.log("Error deleting category:", response.data);
        alert("Error deleting category. Please try again");
      }
    } catch (error) {
      console.log("Error deleting category", error);
      const errorMessage =
        error.response?.data?.message ||
        "Error deleting category. Please try again";
      alert(errorMessage);
    }
  };

  if (loading)
    return <div className="text-center py-10 text-lg">Loading...</div>;

  const handleEdit = async (category) => {
    setEditCategory(category._id);
    setCategoryName(category.categoryName);
    setCategoryDescription(category.categoryDescription);
  };

  const handleCancel = async () => {
    setEditCategory(null);
    setCategoryName("");
    setCategoryDescription("");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 text-center text-gray-900 tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            📂 Category Management
          </span>
        </h1>

        <div className="grid grid-cols-1 gap-12">
          <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 border border-blue-500 transform hover:scale-105 transition-all duration-300 ease-in-out">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
              <span className="text-blue-600 mr-3">➕</span>{" "}
              {editcategory ? "Edit Category " : "Add New Category"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="categoryName"
                  className="block text-gray-700 mb-2 text-sm font-semibold"
                >
                  Category Name
                </label>
                <input
                  id="categoryName"
                  type="text"
                  placeholder="e.g., Electronics, Clothing, Books"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200 ease-in-out text-gray-800"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="categoryDescription"
                  className="block text-gray-700 mb-2 text-sm font-semibold"
                >
                  Category Description
                </label>
                <textarea
                  id="categoryDescription"
                  placeholder="A brief description of the category"
                  value={categoryDescription}
                  onChange={(e) => setCategoryDescription(e.target.value)}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200 ease-in-out resize-y text-gray-800"
                  required
                ></textarea>

                <div className="flex justify-between items-center mt-6 gap-4">
                  <button
                    type="submit"
                    className="w-[250px] bg-blue-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    {editcategory ? "Save Changes" : "Add Category"}
                  </button>

                  {editcategory && (
                    <button
                      type="button"
                      className="w-[250px] bg-red-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-red-700 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>

          <div className="bg-white mt-5 shadow-xl gap-2 rounded-2xl p-6 sm:p-8 border  border-blue-500 transform hover:scale-105 transition-all duration-300 ease-in-out">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
              <span className="text-purple-600 mr-3">📋</span> Existing
              Categories
            </h2>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      #
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categories.length > 0 ? (
                    categories.map((category, index) => (
                      <tr
                        key={index}
                        className="hover:bg-blue-50 transition-colors duration-150 ease-in-out"
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {index + 1}
                        </td>

                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          {category.categoryName}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          {category.categoryDescription}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleDelete(category._id)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 ease-in-out"
                          >
                            🗑️ Delete
                          </button>
                          <button
                            onClick={() => handleEdit(category)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 transition-all duration-200 ease-in-out"
                          >
                            ✏️ Edit
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center py-8 text-gray-500 italic text-lg"
                      >
                        No categories found. Start by adding one!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

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
    </div>
  );
};

export default Categories;
