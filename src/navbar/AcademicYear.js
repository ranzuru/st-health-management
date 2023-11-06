import React from "react";
import Header from "../components/Header.js";
import Footer from "../components/Footer.js";
import AcademicYearGrid from "../datagrid/AcademicYearGrid.js";

const ClassProfile = () => {
  return (
    <div className="flex flex-col">
      <div className="flex-grow overflow-hidden">
        <Header title="Academic Year" />
        <div className="flex flex-col items-center justify-center h-full p-4">
          <div className="flex items-center justify-center w-full">
            <AcademicYearGrid />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default ClassProfile;
