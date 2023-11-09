import React, { useState, useEffect, useCallback } from "react";
import { ResponsiveBar } from "@nivo/bar"; // Import the bar chart component
import { Paper, Box, Typography, Container, Grid, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import axiosInstance from "../config/axios-instance.js";

const BarChart = () => {
  const [data, setData] = useState([]); // Data for the bar chart
  const [selectedSchoolYear, setSelectedSchoolYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [originalData, setOriginalData] = useState([]);
  const [schoolYears, setSchoolYears] = useState([]);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handleSchoolYearChange = (event) => {
    const year = event.target.value;
    setSelectedSchoolYear(year);
  
    specifiedDateData(year, selectedMonth, selectedType);
  };
  
  const handleMonthChange = (event) => {
    const month = event.target.value;
    setSelectedMonth(month);
  
    specifiedDateData(selectedSchoolYear, month, selectedType);
  };
  
  const handleTypeChange = (event) => {
    const type = event.target.value;
    setSelectedType(type);
  
    specifiedDateData(selectedSchoolYear, selectedMonth, type);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [schoolYearResponse, checkupResponse] = await Promise.all([
          axiosInstance.get("/academicYear/fetch"),
          axiosInstance.get("/dengueMonitoring/fetch")
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
          specifiedDateData(`${sortedSchoolYears[0].syStartYear} - ${sortedSchoolYears[0].syEndYear}`);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedSchoolYear]);

  const extractTypes = () => {
    const uniqueTypes = [...new Set(originalData.map((item) => item.classEnrollment.classProfile.grade))];
    return uniqueTypes;
  };

  const aggregateDataByReason = useCallback((rawData) => {
    const aggregatedData = {};

    rawData.forEach((item) => {
      const distinctChartData = item.classEnrollment.classProfile.section.toUpperCase();
      if (!aggregatedData[distinctChartData]) {
        aggregatedData[distinctChartData] = {
          id: distinctChartData,
          label: distinctChartData,
          value: 1,
        };
      } else {
        aggregatedData[distinctChartData].value += 1;
      }
    });

    return Object.values(aggregatedData);
  }, []);

  const specifiedDateData = (selectedYear, selectedMonth, selectedType) => {
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
      const selectedMonthIndex = months.indexOf(selectedMonth);
  
      const filteredData = originalData.filter((item) => {
        const basedDate = new Date(item.dateOfOnset);
        const basedDateYr = basedDate.getFullYear();
        const basedDateMth = basedDate.getMonth();
        
        if (selectedMonth === "All") {
          if (
            (basedDateYr === startYear && basedDateMth >= startMonthIndex) ||
            (basedDateYr === endYear && basedDateMth <= endMonthIndex)
          ) {
            return true;
          }
        } else {
          if (
            (basedDateYr === startYear && basedDateMth >= startMonthIndex && basedDateMth === selectedMonthIndex) ||
            (basedDateYr === endYear && basedDateMth <= endMonthIndex && basedDateMth === selectedMonthIndex)
          ) {
            return true;
          }
        }
  
        return false;
      });
  
      const typeFilter = selectedType === "All" ? filteredData : filteredData.filter((item) => item.classEnrollment.classProfile.grade === selectedType);
      const aggregatedData = aggregateDataByReason(typeFilter);
      setData(aggregatedData);
    }
  };
  
  const summary = () => {
    if (data.length === 0) {
      return "No data available for the selected school year.";
    }
  
    // Find the maximum value among all reasons (types)
    const maxCount = Math.max(...data.map((item) => item.value));
  
    // Filter reasons (types) that have the maximum count
    const highestTypes = data.filter((item) => item.value === maxCount);
  
    const schoolYearText = selectedSchoolYear || "Selected School Year";
    const selectedMonthText = selectedMonth === "All" ? "all months" : `the month of ${selectedMonth}`;
    const selectedTypeText = selectedType === "All" ? "all grades" : `the ${selectedType}`;
  
    if (highestTypes.length === 1) {
      const { label, value } = highestTypes[0];
      return `In the School Year ${schoolYearText}, ${selectedMonthText} registering the highest number of record(s) is the section ${label}, reflecting ${value} dengue infection/s. This surge predominantly pertains to ${selectedTypeText}, signifying a prominent trend in patient interactions during this period.`;
    } else {
      const highestTypeLabels = highestTypes.map((item) => item.label).join(", ");
      return `In the School Year ${schoolYearText}, ${selectedMonthText} registering the highest number of record(s) are the section ${highestTypeLabels}, reflecting ${maxCount} dengue infection/s. This surge predominantly pertains to ${selectedTypeText}, signifying a prominent trend in patient interactions during this period.`;
    }
  };

  return (
    <Container maxWidth="md">
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <Paper elevation={3}>
            <Box p={3}>
              <Typography variant="h4" gutterBottom>
              Dengue Monitoring per Section Analysis
              </Typography>
              <Typography variant="body1" paragraph>
              It is Bar Chart that provides a focused identifying Dengue infected student/s on each section, allowing you to filter data by school year, month, and grade.
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel id="school-year-label">Select School Year</InputLabel>
                    <Select
                      labelId="school-year-label"
                      id="school-year-select"
                      value={selectedSchoolYear}
                      onChange={handleSchoolYearChange}
                      label="Select School Year"
                      style={{ minWidth: "200px" }}
                    >
                      {schoolYears.map((year) => (
                        <MenuItem key={year._id} value={`${year.syStartYear} - ${year.syEndYear}`}>
                          {`${year.syStartYear} - ${year.syEndYear}`}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel id="month-label">Select Month</InputLabel>
                    <Select
                      labelId="month-label"
                      id="month-select"
                      value={selectedMonth}
                      onChange={handleMonthChange}
                      label="Select Month"
                      style={{ minWidth: "200px" }}
                    >
                      <MenuItem value="All">
                        All Months
                      </MenuItem>
                      {months.map((month, index) => (
                        <MenuItem key={index} value={month}>
                          {month}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel id="grade-label">Select Grade</InputLabel>
                    <Select
                      labelId="grade-label"
                      id="grade-select"
                      value={selectedType}
                      onChange={handleTypeChange}
                      label="Select Grade"
                      style={{ minWidth: "200px" }}
                    >
                      <MenuItem value="All">
                        All Grades
                      </MenuItem>
                      {extractTypes().map((month, index) => (
                        <MenuItem key={index} value={month}>
                          {month}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Box className="flex justify-center items-center">
                <div style={{ height: "500px", width: "800px" }}>
                  
                  <ResponsiveBar
                    data={data}
                    keys={['value']}
                    indexBy="label"
                    layout="horizontal"
                    margin={{ top: 40, right: 50, bottom: 70, left: 150 }}
                    padding={0.3}
                    colors={{ scheme: "nivo" }}
                    axisBottom={{
                      orient: "bottom",
                      tickSize: 15,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: "C O U N T",
                      legendOffset: 50,
                      legendPosition: "middle",
                    }}
                    axisLeft={{
                      orient: "left",
                      tickSize: 10,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: "S E C T I O N",
                      legendOffset: -120,
                      legendPosition: "middle",
                    }}
                    tooltip={({ label, value }) => (
                      <div style={{ background: "white", padding: "10px", border: "2px solid black", boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)" }}>
                        Grade: <strong>{selectedType}</strong>
                        <br />
                        <br />
                        Section: <strong>{label.substring(7)}</strong>
                        <br />
                        Count: <strong>{value}</strong>
                      </div>
                    )}
                  />
                </div>
              </Box>
            </Box>
            <Box p={3}>
              <Typography variant="h6">Summary:</Typography>
              <Typography variant="body1" paragraph>
                {summary()}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default BarChart;