import axios from "axios";
import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";

const Profile = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    address: "",
  });

  const [editUser, SetEditUser] = useState(false);

  const fetchUser = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/users/profile",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
          },
        }
      );

      if (response.data.success) {
        const u = response.data.data;
        setUser({
          name: u.name || "",
          email: u.email || "",
          address: u.address || "",
        });
      }
    } catch (error) {
      console.error("Error fetching user profile ", error);
      toast.error("Error fetching user profile");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        "http://localhost:3000/api/users/profile",
        user,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Profile updated successfully!");

        setUser({
          name: response.data.user.name || "",
          email: response.data.user.email || "",
          address: response.data.user.address || "",
        });

        SetEditUser(false);
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile", error);
      toast.error("Error updating profile");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden p-8">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
          My Profile
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={user.name}
              disabled={!editUser}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              className="w-full px-4 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              disabled={!editUser}
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="w-full px-4 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              value={user.address}
              disabled={!editUser}
              onChange={(e) => setUser({ ...user, address: e.target.value })}
              className="w-full px-4 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
          {editUser && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Password
              </label>
              <input
                type="password"
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                className="w-full px-4 py-2 border rounded-xl shadow-sm 
                 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 outline-none"
                placeholder="Enter new password"
              />
            </div>
          )}

          {!editUser ? (
            <button
              type="submit"
              onClick={() => SetEditUser(!editUser)}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-xl font-semibold shadow-md hover:opacity-90 transition"
            >
              Edit Profile
            </button>
          ) : (
            <>
              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 
                 text-white py-2 rounded-xl font-semibold shadow-md 
                 hover:opacity-90 transition"
                >
                  Save Changes
                </button>

                <button
                  type="button"
                  onClick={() => SetEditUser(!editUser)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-xl font-semibold 
                 shadow-md hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </form>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Profile;
