import { ResponsiveRadar } from "@nivo/radar";
import { Paper, Box, Typography, Container, Grid } from "@mui/material";

const MedicalCheckUpRadarCharts = () => {
  const data = [
    {
      section: "Matulungin",
      Cardiology: 2,
      Dermatology: 5,
      Orthopedics: 3,
    },
    {
      section: "Mabait",
      Cardiology: 4,
      Dermatology: 3,
      Orthopedics: 5,
    },
    {
      section: "Magalang",
      Cardiology: 1,
      Dermatology: 4,
      Orthopedics: 2,
    },
  ];

  return (
    <Container maxWidth="md">
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <Paper elevation={3}>
            <Box p={3}>
              <Typography variant="h4" gutterBottom>
                Radar Charts
              </Typography>
              <Typography variant="body1" paragraph>
                Identifies sections with higher needs for specialized care,
                useful for early interventions.
              </Typography>
              <Box className="flex justify-center items-center">
                <div style={{ height: "500px", width: "500px" }}>
                  <ResponsiveRadar
                    data={data}
                    keys={["Cardiology", "Dermatology", "Orthopedics"]}
                    indexBy="section"
                    valueFormat=">-.2f"
                    margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
                    borderColor={{ from: "color" }}
                    gridLabelOffset={36}
                    dotSize={10}
                    dotColor={{ theme: "background" }}
                    dotBorderWidth={2}
                    colors={{ scheme: "nivo" }}
                    blendMode="multiply"
                    motionConfig="wobbly"
                    legends={[
                      {
                        anchor: "top-left",
                        direction: "column",
                        translateX: -50,
                        translateY: -40,
                        itemWidth: 80,
                        itemHeight: 20,
                        itemTextColor: "#999",
                        symbolSize: 12,
                        symbolShape: "circle",
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

export default MedicalCheckUpRadarCharts;
