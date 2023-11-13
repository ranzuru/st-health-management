// LoginPageLayout.js
import React from "react";
import { Grid, Paper } from "@mui/material";

const LoginPageLayout = ({ isSmallScreen, clinicLogo, schoolLogo }) => {
  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      {/* Left-side Image */}
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          display: isSmallScreen ? "none" : "block",
          minHeight: "100vh",
          backgroundImage: `url(${clinicLogo})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Right-side Login Form */}
      <Grid
        item
        xs={12}
        sm={8}
        md={5}
        component={Paper}
        elevation={6}
        square
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: isSmallScreen ? "transparent" : "#FFF",
        }}
      >
        <div className="flex flex-col space-y-4 text-center p-8">
          <div className="flex justify-center">
            <img
              src={schoolLogo}
              alt="School Logo"
              style={{ width: "100px", height: "100px" }}
            />
          </div>
          <h1 className="text-lg font-semibold">
            Don Juan Dela Cruz Central Elementary School
          </h1>
          <div className="flex items-start">
            <h2 className="text-4xl font-bold">Login</h2>
          </div>
          {/* Add form components here */}
        </div>
      </Grid>
    </Grid>
  );
};

export default LoginPageLayout;
