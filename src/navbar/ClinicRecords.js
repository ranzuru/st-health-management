import React from "react";
import ClinicRecordsGrid from "../datagrid/ClinicRecordsGrid.js";
import Header from "../components/Header.js";
import Footer from "../components/Footer.js";

const ClinicRecords = () => {
  return (
    <div className="flex flex-col">
      <div className="flex-grow overflow-hidden">
        <Header title="Clinic Records" />
        <div className="flex flex-col items-center justify-center h-full p-4">
          <div className="flex items-center justify-center w-full">
            <ClinicRecordsGrid />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default ClinicRecords;
