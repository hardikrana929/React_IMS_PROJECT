import React from "react";
import Sidebar from "./Sidebar";
import SummaryCards from "./SummaryCards";

const DashboardLayout = ({ children }) => {
  return (
    <div className="container-fluid p-0">
      <div className="row g-0">

        {/* SIDEBAR */}
        <div className="col-md-3 col-lg-2">
          <Sidebar />
        </div>

        {/* CONTENT */}
        <div
          className="col-md-9 col-lg-10 p-2"
          style={{
            height: "100vh",
            overflowY: "auto",
            backgroundColor: "#f8f9fa"
          }}
        >
          <SummaryCards />

          <div className="bg-white rounded shadow-sm">
            {children}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardLayout;
