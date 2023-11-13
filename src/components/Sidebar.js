import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { List } from "@mui/material";
import { sidebarItems } from "../components/SidebarItems";
import SidebarLink from "../components/SidebarLink";
import SidebarSubmenu from "../components/SidebarSubmenu";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import schoolLogo from "../Data/DonjuanTransparent.webp";
import { removeUser } from "../redux/actions/authActions";

function Sidebar() {
  const role = useSelector((state) => state.auth.role);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [openedSubmenu, setOpenedSubmenu] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const itemsToDisplay = sidebarItems.filter((item) =>
    item.roles.includes(role)
  );

  const toggleSidebar = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    dispatch(removeUser());
    navigate("/");
  };

  const toggleSubmenu = (submenuName) => {
    if (openedSubmenu === submenuName) {
      setOpenedSubmenu(""); // Collapse the submenu if it's already open
    } else {
      setOpenedSubmenu(submenuName); // Otherwise, set the opened submenu to the clicked submenu
    }
  };

  useEffect(() => {
    if (isSidebarCollapsed) {
      setOpenedSubmenu(""); // Collapse all submenus when sidebar is collapsed
    }
  }, [isSidebarCollapsed]);

  return (
    <div
      className={`h-screen overflow-y-auto bg-blue-700 text-white flex flex-col p-2 shadow-xl ${
        isSidebarCollapsed ? "collapsed overflow-x-hidden" : ""
      }`}
      style={{
        width: isSidebarCollapsed ? "4.5rem" : "16.5rem",
      }}
    >
      <div
        className={`flex items-center p-2 ${
          isSidebarCollapsed ? "justify-center" : "justify-between"
        }`}
      >
        <button onClick={toggleSidebar}>
          <MenuOutlinedIcon />
        </button>
      </div>
      {!isSidebarCollapsed && (
        <>
          <div className="flex justify-center mb-2">
            <img
              src={schoolLogo}
              alt="School Logo"
              style={{ width: "100px", height: "100px" }}
            />
          </div>
          <div className="text-center mb-6 text-white">
            <h5 className="text-sm font-semibold">
              Don Juan Dela Cruz Central Elementary School
            </h5>
          </div>
        </>
      )}

      <List>
        {itemsToDisplay.map((item) =>
          item.type === "link" ? (
            <SidebarLink
              key={item.to}
              to={item.to}
              primary={item.primary}
              icon={item.icon}
              isSidebarCollapsed={isSidebarCollapsed}
              onClick={() => {
                if (item.primary === "Logout") {
                  handleLogout();
                } else {
                  toggleSubmenu(item.primary);
                  if (item.onClick) item.onClick();
                }
              }}
            />
          ) : (
            <SidebarSubmenu
              key={item.primary}
              primary={item.primary}
              icon={item.icon}
              submenuLinks={item.submenuLinks}
              isOpened={openedSubmenu === item.primary}
              toggleSubmenu={toggleSubmenu}
              isSidebarCollapsed={isSidebarCollapsed}
            />
          )
        )}
      </List>
    </div>
  );
}

export default Sidebar;
