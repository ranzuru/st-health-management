import { ResponsiveLine } from "@nivo/line";
import { Paper, Box, Typography, Container, Grid } from "@mui/material";

const ClinicVisitorLineChart = () => {
  const data = [
    {
      id: "Overall Students",
      data: [
        { x: "January", y: 20 },
        { x: "February", y: 45 },
        { x: "March", y: 60 },
        { x: "April", y: 55 },
        { x: "May", y: 70 },
        { x: "June", y: 80 },
        { x: "July", y: 90 },
        { x: "August", y: 85 },
        { x: "September", y: 75 },
        { x: "October", y: 60 },
        { x: "November", y: 30 },
        { x: "December", y: 20 },
        // You now have at least 10 data points in your dataset
      ],
    },
  ];

  return (
    <Container maxWidth="md">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={3}>
            <Box p={3}>
              <Typography variant="h4" gutterBottom>
                Daily/Monthly Visits by Section
              </Typography>
              <Typography variant="body1" paragraph>
                Tracks frequency of clinic visits by section, flagging unusually
                high or low visits.
              </Typography>
              <Box className="flex justify-center items-center">
                <div style={{ height: "500px", width: "800px" }}>
                  <ResponsiveLine
                    data={data}
                    margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                    xScale={{ type: "point" }}
                    yScale={{ type: "linear", min: "auto", max: "auto" }}
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                      orient: "bottom",
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: "Month",
                      legendOffset: 36,
                      legendPosition: "middle",
                    }}
                    axisLeft={{
                      orient: "left",
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: "Student Count",
                      legendOffset: -40,
                      legendPosition: "middle",
                    }}
                    curve="linear"
                    pointSize={10}
                    pointColor={{ theme: "background" }}
                    pointBorderWidth={2}
                    pointBorderColor={{ from: "serieColor" }}
                    pointLabelYOffset={-12}
                    useMesh={true}
                  />
                </div>
              </Box>
            </Box>
            <Box p={3}>
              <Typography variant="h6">Summary:</Typography>
              <Typography variant="body1" paragraph>
                In August of 2023, Grade 6 from Section A reported 97 dengue
                cases, marking a 385.0% increase from 20 cases in 2022. Most
                cases were among females aged 6-10 years.
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ClinicVisitorLineChart;
