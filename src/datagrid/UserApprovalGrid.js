import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';


const UserApprovalGrid = () => {

  const [searchValue, setSearchValue] = useState('');
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false); //Dialog for declined
  const [openApproveDialog, setOpenApproveDialog] = useState(false); //Dialog for openApprove
  const [selectedUserId, setSelectedUserId] = useState("");

  
  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const openDeclineDialog = () => {
    setOpenDialog(true);
  };
  
  const closeDialog = () => {
    setOpenDialog(false);
  };

  const openApproveConfirmation = () => {
    setOpenApproveDialog(true);
  };

  const closeApproveConfirmation = () => {
    setOpenApproveDialog(false);
  };

  const formatYearFromDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero if needed
    const day = String(date.getDate()).padStart(2, '0'); // Add leading zero if needed
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    // Fetch user data from your server when the component mounts
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/users/userFetch');
        if (response.ok) {
          const data = await response.json();
          // Map the data to include an 'id' property
          const formattedData = data.map((user) => ({
        ...user,
        id: user.user_id,
      }));
      setUsers(formattedData); // Update the users state with the formatted data
        } else {
          console.error('Error fetching user data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, []); // The empty dependency array ensures the effect runs only once

  const columns = [
    { field: '_id', headerName: 'UserID', width: 100},
    { field: 'name', headerName: 'Name', width: 200},
    { field: 'phoneNumber', headerName: 'Mobile Number', width: 150},
    { field: 'email', headerName: 'Email', width: 250},
    { field: 'gender', headerName: 'Gender', width: 150},
    { field: 'role', headerName: 'Role', width: 150},
    { 
    field: 'createdAt', 
    headerName: 'Date Created', 
    width: 150,
    valueGetter: (params) => formatYearFromDate(params.row.createdAt),
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      renderCell: (params) => (
        <div>
        <IconButton 
          onClick={() => handleAccept(params.row._id)}
          style={{ color: 'green' }}
          >
            <CheckCircleOutlinedIcon />
          </IconButton>
        <IconButton 
          onClick={() => handleDecline(params.row._id)}
          style={{ color: 'red' }}
          >
            <CancelOutlinedIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  const handleConfirmApprove = async () => {
    try {
      // Send a request to your server to update the 'approved' field for the user with the selectedUserId
      const response = await fetch(`http://localhost:8080/users/approveUser/${selectedUserId}`, {
        method: 'PUT',
      });
  
      if (response.ok) {
        // Update the user in the state to mark them as approved
        setUsers((prevUsers) => {
          return prevUsers.map((user) => {
            if (user._id === selectedUserId) {
              return { ...user, approved: true };
            }
            return user;
          });
        });
      } else {
        console.error('Error confirming approval:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
    closeApproveConfirmation();
  };

  const handleConfirmDecline = async () => {
    try {
      // Send a DELETE request to your server to delete the user with the selected '_id'
      const response = await fetch(`http://localhost:8080/users/deleteUser/${selectedUserId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Update the UI by removing the declined user from the list
        const updatedUsers = users.filter((user) => user._id !== selectedUserId);
        setUsers(updatedUsers);
        console.log(`Declined user with ID: ${selectedUserId}`);
      } else {
        console.error('Error declining user:', response.statusText);
      }
    } catch (error) {
      console.error('Error declining user:', error);
    }

    // Close the dialog after the action is complete
    closeDialog();
  };

  const handleDecline = async (_id) => {
      // Set the selected user's _id to the state variable
      setSelectedUserId(_id);
      openDeclineDialog();
    };

    const handleAccept = async (_id) => {
      // Set the selected user's _id to the state variable
      setSelectedUserId(_id);
      openApproveConfirmation();
    };

  const filteredUsers = users.filter((user) => {
    const userId = user._id || '';
    const name = (user.firstName || '') + ' ' + (user.lastName || '');
    const email = user.email || '';
    const mobile = user.phoneNumber || '';
    const role = user.role || '';
  
    const isApproved = user.approved === false;

  return (
    (isApproved && userId.toString().includes(searchValue)) ||
    (isApproved && name.toLowerCase().includes(searchValue.toLowerCase())) ||
    (isApproved && email.toLowerCase().includes(searchValue.toLowerCase())) ||
    (isApproved && mobile.includes(searchValue)) ||
    (isApproved && role.toLowerCase().includes(searchValue.toLowerCase()))
    );
});

  return (
    <div>
    <div className="flex flex-col h-full">
      <div className="w-full max-w-screen-xl mx-auto px-4">
       <div className="mb-4 flex justify-end items-center">
       <div className="ml-2">
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchValue}
          onChange={handleSearchChange}
        />
      </div>
      </div>
      <DataGrid 
      rows={filteredUsers}
      columns={columns}
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: 10,
          },
        },
      }}
      pageSizeOptions={[10]}
      checkboxSelection
      disableRowSelectionOnClick
      getRowId={(row) => row._id}  
      />
    </div>
    </div>
        <Dialog open={openDialog} onClose={closeDialog}>
        <DialogTitle>Confirm Decline</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to decline this user?
            </DialogContentText>
          </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="primary">
            Cancel
          </Button>
        <Button onClick={() => handleConfirmDecline()} color="primary">
            Confirm
        </Button>
      </DialogActions>
          </Dialog>
          <Dialog open={openApproveDialog} onClose={closeApproveConfirmation}>
          <DialogTitle>Confirm Approve</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to approve this user?
            </DialogContentText>
          </DialogContent>
        <DialogActions>
          <Button onClick={closeApproveConfirmation} color="primary">
            Cancel
          </Button>
        <Button onClick={() => handleConfirmApprove()} color="primary">
            Confirm
        </Button>
      </DialogActions>
          </Dialog>
    </div>
  );
};

export default UserApprovalGrid;