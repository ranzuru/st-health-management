import React from "react";
import StudentsProfileGrid from "../datagrid/StudentProfileGrid.js";
import Header from "../components/Header.js";
import Footer from "../components/Footer.js";

const StudentsProfile = () => {
  return (
    <div className="flex flex-col">
      <div className="flex-grow overflow-hidden">
        <Header title="Students Profile" />
        <div className="flex flex-col items-center justify-center h-full p-4">
          <div className="flex items-center justify-center w-full">
            <StudentsProfileGrid />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default StudentsProfile;
