import React from "react";
import NutritionalStatusPreGrid from "../datagrid/NutritionalStatusPreGrid.js";
import Header from "../components/Header.js";
import Footer from "../components/Footer.js";

const FeedingProgram = () => {
  return (
    <div className="flex flex-col">
      <div className="flex-grow overflow-hidden">
        <Header title="Nutritional Status" />
        <div className="flex flex-col items-center justify-center h-full p-4">
          <div className="flex items-center justify-center mb-10">
            <NutritionalStatusPreGrid />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default FeedingProgram;
