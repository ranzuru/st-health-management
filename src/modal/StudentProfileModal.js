import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';

const StudentProfileModal = ({ isOpen, onClose, onAddUser }) => {

  const [newUserData, setNewUserData] = useState({
    stud_id: '',
    name: '',
    mobile: '',
    section: '',
    grade: '',
    gender: '',
    status: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    
    if (name === 'mobile') {
      // Remove non-numeric characters
      const numericValue = value.replace(/\D/g, '');

      // Ensure the length doesn't exceed 12 (including '+63' prefix)
      if (numericValue.length <= 10) {
        setNewUserData((prevData) => ({
          ...prevData,
          [name]: numericValue,
        }));
      }
    } else {
      // For other fields, directly update the state
      setNewUserData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };


  const handleAddUser = () => {
    // Call a function to handle adding the new user with the data in newUserData
    // For example: onAddUser(newUserData);
    // Then reset the form and close the modal
    setNewUserData({
      stud_id: '',
      name: '',
      mobile: '',
      section: '',
      grade: '',
      gender: '',
      status: '',
    });
    onClose();
  };

  const handleClose = () => {
    setNewUserData({
      stud_id: '',
      name: '',
      mobile: '',
      section: '',
      grade: '',
      gender: '',
      status: '',
    });
    onClose();
  };

  return (
    <Modal 
    open={isOpen} 
    onClose={handleClose}
    className="flex items-center justify-center"
    >
      <div className="bg-white p-4 rounded-md w-full md:w-96">
        <form className="space-y-4">
        <p className="mb-4 text-4xl font-bold">Add Student</p>
          <TextField
            label="Stud ID"
            variant="outlined"
            name="stud_id"
            value={newUserData.stud_id}
            onChange={handleInputChange}
            fullWidth
            required
          />
          <TextField
            label="Name"
            variant="outlined"
            name="name"
            value={newUserData.name}
            onChange={handleInputChange}
            fullWidth
            required
          />
          <TextField
            label="Mobile Number"
            variant="outlined"
            name="mobile"
            value={newUserData.mobile}
            onChange={handleInputChange}
            fullWidth
            required
            InputProps={{
                startAdornment: <InputAdornment position="start">+63</InputAdornment>,
              }}
          />
          <FormControl fullWidth variant="outlined">
            <InputLabel>Section</InputLabel>
            <Select
              name="section"
              value={newUserData.section}
              onChange={handleInputChange}
              label="Section"
            >
              <MenuItem value="Mabait">Mabait</MenuItem>
              <MenuItem value="Masunurin">Masunurin</MenuItem>
              <MenuItem value="Magalang">Magalang</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Grade Level</InputLabel>
            <Select
              name="grade"
              value={newUserData.grade}
              onChange={handleInputChange}
              label="Grade Level"
            >
              <MenuItem value="Kinder">Kinder</MenuItem>
              <MenuItem value="1">1</MenuItem>
              <MenuItem value="2">2</MenuItem>
              <MenuItem value="3">3</MenuItem>
              <MenuItem value="4">4</MenuItem>
              <MenuItem value="5">5</MenuItem>
              <MenuItem value="6">6</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Gender</InputLabel>
            <Select
              name="gender"
              value={newUserData.gender}
              onChange={handleInputChange}
              label="Gender"
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </Select>
          </FormControl>
         <FormControl fullWidth variant="outlined">
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={newUserData.status}
              onChange={handleInputChange}
              label="Status"
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
          <div className="mt-4 space-x-2">
        <Button variant="outlined" onClick={handleClose} className="w-full md:w-auto">
        Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleAddUser} className="w-full md:w-auto">
         Add User
        </Button>
         </div>
        </form>
        </div>
    </Modal>
  );
};

export default StudentProfileModal;
