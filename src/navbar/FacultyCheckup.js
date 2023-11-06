import React from "react";
import FacultyCheckUpGrid from "../datagrid/FacultyCheckUpGrid";
import Header from "../components/Header.js";
import Footer from "../components/Footer.js";

const FacultyCheckup = () => {
  return (
    <div className="flex flex-col">
      <div className="flex-grow overflow-hidden">
        <Header title="Faculty Check-Up" />
        <div className="flex flex-col items-center justify-center h-full p-4">
          <div className="flex items-center justify-center w-full">
            <FacultyCheckUpGrid />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default FacultyCheckup;
