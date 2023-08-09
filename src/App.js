import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import RegistrationPage from './RegistrationPage';
import Dashboard from './Dashboard';
import ManageUsers from './navbar/ManageUsers';
import StudentsProfile from './navbar/StudentsProfile';
import FacultyProfile from './navbar/FacultyProfile';
import ClinicPrograms from './navbar/ClinicPrograms';
import DengueMonitoring from './navbar/DengueMonitoring';
import Immunization from './navbar/Immunization';
import MedicalCheckup from './navbar/MedicalCheckup';
import FacultyCheckup from './navbar/FacultyCheckup';
import DewormingMonitoring from './navbar/DewormingMonitoring';
import FeedingProgram from './navbar/FeedingProgram';
import ClinicRecords from './navbar/ClinicRecords';
import MedicineInventory from './navbar/MedicineInventory';
import Events from './navbar/Events';
import Analytics from './navbar/Analytics';
import Logs from './navbar/Logs';
import Settings from './navbar/Settings';
import Logout from './navbar/Logout';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/manage-users" element={<ManageUsers />} />
        <Route path="/students-profile" element={<StudentsProfile />} />
        <Route path="/faculty-profile" element={<FacultyProfile />} />
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
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </Router>
  );
}

export default App;
