import React from 'react';
import UserApprovalGrid from '../datagrid/UserApprovalGrid.js';
import { Typography } from '@mui/material';

const ManageUsers = () => {
  return (
    <div className="flex flex-col">
      <div className="flex-grow">
      <div className="bg-black h-24 flex items-center">
        <Typography variant="h1" sx={{ 
          fontSize: { xs: '2rem', sm: '2rem', md: '2.25rem' }, 
          fontWeight: 'bold', color: 'white', py: { xs: 3, md: 6 }, pl: 2 }}>
          User Approval
        </Typography>
        </div>

        <div className="flex flex-col items-center justify-center h-full p-4">
          <div className="flex items-center justify-center w-full">
            <UserApprovalGrid />
          </div>
        </div>
      </div>
    </div>
  );
};
export default ManageUsers;