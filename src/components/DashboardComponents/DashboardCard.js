import React from "react";
import { Card, CardActionArea, CardContent, Typography } from "@mui/material";

const DashboardCard = ({ icon, number, title, subtitle, onCardClick }) => {
  return (
    <Card className="h-44">
      <CardActionArea onClick={onCardClick}>
        <CardContent className="pl-5 pt-3 pb-1 relative">
          <div className="flex items-center">
            <img src={icon} alt="Icon" className="h-16 w-16" />
            <div className="ml-10 flex flex-col justify-center">
              <Typography variant="h3" component="div">
                {number}
              </Typography>
            </div>
          </div>
          <div className="pt-4 flex flex-col items-start">
            <Typography gutterBottom variant="h6" component="div">
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default DashboardCard;
