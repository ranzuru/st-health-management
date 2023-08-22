import React from 'react';
import Sidebar from '../Sidebar';
import ManageUserGrid from '../datagrid/UserGrid.js';


const ManageUsers = () => {
  return (
    <div className="w-full flex">
    <div className="flex">
      <Sidebar />
      </div>
      <div className="flex-grow overflow-hidden">
      <div className="bg-black h-24">
          <h1 className="text-4xl font-bold text-white py-6 pl-4">Manage User</h1>
      </div>

        <div className="flex flex-col items-center justify-center h-full -mt-16 p-4">
          <ManageUserGrid />
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
