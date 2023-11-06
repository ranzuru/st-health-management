import React from "react";
import ClinicVisitGrid from "../datagrid/ClinicVisitGrid";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import ClinicVisitForm from "../modal/ClinicVisitForm";

import Header from "../components/Header.js";
import Footer from "../components/Footer.js";

const ClinicVisitNavBar = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="flex flex-col">
        <div className="flex-grow overflow-hidden">
        <Header title="Clinic Visit" />

          <div className="flex flex-col items-center justify-center h-full p-4">
            <div className="flex items-center justify-center w-full">
              <ClinicVisitGrid />
            </div>
            <ClinicVisitForm />
          </div>
        </div>
        <Footer />
      </div>
    </LocalizationProvider>
  );
};

export default ClinicVisitNavBar;