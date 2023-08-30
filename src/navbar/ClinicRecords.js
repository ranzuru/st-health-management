import React from 'react';
import ClinicRecordsGrid from '../datagrid/ClinicRecordsGrid.js';
import { Typography } from '@mui/material';

const ClinicRecords = () => {
  return (
    <div className="flex flex-col">
      <div className="flex-grow overflow-hidden">
      <div className="bg-black h-24 flex items-center">
        <Typography variant="h1" sx={{ 
          fontSize: { xs: '2rem', sm: '2rem', md: '2.25rem' }, 
          fontWeight: 'bold', color: 'white', py: { xs: 3, md: 6 }, pl: 2 }}>
         Clinic Records
        </Typography>
        </div>

        <div className="flex flex-col items-center justify-center h-full p-4">
          <div className="flex items-center justify-center">
            <ClinicRecordsGrid />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicRecords;