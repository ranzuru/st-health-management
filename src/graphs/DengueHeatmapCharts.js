import { ResponsiveHeatMap } from "@nivo/heatmap";
import { Paper, Box, Typography, Container, Grid } from "@mui/material";

const DengueHeatmapCharts = () => {
  const rawData = [
    { section: "Apple", gender: "Male", value: 12 },
    { section: "Apple", gender: "Female", value: 20 },
    { section: "Banana", gender: "Male", value: 15 },
    { section: "Banana", gender: "Female", value: 16 },
    { section: "Orange", gender: "Male", value: 10 },
    { section: "Orange", gender: "Female", value: 18 },
    { section: "Grapes", gender: "Male", value: 13 },
    { section: "Grapes", gender: "Female", value: 22 },
    { section: "Strawberry", gender: "Male", value: 8 },
    { section: "Strawberry", gender: "Female", value: 14 },
    { section: "Mango", gender: "Male", value: 17 },
    { section: "Mango", gender: "Female", value: 19 },
    { section: "Pineapple", gender: "Male", value: 11 },
    { section: "Pineapple", gender: "Female", value: 21 },
    { section: "Kiwi", gender: "Male", value: 9 },
    { section: "Kiwi", gender: "Female", value: 23 },
    { section: "Watermelon", gender: "Male", value: 14 },
    { section: "Watermelon", gender: "Female", value: 25 },
  ];

  const transformedData = rawData.reduce((acc, { section, gender, value }) => {
    const existing = acc.find((item) => item.id === section);
    if (existing) {
      existing.data.push({ x: gender, y: value });
    } else {
      acc.push({ id: section, data: [{ x: gender, y: value }] });
    }
    return acc;
  }, []);

  return (
    <Container maxWidth="md">
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <Paper elevation={3}>
            <Box p={3}>
              <Typography variant="h4" gutterBottom>
                Heatmap (Cases by section and gender)
              </Typography>
              <Typography variant="body1" paragraph>
                Allows quick visualization of hotspots within the school. Can
                target interventions more effectively.
              </Typography>
              <Box className="flex justify-center items-center">
                <div style={{ height: "500px", width: "800px" }}>
                  <ResponsiveHeatMap
                    data={transformedData}
                    margin={{ top: 60, right: 90, bottom: 60, left: 90 }}
                    valueFormat=">-.2s"
                    axisTop={{
                      orient: "top",
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: "",
                      legendOffset: 36,
                    }}
                    axisRight={null}
                    axisLeft={{
                      orient: "left",
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      legendPosition: "middle",
                      legendOffset: -40,
                    }}
                    colors={{
                      type: "diverging",
                      scheme: "red_yellow_blue",
                      divergeAt: 0.5,
                      minValue: 5,
                      maxValue: 50,
                    }}
                    emptyColor="#555555"
                  />
                </div>
              </Box>
            </Box>
            <Box p={3}>
              <Typography variant="h6">Summary:</Typography>
              <Typography variant="body1" paragraph>
                In May of 2021, Grade 9 from Section C reported 42 dengue cases,
                marking a -38.24% decrease from 68 cases in 2020. Most cases
                were among males aged 6-10 years.
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DengueHeatmapCharts;
