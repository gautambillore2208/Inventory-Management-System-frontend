import React from "react";
import Siderbar from "../components/Siderbar";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <div>
      <div className="flex">
        <Siderbar />
      </div>
      <div className="flex-1 ml-16 md:ml-64 bg-gray-100 min-h-screen">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
