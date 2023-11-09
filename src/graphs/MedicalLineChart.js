import React, { useState, useEffect } from "react";
import { ResponsiveLine } from "@nivo/line";
import {
  Paper,
  Box,
  Typography,
  Container,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import axiosInstance from "../config/axios-instance.js";

const LineChart = () => {
  const [schoolYears, setSchoolYears] = useState([]);
  const [selectedSchoolYear, setSelectedSchoolYear] = useState("");
  const [data, setData] = useState([]);
  const [uniqueTypes, setUniqueTypes] = useState([]);
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [xAxisFormat, setXAxisFormat] = useState("Month");


  useEffect(() => {
    const fetchSchoolYears = async () => {
      try {
        const response = await axiosInstance.get("academicYear/fetch");
        const sortedSchoolYears = response.data.map((data) => ({
          _id: data._id,
          syStartYear: parseInt(data.schoolYear.substring(0, 4)),
          syEndYear: parseInt(data.schoolYear.slice(-4)),
          syStartMonth: data.monthFrom,
          syEndMonth: data.monthTo
        })).sort((a, b) => b.syStartYear - a.syStartYear || b.syEndYear - a.syEndYear);

      setSchoolYears(sortedSchoolYears);
      setSelectedSchoolYear(sortedSchoolYears[0]?._id || "");
      } catch (error) {
        console.error("Error fetching school years:", error);
      }
    };

    fetchSchoolYears();
  }, []);

  useEffect(() => {
    fetchData();
    
  }, [selectedSchoolYear, selectedMonth, selectedType]);

  const handleSchoolYearChange = (event) => {
    setSelectedSchoolYear(event.target.value);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
     // Update xAxisFormat based on the selected month
     setXAxisFormat(event.target.value === "All" ? "Month" : "Day");
  };

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);;
  };

  const summary = () => {
    if (data.length === 0) {
      return "No data available.";
    }

    // Define a variable for the school year label
  const schoolYearLabel = schoolYears.find((year) => year._id === selectedSchoolYear);
  const schoolYearText = schoolYearLabel
    ? `${schoolYearLabel.syStartYear} - ${schoolYearLabel.syEndYear}`
    : "Selected School Year";
  
    function generateMessage(monthData, typeData, schoolYearText, selectedMonth, selectedType) {
      if (!monthData || !typeData || monthData.count < 1) {
        return "No data available for summary.";
      }
    
      const isAllMonth = selectedMonth === "All";
      const isAllType = selectedType === "All";
      const dateInfo = isAllMonth ? monthData.months : monthData.days.map(day => day.slice(-2));
      const dateLabel = isAllMonth ? "month" : "day";
      const typeLabel = isAllType ? "all grades" : ` ${selectedType}`;
    
      const dateList = dateInfo.length === 1 ? dateInfo[0] : dateInfo.join(', ');
      return isAllMonth
        ? `The ${dateLabel}${dateInfo.length > 1 ? 's' : ''} of ${dateList} in the School Year ${schoolYearText} had the largest number of medical examination/s, with ${monthData.count} count/s in ${typeLabel}.`
        : `The ${dateLabel}${dateInfo.length > 1 ? 's' : ''} of ${selectedMonth} ${dateList} in the School Year ${schoolYearText} had the most medical examination/s, with ${monthData.count} count/s in ${typeLabel}.`;
    }
    
    const monthData = selectedMonth === "All" ? calculateHighestMonthData(selectedType) : calculateHighestDayData(selectedType);
    return generateMessage(monthData, selectedType, schoolYearText, selectedMonth, selectedType);
    
  };

  // Update the calculateHighestDayData function to collect all days with the highest count for a specific type.
