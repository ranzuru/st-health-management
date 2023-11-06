import React from "react";
import ClassEnrollmentGrid from "../datagrid/ClassEnrollmentGrid.js";
import Header from "../components/Header.js";
import Footer from "../components/Footer.js";

const ClassEnrollment = () => {
  return (
    <div className="flex flex-col">
      <div className="flex-grow overflow-hidden">
        <Header title="Student Information" />
        <div className="flex flex-col items-center justify-center h-full p-4">
          <div className="flex items-center justify-center w-full">
            <ClassEnrollmentGrid />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default ClassEnrollment;
