const express = require("express");
const dotenv = require("dotenv");
const authenticateMiddleware = require("./auth/authenticateMiddleware.js");
const authRoutes = require("./auth/Routes.js");
const connectDB = require("./mongodb/Connect.js");
const userRoutes = require("./routes/users/manageUsers.js");
const eventRoutes = require("./routes/users/eventRouter.js");
const settingsRoutes = require("./routes/users/settingsRouter.js");
const medicineInventoryRoutes = require("./routes/users/medicineInventoryRouter.js");
const facultyProfileRoutes = require("./routes/users/facultyProfileRouter.js");
const classProfileRoutes = require("./routes/users/classProfileRouter.js");
const studentProfileRoutes = require("./routes/users/studentProfileRouter.js");
const medicalCheckupRoutes = require("./routes/users/medicalCheckupRouter.js");
const dewormingReportRoutes = require("./routes/users/dewormingReportRouter.js");
const nutritionalStatusRoutes = require("./routes/users/nutritionalStatusRouter.js");
const facultyMedicalRoutes = require("./routes/users/facultyCheckupRouter.js");
const dengueMonitoringRoutes = require("./routes/users/dengueRouter.js");

const cors = require("cors");

dotenv.config();

const app = express();
app.use(express.json({ limit: "50mb" }));

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Import and use the userRoutes with a prefix

app.use("/users", userRoutes);

app.use("/events", eventRoutes);

app.use("/settings", settingsRoutes);

app.use("/medicineInventory", medicineInventoryRoutes);

app.use("/facultyProfile", facultyProfileRoutes);

app.use("/classProfile", classProfileRoutes);

app.use("/studentProfile", studentProfileRoutes);

app.use("/medicalCheckup", medicalCheckupRoutes);

app.use("/dewormingReport", dewormingReportRoutes);

app.use("/nutritionalStatus", nutritionalStatusRoutes);

app.use("/facultyMedical", facultyMedicalRoutes);

app.use("/dengueMonitoring", dengueMonitoringRoutes);

app.use("/auth", authRoutes);

app.get("/protected", authenticateMiddleware, (req, res) => {
  // The middleware verifies the token and attaches user data to req.userData
  res
    .status(200)
    .json({ message: "Access granted to protected route", user: req.userData });
});

const startServer = async () => {
  try {
    connectDB(process.env.MONGODB_URL);

    app.listen(8080, () => {
      console.log("Server started on port http://localhost:8080");
    });
  } catch (error) {
    console.log(error);
  }
};
startServer();
