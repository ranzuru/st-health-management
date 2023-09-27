import { ResponsiveBar } from "@nivo/bar";
import { Paper, Box, Typography, Container, Grid } from "@mui/material";

const DengueGroupBarCharts = () => {
  const data = [
    { age: "6-7", Male: 20, Female: 15 },
    { age: "8-9", Male: 30, Female: 25 },
    { age: "10-11", Male: 50, Female: 35 },
    { age: "12-13", Male: 50, Female: 35 },
    { age: "14-15", Male: 50, Female: 35 },
    { age: "16-17", Male: 50, Female: 35 },
    // ... more data
  ];

  return (
    <Container maxWidth="md">
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <Paper elevation={3}>
            <Box p={3}>
              <Typography variant="h4" gutterBottom>
                Grouped Bar Chart (Cases by age and gender)
              </Typography>
              <Typography variant="body1" paragraph>
                Reveals age and gender groups most affected, aiding targeted
                prevention.
              </Typography>
              <Box className="flex justify-center items-center">
                <div style={{ height: "500px", width: "800px" }}>
                  <ResponsiveBar
                    data={data}
                    keys={["Male", "Female"]}
                    indexBy="age"
                    margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
                    padding={0.2}
                    groupMode="grouped"
                    axisBottom={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: "Age Group",
                      legendPosition: "middle",
                      legendOffset: 32,
                    }}
                    axisLeft={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: "Cases",
                      legendPosition: "middle",
                      legendOffset: -40,
                    }}
                    tooltip={({ id, value, indexValue }) => (
                      <div className="bg-white p-3 rounded shadow-md">
                        Age: <strong>{indexValue}</strong>
                        <br />
                        Gender: <strong>{id}</strong>
                        <br />
                        Cases: <strong>{value}</strong>
                      </div>
                    )}
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

export default DengueGroupBarCharts;
