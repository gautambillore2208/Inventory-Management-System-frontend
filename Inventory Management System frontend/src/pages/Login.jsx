import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/authcontext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSumbit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        {
          email,
          password,
        }
      );
      if (response.data.success) {
        await login(response.data.user, response.data.token);
        if (response.data.user.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/customer-dashboard");
        }
      } else {
        alert(response.data.error);
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 items-center justify-center p-8">
        <h1 className="text-4xl font-extrabold text-white tracking-wide text-center leading-snug drop-shadow-lg">
          Inventory <br /> Management System
        </h1>
      </div>

      <div className="flex w-full md:w-1/2 items-center justify-center bg-gray-50">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-xl shadow-2xl rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Welcome Back 👋
          </h2>
          {error && (
            <div className="bg-red-300 text-red-700 p-2 mb-4 rounded">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSumbit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700
                         text-white font-semibold rounded-lg shadow-md
                         transition duration-300 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {loading ? "Loading" : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
