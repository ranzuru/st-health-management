import { ResponsiveLine } from "@nivo/line";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { Container, Typography, Grid } from "@mui/material";

const DengueLineCharts = () => {
  const data = [
    {
      id: "Grade 1",
      data: [
        { x: "Jan", y: 3 },
        { x: "Feb", y: 4 },
        { x: "Mar", y: 5 },
        { x: "Apr", y: 6 },
        { x: "May", y: 7 },
        { x: "Jun", y: 8 },
        { x: "Jul", y: 9 },
        { x: "Aug", y: 10 },
        { x: "Sep", y: 11 },
        { x: "Oct", y: 12 },
        { x: "Nov", y: 13 },
        { x: "Dec", y: 14 }, // Data for December
      ],
    },
    {
      id: "Grade 2",
      data: [
        { x: "Jan", y: 2 },
        { x: "Feb", y: 5 },
        { x: "Mar", y: 7 },
        { x: "Apr", y: 9 },
        { x: "May", y: 12 },
        { x: "Jun", y: 15 },
        { x: "Jul", y: 18 },
        { x: "Aug", y: 20 },
        { x: "Sep", y: 23 },
        { x: "Oct", y: 25 },
        { x: "Nov", y: 28 },
        { x: "Dec", y: 31 }, // Data for December
      ],
    },
    // ...more grades
  ];

  return (
    <Container maxWidth="md">
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <Paper elevation={3}>
            <Box p={3}>
              <Typography variant="h4" gutterBottom>
                Multi-line Graph (Monthly cases by grade level)
              </Typography>
              <Typography variant="body1" paragraph>
                Tracks dengue cases by month for each grade level. Helps to
                identify if certain grades are more susceptible.
              </Typography>
              <Box p={3} style={{ height: "400px" }}>
                <div style={{ width: "100%", height: "100%" }}>
                  <ResponsiveLine
                    data={data}
                    margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                    xScale={{ type: "point" }}
                    yScale={{ type: "linear", min: "auto", max: "auto" }}
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: "Months",
                      legendOffset: 36,
                      legendPosition: "middle",
                    }}
                    axisLeft={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: "Cases",
                      legendOffset: -40,
                      legendPosition: "middle",
                    }}
                    pointSize={10}
                    pointColor={{ theme: "background" }}
                    pointBorderWidth={2}
                    pointBorderColor={{ from: "serieColor" }}
                    pointLabelYOffset={-12}
                    useMesh={true}
                    legends={[
                      {
                        anchor: "bottom-right",
                        direction: "column",
                        justify: false,
                        translateX: 100,
                        translateY: 0,
                        itemsSpacing: 0,
                        itemDirection: "left-to-right",
                        itemWidth: 80,
                        itemHeight: 20,
                        itemOpacity: 0.75,
                        symbolSize: 12,
                        symbolShape: "circle",
                        symbolBorderColor: "rgba(0, 0, 0, .5)",
                      },
                    ]}
                    tooltip={({ point }) => {
                      return (
                        <div
                          style={{
                            background: "white",
                            padding: "5px",
                            borderRadius: "5px",
                          }}
                        >
                          <strong>{point.serieId}</strong>
                          <br />
                          Month: {point.data.x}
                          <br />
                          Cases: {point.data.y}
                        </div>
                      );
                    }}
                  />
                </div>
              </Box>
            </Box>
            <Box p={3}>
              <Typography variant="h6">Summary:</Typography>
              <Typography variant="body1" paragraph>
                In March of 2021, Grade 6 from Section C reported 99 dengue
                cases, marking a 7.61% increase from 92 cases in 2020. Most
                cases were among females aged 11-15 years.
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DengueLineCharts;
