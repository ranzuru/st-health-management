import { ResponsiveBar } from "@nivo/bar";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { Container, Typography, Grid } from "@mui/material";

const DewormedGroupBarChart = () => {
  const data = [
    {
      Status: "Enrolled",
      "Dewormed-4Ps": 1500, // Dewormed and 4Ps
      "Dewormed-Non-4Ps": 500, // Dewormed but not 4Ps
      "Not Dewormed-4Ps": 300, // Not Dewormed and 4Ps
      "Not Dewormed-Non-4Ps": 200, // Not Dewormed and not 4Ps
    },
  ];
  return (
    <Container maxWidth="md">
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <Paper elevation={3}>
            <Box p={3}>
              <Typography variant="h4" gutterBottom>
                Combined Bar Chart (Enrolled vs Dewormed)
              </Typography>
              <Typography variant="body1" paragraph>
                A grouped bar chart could represent the number of enrolled
                students and dewormed students by grade level or gender. This
                would provide a snapshot comparison.
              </Typography>
              <Box p={3} style={{ height: "400px" }}>
                <div style={{ width: "100%", height: "100%" }}>
                  <ResponsiveBar
                    data={data}
                    keys={[
                      "Dewormed-4Ps",
                      "Dewormed-Non-4Ps",
                      "Not Dewormed-4Ps",
                      "Not Dewormed-Non-4Ps",
                    ]}
                    indexBy="Status"
                    margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
                    padding={0.3}
                    groupMode="stacked"
                    colors={{ scheme: "nivo" }}
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: "Status",
                      legendPosition: "middle",
                      legendOffset: 32,
                    }}
                    axisLeft={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: "Count",
                      legendPosition: "middle",
                      legendOffset: -40,
                    }}
                    legends={[
                      {
                        dataFrom: "keys",
                        anchor: "top-right", // Set the anchor to top-right or top-left
                        direction: "column", // Change the direction to row for horizontal layout
                        justify: false,
                        translateX: 0, // Set this to zero or adjust as needed
                        translateY: -40, // Move it up by -40 units
                        itemsSpacing: 10,
                        itemWidth: 100,
                        itemHeight: 20,
                        itemDirection: "left-to-right",
                        itemOpacity: 0.85,
                        symbolSize: 20,
                      },
                    ]}
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

export default DewormedGroupBarChart;
