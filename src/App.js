import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./LoginPage";
import RegistrationPage from "./RegistrationPage";
import Dashboard from "./Dashboard";
import UserApproval from "./navbar/UserApproval";
import ManageUsers from "./navbar/ManageUsers";

import StudentNavBar from "./navbar/StudentsProfile";


import DengueNavBar from "./navbar/DengueMonitoring";

import FacultyProfile from "./navbar/FacultyProfile";
import ClassProfile from "./navbar/ClassProfile";
import ClinicPrograms from "./navbar/ClinicPrograms";

import Immunization from "./navbar/Immunization";
import MedicalCheckup from "./navbar/MedicalCheckup";
import FacultyCheckup from "./navbar/FacultyCheckup";
import DewormingMonitoring from "./navbar/DewormingMonitoring";
import FeedingProgram from "./navbar/FeedingProgram";
import ClinicRecords from "./navbar/ClinicRecords";
import MedicineInventory from "./navbar/MedicineInventory";
import Events from "./navbar/Events";
import Analytics from "./navbar/Analytics";
import Logs from "./navbar/Logs";

import NutritionalNavBar from "./navbar/NutritionalStatus";

import Settings from "./navbar/Settings";
import Sidebar from "./Sidebar.js";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/*" element={<AppLayout />} />
      </Routes>
    </Router>
  );
}

function AppLayout() {
  return (
    <>
      <div className="flex">
        <Sidebar className="w-64 flex-shrink-0" />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/manage-users" element={<ManageUsers />} />
            <Route path="/user-approval" element={<UserApproval />} />
            <Route path="/student-profile" element={<StudentNavBar />} />
            <Route path="/dengue-monitoring" element={<DengueNavBar />} />
            <Route path="/nutritional-status" element={<NutritionalNavBar />} />
            <Route path="/faculty-profile" element={<FacultyProfile />} />
            <Route path="/class-profile" element={<ClassProfile />} />
            <Route path="/clinic-programs" element={<ClinicPrograms />} />
            <Route path="/dengue-monitoring" element={<DengueMonitoring />} />
            <Route path="/immunization" element={<Immunization />} />
            <Route path="/medical-checkup" element={<MedicalCheckup />} />
            <Route path="/faculty-checkup" element={<FacultyCheckup />} />
            <Route path="/deworming-monitoring" element={<DewormingMonitoring />} />
            <Route path="/feeding-program" element={<FeedingProgram />} />
            <Route path="/clinic-records" element={<ClinicRecords />} />
            <Route path="/medicine-inventory" element={<MedicineInventory />} />
            <Route path="/events" element={<Events />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/logs" element={<Logs />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </>
  );
}

export default App;
