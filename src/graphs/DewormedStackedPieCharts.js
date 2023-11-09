import React, { useState, useEffect, useCallback } from "react";
import { ResponsivePie } from "@nivo/pie";
import { Paper, Box, Typography, Container, Grid, FormControl, InputLabel, Select, MenuItem, Autocomplete } from "@mui/material";
import axiosInstance from "../config/axios-instance.js";

const PieChart = () => {
  const [data, setData] = useState([]);
  const [selectedSy, setSelectedSy] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [selectedGrade, setSelectedGrade] = useState("All");
  const [selected4p, setSelected4p] = useState("");
  const [selectedDew, setSelectedDew] = useState("");
  const [originalData, setOriginalData] = useState([]);
  const [sy, setSy] = useState([]);
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

  const extract4p = () => {
    const uniqueData = [...new Set(originalData.map((item) => (item.classEnrollment.student.is4p ? "Yes" : "No")))];
    return uniqueData;
  };  

  const extractGrades = () => {
    const uniqueData = [...new Set(originalData.map((item) => item.classEnrollment.classProfile.grade))];
    return uniqueData;
  };

  const extractDew = () => {
    const uniqueData = [...new Set(originalData.map((item) => (item.deworming ? "Yes" : "No")))];
    return uniqueData;
  };

  const aggregateData = useCallback((rawData) => {
    const aggregatedData = {};

    rawData.forEach((item) => {
      const dataToAggr = item.classEnrollment.student.gender.toUpperCase();
      if (!aggregatedData[dataToAggr]) {
        aggregatedData[dataToAggr] = {
          id: dataToAggr,
          label: dataToAggr,
          value: 1,
        };
      } else {
        aggregatedData[dataToAggr].value += 1;
      }
    });

    return Object.values(aggregatedData);
  }, []);

  const monthDayData = (selectedSy, selectedMonth, selected4p, selectedGrade, selectedDew) => {
    if (selectedSy) {
      const [startYear, endYear] = selectedSy.split(" - ").map(Number);
  
      const startMonth = sy.find((data) => data.startYear === startYear)?.startMonth || 1;
      const endMonth = sy.find((data) => data.endYear === endYear)?.endMonth || 12;
  
      if (!startMonth || !endMonth) {
        console.error("Start month or end month not found for the selected school year.");
        return;
      }
  
      const startMonthIndex = months.indexOf(startMonth);
      const endMonthIndex = months.indexOf(endMonth);
      const selectedMonthIndex = months.indexOf(selectedMonth);
  
      const dateFilter = originalData.filter((item) => {
        const date = new Date(item.dateOfExamination);
        const year = date.getFullYear();
        const month = date.getMonth();
  
        if (
          (year === startYear && month >= startMonthIndex && month === selectedMonthIndex) ||
          (year === endYear && month <= endMonthIndex && month === selectedMonthIndex)
        ) {
          return true;
        }
  
        return false;
      });
  
      let fourPFilter = dateFilter;
      let gradeFilter;
      let dewormingFilter;

      fourPFilter = dateFilter.filter((item) => (item.classEnrollment.student.is4p ? "Yes" : "No") === selected4p);
      gradeFilter = fourPFilter
      if (selectedGrade !== "All") {
        gradeFilter = fourPFilter.filter((item) => item.classEnrollment.classProfile.grade === selectedGrade);     
      }
      dewormingFilter = gradeFilter.filter((item) => (item.deworming ? "Yes" : "No") === selectedDew); 
      
      const aggregatedData = aggregateData(dewormingFilter);
      setData(aggregatedData);
    }
  };
  
  const yearData = (selectedSy, selectedType, selectedGrade, selectedDew) => {
    if (selectedSy) {
      const [startYear, endYear] = selectedSy.split(" - ").map(Number);
  
      const startMonth = sy.find((data) => data.startYear === startYear)?.startMonth || 1;
      const endMonth = sy.find((data) => data.endYear === endYear)?.endMonth || 12;
  
      if (!startMonth || !endMonth) {
        console.error("Start month or end month not found for the selected school year.");
        return;
      }
  
      const startMonthIndex = months.indexOf(startMonth);
      const endMonthIndex = months.indexOf(endMonth);
  
      const dateFilter = originalData.filter((item) => {
        const date = new Date(item.dateOfExamination);
        const year = date.getFullYear();
        const month = date.getMonth();
  
        if (
          (year === startYear && month >= startMonthIndex) ||
          (year === endYear && month <= endMonthIndex)
        ) {
          return true;
        }
  
        return false;
      });
      
      let fourPFilter = dateFilter;
      let gradeFilter;
      let dewormingFilter;

      fourPFilter = dateFilter.filter((item) => (item.classEnrollment.student.is4p ? "Yes" : "No") === selectedType);
      gradeFilter = fourPFilter
      if (selectedGrade !== "All") {
        gradeFilter = fourPFilter.filter((item) => item.classEnrollment.classProfile.grade === selectedGrade);     
      }
      dewormingFilter = gradeFilter.filter((item) => (item.deworming ? "Yes" : "No") === selectedDew); 
      
      const aggregatedData = aggregateData(dewormingFilter);
      setData(aggregatedData);
    }
  };

  const handleSyChange = (event) => {
    const year = event.target.value;
    setSelectedSy(year);
  
    if (selectedMonth === "All") {
      yearData(year, selected4p, selectedGrade, selectedDew);
    } else {
      monthDayData(year, selectedMonth, selected4p, selectedGrade, selectedDew);
    }
  };
  
  const handleMonthChange = (event) => {
    const month = event.target.value;
    setSelectedMonth(month);
  
    if (month === "All") {
      yearData(selectedSy, selected4p, selectedGrade, selectedDew);
    } else {
      monthDayData(selectedSy, month, selected4p, selectedGrade, selectedDew);
    };
  };
  
  const handle4pChange = (event) => {
    const fourP = event.target.value;
    setSelected4p(fourP);
  
    if (selectedMonth === "All") {
      yearData(selectedSy, fourP, selectedGrade, selectedDew);
    } else {
      monthDayData(selectedSy, selectedMonth, fourP, selectedGrade, selectedDew);
    }
  };

  const handleGradeChange = (event) => {
    const grade = event.target.value;
    setSelectedGrade(grade);
  
    if (selectedMonth === "All") {
      yearData(selectedSy, selected4p, grade, selectedDew);
    } else {
      monthDayData(selectedSy, selectedMonth, selected4p, grade, selectedDew);
    }
  };

  const handleDewChange = (event) => {
    const deworming = event.target.value;
    setSelectedDew(deworming);
  
    if (selectedMonth === "All") {
      yearData(selectedSy, selected4p, selectedGrade, deworming);
    } else {
      monthDayData(selectedSy, selectedMonth, selected4p, selectedGrade, deworming);
    }
  };
  

  const summary = () => {
    if (data.length === 0) {
      return "No data available.";
    }
  
    // Find the maximum value among all reasons (types)
    const maxCount = Math.max(...data.map((item) => item.value));
  
    // Filter reasons (types) that have the maximum count
    const highest4p = data.filter((item) => item.value === maxCount);
    const schoolYearText = selectedSy || "Selected School Year";
    const selectedMonthText = selectedMonth === "All" ? "In all months of " : `In the month of ${selectedMonth}`;
    const selected4pText = selected4p === "No" ? "not a 4P" : `a 4P`;
    const selectedDewText = selected4p === "No" ? "not de-wormed" : `de-wormed`;
    const selectedGradeText = selectedGrade === "All" ? "all grades " : `in ${selectedGrade}`;
  
    if (highest4p.length === 1) {
      const { label, value } = highest4p[0];
      return `${selectedMonthText} in the School Year ${schoolYearText}, the ${label} had the largest number of record/s, with ${value} count/s to those who are ${selected4pText} and ${selectedDewText} in ${selectedGradeText}.`;
    } else {
      const highestTypeLabels = highest4p.map((item) => item.label).join(", ");
      return `In the month of ${selectedMonthText} in the School Year ${schoolYearText}, the reasons ${highestTypeLabels} had the largest number of record/s, with ${maxCount} count/s to those who are ${selected4pText} and ${selectedDewText} in ${selectedGradeText}.`;
    }
  };
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [syResponse, medicalResponse] = await Promise.all([
          axiosInstance.get("/academicYear/fetch"),
          axiosInstance.get("/medicalCheckup/fetch")
        ]);
   
        const syData = syResponse.data.map((year) => ({
          ...year,
          startYear: parseInt(year.schoolYear.substring(0, 4)), // Convert to integer
          endYear: parseInt(year.schoolYear.slice(-4)), // Convert to integer
        }));
  
        const sySort = syData.sort(
          (a, b) => a.startYear - b.startYear || a.endYear - b.endYear
        );
        setSy(sySort.reverse());

        setOriginalData(medicalResponse.data);

        if (!selectedSy && sySort.length > 0) {
          setSelectedSy(`${sySort[0].startYear} - ${sySort[0].endYear}`);
          yearData(`${sySort[0].startYear} - ${sySort[0].endYear}`);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedSy]);

  return (
    <Container maxWidth="md">
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <Paper elevation={3}>
            <Box p={3}>
              <Typography variant="h4" gutterBottom>
                Yearly/ Monthly Mass De-worming Monitoring
              </Typography>
              <Typography variant="body1" paragraph>
              Tracks number of de-wormed students per School Year, Month, 4P, and Grade monitoring how many 4P/ Non-4P students has been de-wormed.

              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel id="school-year-label">Select School Year</InputLabel>
                    <Select
                      labelId="school-year-label"
                      id="school-year-select"
                      value={selectedSy}
                      onChange={handleSyChange}
                      label="Select School Year"
                      style={{ minWidth: "200px" }}
                    >
                      {sy.map((data) => (
                        <MenuItem key={data._id} value={`${data.startYear} - ${data.endYear}`}>
                          {`${data.startYear} - ${data.endYear}`}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
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
                      {months.map((data, index) => (
                        <MenuItem key={index} value={data}>
                          {data}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
              </Grid>
              <Grid container spacing={2} style={{ marginTop: '10px' }}>
              <Grid item xs={12} sm={4}>
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
                      {extractGrades().map((data, index) => (
                        <MenuItem key={index} value={data}>
                          {data}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel id="fourP-label">4p?</InputLabel>
                    <Select
                      labelId="fourP-label"
                      id="fourP-select"
                      value={selected4p}
                      onChange={handle4pChange}
                      label="4p?"
                      style={{ minWidth: "200px" }}
                    >
                      {extract4p().map((data, index) => (
                        <MenuItem key={index} value={data}>
                          {data}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel id="fourP-label">De-wormed?</InputLabel>
                    <Select
                      labelId="fourP-label"
                      id="fourP-select"
                      value={selectedDew}
                      onChange={handleDewChange}
                      label="De-wormed?"
                      style={{ minWidth: "200px" }}
                    >
                      {extractDew().map((data, index) => (
                        <MenuItem key={index} value={data}>
                          {data}
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
                        Gender: <strong>{datum.id}</strong>
                        <br />
                        <br />
                        4P: <strong>{selected4p}</strong>
                        <br />
                        De-wormed: <strong>{selectedDew}</strong>
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