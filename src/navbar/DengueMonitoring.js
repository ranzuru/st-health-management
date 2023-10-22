import React from "react";
import DengueGrid from "../datagrid/DengueMonitoringGrid.js";
import Header from "../components/Header.js";
import Footer from "../components/Footer.js";

const DengueMonitoring = () => {
  return (
    <div className="flex flex-col">
      <div className="flex-grow overflow-hidden">
        <Header title="Dengue Monitoring" />
        <div className="flex flex-col items-center justify-center h-full p-4">
          <div className="flex items-center justify-center w-full">
            <DengueGrid />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default DengueMonitoring;
