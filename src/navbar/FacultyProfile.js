import React from "react";
import FacultyProfileGrid from "../datagrid/FacultyProfileGrid.js";
import Header from "../components/Header.js";
import Footer from "../components/Footer.js";

const FacultyProfile = () => {
  return (
    <div className="flex flex-col">
      <div className="flex-grow overflow-hidden">
        <Header title="Faculty Profile" />
        <div className="flex flex-col items-center justify-center h-full p-4">
          <div className="flex items-center justify-center w-full">
            <FacultyProfileGrid />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default FacultyProfile;
