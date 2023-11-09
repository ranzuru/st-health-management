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
    roles: ["Administrator", "Principal", "IT Staff", "Office Staff", "Doctor", "District Nurse", "School Nurse", "Feeding Program Head", "Medical Program Head", "Dengue Program Head", "Deworming Program Head", "Intern"], // who can see this?
  },
  {
    type: "submenu",
    primary: "User",
    icon: ManageAccountsOutlined,
    roles: ["Administrator", "Principal", "IT Staff"],
    submenuLinks: [
      { to: "/app/user-approval", primary: "Approval" },
      { to: "/app/manage-users", primary: "Management" },
    ],
  },
  {
    type: "submenu",
    primary: "Profile",
    icon: SupervisorAccountOutlined,
    roles: ["Administrator", "Principal", "IT Staff", "Office Staff", "Doctor", "District Nurse", "School Nurse", "Feeding Program Head", "Medical Program Head", "Dengue Program Head", "Deworming Program Head", "Intern"],
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
    roles: ["Administrator", "Principal", "Office Staff", "School Nurse", "Feeding Program Head", "Medical Program Head", "Dengue Program Head", "Deworming Program Head",], // who can see this?
  },
  {
    type: "submenu",
    primary: "Clinic Programs",
    icon: SpaOutlinedIcon,
    roles: ["Administrator", "Principal", "Doctor", "District Nurse", "School Nurse", "Feeding Program Head", "Medical Program Head", "Dengue Program Head", "Deworming Program Head"],
    submenuLinks: [
      { to: "/app/medical-checkup", primary: "Student Medical" },
      { to: "/app/faculty-checkup", primary: "Faculty Medical" },
      { to: "/app/deworming-monitoring", primary: "De-worming Monitoring" },
      { to: "/app/feeding-program", primary: "Nutritional Status" },
      { to: "/app/dengue-monitoring", primary: "Dengue Monitoring" },
    ],
  },
  {
    type: "link",
    to: "/app/clinic-visit",
    primary: "Clinic Visit",
    icon: AssignmentIndOutlined,
    roles: ["Administrator", "Principal", "Doctor", "District Nurse", "School Nurse", "Feeding Program Head", "Medical Program Head", "Dengue Program Head", "Deworming Program Head", "Intern"],
  },
  {
    type: "submenu",
    primary: "Medicine Inventory",
    icon: MedicalServicesOutlined,
    roles: ["Administrator", "Principal", "IT Staff", "Office Staff", "Doctor", "District Nurse", "School Nurse", "Feeding Program Head", "Medical Program Head", "Dengue Program Head", "Deworming Program Head", "Intern"],
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
    roles: ["Administrator", "Principal", "IT Staff", "Office Staff", "Doctor", "District Nurse", "School Nurse", "Feeding Program Head", "Medical Program Head", "Dengue Program Head", "Deworming Program Head", "Intern"],
  },
  {
    type: "submenu",
    primary: "Analytics",
    icon: AutoGraphOutlined,
    roles: ["Administrator", "Principal", "IT Staff", "Office Staff", "Doctor", "District Nurse", "School Nurse", "Feeding Program Head", "Medical Program Head", "Dengue Program Head", "Deworming Program Head", "Intern"],
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
    roles: ["Administrator", "Principal", "IT Staff", "Office Staff", "Doctor", "District Nurse", "School Nurse", "Feeding Program Head", "Medical Program Head", "Dengue Program Head", "Deworming Program Head", "Intern"],
  },
  {
    type: "link",
    to: "/app/settings",
    primary: "Settings",
    icon: SettingsOutlined,
    roles: ["Administrator", "Principal", "IT Staff", "Office Staff", "Doctor", "District Nurse", "School Nurse", "Feeding Program Head", "Medical Program Head", "Dengue Program Head", "Deworming Program Head", "Intern"],
  },
  {
    type: "link",
    to: "/",
    primary: "Logout",
    icon: ExitToAppOutlined,
    roles: ["Administrator", "Principal", "IT Staff", "Office Staff", "Doctor", "District Nurse", "School Nurse", "Feeding Program Head", "Medical Program Head", "Dengue Program Head", "Deworming Program Head", "Intern"],
    onClick: "handleLogout",
  },
];