const calculateHighestDayData = (selectedType) => {
  if (data.length === 0) {
    return null;
  }

  const dayCounts = {};
  data.forEach((typeData) => {
    if (selectedType === "All" || typeData.id === selectedType) {
      typeData.data.forEach((dataPoint) => {
        const monthYearDay = dataPoint.x;
        dayCounts[monthYearDay] = (dayCounts[monthYearDay] || 0) + dataPoint.y;
      });
    }
  });

  let highestCount = 0;
  const highestDays = [];

  for (const monthYearDay in dayCounts) {
    if (dayCounts[monthYearDay] > highestCount) {
      highestDays.length = 0; // Clear previous highest days
      highestDays.push(monthYearDay);
      highestCount = dayCounts[monthYearDay];
    } else if (dayCounts[monthYearDay] === highestCount) {
      highestDays.push(monthYearDay);
    }
  }

  return { days: highestDays, count: highestCount };
};
  

const calculateHighestMonthData = (selectedType) => {
  if (data.length === 0) {
    return null;
  }

  const monthCounts = {};
  data.forEach((typeData) => {
    if (selectedType === "All" || typeData.id === selectedType) {
      typeData.data.forEach((dataPoint) => {
        const monthYear = dataPoint.x.split('-').slice(0, 2).join('-');
        monthCounts[monthYear] = (monthCounts[monthYear] || 0) + dataPoint.y;
      });
    }
  });

  let highestCount = 0;
  const highestMonths = [];

  for (const monthYear in monthCounts) {
    if (monthCounts[monthYear] > highestCount) {
      highestMonths.length = 0; // Clear previous highest months
      highestMonths.push(monthYear);
      highestCount = monthCounts[monthYear];
    } else if (monthCounts[monthYear] === highestCount) {
      highestMonths.push(monthYear);
    }
  }

  // Map the numerical months to month names
  const formattedMonths = highestMonths.map((monthYear) => {
    const [year, month] = monthYear.split('-');
    const monthIndex = parseInt(month) - 1;
    return `${monthNames[monthIndex]}`;
  });

  return { months: formattedMonths, count: highestCount };
};

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get("medicalCheckup/fetch");
      const adjustedResponse = response.data.map((data) => {
        const type = data.classEnrollment.classProfile.grade;
        return {
          ...data,
          type
        };
      });
  
      const types = [...new Set(adjustedResponse.map(data => data.type))];
      setUniqueTypes(types);

      // Get the start year and end year from the selected school year
      const selectedYearStart = schoolYears.find(year => year._id === selectedSchoolYear)?.syStartYear || new Date().getFullYear();
      const selectedYearEnd = schoolYears.find(year => year._id === selectedSchoolYear)?.syEndYear || new Date().getFullYear();

      // Assuming the default start month is January (1) and end month is December (12).
      const selectedStartMonth = schoolYears.find(year => year._id === selectedSchoolYear)?.syStartMonth || 1; 
      const selectedEndMonth = schoolYears.find(year => year._id === selectedSchoolYear)?.syEndMonth || 12;

      // Setting the month index
      const startMonthIndex = monthNames.indexOf(selectedStartMonth) + 1;
      const endMonthIndex = monthNames.indexOf(selectedEndMonth) + 1;
      const selectedMonthIndex = monthNames.indexOf(selectedMonth) + 1;

      // Extract the current year
      const currentYear = new Date().getFullYear();

      // Create a variable to store the filter type
      const filterType = selectedType === "All" ? "All" : selectedType;
  
        // Display data by Month
        if (selectedMonth === "All") {
          const monthData = types.map(type => {
            const clinicVisitData = adjustedResponse
            .filter(data => filterType === "All" ? data.type === type : data.type === filterType)
              .reduce((acc, data) => {
                const issueDate = new Date(data.dateOfExamination);
                const year = issueDate.getFullYear();
                const month = issueDate.getMonth() + 1;

                const monthYearKey = `${year}-${month.toString().padStart(2, '0')}`;
                acc[monthYearKey] = acc[monthYearKey] || 0;
                acc[monthYearKey] += 1;
                return acc;
              }, {});

              const schoolYearMonths = [];
  
            for (let year = selectedYearStart; year <= selectedYearEnd; year++) {

              const startMonth = year === selectedYearStart ? startMonthIndex : 1;
              const endMonth = year === selectedYearEnd ? endMonthIndex : 12;
              for (let month = startMonth; month <= endMonth; month++) {
                const monthYearKey = `${year}-${month.toString().padStart(2, '0')}`;
                schoolYearMonths.push({
                  x: monthYearKey,
                  y: clinicVisitData[monthYearKey] || 0
                });
              }
            }
  
            return {
              id: type,
              data: schoolYearMonths,
            };
          });
  
          setData(monthData);
        
        // Display data by Days of a Specific Month
        } else {
          const dayData = types.map(type => {
            const clinicVisitData = adjustedResponse
            .filter(data => filterType === "All" ? data.type === type : data.type === filterType)
              .reduce((acc, data) => {
                const issueDate = new Date(data.dateOfExamination);
                const year = issueDate.getFullYear();
                const month = issueDate.getMonth() + 1;
          
                const day = issueDate.getDate(); // Get the day of the month.
          
                if (month === selectedMonthIndex && year >= selectedYearStart && year <= selectedYearEnd) {
                  const dayYearKey = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                  acc[dayYearKey] = acc[dayYearKey] || 0;
                  acc[dayYearKey] += 1;
                }
                return acc;
              }, {});
          
            const schoolYearDays = [];
          
            for (let year = selectedYearStart; year <= selectedYearEnd; year++) {
              if (year === selectedYearStart) {
                var startMonth = startMonthIndex;
              } else if (year === selectedYearEnd) {
                var endMonth = endMonthIndex;
              } else {
                var startMonth = 1;
                var endMonth = 12;
              }
          
              if (year === selectedYearStart) {
                startMonth = startMonthIndex;
              } else {
                startMonth = 1;
              }
              if (year === selectedYearEnd) {
                endMonth = endMonthIndex;
              } else {
                endMonth = 12;
              }
          
              if (year >= selectedYearStart && year <= selectedYearEnd) {
                for (let month = startMonth; month <= endMonth; month++) {
                  if (month === selectedMonthIndex) {
                    for (let day = 1; day <= new Date(year, month, 0).getDate(); day++) {
                      const monthYearDayKey = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                      schoolYearDays.push({
                        x: monthYearDayKey,
                        y: clinicVisitData[monthYearDayKey] || 0
                      });
                    }
                  }
                }
              }
            }
          
            return {
              id: type,
              data: schoolYearDays,
            };
          });
          
          setData(dayData);
        }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <Container maxWidth="md">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={3}>
            <Box p={3}>
              <Typography variant="h4" gutterBottom>
                Yearly/ Monthly/ Daily Student Medical
              </Typography>
              <Typography variant="body1" paragraph>
                Tracks how many medical in each grade has been engaged.
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel id="school-year-label">Select School Year</InputLabel>
                    <Select
                      labelId="school-year-label"
                      id="school-year-select"
                      value={selectedSchoolYear}
                      onChange={handleSchoolYearChange}
                      label="Select School Year"
                    >
                      <MenuItem value="" disabled>
                        Select School Year
                      </MenuItem>
                      {schoolYears.map((year) => (
                        <MenuItem key={year._id} value={year._id}>
                          {`${year.syStartYear} - ${year.syEndYear}`}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel id="month-label">Select Month</InputLabel>
                    <Select
                      labelId="month-label"
                      id="month-select"
                      value={selectedMonth}
                      onChange={handleMonthChange}
                      label="Select Month"
                    >
                      <MenuItem value="All">All Months</MenuItem>
                      {monthNames.map((month, index) => (
                        <MenuItem key={index} value={month}>
                          {month}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel id="type-label">Select Grade</InputLabel>
                    <Select
                      labelId="type-label"
                      id="type-select"
                      value={selectedType}
                      onChange={handleTypeChange}
                      label="Select Grade"
                    >
                      <MenuItem value="All">All Grades</MenuItem>
                      {uniqueTypes.map((month, index) => (
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
                  <ResponsiveLine
                    data={data}
                    margin={{ top: 50, right: 40, bottom: 70, left: 90 }}
                    xScale={{
                      type: "point",
                      format: (value) => {
                        const [year, month] = value.split("-");
                        const monthIndex = parseInt(month) - 1;
                        const abbreviatedMonth = monthNames[monthIndex]?.slice(0, 3);
                        if (xAxisFormat === "Month") {
                          return `${year}-${abbreviatedMonth || monthNames[monthIndex]}`;
                        } else {
                          return `${year}-${abbreviatedMonth || monthNames[monthIndex]}-${value.slice(-2)}`;
                        }
                      }
                    }}
                    yScale={{ type: "linear", min: "auto", max: "auto" }}
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                      orient: "bottom",
                      tickSize: 15,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: xAxisFormat === "Month" ? "M O N T H" : "D A Y", // Dynamic legend
                      legendOffset: 50,
                      legendPosition: "middle",
                      format: (value) => {
                        if (xAxisFormat === "Month") {
                          const [year, month] = value.split("-");
                          const monthIndex = parseInt(month) - 1;
                          const abbreviatedMonth = monthNames[monthIndex]?.slice(0, 3);
                          return `${abbreviatedMonth || monthNames[monthIndex]}`;
                        } else {
                          // Display the full date for selected month
                          return value.split('-')[2];
                        }
                      },
                    }}
                    axisLeft={{
                      orient: "left",
                      tickSize: 10,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: "C O U N T",
                      legendOffset: -70,
                      legendPosition: "middle",
                    }}
                    curve="linear"
                    pointSize={10}
                    pointColor={{ theme: "background" }}
                    pointBorderWidth={2}
                    pointBorderColor={{ from: "serieColor" }}
                    pointLabelYOffset={-12}
                    useMesh={true}
                    legends={
                      selectedType === "All" // Check if "All Types" is selected
                        ? [
                            {
                              anchor: "top",
                              direction: "row",
                              justify: false,
                              translateX: 0,
                              translateY: 0,
                              itemsSpacing: 0,
                              itemDirection: "left-to-right",
                              itemWidth: 80,
                              itemHeight: -40,
                              itemOpacity: 1,
                              symbolSize: 12,
                              symbolShape: "circle",
                              symbolBorderColor: "rgba(0, 0, 0, .5)",
                              effects: [
                                {
                                  on: "hover",
                                  style: {
                                    itemBackground: "rgba(0, 0, 0, 0)",
                                    itemOpacity: 1,
                                  },
                                },
                              ],
                            },
                          ]
                        : [] // Empty legends when a specific type is selected
                    }
                    tooltip={({ point }) => {
                      const xValue = point.data.xFormatted;
                      const yValue = point.data.y;

                      // Check if a specific type is selected, and display Date and Count only
                      if (selectedType !== "All") {
                        return (
                          <div style={{ background: "white", padding: "15px", border: "2px solid black" }}>
                            Date: &nbsp;<strong>{xValue}</strong>
                            <br />
                            Count: &nbsp;<strong>{yValue}</strong>
                          </div>
                        );
                      }
                    
                      const matchingLegends = data.filter((data) =>
                        data.data.some((d) => d.x === xValue && d.y === yValue)
                      );
                      
                      return (
                        <div style={{ background: "white", padding: "15px", border: "2px solid black" }}>
                          {matchingLegends.map((legendData, index) => (
                            <div key={index} style={{ alignItems: "center" }}>
                              <div style={{ width: "10px", height: "10px", borderRadius: "50%", marginRight: "5px" }}></div>
                              Legend: &nbsp;<strong>{legendData.id}</strong>
                            </div>
                          ))}
                          <br />
                          Date: &nbsp;<strong>{xValue}</strong>
                          <br />
                          Count: &nbsp;<strong>{yValue}</strong>
                        </div>
                      );
                    }}                 
                  />
                </div>
              </Box>
              <Typography variant="h6" gutterBottom>
                Summary:
              </Typography>
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

export default LineChart;
//checkpoint