import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import AcademicYearForm from "../modal/AcademicYearForm";
import axiosInstance from "../config/axios-instance";

const AcademicYearGrid = () => {
  const [formOpen, setFormOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [recordIdToDelete, setRecordIdToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [academicYearRecords, setAcademicYearRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const handleDialogOpen = (recordId) => {
    setRecordIdToDelete(recordId);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setRecordIdToDelete(null);
    setDialogOpen(false);
  };

  const mapRecord = (record) => {
    return {
      id: record._id,
      yearFrom: record.yearFrom,
      yearTo: record.yearTo,
      academicYear: `${record.yearFrom}-${record.yearTo}` || "N/A",
      monthFrom: record.monthFrom || "N/A",
      monthTo: record.monthTo || "N/A",
      status: record.status || "N/A",
    };
  };
  useEffect(() => {
    const fetchAcademicYearRecords = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get("academicYear/fetch");
        const updatedRecords = response.data.map(mapRecord);
        setAcademicYearRecords(updatedRecords);
      } catch (error) {
        console.error(
          "An error occurred while fetching medical checkups:",
          error
        );
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAcademicYearRecords();
  }, []);

  const addNewAcademicYear = (newRecord) => {
    const mappedRecord = mapRecord(newRecord);
    setAcademicYearRecords((prevRecords) => [...prevRecords, mappedRecord]);
  };

  const handleEditRecord = (recordId) => {
    const recordToEdit = academicYearRecords.find(
      (academicYearRecord) => academicYearRecord.id === recordId
    );
    setSelectedRecord(recordToEdit);
    setFormOpen(true);
  };

  const updatedAcademicYear = (updatedRecord) => {
    const mappedRecord = mapRecord(updatedRecord);
    setAcademicYearRecords((prevRecords) =>
      prevRecords.map((record) =>
        record.id === mappedRecord.id ? mappedRecord : record
      )
    );
  };

  const columns = [
    { field: "academicYear", headerName: "Academic Year", width: 125 },
    { field: "monthFrom", headerName: "Month From", width: 100 },
    { field: "monthTo", headerName: "Month To", width: 100 },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      renderCell: (params) => {
        let bgColor;
        let textColor;
        let borderColor;
        switch (params.value) {
          case "Active":
            bgColor = "#DFF0D8";
            textColor = "#4CAF50";
            borderColor = "#4CAF50";
            break;
          case "Completed":
            bgColor = "#D9EDF7";
            textColor = "#2196F3";
            borderColor = "#2196F3";
            break;
          case "Planned":
            bgColor = "#FEEBC8";
            textColor = "#FF9800";
            borderColor = "#FF9800";
            break;
          default:
            bgColor = "#E0E0E0";
            textColor = "#333333";
            borderColor = "transparent";
        }

        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "1px 8px",
                borderRadius: 8,
                backgroundColor: bgColor,
                color: textColor,
                fontSize: "12px",
                border: `1px solid ${borderColor}`,
              }}
            >
              {params.value}
            </div>
          </div>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <div>
          <IconButton onClick={() => handleEditRecord(params.row.id)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDialogOpen(params.row.id)}>
            <DeleteOutlineIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`academicYear/delete/${recordIdToDelete}`);

      const updatedRecords = academicYearRecords.filter(
        (record) => record.id !== recordIdToDelete
      );
      setAcademicYearRecords(updatedRecords);
    } catch (error) {
      console.error("Error deleting the record:", error.message);
    }
    handleDialogClose();
  };

  const handleModalOpen = () => {
    setFormOpen(true);
  };

  const handleModalClose = () => {
    setFormOpen(false);
  };

  console.log("Data going into DataGrid:", academicYearRecords);

  return (
    <div className="flex flex-col h-full">
      <div className="w-full max-w-screen-xl mx-auto px-4">
        <div className="mb-4 flex justify-end items-center">
          <div className="ml-2">
            <Button
              variant="contained"
              color="primary"
              onClick={handleModalOpen}
            >
              Add Record
            </Button>
          </div>
        </div>
        <DataGrid
          rows={academicYearRecords}
          columns={columns}
          getRowId={(row) => row.id}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          sx={{
            "& .MuiDataGrid-row:nth-of-type(odd)": {
              backgroundColor: "#f3f4f6",
            },
          }}
          pageSizeOptions={[10]}
          checkboxSelection
          disableRowSelectionOnClick
          loading={isLoading}
          style={{ height: 650 }}
        />
        <AcademicYearForm
          open={formOpen}
          addNewAcademicYear={addNewAcademicYear}
          selectedAcademicYear={selectedRecord}
          onUpdate={updatedAcademicYear}
          onClose={() => {
            setSelectedRecord(null);
            handleModalClose();
          }}
          onCancel={() => {
            setSelectedRecord(null);
            handleModalClose();
          }}
        />
      </div>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Confirm Delete!</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this record?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AcademicYearGrid;
