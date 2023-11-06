import React from "react";
import DewormedGrid from "../datagrid/DewormingGrid.js";
import Header from "../components/Header.js";
import Footer from "../components/Footer.js";

const DewormingMonitoring = () => {
  return (
    <div className="flex flex-col">
      <div className="flex-grow overflow-hidden">
        <Header title="De-wormed Monitoring" />
        <div className="flex flex-col items-center justify-center h-full p-4">
          <div className="flex items-center justify-center w-full">
            <DewormedGrid />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default DewormingMonitoring;
