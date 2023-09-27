import { useState } from "react";
import { ResponsivePie } from "@nivo/pie";
import {
  Paper,
  Box,
  Typography,
  Container,
  Select,
  MenuItem,
} from "@mui/material";

const ImmunizationPieChart = () => {
  const [selectedGrade, setSelectedGrade] = useState("Grade 1");

  const data = {
    "Grade 1": [
      { id: "Immunized", label: "Immunized", value: 200 },
      { id: "Non-Immunized", label: "Non-Immunized", value: 50 },
    ],
    "Grade 2": [
      { id: "Immunized", label: "Immunized", value: 180 },
      { id: "Non-Immunized", label: "Non-Immunized", value: 70 },
    ],
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3}>
        <Box p={3}>
          <Typography variant="h4" gutterBottom>
            Pie Chart (Immunized vs non-immunized by grade level)
          </Typography>
          <Typography variant="body1" paragraph>
            Compares immunization coverage between grades, highlighting any gaps
            in vaccination.
          </Typography>
          <Select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
          >
            <MenuItem value="Grade 1">Grade 1</MenuItem>
            <MenuItem value="Grade 2">Grade 2</MenuItem>
          </Select>
          <Box className="flex justify-center items-center">
            <div style={{ height: "500px", width: "800px" }}>
              <ResponsivePie
                data={data[selectedGrade]}
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
                legends={[
                  {
                    anchor: "bottom",
                    direction: "row",
                    justify: false,
                    translateX: 0,
                    translateY: 30,
                    itemsSpacing: 0,
                    itemWidth: 100,
                    itemHeight: 18,
                    itemTextColor: "#999",
                    itemDirection: "left-to-right",
                    itemOpacity: 1,
                    symbolSize: 18,
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
            In August of 2023, Grade 6 from Section A reported 97 dengue cases,
            marking a 385.0% increase from 20 cases in 2022. Most cases were
            among females aged 6-10 years.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default ImmunizationPieChart;
