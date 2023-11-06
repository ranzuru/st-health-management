import React, { useState, useEffect, useCallback } from "react";
import { ResponsiveBar } from "@nivo/bar"; // Import the bar chart component
import { Paper, Box, Typography, Container, Grid, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import axiosInstance from "../config/axios-instance.js";

const DengueBarChart = () => {
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

  const extractSchoolYears = (data) => {
    const uniqueYears = new Set();
    data.forEach((item) => {
      const startYear = item.syStartYear;
      const endYear = item.syEndYear;
      const schoolYear = `${startYear} - ${endYear}`;
      uniqueYears.add(schoolYear);
    });
    return Array.from(uniqueYears);
  };

  const extractTypes = () => {
    const uniqueTypes = [...new Set(originalData.map((item) => item.class_data.grade))];
    return uniqueTypes;
  };

  const aggregateDataByReason = useCallback((rawData, groupByGender) => {
    const aggregatedData = {};
  
    rawData.forEach((item) => {
      const reason = item.class_data.section.toUpperCase(); // Assuming the reason property exists in your data
      const gender = item.student_data.gender.toUpperCase(); // Assuming the gender property exists in your data
      const groupKey = reason;
  
      if (!aggregatedData[groupKey]) {
        aggregatedData[groupKey] = {
          id: groupKey,
          label: reason,
          value: 1,
        };
      } else {
        aggregatedData[groupKey].value += 1;
      }
    });
  
    return Object.values(aggregatedData);
  }, []);
  

  const fetchDataByYearAndMonth = (selectedYear, selectedMonth, selectedType) => {
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
        const issueDate = new Date(item.onsetDate);
        const issueDateYear = issueDate.getFullYear();
        const issueDateMonth = issueDate.getMonth();

        if (
          (issueDateYear === startYear && issueDateMonth >= startMonthIndex && issueDateMonth === selectedMonthIndex) ||
          (issueDateYear === endYear && issueDateMonth <= endMonthIndex && issueDateMonth === selectedMonthIndex)
        ) {
          return true;
        }

        return false;
      });

      const filteredDataByType = selectedType === "All" ? filteredData : filteredData.filter((item) => item.class_data.grade === selectedType);
      const aggregatedData = aggregateDataByReason(filteredDataByType);
      setData(aggregatedData);
    }
  };

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
        const issueDate = new Date(item.onsetDate);
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

      const filteredDataByType = selectedType === "All" ? filteredData : filteredData.filter((item) => item.class_data.grade === selectedType);
      const aggregatedData = aggregateDataByReason(filteredDataByType);
      setData(aggregatedData);
    }
  };

  const handleSchoolYearChange = (event) => {
    const year = event.target.value;
    setSelectedSchoolYear(year);

    if (selectedMonth === "All") {
      fetchDataByYear(year, selectedType);
    } else {
      fetchDataByYearAndMonth(year, selectedMonth, selectedType);
    }
  };

  const handleMonthChange = (event) => {
    const month = event.target.value;
    setSelectedMonth(month);

    if (month === "All") {
      fetchDataByYear(selectedSchoolYear, selectedType);
    } else {
      fetchDataByYearAndMonth(selectedSchoolYear, month, selectedType);
    };
  };

  const handleTypeChange = (event) => {
    const type = event.target.value;
    setSelectedType(type);

    if (selectedMonth === "All") {
      fetchDataByYear(selectedSchoolYear, type);
    } else {
      fetchDataByYearAndMonth(selectedSchoolYear, selectedMonth, type);
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
    const selectedMonthText = selectedMonth === "All" ? "In all months of " : `In the month of ${selectedMonth} in`;
    const selectedTypeText = selectedType === "All" ? "all grades" : `all ${selectedType}`;

    if (highestTypes.length === 1) {
      const { label, value } = highestTypes[0];
      return `${selectedMonthText} the School Year ${schoolYearText}, section ${label} had the largest number of dengue record/s, with ${value} count/s in ${selectedTypeText}.`;
    } else {
      const highestTypeLabels = highestTypes.map((item) => item.label).join(", ");
      return `In the month of ${selectedMonthText} in the School Year ${schoolYearText}, the reasons ${highestTypeLabels} had the largest number of dengue record/s, with ${maxCount} count/s in ${selectedTypeText}.`;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [schoolYearResponse, checkupResponse] = await Promise.all([
          axiosInstance.get("/schoolYear/get"),
          axiosInstance.get("/dengueProfile/get")
        ]);

        const sortedSchoolYears = schoolYearResponse.data.sort(
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

  return (
    <Container maxWidth="md">
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <Paper elevation={3}>
            <Box p={3}>
              <Typography variant="h4" gutterBottom>
                Overall (per School Year)/ Monthly Clinic Visit Reason/s
              </Typography>
              <Typography variant="body1" paragraph>
                Distinguishes why students are visiting the clinic per School Year, Month, and Type.
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

export default DengueBarChart;