import { useEffect, useState } from "react";
// import BarGraphDashboard from "./graphs/BarGraphDashboard.js";
import { Typography, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import numberOfUser from "./Data/numberOfUser.png";
import numberOfStudents from "./Data/numberOfStudents.png";
import clinicPatients from "./Data/clinicPatients.png";
import feedingPrograms from "./Data/feedingProgram.png";
import DashboardCard from "./components/DashboardComponents/DashboardCard.js";
import { useSelector } from "react-redux";
import axiosInstance from "./config/axios-instance.js";

const Dashboard = () => {

  const [clinicVisitData, setClinicVisitData] = useState([]);
  const [feedingData, setFeedingData] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clinicVisitResponse, feedingResponse] = await Promise.all([
          axiosInstance.get("/clinicVisit/getPresent"),
          axiosInstance.get("/nutritionalStatus/getPresent")
        ]);

        setClinicVisitData(clinicVisitResponse.data);
        setFeedingData(feedingResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);


  const navigate = useNavigate();
  const [userCount, setUserCount] = useState(0);
  const [studentCount, setStudentUserCount] = useState(0);
  const user = useSelector((state) => state.auth.user);

  const handleCardClickManageUser = () => {
    navigate("/app/manage-users");
  };

  const handleCardClickStudents = () => {
    navigate("/app/students-profile");
  };

  const handleCardClickClinic = () => {
    navigate("/app/clinic-records");
  };

  const handleCardClickFeeding = () => {
    navigate("/app/feeding-program");
  };

  const fetchUserCount = async () => {
    try {
      const response = await axiosInstance.get("/users/count");
      setUserCount(response.data.count);
    } catch (error) {
      console.error("Failed to fetch user count:", error);
    }
  };

  useEffect(() => {
    fetchUserCount();
  }, []);

  const fetchStudentCount = async () => {
    try {
      const response = await axiosInstance.get("/classEnrollment/count");
      setStudentUserCount(response.data.count);
    } catch (error) {
      console.error("Failed to fetch user count:", error);
    }
  };

  useEffect(() => {
    fetchStudentCount();
  }, []);

  return (
    <div className="flex">
      <div className="bg-blue-900 h-64 w-full mb-4">
        <div className="flex-grow p-4">
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: "2rem", sm: "2rem", md: "3rem" },
              fontWeight: "bold",
              color: "white",
              pt: { xs: 2, md: 4 },
            }}
          >
            Welcome {user?.name}!
          </Typography>
        </div>
        <Grid className="pt-14 pr-4 pl-4" container spacing={3}>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <DashboardCard
              icon={numberOfUser}
              number={userCount}
              title="Number of User"
              subtitle="Total number of user of this system."
              onCardClick={handleCardClickManageUser}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <DashboardCard
              icon={numberOfStudents}
              number={studentCount}
              title="Number of Students"
              subtitle="Total number of students."
              onCardClick={handleCardClickStudents}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <DashboardCard
              icon={clinicPatients}
              number={clinicVisitData.length}
              title="Clinic Visitors"
              subtitle="Total number of clinic visitors."
              onCardClick={handleCardClickClinic}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <DashboardCard
              icon={feedingPrograms}
              number={feedingData.length}
              title="Feeding Program"
              subtitle="Total of students eligible for feeding program."
              onCardClick={handleCardClickFeeding}
            />
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default Dashboard;
