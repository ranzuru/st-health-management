import React from 'react';
import Sidebar from '../Sidebar';

const Analytics = () => {
  return (
    <div className='flex'>
      <Sidebar/>

      <div className="flex-grow p-4">
        <h1>Analytics</h1>
        <p>This is a temporary component for analytics.</p>
        <p>You can add user management functionality here.</p>
      </div>
    </div>
  );
};

export default Analytics;
