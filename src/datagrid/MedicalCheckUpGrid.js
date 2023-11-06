import React, { useState, useEffect, useCallback } from "react";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import ReportIcon from "@mui/icons-material/Description";
import MedicalCheckupForm from "../modal/MedicalStudentForm";
import axiosInstance from "../config/axios-instance";

const MedicalCheckUpGrid = () => {
  const [medicalCheckups, setMedicalCheckups] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [recordIdToDelete, setRecordIdToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleDialogOpen = (checkupId) => {
    setRecordIdToDelete(checkupId);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setRecordIdToDelete(null);
    setDialogOpen(false);
  };

  const formatYearFromDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Add leading zero if needed
    const day = String(date.getDate()).padStart(2, "0"); // Add leading zero if needed
    return `${year}-${month}-${day}`;
  };

  const transformRecord = (checkup = {}) => {
    let {
      classEnrollment: {
        student = {},
        academicYear = {},
        classProfile = {},
      } = {},
      nutritionalStatus = {},
    } = checkup;

    if (!nutritionalStatus) {
      nutritionalStatus = {};
    }

    const name =
      student.firstName || student.lastName
        ? `${student.lastName || ""}, ${student.firstName || ""}${
            student.middleName ? ` ${student.middleName.charAt(0)}.` : ""
          } ${student.nameExtension || ""}`.trim()
        : "N/A";

    return {
      id: checkup._id,
      lrn: student.lrn || "N/A",
      name,
      age: student.age || "N/A",
      gender: student.gender || "N/A",
      birthDate: student.birthDate || "N/A",
      address: student.address || "N/A",
      grade: classProfile.grade || "N/A",
      section: classProfile.section || "N/A",
      schoolYear: academicYear.schoolYear || "N/A",
      heightCm: nutritionalStatus.heightCm || "N/A",
      weightKg: nutritionalStatus.weightKg || "N/A",
      BMI: nutritionalStatus.BMI || "N/A",
      BMIClassification: nutritionalStatus.BMIClassification || "N/A",
      heightForAge: nutritionalStatus.heightForAge || "N/A",
      beneficiaryOfSBFP: nutritionalStatus.beneficiaryOfSBFP || "N/A",
      ironSupplementation: checkup.ironSupplementation,
      dateOfExamination: checkup.dateOfExamination,
      deworming: checkup.deworming,
      pulseRate: checkup.pulseRate,
      respiratoryRate: checkup.respiratoryRate,
      visionScreeningLeft: checkup.visionScreeningLeft,
      visionScreeningRight: checkup.visionScreeningRight,
      auditoryScreeningLeft: checkup.auditoryScreeningLeft,
      auditoryScreeningRight: checkup.auditoryScreeningRight,
      scalpScreening: checkup.scalpScreening,
      skinScreening: checkup.skinScreening,
      eyesScreening: checkup.eyesScreening,
      earScreening: checkup.earScreening,
      noseScreening: checkup.noseScreening,
      mouthScreening: checkup.mouthScreening,
      neckScreening: checkup.neckScreening,
      throatScreening: checkup.throatScreening,
      lungScreening: checkup.lungScreening,
      heartScreening: checkup.heartScreening,
      abdomen: checkup.abdomen,
      deformities: checkup.deformities,
      menarche: checkup.menarche,
      temperature: checkup.temperature,
      bloodPressure: checkup.bloodPressure,
      heartRate: checkup.heartRate,
      remarks: checkup.remarks,
    };
  };

  const fetchMedicalCheckups = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("medicalCheckup/fetch");
      const updatedCheckups = response.data.map(transformRecord);
      setMedicalCheckups(updatedCheckups);
    } catch (error) {
      console.error(
        "An error occurred while fetching medical checkups:",
        error
      );
      setIsLoading(false);
    } finally {
      setIsLoading(false); // This ensures loading is set to false regardless of try or catch outcomes.
    }
  }, []);

  useEffect(() => {
    fetchMedicalCheckups();
  }, [fetchMedicalCheckups]);

  const addNewMedicalCheckup = (newCheckup) => {
    setMedicalCheckups((prevCheckups) => [...prevCheckups, newCheckup]);
  };

  const columns = [
    {
      field: "dateOfExamination",
      headerName: "Examination Date",
      width: 125,
      valueGetter: (params) => formatYearFromDate(params.row.dateOfExamination),
    },
    { field: "lrn", headerName: "LRN", width: 150 },
    { field: "age", headerName: "Age", width: 100 },
    { field: "gender", headerName: "Gender", width: 100 },
    { field: "section", headerName: "Section", width: 100 },
    { field: "schoolYear", headerName: "S.Y", width: 100 },
    { field: "temperature", headerName: "Temp (°C)", width: 100 },
    { field: "bloodPressure", headerName: "BP mmHg", width: 100 },
    { field: "heartRate", headerName: "Heart Rate", width: 100 },
    { field: "heightCm", headerName: "Height (cm)", width: 100 },
    { field: "weightKg", headerName: "Weight (kg)", width: 100 },
    { field: "BMIClassification", headerName: "Classification", width: 100 },
    {
      field: "ironSupplementation",
      headerName: "Iron Supp.",
      width: 100,
      valueGetter: (params) => (params.row.ironSupplementation ? "Yes" : "No"),
    },
    {
      field: "deworming",
      headerName: "Deworming",
      width: 100,
      valueGetter: (params) => (params.row.deworming ? "Yes" : "No"),
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

  const handleEditRecord = (checkupId) => {
    const medicalToEdit = medicalCheckups.find(
      (medicalCheckup) => medicalCheckup.id === checkupId
    );
    setSelectedRecord(medicalToEdit);
    setFormOpen(true);
  };

  const updatedMedicalCheckup = (updatedCheckup) => {
    setMedicalCheckups((prevCheckups) =>
      prevCheckups.map((checkup) =>
        checkup.id === updatedCheckup.id ? updatedCheckup : checkup
      )
    );
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`medicalCheckup/delete/${recordIdToDelete}`);

      // Update the state to filter out the deleted record
      const updatedRecords = medicalCheckups.filter(
        (checkup) => checkup.id !== recordIdToDelete
      );
      setMedicalCheckups(updatedRecords);
    } catch (error) {
      console.error("Error deleting the record:", error.message);
    }
    handleDialogClose();
  };

  const FilteredMedicalCheckups = medicalCheckups.filter((checkup) =>
    Object.keys(checkup).some((key) => {
      const value = checkup[key]?.toString().toLowerCase();
      return value?.includes(searchValue.toLowerCase());
    })
  );

  const handleModalOpen = () => {
    setFormOpen(true);
  };

  const handleModalClose = () => {
    setFormOpen(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="w-full max-w-screen-xl mx-auto px-8">
        <div className="mb-4 flex justify-between items-center">
          <div>
            <Button variant="contained" color="secondary">
              <ReportIcon /> Generate Report
            </Button>
          </div>
          <div className="flex items-center">
            <div className="ml-2">
              <Button
                variant="contained"
                color="primary"
                onClick={handleModalOpen}
              >
                Add Patients
              </Button>
            </div>
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
        </div>
        <DataGrid
          rows={FilteredMedicalCheckups}
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
        <MedicalCheckupForm
          open={formOpen}
          isEditing={!!selectedRecord}
          addNewMedicalCheckup={addNewMedicalCheckup}
          selectedRecord={selectedRecord}
          onCheckupUpdate={updatedMedicalCheckup}
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

export default MedicalCheckUpGrid;
