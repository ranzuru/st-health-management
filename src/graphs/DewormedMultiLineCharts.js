import { ResponsiveLine } from "@nivo/line";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { Container, Typography, Grid } from "@mui/material";

const MultiLineGraph = () => {
  const data = [
    {
      id: "Grade 1",
      data: [
        { x: "Jan", y: 10 },
        { x: "Feb", y: 20 },
        { x: "Mar", y: 25 },
        { x: "Apr", y: 18 },
        { x: "May", y: 22 },
        { x: "Jun", y: 28 },
        { x: "Jul", y: 30 },
        { x: "Aug", y: 25 },
        { x: "Sep", y: 20 },
        { x: "Oct", y: 15 },
        { x: "Nov", y: 12 },
        { x: "Dec", y: 10 },
      ],
    },
    {
      id: "Grade 2",
      data: [
        { x: "Jan", y: 15 },
        { x: "Feb", y: 30 },
        { x: "Mar", y: 20 },
        { x: "Apr", y: 22 },
        { x: "May", y: 28 },
        { x: "Jun", y: 35 },
        { x: "Jul", y: 40 },
        { x: "Aug", y: 32 },
        { x: "Sep", y: 28 },
        { x: "Oct", y: 20 },
        { x: "Nov", y: 18 },
        { x: "Dec", y: 16 },
      ],
    },
  ];

  return (
    <Container maxWidth="md">
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <Paper elevation={3}>
            <Box p={3}>
              <Typography variant="h4" gutterBottom>
                Multi-line Graph (Deworming frequency by grade level)
              </Typography>
              <Typography variant="body1" paragraph>
                Monitors the frequency of deworming across grades over time,
                pinpointing where more attention is needed.
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
                      legend: "Deworming Frequency",
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
                In 2021, a total of 956 students across all grades were
                de-wormed, representing a 18.02% change from 810 students in
                2020. Of these, 94 were from Grade 3, particularly in Section A.
                The majority were males aged 6-8 years.
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default MultiLineGraph;
