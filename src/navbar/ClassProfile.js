import React from "react";
import Header from "../components/Header.js";
import Footer from "../components/Footer.js";
import ClassProfileGrid from "../datagrid/ClassProfileGrid";

const ClassProfile = () => {
  return (
    <div className="flex flex-col">
      <div className="flex-grow overflow-hidden">
        <Header title="Class Profile" />
        <div className="flex flex-col items-center justify-center h-full p-4">
          <div className="flex items-center justify-center w-full">
            <ClassProfileGrid />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default ClassProfile;
