import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"; // Import from @mui/x-date-pickers
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Calendar from "../calendar/Calendar.js";
import CalendarCreateForm from "../modal/CalendarCreateForm.js"; // Assuming EventForm is imported here
import CalendarEditForm from "../modal/CalendarEditForm.js";
import Header from "../components/Header.js";
import Footer from "../components/Footer.js";

const Events = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="flex flex-col">
        <div className="flex-grow overflow-hidden">
          <Header title="Events" />
          <div className="flex flex-col items-center justify-center h-full p-4">
            <div className="flex items-center justify-center w-full">
              <Calendar />
              <CalendarCreateForm />
              <CalendarEditForm />
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default Events;
