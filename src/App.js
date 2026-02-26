import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Signup from "./components/Signup";
import AddProduct from "./components/AddProduct";
import LowStock from "./components/ProductStock";
import Category from "./components/Categoty";
import GenerateBill from "./components/Generate_Bill";
import ProtectedRoute from "./components/ProtectRouter";
import DashboardLayout from "./components/DashboardLayout";
import { ToastContainer } from "react-toastify";
import LowProduct from "./components/LowProduct";
import ForgotPass from "./components/ForgotPass";

function App() {
  const isLogin = JSON.parse(localStorage.getItem("KeepLogin"));

  useEffect{
    document.title = "IMS"
  }
  return (
    <>
      <ToastContainer />

      <Routes>

        {/* LOGIN */}
        <Route
          path="/login"
          element={isLogin ? <Navigate to="/generatebill" /> : <Login />}
        />

        <Route
          path="/fpass"
          element={<ForgotPass/>}
        />

        <Route path="/signup" element={<Signup />} />

        {/* DASHBOARD PAGES */}
        <Route
          path="/addproduct"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <AddProduct />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/lowstock"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <LowStock />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/category"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Category />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />


        <Route
          path="/edit-product/:pid"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <AddProduct />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />


        <Route
          path="/lowproduct"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <LowProduct />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/generatebill"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <GenerateBill />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/"
          element={<Navigate to={isLogin ? "/addproduct" : "/login"} />}
        />

      </Routes>
    </>
  );
}

export default App;
