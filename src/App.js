import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
  Outlet,
} from "react-router-dom";
import LoginPage from "./LoginPage";
import RegistrationPage from "./RegistrationPage";
import Dashboard from "./Dashboard";
import UserApproval from "./navbar/UserApproval";
import ManageUsers from "./navbar/ManageUsers";
import StudentsProfile from "./navbar/StudentsProfile";
import FacultyProfile from "./navbar/FacultyProfile";
import ClassProfile from "./navbar/ClassProfile";
import ClinicVisitNavBar from "./navbar/ClinicVisit";
import DengueMonitoring from "./navbar/DengueMonitoring";
import MedicalCheckup from "./navbar/MedicalCheckup";
import FacultyCheckup from "./navbar/FacultyCheckup";
import DewormingMonitoring from "./navbar/DewormingMonitoring";
import FeedingProgram from "./navbar/FeedingProgram";
import Events from "./navbar/Events";
import Analytics from "./navbar/Analytics";
import DengueMonitoringAnalytics from "./navbar/DengueMonitoringAnalytics";
import DewormedMonitoringAnalytics from "./navbar/DewormedMonitoringAnalytics";
import ImmunizationAnalytics from "./navbar/ImmunizationAnalytics";
import MedicalCheckUpAnalytics from "./navbar/MedicalCheckUpAnalytics";
import ClinicVisitorsAnalytics from "./navbar/ClinicVisitorsAnalytics";
import FeedingProgramAnalytics from "./navbar/FeedingProgramAnalytics";
import AcademicYear from "./navbar/AcademicYear";
import ClassEnrollment from "./navbar/ClassEnrollment";
import MedicineInNavBar from "./navbar/MedicineIn";
import MedicineItemNavBar from "./navbar/MedicineItem";
import MedicineDisposalNavBar from "./navbar/MedicineDisposal";
import MedicineAdjustmentNavBar from "./navbar/MedicineAdjustment";
import Logs from "./navbar/Logs";
import Settings from "./navbar/Settings";
import Sidebar from "./components/Sidebar";
import PageNotFound from "./pages/pageNotFound";
import PasswordResetPage from "./pages/PasswordResetPage";
import { Provider } from "react-redux";
import store, { persistor } from "./redux/store";
import ProtectedRoute from "./utils/ProtectedRoutes";
import { useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

function AuthRedirect() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    // Redirect to dashboard if at root and authenticated
    if (isAuthenticated && location.pathname === "/") {
      navigate("/app/dashboard");
      return;
    }

    // Redirect to root if not authenticated and trying to access a protected route
    if (!isAuthenticated && location.pathname.startsWith("/app")) {
      navigate("/");
      return;
    }
  }, [isAuthenticated, navigate, location.pathname]);

  return null;
}
function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <AuthRedirect />
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/reset-password" element={<PasswordResetPage />} />
            <Route
              path="/app/*"
              element={<ProtectedRoute component={AppLayout} />}
            />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
      </PersistGate>
    </Provider>
  );
}

function AppLayout() {
  return (
    <>
      <div className="flex h-screen">
        <Sidebar className="w-64 overflow-y-auto" />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/manage-users" element={<ManageUsers />} />
            <Route path="/user-approval" element={<UserApproval />} />
            <Route path="/students-profile" element={<StudentsProfile />} />
            <Route path="/faculty-profile" element={<FacultyProfile />} />
            <Route path="/class-profile" element={<ClassProfile />} />
            <Route path="/academicYear-profile" element={<AcademicYear />} />
            <Route path="/class-enrollment" element={<ClassEnrollment />} />
            <Route path="/clinic-visit" element={<ClinicVisitNavBar />} />
            <Route path="/dengue-monitoring" element={<DengueMonitoring />} />
            <Route path="/medical-checkup" element={<MedicalCheckup />} />
            <Route path="/faculty-checkup" element={<FacultyCheckup />} />
            <Route path="/medicine-item" element={<MedicineItemNavBar />} />
            <Route path="/medicine-adjustment" element={<MedicineAdjustmentNavBar />} />
            <Route path="/medicine-in" element={<MedicineInNavBar />} />
            <Route path="/medicine-disposal" element={<MedicineDisposalNavBar />} />
            <Route
              path="/deworming-monitoring"
              element={<DewormingMonitoring />}
            />
            <Route path="/feeding-program" element={<FeedingProgram />} />
            <Route path="/events" element={<Events />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route
              path="/dengue-monitoring-analytics"
              element={<DengueMonitoringAnalytics />}
            />
            <Route
              path="/dewormed-monitoring-analytics"
              element={<DewormedMonitoringAnalytics />}
            />
            <Route
              path="/immunization-analytics"
              element={<ImmunizationAnalytics />}
            />
            <Route
              path="/medical-checkup-analytics"
              element={<MedicalCheckUpAnalytics />}
            />
            <Route
              path="/clinic-visitors-analytics"
              element={<ClinicVisitorsAnalytics />}
            />
            <Route
              path="/feeding-program-analytics"
              element={<FeedingProgramAnalytics />}
            />
            <Route path="/logs" element={<Logs />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default App;
