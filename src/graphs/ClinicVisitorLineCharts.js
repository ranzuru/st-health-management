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
  const [clinicData, setClinicData] = useState([]);
  const [sy, setSy] = useState([]);
  const [selectedSy, setSelectedSy] = useState("");
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const [selectedMonth, setSelectedMth] = useState("All");
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("All");
  const [xAxisFormat, setXAxisFormat] = useState("Month");

  useEffect(() => {
    const getSyData = async () => {
      try {
        const response = await axiosInstance.get("academicYear/fetch");
        const sortedRes = response.data.map((data) => ({
          _id: data._id,
          startYr: parseInt(data.schoolYear.substring(0, 4)),
          endYr: parseInt(data.schoolYear.slice(-4)),
          startMth: data.monthFrom,
          endMth: data.monthTo
        })).sort((a, b) => b.startYr - a.startYr || b.endYr - a.endYr);

      setSy(sortedRes);
      setSelectedSy(sortedRes[0]?._id || "");
      } catch (error) {
        console.error("Error fetching school years:", error);
      }
    };

    getSyData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("clinicVisit/get");
        const adjustedResponse = response.data.map((data) => {
          const type = data.patient_type;
          return {
            ...data,
            type
          };
        });
        
        const types = [...new Set(adjustedResponse.map(data => data.type))];
        setTypes(types);
  
        // Get the start year and end year from the selected school year
        const selectedYearStart = sy.find(data => data._id === selectedSy)?.startYr || new Date().getFullYear();
        const selectedYearEnd = sy.find(data => data._id === selectedSy)?.endYr || new Date().getFullYear();
  
        // Assuming the default start month is January (1) and end month is December (12).
        const selectedStartMonth = sy.find(data => data._id === selectedSy)?.startMth || 1; 
        const selectedEndMonth = sy.find(data => data._id === selectedSy)?.endMth || 12;
  
        // Setting the month index
        const startMonthIndex = monthNames.indexOf(selectedStartMonth) + 1;
        const endMonthIndex = monthNames.indexOf(selectedEndMonth) + 1;
        const selectedMonthIndex = monthNames.indexOf(selectedMonth) + 1;
  
        const filterType = selectedType === "All" ? "All" : selectedType;
    
        const dateSpecifiedData = types.map(type => {
          const clinicVisitData = adjustedResponse
            .filter(data => filterType === "All" ? data.type === type : data.type === filterType)
            .reduce((acc, data) => {
              const basedDate = new Date(data.issueDate);
              const year = basedDate.getFullYear();
              const month = basedDate.getMonth() + 1;
              const day = basedDate.getDate();
              const monthKey = `${year}-${month.toString().padStart(2, '0')}`;
              const dayKey = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

              if (selectedMonth === "All") {
                acc[monthKey] = (acc[monthKey] || 0) + 1;
              } else {
                if (month === selectedMonthIndex && year >= selectedYearStart && year <= selectedYearEnd) {
                  acc[dayKey] = (acc[dayKey] || 0) + 1;
                }
              }
              
              return acc;
            }, {});
            console.log(clinicVisitData)
          const dateFormat = [];
      
          for (let year = selectedYearStart; year <= selectedYearEnd; year++) {
            const startMonth = year === selectedYearStart ? startMonthIndex : 1;
            const endMonth = year === selectedYearEnd ? endMonthIndex : 12;
      
            for (let month = startMonth; month <= endMonth; month++) {

              if (selectedMonth === "All") {
                const monthKey = `${year}-${month.toString().padStart(2, '0')}`;
                dateFormat.push({
                x: monthKey,
                y: clinicVisitData[monthKey] || 0,
              });
              } else {
                if (month === selectedMonthIndex) {
                  for (let day = 1; day <= new Date(year, month, 0).getDate(); day++) {
                    const dayKey = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                    dateFormat.push({
                      x: dayKey,
                      y: clinicVisitData[dayKey] || 0,
                    });
                  }
                }
              }
            }
          }
      
          return {
            id: type,
            data: dateFormat,
          };
        });
        setClinicData(dateSpecifiedData);       
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); 
  }, [selectedSy, selectedMonth, selectedType]);

  const handleSyChange = (event) => {
    setSelectedSy(event.target.value);
  };

  const handleMthChange = (event) => {
    setSelectedMth(event.target.value);
     setXAxisFormat(event.target.value === "All" ? "Month" : "Day");
  };

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);;
  };

  const summary = () => {
    if (clinicData.length === 0) {
      return "No data available.";
    }

    // Define a variable for the school year label
  const schoolYearLabel = sy.find((year) => year._id === selectedSy);
  const schoolYearText = schoolYearLabel
    ? `${schoolYearLabel.startYr} - ${schoolYearLabel.endYr}`
    : "Selected School Year";
  
    function generateMessage(monthData, typeData, schoolYearText, selectedMonth, selectedType) {
      if (!monthData || !typeData || monthData.count < 1) {
        return "No data available for summary.";
      }
    
      const isAllMonth = selectedMonth === "All";
      const isAllType = selectedType === "All";
      const dateInfo = isAllMonth ? monthData.months : monthData.days.map(day => day.slice(-2));
      const dateLabel = isAllMonth ? "month" : "day";
      const typeLabel = isAllType ? "all sorts of patients" : `the ${selectedType} type of patients`;
    
      const dateList = dateInfo.length === 1 ? `is ${dateInfo[0]}` : `are ${dateInfo.join(', ')}`;
      return isAllMonth
        ? `In the School Year ${schoolYearText}, the ${dateLabel} registering the highest number of record(s) ${dateList}, reflecting ${monthData.count} clinic visit/s. This surge predominantly pertains to the ${typeLabel} type, signifying a prominent trend in patient interactions during this period.`
        : `In the School Year ${schoolYearText}, the ${dateLabel} registering the highest number of record(s) ${dateList}, reflecting ${monthData.count} clinic visit/s. This surge predominantly pertains to the ${typeLabel} type, signifying a prominent trend in patient interactions during this period.`;
    }
    
    const monthData = highestDateData(selectedType);
    return generateMessage(monthData, selectedType, schoolYearText, selectedMonth, selectedType); 
  };

