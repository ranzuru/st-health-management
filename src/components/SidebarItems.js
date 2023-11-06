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
  PersonAddOutlined,
} from "@mui/icons-material";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";

export const sidebarItems = [
  {
    type: "link",
    to: "/app/dashboard",
    primary: "Dashboard",
    icon: DashboardOutlined,
    roles: ["Administrator", "School Nurse", "District Nurse"], // who can see this?
  },
  {
    type: "submenu",
    primary: "User",
    icon: ManageAccountsOutlined,
    roles: ["Administrator"],
    submenuLinks: [
      { to: "/app/user-approval", primary: "Approval" },
      { to: "/app/manage-users", primary: "Management" },
    ],
  },
  {
    type: "submenu",
    primary: "Profile",
    icon: SupervisorAccountOutlined,
    roles: ["Administrator", "School Nurse"],
    submenuLinks: [
      { to: "/app/students-profile", primary: "Student" },
      { to: "/app/faculty-profile", primary: "Faculty" },
      { to: "/app/class-profile", primary: "Class" },
      { to: "/app/academicYear-profile", primary: "Academic Year" },
    ],
  },
  {
    type: "link",
    to: "/app/class-enrollment",
    primary: "Assignment",
    icon: PersonAddOutlined,
    roles: ["Administrator", "School Nurse", "District Nurse"], // who can see this?
  },
  {
    type: "submenu",
    primary: "Clinic Programs",
    icon: SpaOutlinedIcon,
    roles: ["Administrator", "School Nurse"],
    submenuLinks: [
      { to: "/app/medical-checkup", primary: "Student Medical" },
      { to: "/app/faculty-checkup", primary: "Faculty Medical" },
      { to: "/app/deworming-monitoring", primary: "De-worming Monitoring" },
      { to: "/app/feeding-program", primary: "Feeding Program" },
      { to: "/app/dengue-monitoring", primary: "Dengue Monitoring" },
    ],
  },
  {
    type: "link",
    to: "/app/clinic-visit",
    primary: "Clinic Visit",
    icon: AssignmentIndOutlined,
    roles: ["Administrator", "School Nurse"],
  },
  {
    type: "submenu",
    primary: "Medicine Inventory",
    icon: MedicalServicesOutlined,
    roles: ["Administrator", "School Nurse"],
    submenuLinks: [
      { to: "/app/medicine-item", primary: "Item" },
      { to: "/app/medicine-in", primary: "In" },
      { to: "/app/medicine-disposal", primary: "Disposal" },
      { to: "/app/medicine-adjustment", primary: "Adjustment" },

    ],
  },
  {
    type: "link",
    to: "/app/events",
    primary: "Events",
    icon: EventOutlined,
    roles: ["Administrator", "School Nurse", "District Nurse"],
  },
  {
    type: "submenu",
    primary: "Analytics",
    icon: AutoGraphOutlined,
    roles: ["Administrator", "School Nurse"],
    submenuLinks: [
      { to: "/app/medical-checkup-analytics", primary: "Student Medical" },
      
      {
        to: "/app/dewormed-monitoring-analytics",
        primary: "De-worming Monitoring",
      },
      { to: "/app/feeding-program-analytics", primary: "Feeding Program" },
      { to: "/app/dengue-monitoring-analytics", primary: "Dengue Monitoring" },
      { to: "/app/clinic-visitors-analytics", primary: "Clinic Visit" },
      
    ],
  },
  {
    type: "link",
    to: "/app/logs",
    primary: "Logs",
    icon: ReceiptLongOutlined,
    roles: ["Administrator"],
  },
  {
    type: "link",
    to: "/app/settings",
    primary: "Settings",
    icon: SettingsOutlined,
    roles: ["Administrator", "School Nurse", "District Nurse"],
  },
  {
    type: "link",
    to: "/",
    primary: "Logout",
    icon: ExitToAppOutlined,
    roles: ["Administrator", "School Nurse", "District Nurse"],
    onClick: "handleLogout",
  },
];
