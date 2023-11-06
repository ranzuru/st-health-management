import { Link, useLocation } from "react-router-dom";
import { ListItem, ListItemIcon, ListItemText } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";

function SidebarLink({
  to,
  primary,
  icon: IconComponent,
  onClick,
  isSidebarCollapsed,
}) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <ListItem
      component={Link}
      to={to}
      onClick={onClick}
      className={`flex items-center justify-start transition duration-200 hover:bg-blue-800 rounded-lg ${
        isActive ? "bg-blue-900 rounded-lg" : ""
      }`}
    >
      {IconComponent && (
        <Tooltip title={primary} arrow placement="right">
          <ListItemIcon>
            <IconComponent style={{ color: "white" }} />
          </ListItemIcon>
        </Tooltip>
      )}
      {!isSidebarCollapsed && <ListItemText primary={primary} />}
    </ListItem>
  );
}
export default SidebarLink;
