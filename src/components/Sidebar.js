import React from "react";
import { NavLink, useNavigate } from "react-router-dom"; // Cleaned up imports

const Sidebar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="bg-dark text-white sidebar-wrapper d-flex flex-column" style={{ height: "100vh" }}>
      
      {/* TOP: LOGO */}
      <div className="d-flex justify-content-center mb-3 pt-4">
        <div className="rounded-circle bg-white d-flex align-items-center justify-content-center shadow-sm" style={{ width: "85px", height: "85px" }}>
          <img src="https://cdn-icons-gif.flaticon.com/18999/18999286.gif" alt="IMS Logo" style={{ width: "48px", height: "48px" }} />
        </div>
      </div>

      <h6 className="fw-bold text-uppercase mb-1 text-center">Inventory Management</h6>

      {/* MIDDLE: MENU */}
      <div className="sidebar-menu p-3 flex-grow-1" style={{ overflowY: "auto" }}>
        <ul className="nav flex-column gap-2"> {/* Added gap for spacing */}
          
          {/* <li className="nav-item">
            <NavLink 
              className={({ isActive }) => isActive ? "nav-link text-white active" : "nav-link text-white"} 
              to="/addproduct"
            >
              <i className="bi bi-cart-plus me-2"></i> Add Product
            </NavLink>
          </li> */}

          <li className="nav-item">
            <NavLink 
              className={({ isActive }) => isActive ? "nav-link text-white active" : "nav-link text-white"} 
              to="/lowstock"
            >
              <i className="bi bi-box-seam me-2"></i> Product Stock
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink 
              className={({ isActive }) => isActive ? "nav-link text-white active" : "nav-link text-white"} 
              to="/category"
            >
              <i className="bi bi-tags me-2"></i> Category
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink 
              className={({ isActive }) => isActive ? "nav-link text-white active" : "nav-link text-white"} 
              to="/generatebill"
            >
              <i className="bi bi-receipt me-2"></i> Bills
            </NavLink>
          </li>

        </ul>
      </div>

      {/* BOTTOM: LOGOUT */}
      <div className="p-3 border-top">
        <button className="btn btn-outline-danger w-100" onClick={logout}>
          <i className="bi bi-box-arrow-right me-2"></i> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;