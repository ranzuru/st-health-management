import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem'; 

const ManageUserModal = ({ isOpen, onClose, onAddUser }) => {

  const [newUserData, setNewUserData] = useState({
    user_id: '',
    name: '',
    email: '',
    mobile: '',
    role: '',
    status: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddUser = () => {
    // Call a function to handle adding the new user with the data in newUserData
    // For example: onAddUser(newUserData);
    // Then reset the form and close the modal
    setNewUserData({
      user_id: '',
      name: '',
      email: '',
      mobile: '',
      role: '',
      status: '',
    });
    onClose();
  };

  return (
    <Modal 
    open={isOpen} 
    onClose={onClose}
    className="flex items-center justify-center"
    >
      <div className="bg-white p-4 rounded-md w-full md:w-96">
        <form className="space-y-4">
        <p className="mb-4 text-4xl font-bold">Add User</p>
          <TextField
            label="User ID"
            variant="outlined"
            name="user_id"
            value={newUserData.user_id}
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
            label="Email"
            variant="outlined"
            name="email"
            value={newUserData.email}
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
          />
          <TextField
            label="Role"
            variant="outlined"
            name="role"
            value={newUserData.role}
            onChange={handleInputChange}
            fullWidth
            required
          />
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
        <Button variant="outlined" onClick={onClose} className="w-full md:w-auto">
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

export default ManageUserModal;
