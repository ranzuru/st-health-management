import { ResponsiveBar } from "@nivo/bar";
import { Paper, Box, Typography, Container, Grid } from "@mui/material";

const ImmunizationBarCharts = () => {
  const data = [
    {
      vaccine: "MMR",
      Male: 120,
      Female: 100,
    },
    {
      vaccine: "Hepatitis B",
      Male: 110,
      Female: 90,
    },
    {
      vaccine: "Polio",
      Male: 100,
      Female: 95,
    },
    {
      vaccine: "DTaP",
      Male: 130,
      Female: 110,
    },
    {
      vaccine: "Influenza",
      Male: 85,
      Female: 95,
    },
    {
      vaccine: "Hepatitis A",
      Male: 90,
      Female: 80,
    },
    {
      vaccine: "Varicella",
      Male: 75,
      Female: 70,
    },
    {
      vaccine: "Rotavirus",
      Male: 70,
      Female: 75,
    },
    {
      vaccine: "HPV",
      Male: 60,
      Female: 75,
    },
    {
      vaccine: "Meningococcal",
      Male: 40,
      Female: 45,
    },
    // Add more data as needed
  ];

  return (
    <Container maxWidth="md">
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <Paper elevation={3}>
            <Box p={3}>
              <Typography variant="h4" gutterBottom>
                Multi-Stacked Bar Chart (Immunizations by vaccine and gender)
              </Typography>
              <Typography variant="body1" paragraph>
                Breaks down the type of vaccines administered by gender, helping
                to spot any gender-related discrepancies.
              </Typography>
              <Box className="flex justify-center items-center">
                <div style={{ height: "500px", width: "800px" }}>
                  <ResponsiveBar
                    data={data}
                    keys={["Male", "Female"]}
                    indexBy="vaccine"
                    margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
                    padding={0.2}
                    groupMode="grouped"
                    axisBottom={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: "Vaccine",
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
                        direction: "row", // Change the direction to row for horizontal layout
                        justify: false,
                        translateX: 0, // Set this to zero or adjust as needed
                        translateY: -30, // Move it up by -40 units
                        itemsSpacing: 0,
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

export default ImmunizationBarCharts;
