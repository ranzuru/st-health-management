import React from "react";
import { Typography } from "@mui/material";
import SettingsInfo from "../components/SettingsInfo.js";

const Settings = () => {
  return (
    <div className="flex flex-col h-screen">
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
          Settings
        </Typography>
      </div>
      <div className="flex flex-grow p-4">
        <SettingsInfo />
      </div>
    </div>
  );
};

export default Settings;
