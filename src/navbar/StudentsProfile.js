import React from "react";
import StudentsProfileGrid from "../datagrid/StudentProfileGrid.js";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Typography } from "@mui/material";
import StudentProfileForm from "../modal/StudentProfileForm.js";

const StudentsProfile = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="flex flex-col">
        <div className="flex-grow">
          <div className="bg-black h-24 flex items-center">
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "2rem", sm: "2rem", md: "2.25rem" },
                fontWeight: "bold",
                color: "white",
                py: { xs: 3, md: 6 },
                pl: 2,
              }}
            >
              Students Profile
            </Typography>
          </div>

          <div className="flex flex-col items-center justify-center h-full p-4">
            <div className="flex items-center justify-center w-full">
              <StudentsProfileGrid />
            </div>
            <StudentProfileForm />
          </div>
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default StudentsProfile;
