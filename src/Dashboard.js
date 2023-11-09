import React, { useState, useEffect, useCallback } from "react";
import BarGraphDashboard from "./graphs/BarGraphDashboard.js";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  CardActionArea,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import numberOfUser from "./Data/numberOfUser.png";
import numberOfStudents from "./Data/numberOfStudents.png";
import clinicPatients from "./Data/clinicPatients.png";
import feedingPrograms from "./Data/feedingProgram.png";
import graphImage from "./Data/barGraph.png";
import axiosInstance from "./config/axios-instance.js";

const Dashboard = () => {

  const [data, setData] = useState([]);
  const [selectedSchoolYear, setSelectedSchoolYear] = useState("");
  const [originalData, setOriginalData] = useState([]);
  const [schoolYears, setSchoolYears] = useState([]);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const extractSchoolYears = (data) => {
    const uniqueYears = new Set();
    data.forEach((item) => {
      const startYear = parseInt(item.schoolYear.substring(0, 4));
      const endYear = parseInt(item.schoolYear.slice(-4));
      const schoolYear = `${startYear} - ${endYear}`;
      uniqueYears.add(schoolYear);
    });
    return Array.from(uniqueYears);
  };

  const aggregateDataByReason = useCallback((rawData) => {
    const aggregatedData = {};

    rawData.forEach((item) => {
      const reason = item.reason.toUpperCase(); // Assuming the reason property exists in your data
      if (!aggregatedData[reason]) {
        aggregatedData[reason] = {
          id: reason,
          label: reason,
          value: 1,
        };
      } else {
        aggregatedData[reason].value += 1;
      }
    });

    return Object.values(aggregatedData);
  }, []);

  const fetchDataByYear = (selectedYear, selectedType) => {
    if (selectedYear) {
      const [startYear, endYear] = selectedYear.split(" - ").map(Number);
  
      const startMonth = schoolYears.find((year) => year.syStartYear === startYear)?.syStartMonth || 1;
      const endMonth = schoolYears.find((year) => year.syEndYear === endYear)?.syEndMonth || 12;
  
      if (!startMonth || !endMonth) {
        console.error("Start month or end month not found for the selected school year.");
        return;
      }
  
      const startMonthIndex = months.indexOf(startMonth);
      const endMonthIndex = months.indexOf(endMonth);
  
      const filteredData = originalData.filter((item) => {
        const issueDate = new Date(item.issueDate);
        const issueDateYear = issueDate.getFullYear();
        const issueDateMonth = issueDate.getMonth();
  
        if (
          (issueDateYear === startYear && issueDateMonth >= startMonthIndex) ||
          (issueDateYear === endYear && issueDateMonth <= endMonthIndex)
        ) {
          return true;
        }
  
        return false;
      });
  
      const filteredDataByType = selectedType === "All" ? filteredData : filteredData.filter((item) => item.patient_type === selectedType);
      const aggregatedData = aggregateDataByReason(filteredDataByType);
      setData(aggregatedData);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [schoolYearResponse, checkupResponse] = await Promise.all([
          axiosInstance.get("/academicYear/fetch"),
          axiosInstance.get("/clinicVisit/get")
        ]);
   
        const schoolYearsData = schoolYearResponse.data.map((year) => ({
          ...year,
          syStartYear: parseInt(year.schoolYear.substring(0, 4)), // Convert to integer
          syEndYear: parseInt(year.schoolYear.slice(-4)), // Convert to integer
        }));
  
        const sortedSchoolYears = schoolYearsData.sort(
          (a, b) => a.syStartYear - b.syStartYear || a.syEndYear - b.syEndYear
        );
        setSchoolYears(sortedSchoolYears.reverse());

        setOriginalData(checkupResponse.data);

        if (!selectedSchoolYear && sortedSchoolYears.length > 0) {
          setSelectedSchoolYear(`${sortedSchoolYears[0].syStartYear} - ${sortedSchoolYears[0].syEndYear}`);
          fetchDataByYear(`${sortedSchoolYears[0].syStartYear} - ${sortedSchoolYears[0].syEndYear}`);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedSchoolYear]);


  const navigate = useNavigate();

  const handleCardClickManageUser = () => {
    navigate("/app/manage-users");
  };

  const handleCardClickStudents = () => {
    navigate("/app/students-profile");
  };

  const handleCardClickClinic = () => {
    navigate("/app/clinic-records");
  };

  const handleCardClickFeeding = () => {
    navigate("/app/feeding-program");
  };

  return (
    <div className="flex">
      <div className="bg-blue-900 h-64 w-full mb-4">
        <div className="flex-grow p-4">
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: "2rem", sm: "2rem", md: "3rem" },
              fontWeight: "bold",
              color: "white",
              pt: { xs: 2, md: 4 },
            }}
          >
            ST - Health and Wellness Management System
          </Typography>
        </div>
        <Grid className="pt-14 pr-4 pl-4" container spacing={3}>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card className="h-44">
              <CardActionArea onClick={handleCardClickManageUser}>
                <CardContent className="pl-5 pt-3 pb-1 relative">
                  <div className="flex items-center">
                    <img
                      src={numberOfUser}
                      alt="Icon"
                      className="h-16 w-16"
                      display="inline-block"
                    />
                    <div className="ml-10 flex flex-col justify-center">
                      <Typography variant="h3" component="div">
                        12
                      </Typography>
                    </div>
                  </div>
                  <div className=" pt-4 flex flex-col items-start">
                    <Typography gutterBottom variant="h6" component="div">
                      Number of User
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total number of user of this system.
                    </Typography>
                  </div>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card className="h-44">
              <CardActionArea onClick={handleCardClickStudents}>
                <CardContent className="pl-5 pt-3 pb-1 relative">
                  <div className="flex items-center">
                    <img
                      src={numberOfStudents}
                      alt="Icon"
                      className="h-16 w-16"
                    />
                    <div className="ml-10 flex flex-col justify-center">
                      <Typography variant="h3" component="div">
                        2500
                      </Typography>
                    </div>
                  </div>
                  <div className=" pt-4 flex flex-col items-start">
                    <Typography gutterBottom variant="h6" component="div">
                      Number of Students
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total number of students.
                    </Typography>
                  </div>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card className="h-44">
              <CardActionArea onClick={handleCardClickClinic}>
                <CardContent className="pl-5 pt-3 pb-1 relative">
                  <div className="flex items-center">
                    <img
                      src={clinicPatients}
                      alt="Icon"
                      className="h-16 w-16"
                    />
                    <div className="ml-10 flex flex-col justify-center">
                      <Typography variant="h3" component="div">
                        250
                      </Typography>
                    </div>
                  </div>
                  <div className=" pt-4 flex flex-col items-start">
                    <Typography gutterBottom variant="h6" component="div">
                      Clinic Patients
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total number of clinic patients.
                    </Typography>
                  </div>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card className="h-44">
              <CardActionArea onClick={handleCardClickFeeding}>
                <CardContent className="pl-5 pt-3 pb-1 relative">
                  <div className="flex items-center">
                    <img
                      src={feedingPrograms}
                      alt="Icon"
                      className="h-16 w-16"
                    />
                    <div className="ml-10 flex flex-col justify-center">
                      <Typography variant="h3" component="div">
                        150
                      </Typography>
                    </div>
                  </div>
                  <div className=" pt-4 flex flex-col items-start">
                    <Typography variant="h6" component="div">
                      Feeding Program
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total of students eligible for feeding program.
                    </Typography>
                  </div>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xs={12} sm={9}>
            <Card className="w-full mt-4" style={{ overflowX: "auto" }}>
              <CardContent>
                <div className="flex items-center mb-4">
                  <img
                    src={graphImage}
                    alt="Icon"
                    className="w-16 h-16 inline-block"
                  />
                  <Typography
                    variant="h1"
                    sx={{
                      fontSize: { xs: "1rem", sm: "2rem", md: "2rem" },
                      fontWeight: "bold",
                      textAlign: "center",
                      whiteSpace: "pre-line",
                    }}
                  >
                    &nbsp;&nbsp; Clinic Patients For School Year 2022-2023
                  </Typography>
                </div>
                <BarGraphDashboard />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card className="mt-4">
              <CardContent className="pl-5 pt-3 pb-1 relative">
                <div className="flex flex-col justify-center">
                  <Typography variant="h5" component="div">
                    Today's Agenda
                  </Typography>
                </div>
                <div className="flex flex-col items-start">
                  <Typography variant="body2" color="text.secondary">
                    August 20, 2023
                  </Typography>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default Dashboard;
