import {
  DashboardOutlined,
  ManageAccountsOutlined,
  SupervisorAccountOutlined,
  AssignmentIndOutlined,
  MedicalServicesOutlined,
  EventOutlined,
  AutoGraphOutlined,
  ReceiptLongOutlined,
  SettingsOutlined,
  ExitToAppOutlined,
} from "@mui/icons-material";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";

export const sidebarItems = [
  {
    type: "link",
    to: "/app/dashboard",
    primary: "Dashboard",
    icon: DashboardOutlined,
    roles: ["Admin", "School Nurse", "District Nurse"], // who can see this?
  },
  {
    type: "submenu",
    primary: "Users",
    icon: ManageAccountsOutlined,
    roles: ["Admin"],
    submenuLinks: [
      { to: "/app/user-approval", primary: "User Approval" },
      { to: "/app/manage-users", primary: "Manage User" },
    ],
  },
  {
    type: "submenu",
    primary: "Profile",
    icon: SupervisorAccountOutlined,
    roles: ["Admin", "School Nurse"],
    submenuLinks: [
      { to: "/app/students-profile", primary: "Student Profile" },
      { to: "/app/faculty-profile", primary: "Faculty Profile" },
      { to: "/app/class-profile", primary: "Class Profile" },
      { to: "/app/academicYear-profile", primary: "Academic Year" },
    ],
  },
  {
    type: "submenu",
    primary: "Clinic Programs",
    icon: SpaOutlinedIcon,
    roles: ["Admin", "School Nurse"],
    submenuLinks: [
      { to: "/app/dengue-monitoring", primary: "Dengue Monitoring" },
      { to: "/app/immunization", primary: "Immunization" },
      { to: "/app/medical-checkup", primary: "Medical Checkup" },
      { to: "/app/faculty-checkup", primary: "Faculty Checkup" },
      { to: "/app/deworming-monitoring", primary: "Deworming Monitoring" },
      { to: "/app/feeding-program", primary: "Feeding Program" },
    ],
  },
  {
    type: "link",
    to: "/app/clinic-records",
    primary: "Clinic Records",
    icon: AssignmentIndOutlined,
    roles: ["Admin", "School Nurse"],
  },
  {
    type: "link",
    to: "/app/medicine-inventory",
    primary: "Medicine Inventory",
    icon: MedicalServicesOutlined,
    roles: ["Admin", "School Nurse"],
  },
  {
    type: "link",
    to: "/app/events",
    primary: "Events",
    icon: EventOutlined,
    roles: ["Admin", "School Nurse", "District Nurse"],
  },
  {
    type: "submenu",
    primary: "Analytics",
    icon: AutoGraphOutlined,
    roles: ["Admin", "School Nurse"],
    submenuLinks: [
      { to: "/app/dengue-monitoring-analytics", primary: "Dengue Analytics" },
      {
        to: "/app/dewormed-monitoring-analytics",
        primary: "Dewormed Analytics",
      },
      {
        to: "/app/immunization-analytics",
        primary: "Immunization Analytics",
      },
      { to: "/app/medical-checkup-analytics", primary: "Checkup Analytics" },
      { to: "/app/clinic-visitors-analytics", primary: "Clinic Analytics" },
      { to: "/app/feeding-program-analytics", primary: "Feeding Analytics" },
    ],
  },
  {
    type: "link",
    to: "/app/logs",
    primary: "Logs",
    icon: ReceiptLongOutlined,
    roles: ["Admin"],
  },
  {
    type: "link",
    to: "/app/settings",
    primary: "Settings",
    icon: SettingsOutlined,
    roles: ["Admin", "School Nurse", "District Nurse"],
  },
  {
    type: "link",
    to: "/",
    primary: "Logout",
    icon: ExitToAppOutlined,
    roles: ["Admin", "School Nurse", "District Nurse"],
    onClick: "handleLogout",
  },
];
