import React from 'react';
import Sidebar from './Sidebar';

const Dashboard = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-grow p-4">
        <h1>Welcome to the Dashboard!</h1>
        <p>This is a simple dashboard with placeholder content.</p>
        <p>You can add various widgets, charts, and data displays here.</p>
      </div>
    </div>
  );
};

export default Dashboard;