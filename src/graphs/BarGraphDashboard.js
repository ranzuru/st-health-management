import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const BarGraphDashboard = () => {
  const [selectedGender, setSelectedGender] = useState('all'); // Default value: 'all'

  // Replace this with your actual data
  const data = [
    { name: 'Jan', boys: 56, girls: 43 },
    { name: 'Feb', boys: 43, girls: 32 },
    { name: 'Mar', boys: 65, girls: 54 },
    { name: 'Apr', boys: 42, girls: 53 },
    { name: 'May', boys: 61, girls: 54 },
    { name: 'Jun', boys: 0, girls: 0 },
    { name: 'Jul', boys: 0, girls: 0 },
    { name: 'Aug', boys: 34, girls: 31 },
    { name: 'Sept', boys: 42, girls: 32 },
    { name: 'Oct', boys: 51, girls: 47 },
    { name: 'Nov', boys: 37, girls: 32 },
    { name: 'Dec', boys: 39, girls: 28 },
    // ... and so on
  ];

  const filteredData = data.map(entry => {
    const uvPropertyName = selectedGender === 'all' ? 'total' : selectedGender;
    return {
      name: entry.name,
      [uvPropertyName]: selectedGender === 'all' ? entry.boys + entry.girls : entry[selectedGender]
    };
  });

  return (
    <div className="flex flex-col justify-between">
      {/* Dropdown menu */}
      <div className="mt-2 mr-16 self-end">
      <FormControl variant="outlined" className="w-36">
        <InputLabel id="gender-label">Gender</InputLabel>
        <Select
          labelId="gender-label"
          id="gender-select"
          value={selectedGender}
          onChange={(e) => setSelectedGender(e.target.value)}
          label="Gender"
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="boys">Boys</MenuItem>
          <MenuItem value="girls">Girls</MenuItem>
        </Select>
      </FormControl>
      </div>

      {/* Bar chart */}
      <div className="flex-grow">
      <BarChart width={830} height={300} data={filteredData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey={selectedGender === 'all' ? 'total' : selectedGender} fill="#2272BB" />
      </BarChart>
      </div>
    </div>
  );
};

export default BarGraphDashboard;
