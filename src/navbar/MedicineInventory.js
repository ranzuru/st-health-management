import React from "react";
import MedicineInventoryGrid from "../datagrid/MedicineInventoryGrid.js";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import MedicineInventoryForm from "../modal/MedicineInventoryForm.js";
import Header from "../components/Header.js";
import Footer from "../components/Footer.js";

const MedicineInventory = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="flex flex-col">
        <div className="flex-grow overflow-hidden">
          <Header title="Medicine Inventory" />
          <div className="flex flex-col items-center justify-center h-full p-4">
            <div className="flex items-center justify-center w-full">
              <MedicineInventoryGrid />
              <MedicineInventoryForm />
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default MedicineInventory;
