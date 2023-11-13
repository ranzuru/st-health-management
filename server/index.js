const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const path = require("path");
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
const academicYearRoutes = require("./routes/users/academicYearRouter.js");
const classEnrollmentRoutes = require("./routes/users/classEnrollmentRouter.js");
const clinicVisitRoutes = require("./routes/users/clinicVisitRouter.js");
const viewLogRoutes = require("./routes/viewLogRouter.js");


const resetPasswordRoutes = require("./routes/resetPasswordRoutes.js");
const otpRoutes = require("./routes/otpRoutes.js");
const cors = require("cors");

const app = express();

const oneYear = 31536000;
app.use(
  "/public",
  express.static(path.join(__dirname, "public"), {
    maxAge: oneYear,
  })
);
app.use(express.json({ limit: "50mb" }));

const corsOptions = {
  origin: "http://localhost:3000", // Replace with your frontend's URL
  credentials: true, // This is important for cookies
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

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

app.use("/academicYear", academicYearRoutes);

app.use("/classEnrollment", classEnrollmentRoutes);

app.use("/clinicVisit", clinicVisitRoutes);

app.use("/log", viewLogRoutes);

app.use("/resetPassword", resetPasswordRoutes);

app.use("/otp", otpRoutes);

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
      console.log("Server Port: 8080");
      console.log("Local Host: http://localhost:8080");
    });
  } catch (error) {
    console.log(error);
  }
};
startServer();
