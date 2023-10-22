import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Button from "@mui/material/Button";
import ReportIcon from "@mui/icons-material/Description";
import axiosInstance from "../config/axios-instance";

const DewormingGrid = () => {
  const [aggregateData, setAggregateData] = useState([]);

  useEffect(() => {
    const fetchAggregateData = async () => {
      try {
        const response = await axiosInstance.get(
          "dewormingReport/dewormingReportCount"
        );
        setAggregateData(response.data);
      } catch (error) {
        console.error("Error fetching aggregate data:", error);
      }
    };

    fetchAggregateData();
  }, []);

  const aggregateColumns = [
    { field: "_id", headerName: "Grade Level", width: 150 },
    { field: "male4P", headerName: "Male 4P's", width: 150 },
    { field: "female4P", headerName: "Female 4P's", width: 150 },
    { field: "maleNon4P", headerName: "Male Non-4P's", width: 150 },
    { field: "femaleNon4P", headerName: "Female Non-4P's", width: 150 },
    {
      field: "total",
      headerName: "Total",
      width: 150,
      valueGetter: (params) =>
        params.row.male4P +
        params.row.female4P +
        params.row.maleNon4P +
        params.row.femaleNon4P,
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <div>
          <IconButton onClick={() => handleAction(params.row._id)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row._id)}>
            <DeleteOutlineIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  const handleAction = (userId) => {
    // Implement your action logic here
    console.log(`Edit user with ID: ${userId}`);
  };

  const handleDelete = (userId) => {
    // Implement your delete logic here
    console.log(`Delete user with ID: ${userId}`);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="w-full max-w-screen-xl mx-auto px-4">
        <div className="mb-4 flex justify-between items-center">
          <div>
            <Button variant="contained" color="secondary">
              <ReportIcon /> Generate Report
            </Button>
          </div>
          <div className="flex items-center"></div>
        </div>
        <DataGrid
          rows={aggregateData}
          columns={aggregateColumns}
          getRowId={(row) => row._id}
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
          style={{ height: 500 }}
        />
      </div>
    </div>
  );
};

export default DewormingGrid;
