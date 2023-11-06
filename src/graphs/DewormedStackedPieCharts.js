import { ResponsivePie } from "@nivo/pie";
import { Paper, Box, Typography, Container, Grid } from "@mui/material";

const DewormedStackedPieCharts = () => {
  const data = [
    { id: "Dewormed-Male", label: "Dewormed Male", value: 50 },
    { id: "NotDewormed-Male", label: "Not Dewormed Male", value: 20 },
    { id: "Dewormed-Female", label: "Dewormed Female", value: 40 },
    { id: "NotDewormed-Female", label: "Not Dewormed Female", value: 30 },
  ];

  return (
    <Container maxWidth="md">
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <Paper elevation={3}>
            <Box p={3}>
              <Typography variant="h4" gutterBottom>
                Stacked Pie Chart (Dewormed vs not-dewormed by gender)
              </Typography>
              <Typography variant="body1" paragraph>
                Shows the proportion of students dewormed, broken down by
                gender. Helps in assessing gender-specific compliance.
              </Typography>
              <Box className="flex justify-center items-center">
                <div style={{ height: "500px", width: "800px" }}>
                  <ResponsivePie
                    data={data}
                    margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                    sortByValue={true}
                    innerRadius={0.5}
                    padAngle={0.7}
                    cornerRadius={3}
                    colors={{ scheme: "nivo" }}
                    radialLabelsSkipAngle={10}
                    radialLabelsTextXOffset={6}
                    radialLabelsTextColor="#333333"
                    radialLabelsLinkOffset={0}
                    radialLabelsLinkDiagonalLength={16}
                    radialLabelsLinkHorizontalLength={24}
                    radialLabelsLinkStrokeWidth={1}
                    radialLabelsLinkColor={{ from: "color" }}
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

export default DewormedStackedPieCharts;
