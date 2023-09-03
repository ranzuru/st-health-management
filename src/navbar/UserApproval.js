import React from 'react';
import { Typography } from '@mui/material';

const UserApproval = () => {
  return (
    <div className='flex flex-col'>
     <div className="bg-black h-24 flex items-center">
        <Typography variant="h1" sx={{ 
          fontSize: { xs: '2rem', sm: '2rem', md: '2.25rem' }, 
          fontWeight: 'bold', color: 'white', py: { xs: 3, md: 6 }, pl: 2 }}>
          User Approval
        </Typography>
        </div>
    </div>
  );
};

export default UserApproval;