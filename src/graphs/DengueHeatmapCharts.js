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
      const distinctChartData = item.classEnrollment.student.gender.toUpperCase();
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
  
      const typeFilter = selectedType === "All" ? filteredData : filteredData.filter((item) => item.classEnrollment.classProfile.section === selectedType);
      const aggregatedData = aggregateDataByReason(typeFilter);
      setData(aggregatedData);
    }
  };
  
  
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
  
  const handleTypeChange = (event, newValue) => {
    setSelectedType(newValue);
  
    specifiedDateData(selectedSchoolYear, selectedMonth, newValue);
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
    const selectedTypeText = `the section ${selectedType}`;
  
    if (highestTypes.length === 1) {
      const { label, value } = highestTypes[0];
      return `In the School Year ${schoolYearText}, ${selectedMonthText} registering the highest number of record(s) is ${label}, reflecting ${value} dengue infection/s. This surge predominantly pertains to ${selectedTypeText}, signifying a prominent trend in patient interactions during this period.`;
    } else {
      const highestTypeLabels = highestTypes.map((item) => item.label).join(", ");
      return `In the School Year ${schoolYearText}, ${selectedMonthText} registering the highest number of record(s) are ${highestTypeLabels}, reflecting ${maxCount} dengue infection/s. This surge predominantly pertains to ${selectedTypeText}, signifying a prominent trend in patient interactions during this period.`;
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
          specifiedDateData(`${sortedSchoolYears[0].syStartYear} - ${sortedSchoolYears[0].syEndYear}`);
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
              Dengue Monitoring per Gender Analysis
              </Typography>
              <Typography variant="body1" paragraph>
              It is Pie Chart that provides a focused distinction between Male and Female of Dengue infected student/s, allowing you to filter data by school year, month, and section.
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