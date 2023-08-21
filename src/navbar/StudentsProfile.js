import React from 'react';
import Sidebar from '../Sidebar';
import StudentsProfileGrid from '../datagrid/StudentProfileGrid.js';

const StudentsProfile = () => {
  return (
    <div className="w-full flex">
      <Sidebar />

      <div className="flex-grow overflow-hidden">
      <div className="bg-black h-24">
          <h1 className="text-4xl font-bold text-white py-6 pl-4">Student Profile</h1>
      </div>

        <div className="flex flex-col items-center justify-center h-full -mt-16 p-4">
          <StudentsProfileGrid />
        </div>
      </div>
    </div>
  );
};

export default StudentsProfile;
