import { ResponsivePie } from "@nivo/pie";
import { Paper, Box, Typography, Container, Grid } from "@mui/material";

const ClinicVisitorPieChart = () => {
  const data = [
    { id: "Cough", label: "Cough", value: 20 },
    { id: "Flu", label: "Flu", value: 30 },
    { id: "Fever", label: "Fever", value: 40 },
    { id: "Headache", label: "Headache", value: 15 },
    { id: "Injury", label: "Injury", value: 10 },
    { id: "Stomachache", label: "Stomachache", value: 25 },
    { id: "Allergies", label: "Allergies", value: 18 },
    { id: "Dental", label: "Dental", value: 12 },
    { id: "Eye Problem", label: "Eye Problem", value: 8 },
    { id: "Skin Issue", label: "Skin Issue", value: 14 },
    { id: "Earache", label: "Earache", value: 7 },
    { id: "Fatigue", label: "Fatigue", value: 22 },
    { id: "COVID-19 Symptoms", label: "COVID-19 Symptoms", value: 5 },
    { id: "Vaccination", label: "Vaccination", value: 9 },
    { id: "Other", label: "Other", value: 11 },
  ];

  return (
    <Container maxWidth="md">
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <Paper elevation={3}>
            <Box p={3}>
              <Typography variant="h4" gutterBottom>
                Reasons for Clinic Visits by Gender
              </Typography>
              <Typography variant="body1" paragraph>
                Distinguishes why students are visiting the clinic.
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

export default ClinicVisitorPieChart;
