import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const MedicineInventoryGrid = () => {

  const [searchValue, setSearchValue] = useState('');
  
  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const medicine = [
    {
      id: 1,
      med_id: 1,
      med_product: 'Biogesic',
      med_category: 'Paracetamol',
      med_quantity: '150',
      med_stock_lvl: 'High',
      med_exp_date: '8/22/2024',
      med_last_restock_timestamp: '8/22/2023',
      med_note: 'Box number: L432AN3CC',
    }
    // ... more user data
  ];

  const columns = [
    { field: 'med_id', headerName: 'ID', width: 100 },
    { field: 'med_product', headerName: 'Product', width: 150 },
    { field: 'med_category', headerName: 'Category', width: 150 },
    { field: 'med_quantity', headerName: 'Quantity', width: 100 },
    {
      field: 'med_stock_lvl',
      headerName: 'Stock Level',
      width: 150,
      renderCell: (params) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: params.value === 'High' ? 'green' : 'red',
              marginRight: 5,
            }}
          />
          {params.value}
        </div>
      ),
    },
    { field: 'med_exp_date', headerName: 'Expiration \nDate', width: 150 },
    { field: 'med_last_restock_timestamp', headerName: 'Last Restock Date', width: 150 },
    { field: 'med_note', headerName: 'Note', width: 150 },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      renderCell: (params) => (
        <div>
        <IconButton onClick={() => handleAction(params.row.id)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)}>
            <DeleteOutlineIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  const handleAction = (medicineId) => {
    // Implement your action logic here
    console.log(`Modify medicine information with ID: ${medicineId}`);
  };

  const handleDelete = (medicineId) => {
    // Implement your delete logic here
    console.log(`Delete medicine information with ID: ${medicineId}`);
  };

  const filteredMedicine = medicine.filter(user => 
    user.med_id.toString().includes(searchValue) ||
    user.med_product.toLowerCase().includes(searchValue.toLowerCase()) ||
    user.med_category.toLowerCase().includes(searchValue.toLowerCase()) ||
    user.med_quantity.includes(searchValue) ||
    user.med_stock_lvl.toLowerCase().includes(searchValue.toLowerCase()) ||
    user.med_exp_date.toLowerCase().includes(searchValue.toLowerCase()) ||
    user.med_last_rstk_dte.toLowerCase().includes(searchValue.toLowerCase()) ||
    user.med_note.toLowerCase().includes(searchValue.toLowerCase())
  );
  

  return (
    <div className="flex flex-col h-full">
      <div className="w-full max-w-screen-xl mx-auto px-4">
       <div className="mb-4 flex justify-end items-center">
       <Button variant="contained" color="primary">New Medicine</Button>
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
      rows={filteredMedicine}
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
      />
    </div>
    </div>
  );
};

export default MedicineInventoryGrid;