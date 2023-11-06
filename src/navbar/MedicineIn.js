import React from "react";
import MedicineInGrid from "../datagrid/MedicineInGrid.js";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import MedicineInForm from "../modal/MedicineInForm.js";
import Header from "../components/Header.js";
import Footer from "../components/Footer.js";

const MedicineInNavBar = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="flex flex-col">
        <div className="flex-grow overflow-hidden">
          <Header title="Medicine In" />
          <div className="flex flex-col items-center justify-center h-full p-4">
            <div className="flex items-center justify-center w-full">
              <MedicineInGrid />
            </div>
            <MedicineInForm />
          </div>
          <Footer />
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default MedicineInNavBar;