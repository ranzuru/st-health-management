import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { List, ListItem, ListItemIcon, ListItemText, Collapse, Divider } from '@mui/material';
import { DashboardOutlined, ManageAccountsOutlined, Person2Outlined, SupervisorAccountOutlined, SpaOutlined, AssignmentIndOutlined, MedicalServicesOutlined, EventOutlined, AutoGraphOutlined, ReceiptLongOutlined, SettingsOutlined, ExitToAppOutlined, ExpandLess, ExpandMore } from '@mui/icons-material';

import schoolLogo from './Data/DonjuanTransparent.png';


const Sidebar = () => {
  const [activeSubmenu, setActiveSubmenu] = useState('');
  const location = useLocation();

  const handleSubmenuClick = (submenuName) => {
    setActiveSubmenu((prevActiveSubmenu) =>
    prevActiveSubmenu === submenuName ? '' : submenuName
  );
};

  const isSubmenuOpen = (submenuName) => {
    return activeSubmenu === submenuName;
  };

  const isActive = (path) => {
    if (activeSubmenu === 'Dengue Monitoring') {
      return location.pathname.startsWith('/dengue-monitoring');
    } else {
      return location.pathname === path;
    }
  };

  return (
    <div className="bg-black text-gray-300 flex flex-col w-60 p-4" style={{ minHeight: '100vh' }}>
      <div className="flex justify-center mb-2">
          <img src={schoolLogo} alt="School Logo" style={{ width: '100px', height: '100px' }} />
      </div>
      <div className="text-center mb-6 text-white">
        <h5 className="text-sm font-semibold">Don Juan Dela Cruz Central Elementary School</h5>
      </div>
      <Divider />
      <List className='flex-grow'>
        <ListItem button component={Link} to="/dashboard" sx={{
            backgroundColor: isActive('/dashboard') ? '#343541' : 'transparent',
            color: isActive('/dashboard') ? '#FEFEFE' : 'gray-300',
            '&:hover': { backgroundColor: '#2A2B32', borderRadius: '0.5rem', color: '#FEFEFE'},
            borderRadius: isActive('/dashboard') ? '0.5rem' : '0',
          }}> {/*Other option for color in hover #3A3B3D or #282828 */}
          <ListItemIcon>
            <DashboardOutlined style={{ color: isActive('/dashboard') ? 'white' : '#E0E0E0' }}/>
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} to="/manage-users" sx={{
            backgroundColor: isActive('/manage-users') ? '#343541' : 'transparent',
            color: isActive('/manage-users') ? '#FEFEFE' : 'gray-300',
            '&:hover': { backgroundColor: '#2A2B32', borderRadius: '0.5rem', color: '#FEFEFE'},
            borderRadius: isActive('/manage-users') ? '0.5rem' : '0',
          }}>
          <ListItemIcon>
            <ManageAccountsOutlined style={{ color: isActive('/manage-users') ? 'white' : '#E0E0E0' }}/>
          </ListItemIcon>
          <ListItemText primary="Manage Users" />
        </ListItem>
        <ListItem button component={Link} to="/students-profile" sx={{
            backgroundColor: isActive('/students-profile') ? '#343541' : 'transparent',
            color: isActive('/students-profile') ? '#FEFEFE' : 'gray-300',
            '&:hover': { backgroundColor: '#2A2B32', borderRadius: '0.5rem', color: '#FEFEFE'},
            borderRadius: isActive('/students/profile') ? '0.5rem' : '0',
          }}>
          <ListItemIcon>
            <Person2Outlined style={{ color: isActive('/students-profile') ? 'white' : '#E0E0E0' }} />
          </ListItemIcon>
          <ListItemText primary="Students Profile" />
        </ListItem>
        <ListItem button component={Link} to="/faculty-profile" sx={{
            backgroundColor: isActive('/faculty-profile') ? '#343541' : 'transparent',
            color: isActive('/faculty-profile') ? '#FEFEFE' : 'gray-300',
            '&:hover': { backgroundColor: '#2A2B32', borderRadius: '0.5rem', color: '#FEFEFE'},
            borderRadius: isActive('/faculty-profile') ? '0.5rem' : '0',
          }}>
          <ListItemIcon>
            <SupervisorAccountOutlined style={{ color: isActive('/faculty-profile') ? 'white' : '#E0E0E0' }} />
          </ListItemIcon>
          <ListItemText primary="Faculty Profile" />
        </ListItem>
        <ListItem button onClick={() => handleSubmenuClick('clinicProgram')} sx={{
            backgroundColor: isActive('/clinic-programs') ? '#343541' : 'transparent',
            color: isActive('/clinic-programs') ? '#FEFEFE' : 'gray-300',
            '&:hover': { backgroundColor: '#2A2B32', borderRadius: '0.5rem', color: '#FEFEFE'},
            borderRadius: isActive('/clinic-programs') ? '0.5rem' : '0',
          }}>
          <ListItemIcon>
            <SpaOutlined style={{ color: isActive('/clinic-programs') ? 'white' : '#E0E0E0' }}/>
          </ListItemIcon>
          <ListItemText primary="Clinic Programs"/>
          {activeSubmenu === 'clinicProgram' ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={isSubmenuOpen('clinicProgram')} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button component={Link} to="/dengue-monitoring" className="pl-8" sx={{
            backgroundColor: isActive('/dengue-monitoring') ? '#343541' : 'transparent',
            color: isActive('/dengue-monitoring') ? '#FEFEFE' : 'gray-300',
            '&:hover': { backgroundColor: '#2A2B32', borderRadius: '0.5rem', color: '#FEFEFE'},
            borderRadius: isActive('/dengue-monitoring') ? '0.5rem' : '0',
          }}>
              <ListItemText primary="Dengue Monitoring" />
            </ListItem>
            <ListItem button component={Link} to="/immunization" className="pl-8" sx={{
            backgroundColor: isActive('/immunization') ? '#343541' : 'transparent',
            color: isActive('/immunization') ? '#FEFEFE' : 'gray-300',
            '&:hover': { backgroundColor: '#2A2B32', borderRadius: '0.5rem', color: '#FEFEFE'},
            borderRadius: isActive('/immunization') ? '0.5rem' : '0',
          }}>
              <ListItemText primary="Immunization" />
            </ListItem>
            <ListItem button component={Link} to="/medical-checkup" className="pl-8" sx={{
            backgroundColor: isActive('/medical-checkup') ? '#343541' : 'transparent',
            color: isActive('/medical-checkup') ? '#FEFEFE' : 'gray-300',
            '&:hover': { backgroundColor: '#2A2B32', borderRadius: '0.5rem', color: '#FEFEFE'},
            borderRadius: isActive('/medical-checkup') ? '0.5rem' : '0',
          }}>
              <ListItemText primary="Medical Checkup" />
            </ListItem>
            <ListItem button component={Link} to="/faculty-checkup" className="pl-8" sx={{
            backgroundColor: isActive('/faculty-checkup') ? '#343541' : 'transparent',
            color: isActive('/faculty-checkup') ? '#FEFEFE' : 'gray-300',
            '&:hover': { backgroundColor: '#2A2B32', borderRadius: '0.5rem', color: '#FEFEFE'},
            borderRadius: isActive('/faculty-checkup') ? '0.5rem' : '0',
          }}>
              <ListItemText primary="Faculty Checkup" />
            </ListItem>
            <ListItem button component={Link} to="/deworming-monitoring" className="pl-8" sx={{
            backgroundColor: isActive('/deworming-monitoring') ? '#343541' : 'transparent',
            color: isActive('/deworming-monitoring') ? '#FEFEFE' : 'gray-300',
            '&:hover': { backgroundColor: '#2A2B32', borderRadius: '0.5rem', color: '#FEFEFE'},
            borderRadius: isActive('/deworming-monitoring') ? '0.5rem' : '0',
          }}>
              <ListItemText primary="Deworming Monitoring" />
            </ListItem>
            <ListItem button component={Link} to="/feeding-program" className="pl-8" sx={{
            backgroundColor: isActive('/feeding-program') ? '#343541' : 'transparent',
            color: isActive('/feeding-program') ? '#FEFEFE' : 'gray-300',
            '&:hover': { backgroundColor: '#2A2B32', borderRadius: '0.5rem', color: '#FEFEFE'},
            borderRadius: isActive('/feeding-program') ? '0.5rem' : '0',
          }}>
              <ListItemText primary="Feeding Program" />
            </ListItem>
          </List>
        </Collapse>
        <ListItem button component={Link} to="/clinic-records"sx={{
            backgroundColor: isActive('/clinic-records') ? '#343541' : 'transparent',
            color: isActive('/clinic-records') ? '#FEFEFE' : 'gray-300',
            '&:hover': { backgroundColor: '#2A2B32', borderRadius: '0.5rem', color: '#FEFEFE'},
            borderRadius: isActive('/clinic-records') ? '0.5rem' : '0',
          }}>
          <ListItemIcon>
            <AssignmentIndOutlined style={{ color: isActive('/clinic-records') ? 'white' : '#E0E0E0' }} />
          </ListItemIcon>
          <ListItemText primary="Clinic Records" />
        </ListItem>
        <ListItem button component={Link} to="/medicine-inventory" sx={{
            backgroundColor: isActive('/medicine-inventory') ? '#343541' : 'transparent',
            color: isActive('/medicine-inventory') ? '#FEFEFE' : 'gray-300',
            '&:hover': { backgroundColor: '#2A2B32', borderRadius: '0.5rem', color: '#FEFEFE'},
            borderRadius: isActive('/medicine-inventory') ? '0.5rem' : '0',
          }}>
          <ListItemIcon>
            <MedicalServicesOutlined style={{ color: isActive('/medicine-inventory') ? 'white' : '#E0E0E0' }}/>
          </ListItemIcon>
          <ListItemText primary="Medicine Inventory" />
        </ListItem>
        <ListItem button component={Link} to="/events" sx={{
            backgroundColor: isActive('/events') ? '#343541' : 'transparent',
            color: isActive('/events') ? '#FEFEFE' : 'gray-300',
            '&:hover': { backgroundColor: '#2A2B32', borderRadius: '0.5rem', color: '#FEFEFE'},
            borderRadius: isActive('/events') ? '0.5rem' : '0',
          }}>
          <ListItemIcon>
            <EventOutlined style={{ color: isActive('/events') ? 'white' : '#E0E0E0' }}/>
          </ListItemIcon>
          <ListItemText primary="Events" />
        </ListItem>
        <ListItem button component={Link} to="/analytics" sx={{
            backgroundColor: isActive('/analytics') ? '#343541' : 'transparent',
            color: isActive('/analytics') ? '#FEFEFE' : 'gray-300',
            '&:hover': { backgroundColor: '#2A2B32', borderRadius: '0.5rem', color: '#FEFEFE'},
            borderRadius: isActive('/analytics') ? '0.5rem' : '0',
          }}>
          <ListItemIcon>
            <AutoGraphOutlined style={{ color: isActive('/analytics') ? 'white' : '#E0E0E0' }}/>
          </ListItemIcon>
          <ListItemText primary="Analytics" />
        </ListItem>
        <ListItem button component={Link} to="/logs" sx={{
            backgroundColor: isActive('/logs') ? '#343541' : 'transparent',
            color: isActive('/logs') ? '#FEFEFE' : 'gray-300',
            '&:hover': { backgroundColor: '#2A2B32', borderRadius: '0.5rem', color: '#FEFEFE'},
            borderRadius: isActive('/logs') ? '0.5rem' : '0',
          }}>
          <ListItemIcon>
            <ReceiptLongOutlined style={{ color: isActive('/logs') ? 'white' : '#E0E0E0' }}/>
          </ListItemIcon>
          <ListItemText primary="Logs" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button component={Link} to="/settings" sx={{
            backgroundColor: isActive('/settings') ? '#343541' : 'transparent',
            color: isActive('/settings') ? '#FEFEFE' : 'gray-300',
            '&:hover': { backgroundColor: '#2A2B32', borderRadius: '0.5rem', color: '#FEFEFE'},
            borderRadius: isActive('/settings') ? '0.5rem' : '0',
          }}>
          <ListItemIcon>
            <SettingsOutlined style={{ color: isActive('/settings') ? 'white' : '#E0E0E0' }}/>
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
        <ListItem button component={Link} to="/logout" sx={{
            backgroundColor: isActive('/logout') ? '#343541' : 'transparent',
            color: isActive('/logout') ? '#FEFEFE' : 'gray-300',
            '&:hover': { backgroundColor: '#2A2B32', borderRadius: '0.5rem', color: '#FEFEFE'},
            borderRadius: isActive('/logout') ? '0.5rem' : '0',
          }}>
          <ListItemIcon>
            <ExitToAppOutlined style={{ color: isActive('/logout') ? 'white' : '#E0E0E0' }}/>
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </div>
  );
};

export default Sidebar;
