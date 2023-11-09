import React, { useState, useEffect, useCallback } from "react";
import { ResponsivePie } from "@nivo/pie";
import { Paper, Box, Typography, Container, Grid, FormControl, InputLabel, Select, MenuItem, Autocomplete, TextField } from "@mui/material";
import axiosInstance from "../config/axios-instance.js";

const PieChart = () => {
  const [data, setData] = useState([]);
  const [selectedSchoolYear, setSelectedSchoolYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [selectedType, setSelectedType] = useState("");
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

  const extractTypes = () => {
    const uniqueTypes = [...new Set(originalData.map((item) => item.classEnrollment.classProfile.section))];
    return uniqueTypes;
  };

  const aggregateDataByReason = useCallback((rawData) => {
    const aggregatedData = {};

    rawData.forEach((item) => {
      const reason = item.classEnrollment.student.gender.toUpperCase(); // Assuming the reason property exists in your data
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
        const issueDate = new Date(item.dateOfOnset);
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
  
      const filteredDataByType = selectedType === "All" ? filteredData : filteredData.filter((item) => item.classEnrollment.classProfile.section === selectedType);
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
        const issueDate = new Date(item.dateOfOnset);
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
  
      const filteredDataByType = selectedType === "All" ? filteredData : filteredData.filter((item) => item.classEnrollment.classProfile.section === selectedType);
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
  
  const handleTypeChange = (event, newValue) => {
    setSelectedType(newValue);
  
    if (selectedMonth === "All") {
      fetchDataByYear(selectedSchoolYear, newValue);
    } else {
      fetchDataByYearAndMonth(selectedSchoolYear, selectedMonth, newValue);
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
    const selectedMonthText = selectedMonth === "All" ? "In all months of " : `In the month of ${selectedMonth}`;
    const selectedTypeText = `the section ${selectedType}`;
  
    if (highestTypes.length === 1) {
      const { label, value } = highestTypes[0];
      return `${selectedMonthText} the School Year ${schoolYearText}, the gender ${label} had the largest number of dengue record/s, with ${value} count/s in ${selectedTypeText}.`;
    } else {
      const highestTypeLabels = highestTypes.map((item) => item.label).join(", ");
      return `In the month of ${selectedMonthText} in the School Year ${schoolYearText}, the gender ${highestTypeLabels} had the largest number of dengue record/s, with ${maxCount} count/s in ${selectedTypeText}.`;
    }
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
              Yearly/ Monthly/ Daily Dengue Monitoring Records
              </Typography>
              <Typography variant="body1" paragraph>
                Distinguishes which gender of students has the most and least gender infected by Dengue.
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
                    
                    <Autocomplete
                    id="type-select"
                    value={selectedType}
                    onChange={handleTypeChange}
                    options={extractTypes()}
                    renderInput={(params) => <TextField {...params} label="Select Type" variant="outlined" />}
                  />
                  </FormControl>
                </Grid>
              </Grid>
              <Box className="flex justify-center items-center">
                <div style={{ height: "500px", width: "800px" }}>
                  <ResponsivePie
                    data={data}
                    margin={{ top: 50, right: 40, bottom: 40, left: 40 }}
                    sortByValue={true}
                    innerRadius={0.5}
                    padAngle={0.7}
                    cornerRadius={3}
                    colors={{ scheme: "nivo" }}
                    radialLabelsSkipAngle={10}
                    radialLabelsTextXOffset={6}
                    radialLabelsTextColor="#333333"
                    radialLabelsLinkOffset={0}
                    radialLabelsLinkDiagonalLength={16}
                    radialLabelsLinkHorizontalLength={24}
                    radialLabelsLinkStrokeWidth={1}
                    radialLabelsLinkColor={{ from: "color" }}
                    theme={{ labels: { text: { fontSize: 15 } }}}
                    tooltip={({ datum }) => (
                      <div style={{ background: "white", padding: "15px", border: "2px solid black", boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)" }}>
                        Gender: <strong>{datum.id}</strong>
                        <br />
                        <br />
                        Section: <strong>{selectedType}</strong>
                        <br />
                        Count: <strong>{datum.value}</strong>
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

export default PieChart;