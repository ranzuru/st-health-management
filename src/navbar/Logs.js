import React from 'react';
import Sidebar from '../Sidebar';
import LogsGrid from '../datagrid/LogsGrid.js';

const Logs = () => {
  return (
    <div className="w-full flex">
    <div className="flex">
      <Sidebar />
      </div>
      <div className="flex-grow overflow-hidden">
      <div className="bg-black h-24">
          <h1 className="text-4xl font-bold text-white py-6 pl-4">Logs</h1>
      </div>

        <div className="flex flex-col items-center justify-center h-full -mt-16 p-4">
          <LogsGrid />
        </div>
      </div>
    </div>
  );
};

export default Logs;