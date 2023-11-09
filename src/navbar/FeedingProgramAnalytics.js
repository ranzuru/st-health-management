import React from "react";
import { Typography } from "@mui/material";
import PieCharts from "../graphs/FeedingPieChart";

const FeedingProgramAnalytics = () => {
  return (
    <div className="flex flex-col">
      <div className="bg-blue-900 h-24 flex items-center">
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
          Feeding Program Analytics
        </Typography>
      </div>
      <div className="flex flex-col items-center justify-center p-4">
        <div className="flex items-center justify-center w-full mt-6">
          <PieCharts />
        </div>
      </div>
    </div>
  );
};

export default FeedingProgramAnalytics;
