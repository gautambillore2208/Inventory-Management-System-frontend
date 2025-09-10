import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaBox,
  FaTags,
  FaTruck,
  FaShoppingCart,
  FaUsers,
  FaUserCircle,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";

const Sidebar = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [menuLinks, setMenuLinks] = useState([]);

  const adminItems = [
    {
      name: "Dashboard",
      path: "/admin-dashboard",
      icon: <FaHome />,
      isParent: true,
    },
    {
      name: "Categories",
      path: "/admin-dashboard/categories",
      icon: <FaTags />,
    },
    { name: "Products", path: "/admin-dashboard/products", icon: <FaBox /> },
    {
      name: "Suppliers",
      path: "/admin-dashboard/suppliers",
      icon: <FaTruck />,
    },
    {
      name: "Orders",
      path: "/admin-dashboard/orders",
      icon: <FaShoppingCart />,
    },
    { name: "Users", path: "/admin-dashboard/users", icon: <FaUsers /> },
    {
      name: "Profile",
      path: "/admin-dashboard/profile",
      icon: <FaUserCircle />,
    },
    { name: "Logout", path: "/logout", icon: <FaSignOutAlt /> },
  ];

  const customerItems = [
    {
      name: "Products",
      path: "/customer-dashboard",
      isParent: true,
      icon: <FaBox />,
    },
    {
      name: "Orders",
      path: "/customer-dashboard/orders",
      icon: <FaShoppingCart />,
    },
    {
      name: "Profile",
      path: "/customer-dashboard/profile",
      icon: <FaUserCircle />,
    },
    { name: "Logout", path: "/logout", icon: <FaSignOutAlt /> },
  ];

  useEffect(() => {
    if (user?.role === "admin") {
      setMenuLinks(adminItems);
    } else {
      setMenuLinks(customerItems);
    }
  }, [user]);

  return (
    <>
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-800 p-2 bg-white/70 backdrop-blur-md rounded-lg shadow-md"
        >
          <FaBars size={24} />
        </button>
      </div>

      <div
        className={`fixed top-0 left-0 h-screen bg-white/20 backdrop-blur-md shadow-lg border-r border-gray-200 flex flex-col p-4 z-40
        transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 w-64`}
      >
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {user?.role === "admin" ? "Admin Panel" : "Customer Panel"}
        </h1>
        <nav className="flex flex-col space-y-3">
          {menuLinks.map((item, index) => (
            <NavLink
              end={item.isParent}
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
                    : "hover:bg-gray-200"
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/30 md:hidden z-30"
        />
      )}
    </>
  );
};

export default Sidebar;
