import axios from "axios";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Users = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "",
  });

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/api/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });

      if (response.data.success) {
        setUsers(response.data.users || []);
      } else {
        toast.error(response.data.message || "Failed to fetch users ❌");
      }
    } catch (error) {
      toast.error("Failed to fetch users ❌");
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/add",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message || "User added successfully ");
        setFormData({
          name: "",
          email: "",
          password: "",
          address: "",
          role: "",
        });
        fetchUsers();
      } else {
        toast.error(response.data.message || "Error adding user ❌");
      }
    } catch (error) {
      toast.error("API error ❌");
      console.error("API error:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/users/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message || "User deleted successfully ");
        setUsers(users.filter((user) => user._id !== id));
      } else {
        toast.error(response.data.message || "Error deleting user ");
      }
    } catch (error) {
      toast.error("Error deleting user ");
      console.error("Error deleting user", error);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-10 text-lg">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 sm:p-8">
      <div className="max-w-6xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 text-center text-gray-900 tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            👥 User Management
          </span>
        </h1>

        <div className="grid grid-cols-1 gap-12">
          <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 border border-blue-500 transform hover:scale-[1.01] transition-all duration-300 ease-in-out">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
              <span className="text-blue-600 mr-3">➕</span> Add User
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="text"
                name="name"
                placeholder="Enter Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Enter Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Enter Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
              <input
                type="text"
                name="address"
                placeholder="Enter Address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              >
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="customer">Customer</option>
              </select>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition-all duration-300 shadow-md"
              >
                Add User
              </button>
            </form>
          </div>

          <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 border border-purple-500">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
              <span className="text-purple-600 mr-3">📋</span> Existing Users
            </h2>

            <div className="mb-6">
              <input
                type="text"
                placeholder="Search by name, email or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user, index) => (
                      <tr
                        key={user._id}
                        className="hover:bg-blue-50 transition-colors duration-150"
                      >
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {user.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {user.email}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 text-center">
                          {user.address}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 text-center">
                          {user.role}
                        </td>
                        <td className="px-4 py-3 text-sm text-center space-x-2">
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 transition-all"
                          >
                            🗑️ Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center py-8 text-gray-500 italic text-lg"
                      >
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      </div>
    </div>
  );
};

export default Users;
