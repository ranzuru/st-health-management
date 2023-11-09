import React from "react";
import { Typography } from "@mui/material";
import DewormedStackedPieCharts from "../graphs/DewormedStackedPieCharts";
import DewormedMultiLineCharts from "../graphs/DewormedMultiLineCharts";

const DewormedMonitoringAnalytics = () => {
  return (
    <div className="flex flex-col">
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
          Dewormed Monitoring Analytics
        </Typography>
      </div>
      <div className="flex flex-col items-center justify-center h-full p-4">
      <div className="flex items-center justify-center w-full mt-6">
          <DewormedMultiLineCharts /> {/* Add this line */}
        </div>
        <div className="flex items-center justify-center w-full mt-6">
          <DewormedStackedPieCharts />
        </div>
      </div>
    </div>
  );
};

export default DewormedMonitoringAnalytics;
