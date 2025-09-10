// import "./App.css";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Root from "./utils/Root";
// import Login from "./pages/Login";
// import ProtectedRoutes from "../src/utils/protectedRoutes";
// import Dashboard from "./pages/Dashboard";
// import Categories from "./components/Categories.";
// import Suppliers from "./components/Suppliers";
// import Products from "./components/Products";
// import Logout from "./components/Logout";
// import Users from "./components/Users";
// // import NotFound from "./components/NotFound"; // Import the new component

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Root />} />

//         {/* Public routes */}
//         <Route path="/login" element={<Login />} />
//         <Route path="/logout" element={<Logout />} />

//         <Route
//           path="/admin-dashboard"
//           element={
//             <ProtectedRoutes requireRole={["admin"]}>
//               <Dashboard />
//             </ProtectedRoutes>
//           }
//         >
//           <Route
//             index
//             element={<h1 className="text-green-700">Admin Dashboard Home</h1>}
//           />
//           <Route path="categories" element={<Categories />} />
//           <Route path="products" element={<Products />} />
//           <Route path="suppliers" element={<Suppliers />} />
//           <Route
//             path="orders"
//             element={<h1 className="text-green-700">Admin Dashboard Orders</h1>}
//           />
//           <Route path="users" element={<Users />} />
//           <Route
//             path="profile"
//             element={
//               <h1 className="text-green-700">Admin Dashboard Profile</h1>
//             }
//           />
//         </Route>

//         <Route path="/customer-dashboard" element={<Dashboard></Dashboard>}>
//           <Route index element={<>products</>}></Route>
//         </Route>
//         <Route
//           path="/unauthorized"
//           element={
//             <p className="font-bold text-3xl mt-20 ml-20 ">Unauthorized user</p>
//           }
//         />

//         {/* Catch-all route for 404 pages - MUST BE LAST */}
//         {/* <Route path="*" element={<NotFound />} /> */}
//       </Routes>
//     </Router>
//   );
// }

// export default App;

// 22222222222222222222222222

// import "./App.css";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Root from "./utils/Root";
// import Login from "./pages/Login";
// import ProtectedRoutes from "./utils/protectedRoutes";
// import Dashboard from "./pages/Dashboard";
// import Categories from "./components/Categories";
// import Suppliers from "./components/Suppliers";
// import Products from "./components/Products";
// import Logout from "./components/Logout";
// import Users from "./components/Users";
// import CustomerProducts from "./components/CustomerProducts";
// // import NotFound from "./components/NotFound";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Root />} />

//         {/* Public routes */}
//         <Route path="/login" element={<Login />} />
//         <Route path="/logout" element={<Logout />} />

//         {/* Admin routes */}
//         <Route
//           path="/admin-dashboard"
//           element={
//             <ProtectedRoutes requireRole={["admin"]}>
//               <Dashboard />
//             </ProtectedRoutes>
//           }
//         >
//           <Route
//             index
//             element={<h1 className="text-green-700">Admin Dashboard Home</h1>}
//           />
//           <Route path="categories" element={<Categories />} />
//           <Route path="products" element={<Products />} />
//           <Route path="suppliers" element={<Suppliers />} />
//           <Route
//             path="orders"
//             element={<h1 className="text-green-700">Admin Dashboard Orders</h1>}
//           />
//           <Route path="users" element={<Users />} />
//           <Route
//             path="profile"
//             element={
//               <h1 className="text-green-700">Admin Dashboard Profile</h1>
//             }
//           />
//         </Route>

//         {/* Customer routes */}
//         <Route
//           path="/customer-dashboard"
//           element={
//             <ProtectedRoutes requireRole={["customer"]}>
//               <Dashboard />
//             </ProtectedRoutes>
//           }
//         >
//           <Route index element={<CustomerProducts />} />
//           <Route element={<h1 className="text-blue-600">Customer Orders</h1>} />
//           <Route
//             path="profile"
//             element={<h1 className="text-blue-600">Customer Profile</h1>}
//           />
//         </Route>

//         {/* Unauthorized */}
//         <Route
//           path="/unauthorized"
//           element={
//             <p className="font-bold text-3xl mt-20 ml-20">Unauthorized user</p>
//           }
//         />

//         {/* Catch-all route for 404 pages */}
//         {/* <Route path="*" element={<NotFound />} /> */}
//       </Routes>
//     </Router>
//   );
// }

// export default App;
// 3333333333333333

import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Root from "./utils/Root";
import Login from "./pages/Login";
import ProtectedRoutes from "./utils/protectedRoutes";
import Dashboard from "./pages/Dashboard";
import Categories from "./components/Categories";
import Suppliers from "./components/Suppliers";
import Products from "./components/Products";
import Logout from "./components/Logout";
import Users from "./components/Users";
import CustomerProducts from "./components/CustomerProducts";
import Orders from "./components/Orders";
import Profile from "./components/Profile";
import Summary from "./components/Summary";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Root />} />

        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoutes requireRole={["admin"]}>
              <Dashboard />
            </ProtectedRoutes>
          }
        >
          <Route index element={<Summary />} />
          <Route path="categories" element={<Categories />} />
          <Route path="products" element={<Products />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="orders" element={<Orders />} />
          <Route path="users" element={<Users />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route
          path="/customer-dashboard"
          element={
            <ProtectedRoutes requireRole={["customer"]}>
              <Dashboard />
            </ProtectedRoutes>
          }
        >
          <Route index element={<CustomerProducts />} />
          <Route path="products" element={<CustomerProducts />} />{" "}
          <Route path="orders" element={<Orders />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route
          path="/unauthorized"
          element={
            <p className="font-bold text-3xl mt-20 ml-20">Unauthorized user</p>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
