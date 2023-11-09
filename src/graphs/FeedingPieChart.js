import React, { useState, useEffect, useCallback } from "react";
import { ResponsivePie } from "@nivo/pie";
import { Paper, Box, Typography, Container, Grid, FormControl, InputLabel, Select, MenuItem, Autocomplete } from "@mui/material";
import axiosInstance from "../config/axios-instance.js";

const PieChart = () => {
  const [data, setData] = useState([]);
  const [selectedSchoolYear, setSelectedSchoolYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [selectedGrade, setSelectedGrade] = useState("All");
  const [selectedType, setSelectedType] = useState("");
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

    specifiedDateData(selectedSchoolYear, month, selectedType, selectedGrade);
  };
  
  const handleTypeChange = (event) => {
    const type = event.target.value;
    setSelectedType(type);
  
    specifiedDateData(selectedSchoolYear, selectedMonth, type, selectedGrade);
  };

  const handleGradeChange = (event) => {
    const grade = event.target.value;
    setSelectedGrade(grade);
  
    specifiedDateData(selectedSchoolYear, selectedMonth, selectedType, grade);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [schoolYearResponse, checkupResponse] = await Promise.all([
          axiosInstance.get("/academicYear/fetch"),
          axiosInstance.get("/nutritionalStatus/fetchFeedYes")
        ]);
   
        const schoolYearsData = schoolYearResponse.data.map((year) => ({
          ...year,
          syStartYear: parseInt(year.schoolYear.substring(0, 4)),
          syEndYear: parseInt(year.schoolYear.slice(-4)),
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
    const uniqueTypes = [...new Set(originalData.map((item) => item.measurementType))];
    return uniqueTypes;
  };

  const extractGrades = () => {
    const uniqueGrade = [...new Set(originalData.map((item) => item.classEnrollment.classProfile.grade))];
    return uniqueGrade;
  };

  const aggregateDataByReason = useCallback((rawData) => {
    const aggregatedData = {};

    rawData.forEach((item) => {
      const distinctKey = item.BMIClassification.toUpperCase();
      if (!aggregatedData[distinctKey]) {
        aggregatedData[distinctKey] = {
          id: distinctKey,
          label: distinctKey,
          value: 1,
        };
      } else {
        aggregatedData[distinctKey].value += 1;
      }
    });

    return Object.values(aggregatedData);
  }, []);

  const specifiedDateData = (selectedYear, selectedMonth, selectedType, selectedGrade) => {
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
        const basedDate = new Date(item.dateMeasured);
        const basedYear = basedDate.getFullYear();
        const basedMonth = basedDate.getMonth();
  
        if (selectedMonth === "All") {
          if (
            (basedYear === startYear && basedMonth >= startMonthIndex) ||
            (basedYear === endYear && basedMonth <= endMonthIndex)
          ) {
            return true;
          }
        } else {
          if (
            (basedYear === startYear && basedMonth >= startMonthIndex && basedMonth === selectedMonthIndex) ||
            (basedYear === endYear && basedMonth <= endMonthIndex && basedMonth === selectedMonthIndex)
          ) {
            return true;
          }
        }
  
        return false;
      });
  
      let typeFilter = filteredData;
      let gradeFilter;

      typeFilter = filteredData.filter((item) => item.measurementType === selectedType);
      gradeFilter = typeFilter
      if (selectedGrade !== "All") {
        gradeFilter = typeFilter.filter((item) => item.classEnrollment.classProfile.grade === selectedGrade);     
      }
      
      const aggregatedData = aggregateDataByReason(gradeFilter);
      setData(aggregatedData);
    }
  };

  const summary = () => {
    if (data.length === 0) {
      return "No data available.";
    }
  
    // Find the maximum value among all reasons (types)
    const maxCount = Math.max(...data.map((item) => item.value));
  
    // Filter reasons (types) that have the maximum count
    const highestTypes = data.filter((item) => item.value === maxCount);
  
    const schoolYearText = selectedSchoolYear || "Selected School Year";
    const selectedMonthText = selectedMonth === "All" ? "all months" : `the month of ${selectedMonth}`;
    const selectedTypeText = `the ${selectedType} measurement type`;
    const selectedGradeText = selectedGrade === "All" ? "all grades" : `${selectedGrade}`;
  
    if (highestTypes.length === 1) {
      const { label, value } = highestTypes[0];
      return `In the School Year ${schoolYearText}, ${selectedMonthText} registering the highest number of record(s) is ${label} classification, reflecting ${value} record/s. This surge predominantly pertains to ${selectedTypeText} in ${selectedGradeText}, signifying a prominent trend in patient interactions during this period.`;
    } else {
      const highestTypeLabels = highestTypes.map((item) => item.label).join(", ");
      return `In the School Year ${schoolYearText}, ${selectedMonthText} registering the highest number of record(s) are ${highestTypeLabels} classifications, reflecting ${maxCount} record/s. This surge predominantly pertains to ${selectedTypeText} in ${selectedGradeText}, signifying a prominent trend in patient interactions during this period.`;
    }
  };

  return (
    <Container maxWidth="md">
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <Paper elevation={3}>
            <Box p={3}>
              <Typography variant="h4" gutterBottom>
               Feeding Program per Classification Analysis
              </Typography>
              <Typography variant="body1" paragraph>
              It is Pie Chart that provides a focused distinction on the BMI Classification among feeding program eligible student/s, allowing you to filter data by school year, month, grade and feeding measurement type.

              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={3}>
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
                <Grid item xs={12} sm={3}>
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
                <Grid item xs={12} sm={3}>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel id="grade-label">Select Grade</InputLabel>
                    <Select
                      labelId="grade-label"
                      id="grade-select"
                      value={selectedGrade}
                      onChange={handleGradeChange}
                      label="Select Grade"
                      style={{ minWidth: "200px" }}
                    >
                      <MenuItem value="All">All Grades</MenuItem>
                      {extractGrades().map((grade, index) => (
                        <MenuItem key={index} value={grade}>
                          {grade}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel id="type-label">Measurement Type</InputLabel>
                    <Select
                      labelId="type-label"
                      id="type-select"
                      value={selectedType}
                      onChange={handleTypeChange}
                      label="Measurement Type"
                      style={{ minWidth: "200px" }}
                    >
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
                        Classification: <strong>{datum.id}</strong>
                        <br />
                        <br />
                        Measurement: <strong>{selectedType}</strong>
                        <br />
                        Grade: <strong>{selectedGrade}</strong>
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