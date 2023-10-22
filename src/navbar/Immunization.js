import React from "react";
import ImmunizationGrid from "../datagrid/ImmunizationGrid";
import Header from "../components/Header.js";
import Footer from "../components/Footer.js";

const Immunization = () => {
  return (
    <div className="flex flex-col">
      <div className="flex-grow overflow-hidden">
        <Header title="Immunization Program" />
        <div className="flex flex-col items-center justify-center h-full p-4">
          <div className="flex items-center justify-center w-full">
            <ImmunizationGrid />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Immunization;
