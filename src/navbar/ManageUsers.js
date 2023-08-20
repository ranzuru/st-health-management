import React from 'react';
import Sidebar from '../Sidebar';
import ManageUserGrid from '../datagrid/UserGrid.js';

const ManageUsers = () => {
  return (
    <div className="bg-black h-24 w-full">
    <div className='flex'>
      <Sidebar/>

      
      <div className="flex-grow flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-bold mb-4" >Manage User</h1>

        <div className="w-full">
        <ManageUserGrid />
        </div>
       </div>
      </div>
    </div>
  );
};

export default ManageUsers;
