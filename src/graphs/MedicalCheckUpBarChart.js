import { ResponsiveBar } from "@nivo/bar";
import { Paper, Box, Typography, Container, Grid } from "@mui/material";

const MedicalCheckUpBarChart = () => {
  const data = [
    {
      grade: "Grade 1",
      Dental: 40,
      Vision: 20,
      General: 30,
    },
    {
      grade: "Grade 2",
      Dental: 25,
      Vision: 35,
      General: 40,
    },
    {
      grade: "Grade 3",
      Dental: 30,
      Vision: 25,
      General: 45,
    },
  ];

  return (
    <Container maxWidth="md">
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <Paper elevation={3}>
            <Box p={3}>
              <Typography variant="h4" gutterBottom>
                Medical Issue Count by Check-Up Type and Grade
              </Typography>
              <Typography variant="body1" paragraph>
                This chart shows the number of students in each grade who have
                issues identified during various types of medical check-ups. Use
                this information for targeted interventions and resource
                planning.
              </Typography>
              <Box className="flex justify-center items-center">
                <div style={{ height: "500px", width: "800px" }}>
                  <ResponsiveBar
                    data={data}
                    keys={["Dental", "Vision", "General"]}
                    indexBy="grade"
                    margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                    padding={0.3}
                    groupMode="grouped"
                    colors={{ scheme: "nivo" }}
                    borderColor={{
                      from: "color",
                      modifiers: [["darker", 1.6]],
                    }}
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: "Grade",
                      legendPosition: "middle",
                      legendOffset: 36,
                    }}
                    axisLeft={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: "Count",
                      legendPosition: "middle",
                      legendOffset: -40,
                    }}
                    labelSkipWidth={12}
                    labelSkipHeight={12}
                    labelTextColor={{
                      from: "color",
                      modifiers: [["darker", 1.6]],
                    }}
                    legends={[
                      {
                        dataFrom: "keys",
                        anchor: "bottom-right",
                        direction: "column",
                        justify: false,
                        translateX: 120,
                        translateY: 0,
                        itemsSpacing: 2,
                        itemWidth: 100,
                        itemHeight: 20,
                        itemDirection: "left-to-right",
                        itemOpacity: 0.85,
                        symbolSize: 20,
                      },
                    ]}
                    animate={true}
                    motionStiffness={90}
                    motionDamping={15}
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

export default MedicalCheckUpBarChart;
