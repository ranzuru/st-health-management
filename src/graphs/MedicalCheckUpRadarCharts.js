import React, { useState, useEffect, useCallback } from "react";
import { ResponsivePie } from "@nivo/pie";
import { Paper, Box, Typography, Container, Grid, FormControl, InputLabel, Select, MenuItem, Autocomplete, TextField } from "@mui/material";
import axiosInstance from "../config/axios-instance.js";

const PieChart = () => {
  const [data, setData] = useState([]);
  const [selectedSchoolYear, setSelectedSchoolYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [originalData, setOriginalData] = useState([]);
  const [schoolYears, setSchoolYears] = useState([]);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const extractTypes = () => {
    const uniqueTypes = [...new Set(originalData.map((item) => item.classEnrollment.student.gender))];
    return uniqueTypes;
  };

  const extractGrades = () => {
    const uniqueGrade = [...new Set(originalData.map((item) => item.classEnrollment.classProfile.section))];
    return uniqueGrade;
  };

  const aggregateDataByReason = useCallback((rawData) => {
    const aggregatedData = {};
    
    rawData.forEach((item) => {
      let dataToAgg;
      if (selectedCategory) {
        switch (selectedCategory) {
        case "Vision Left":
          dataToAgg = (item.visionScreeningLeft ? "Passed" : "Failed");
          break;
        case "Vision Right":
          dataToAgg = (item.visionScreeningRight ? "Passed" : "Failed");
          break;
        case "Hearing Left":
           dataToAgg = (item.auditoryScreeningLeft ? "Passed" : "Failed");
          break;
        case "Hearing Right":
           dataToAgg = (item.auditoryScreeningRight ? "Passed" : "Failed");
          break;
        case "Scalp Issue":
           dataToAgg = item.scalpScreening;
          break;
        case "Skin Issue":
           dataToAgg = item.skinScreening;
          break;
        case "Eyes Issue":
           dataToAgg = item.eyesScreening;
          break;
        case "Ears Issue":
          dataToAgg = item.earScreening;
          break;
        case "Nose Issue":
            dataToAgg = item.noseScreening;
           break;
        case "Mouth Issue":
            dataToAgg = item.mouthScreening;
           break;
        case "Neck Issue":
            dataToAgg = item.neckScreening;
           break;
           case "Throat Issue":
            dataToAgg = item.throatScreening;
           break;
           case "Lungs Issue":
            dataToAgg = item.lungScreening;
           break;
           case "Heart Issue":
            dataToAgg = item.heartScreening;
           break;
           case "Abdomen Issue":
            dataToAgg = item.abdomen;
           break;
           case "Deformities":
            dataToAgg = item.deformities;
           break;
           case "Iron Supplementation":
            dataToAgg = (item.ironSupplementation ? "Yes" : "No");
           break;
           case "Menarche":
            dataToAgg = item.Menarche;
           break;

        default:
          dataToAgg = ""
          break;
      }
      }
      // Assuming the reason property exists in your data
      if (!aggregatedData[dataToAgg]) {
        aggregatedData[dataToAgg] = {
          id: dataToAgg,
          label: dataToAgg,
          value: 1,
        };
      } else {
        aggregatedData[dataToAgg].value += 1;
      }
    });

    return Object.values(aggregatedData);
  }, [selectedCategory]);

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
        const issueDate = new Date(item.dateOfExamination);
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
  
      let typeFilter = filteredData;
      let gradeFilter;

      typeFilter = filteredData.filter((item) => item.classEnrollment.student.gender === selectedType);
      gradeFilter = typeFilter
      if (selectedGrade !== "All") {
        gradeFilter = typeFilter.filter((item) => item.classEnrollment.classProfile.section === selectedGrade);     
      }
      
      const aggregatedData = aggregateDataByReason(gradeFilter);
      setData(aggregatedData);
    }
  };
  
  const fetchDataByYear = (selectedYear, selectedType, selectedGrade) => {
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
        const issueDate = new Date(item.dateOfExamination);
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
      
      let typeFilter = filteredData;
      let gradeFilter;

      typeFilter = filteredData.filter((item) => item.classEnrollment.student.gender === selectedType);
      gradeFilter = typeFilter
      if (selectedGrade !== "All") {
        gradeFilter = typeFilter.filter((item) => item.classEnrollment.classProfile.section === selectedGrade);     
      }
      
      const aggregatedData = aggregateDataByReason(gradeFilter);
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
      fetchDataByYear(selectedSchoolYear, selectedType, selectedGrade);
    } else {
      fetchDataByYearAndMonth(selectedSchoolYear, month, selectedType, selectedGrade);
    };
  };
  
  const handleTypeChange = (event) => {
    const type = event.target.value;
    setSelectedType(type);
  
    if (selectedMonth === "All") {
      fetchDataByYear(selectedSchoolYear, type, selectedGrade);
    } else {
      fetchDataByYearAndMonth(selectedSchoolYear, selectedMonth, type, selectedGrade);
    }
  };

  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);

    if (selectedMonth === "All") {
      fetchDataByYear(selectedSchoolYear, selectedType, selectedGrade);
    } else {
      fetchDataByYearAndMonth(selectedSchoolYear, selectedMonth, selectedType, selectedGrade);
    }
  };

  const handleGradeChange = (event, newValue) => {
    setSelectedGrade(newValue);
  
    if (selectedMonth === "All") {
      fetchDataByYear(selectedSchoolYear, selectedType, newValue,);
    } else {
      fetchDataByYearAndMonth(selectedSchoolYear, selectedMonth, selectedType, newValue);
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
    const selectedMonthText = selectedMonth === "All" ? "In all months" : `In the month of ${selectedMonth}`;
    const selectedTypeText = `${selectedType} students`;
    const selectedGradeText = selectedGrade === "All" ? "all grades " : `${selectedGrade}`;
  
    if (highestTypes.length === 1) {
      const { label, value } = highestTypes[0];
      return `In the School Year ${schoolYearText}, in ${selectedMonthText} and in ${selectedGradeText} section registering the highest number of record(s) is ${label} in ${selectedCategory} assessment category, reflecting ${value} count/s. This surge predominantly pertains to the ${selectedTypeText}, signifying a prominent trend in patient interactions during this period.`;
    } else {
      const highestTypeLabels = highestTypes.map((item) => item.label).join(", ");
      return `In the School Year ${schoolYearText}, in ${selectedMonthText} and in ${selectedGradeText} section registering the highest number of record(s) are ${highestTypeLabels} in ${selectedCategory} assessment category, reflecting ${maxCount} count/s. This surge predominantly pertains to the ${selectedTypeText}, signifying a prominent trend in patient interactions during this period.`;
    }
  };
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [schoolYearResponse, checkupResponse] = await Promise.all([
          axiosInstance.get("/academicYear/fetch"),
          axiosInstance.get("/medicalCheckup/fetch")
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

  useEffect(() => {
    if (selectedCategory) {
      // When a category is selected, fetch data and update the pie chart.
      if (selectedMonth === "All") {
        fetchDataByYear(selectedSchoolYear, selectedType, selectedGrade);
      } else {
        fetchDataByYearAndMonth(selectedSchoolYear, selectedMonth, selectedType, selectedGrade);
      }
    } else {
      // When no category is selected, clear the data to hide the chart.
      setData([]);
    }
  }, [selectedCategory, selectedSchoolYear, selectedMonth, selectedType, selectedGrade]);

  return (
    <Container maxWidth="md">
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <Paper elevation={3}>
            <Box p={3}>
              <Typography variant="h4" gutterBottom>
                Student Medical per Assessment Analysis
              </Typography>
              <Typography variant="body1" paragraph>
              It is Pie Chart that provides a focused examination of evaluation on each grade, allowing you to filter data by school year, month, and being de-wormed.

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
                    value={selectedGrade}
                    onChange={handleGradeChange}
                    options={extractGrades()}
                    renderInput={(params) => <TextField {...params} label="Select Section" variant="outlined" />}
                  />
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container spacing={2} style={{ marginTop: '10px' }}>
                <Grid item xs={12} sm={6}>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel id="type-label">Select Gender</InputLabel>
                    <Select
                      labelId="type-label"
                      id="type-select"
                      value={selectedType}
                      onChange={handleTypeChange}
                      label="Select Gender"
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
                <Grid item xs={12} sm={6}>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel id="type-label">Select Category</InputLabel>
                    <Select
                      labelId="type-label"
                      id="type-select"
                      value={selectedCategory}
                      onChange={handleCategoryChange}
                      label="Select Category"
                      style={{ minWidth: "200px" }}
                    >
                      <MenuItem disabled>Sensory Assessment:</MenuItem>
                      <MenuItem value="Vision Left">Vision Left</MenuItem>
                      <MenuItem value="Vision Right">Vision Right</MenuItem>
                      <MenuItem value="Hearing Left">Hearing Left</MenuItem>
                      <MenuItem value="Hearing Right">Hearing Right</MenuItem>
                      <MenuItem disabled>Screening:</MenuItem>
                      <MenuItem value="Scalp Issue">Scalp Issue</MenuItem>
                      <MenuItem value="Skin Issue">Skin Issue</MenuItem>
                      <MenuItem value="Eyes Issue">Eyes Issue</MenuItem>
                      <MenuItem value="Ears Issue">Ears Issue</MenuItem>
                      <MenuItem value="Nose Issue">Nose Issue</MenuItem>
                      <MenuItem value="Mouth Issue">Mouth Issue</MenuItem>
                      <MenuItem value="Neck Issue">Neck Issue</MenuItem>
                      <MenuItem value="Throat Issue">Throat Issue</MenuItem>
                      <MenuItem value="Lungs Issue">Lungs Issue</MenuItem>
                      <MenuItem value="Heart Issue">Heart Issue</MenuItem>
                      <MenuItem value="Abdomen Issue">Abdomen Issue</MenuItem>
                      <MenuItem value="Deformities">Deformities</MenuItem>
                      <MenuItem disabled>Supplementation:</MenuItem>
                      <MenuItem value="Iron Supplementation">Iron</MenuItem>
                      <MenuItem disabled>Additional Condition (Female):</MenuItem>
                      <MenuItem value="Menarche">Menarche</MenuItem>
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
                        Evaluation: <strong>{datum.id}</strong>
                        <br />
                        <br />
                        Category: <strong>{selectedCategory}</strong>
                        <br />
                        Gender: <strong>{selectedType}</strong>
                        <br />
                        Section: <strong>{selectedGrade}</strong>
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