import React from "react";
import MedicalCheckUpGrid from "../datagrid/MedicalCheckUpGrid.js";
import Header from "../components/Header.js";
import Footer from "../components/Footer.js";

const MedicalCheckup = () => {
  return (
    <div className="flex flex-col">
      <div className="flex-grow overflow-hidden">
        <Header title="Student Check-Up" />
        <div className="flex flex-col items-center justify-center h-full p-4">
          <div className="flex items-center justify-center w-full">
            <MedicalCheckUpGrid />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default MedicalCheckup;
