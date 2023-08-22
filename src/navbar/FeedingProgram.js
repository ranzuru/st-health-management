import React from 'react';
import Sidebar from '../Sidebar';
import FeedingGrid from '../datagrid/FeedingGrid.js';

const FeedingProgram = () => {
  return (
    <div className="w-full flex">
    <div className="flex">
      <Sidebar />
      </div>
      <div className="flex-grow overflow-hidden">
      <div className="bg-black h-24">
          <h1 className="text-4xl font-bold text-white py-6 pl-4">Clinic Program - Feeding Eligibility</h1>
      </div>

        <div className="flex flex-col items-center justify-center h-full -mt-16 p-4">
          <FeedingGrid />
        </div>
      </div>
    </div>
  );
};

export default FeedingProgram;
