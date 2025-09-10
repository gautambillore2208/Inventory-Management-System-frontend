// import React, { useEffect } from "react";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";

// const Root = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (user) {
//       if (user.role === "admin") {
//         navigate("/admin/dashboard");
//       } else if (user.role === "employee") {
//         navigate("/employee/dashboard");
//       } else {
//         navigate("/login");
//       }
//     } else {
//       navigate("/login");
//     }
//   }, [user, navigate]);

//   return null;
// };

// export default Root;

// /22222222222222222

import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Root = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin-dashboard"); // ✅ match App.jsx
      } else if (user.role === "customer") {
        navigate("/customer-dashboard"); // ✅ match App.jsx
      } else {
        navigate("/unauthorized"); // ✅ fallback for unknown roles
      }
    } else {
      navigate("/login");
    }
  }, [user, navigate]);

  return null;
};

export default Root;