const highestDateData = (selectedType) => {
  if (clinicData.length === 0) {
    return null;
  }

  const count = {};
  clinicData.forEach((typeData) => {
    if (selectedType === "All" || typeData.id === selectedType) {
      typeData.data.forEach((dataPoint) => {
        
        let formattedDate = dataPoint.x;

        if (selectedMonth === "All"){
          formattedDate = dataPoint.x.split('-').slice(0, 2).join('-');
        }

        count[formattedDate] = (count[formattedDate] || 0) + dataPoint.y;
      });
    }
  });

  let highestCount = 0;
  const highestDate = [];

  for (const date in count) {
    if (count[date] > highestCount) {
      highestDate.length = 0;
      highestDate.push(date);
      highestCount = count[date];
    } else if (count[date] === highestCount) {
      highestDate.push(date);
    }
  }

  if (selectedMonth === "All"){
      const formattedMonths = highestDate.map((monthYear) => {
      const [year, month] = monthYear.split('-');
      const index = parseInt(month) - 1;
      return `${monthNames[index]}`;
    });

    return { months: formattedMonths, count: highestCount };
  } else {
    return { days: highestDate, count: highestCount }; 
  }  
};

  return (
    <Container maxWidth="md">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={3}>
            <Box p={3}>
              <Typography variant="h4" gutterBottom>
              Mass De-worming per Section Analysis
              </Typography>
              <Typography variant="body1" paragraph>
              It is Bar Chart that provides a focused examination of de-worming trends on each section, allowing you to filter data by school year, month, and grade.
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel id="school-year-label">Select School Year</InputLabel>
                    <Select
                      labelId="school-year-label"
                      id="school-year-select"
                      value={selectedSy}
                      onChange={handleSyChange}
                      label="Select School Year"
                    >
                      <MenuItem value="" disabled>
                        Select School Year
                      </MenuItem>
                      {sy.map((data) => (
                        <MenuItem key={data._id} value={data._id}>
                          {`${data.startYr} - ${data.endYr}`}
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
                      onChange={handleMthChange}
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
                    <InputLabel id="type-label">Select Type</InputLabel>
                    <Select
                      labelId="type-label"
                      id="type-select"
                      value={selectedType}
                      onChange={handleTypeChange}
                      label="Select Type"
                    >
                      <MenuItem value="All">All Types</MenuItem>
                      {types.map((month, index) => (
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
                    data={clinicData}
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
                      selectedType === "All"
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
                    
                      const matchingLegends = clinicData.filter((data) =>
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