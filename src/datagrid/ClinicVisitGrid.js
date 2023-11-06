import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ClinicVisitForm from "../modal/ClinicVisitForm";
import axiosInstance from "../config/axios-instance.js";

const ClinicVisitGrid = () => {
  const [searchValue, setSearchValue] = useState("");
  const [documents, setDocuments] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  

  // Function to handle search input changes
  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  // Function to format date string to YYYY-MM-DD
  const dateFormat = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Add leading zero if needed
    const day = String(date.getDate()).padStart(2, "0"); // Add leading zero if needed
    return `${year}-${month}-${day}`;
  };

  const fetchDocuments = async () => {
    try {
      const response = await axiosInstance.get(
        "clinicVisit/get"
      );
      let adjustedResponse = response.data.map((data) => {

        let patient_id, name;

        if (data.patient_type === "Student") {
          patient_id = data.patient_id.lrn;
          name = `${data.patient_id.lastName}, ${data.patient_id.firstName}`;
        } else if (data.patient_type === "Faculty") {
          patient_id = data.patient_id.employeeId;
          name = `${data.patient_id.lastName}, ${data.patient_id.firstName}`;
        } else if (data.patient_type === "Other") {
          patient_id = "";
          name = data.patient_name;
        }
        
        const medicine = data.MedicineItemData.product;
        const medicine_id = data.medicine_id._id;
        const pcp_id = data.pcp_id.employeeId;
        const pcp = `${data.pcp_id.lastName}, ${data.pcp_id.firstName}`;
        return {
          ...data,
          patient_id: patient_id,
          name: name,
          medicine: medicine,
          pcp: pcp,
          medicine_id: medicine_id,
          pcp_id: pcp_id,
        };
      });
      adjustedResponse = adjustedResponse.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      setDocuments(adjustedResponse);
    } catch (error) {
      console.error("Fetching data error:", error);
    }
  };

  // Fetch medicines when the component mounts
  useEffect(() => {
    fetchDocuments();
  }, []);

  // Function to update state after a medicine item is updated
  const onDocumentUpdate = (updatedDocument) => {
    const pcp = updatedDocument.pcp_id 
      ? `${updatedDocument.pcp_id.lastName}, ${updatedDocument.pcp_id.firstName}` 
      : "";
    const name = updatedDocument.patient_id 
      ? `${updatedDocument.pcp_id.lastName}, ${updatedDocument.pcp_id.firstName}` 
     : "";

    const updatedDocuments = documents.map((document) =>
      document._id === updatedDocument._id ? {
        ...updatedDocument,
        pcp: pcp,
        name: name
      } : document
    );
    setDocuments(updatedDocuments);
  };

  const mapStudentDocument = (newDocument) => {
    const name = `${newDocument.patient_id.lastName}, ${newDocument.patient_id.firstName}`;
    const pcp = `${newDocument.pcp_id.lastName}, ${newDocument.pcp_id.firstName}`;
    return {
      ...newDocument,
      name: name,
      pcp: pcp,
    };
  };

  const onDocumentCreate = (newDocument) => {
    const updatedDocuments = mapStudentDocument(newDocument);
    setDocuments((documents) => [ updatedDocuments, ...documents,]);
  };

  const columns = [
    { field: "_id", headerName: "Record ID", width: 250 },
    { field: "patient_id", headerName: "Patient ID", width: 150 },
    { field: "name", headerName: "Name", width: 250 },
    { field: "patient_age", headerName: "Age", width: 50 },
    { field: "patient_type", headerName: "Type", width: 100 },
    { field: "pcp", headerName: "Primary Care Provider (PCP)", width: 250 },
    { field: "medicine", headerName: "Medicine", width: 200 },
    { field: "quantity", headerName: "Quantity", width: 100 },
    { field: "dosage", headerName: "Dosage", width: 100 },
    { field: "frequency", headerName: "Frequency", width: 100 },
    { field: "duration", headerName: "Duration", width: 100 },
    { field: "reason", headerName: "Reason/s", width: 300 },
    { field: "issueDate", headerName: "Issue Date", width: 100,
      valueGetter: (params) => dateFormat(params.row.issueDate),
    },
    { field: "createdAt", headerName: "Created",  width: 100,
      valueGetter: (params) => dateFormat(params.row.createdAt),
    },
    { field: "updatedAt", headerName: "Updated",  width: 100,
      valueGetter: (params) => dateFormat(params.row.updatedAt),
    },
    {
      field: "action",
      headerName: "Action",
      width: 70,
      renderCell: (params) => {
        return (
          <div>
            <IconButton onClick={() => handleEditDocument(params.row._id)}>
              <EditIcon />
            </IconButton>
          </div>
        );
      },
    },
  ];

  const handleEditDocument = (id) => {
    const editDocument = documents.find((document) => document._id === id);
    setSelectedDocument(editDocument);
    setFormOpen(true); // Assuming this opens the form dialog
  };

  const handleModalClose = () => {
    setFormOpen(false);
  };

  const handleModalOpen = () => {
    setFormOpen(true);
  };

  const filteredDocumentData = documents.filter((document) => 
    (
      (document._id 
        ? document._id.toLowerCase() 
        : "").includes(searchValue) ||
      (document.patient_id 
        ? document.patient_id.toLowerCase() 
        : "").includes(searchValue) ||
      (document.name 
        ? document.name.toLowerCase() 
        : "").includes(searchValue) ||
      (document.patient_age 
        ? document.patient_age 
        : "").includes(searchValue) ||
      (document.patient_type 
        ? document.patient_type.toLowerCase() 
        : "").includes(searchValue) ||
      (document.pcp 
        ? document.pcp.toLowerCase() 
        : "").includes(searchValue) ||
      (document.medicine 
        ? document.medicine.toLowerCase() 
        : "").includes(searchValue) ||
      (document.quantity 
        ? document.quantity 
        : "").includes(searchValue) ||
      (document.dosage 
        ? document.dosage.toLowerCase() 
        : "").includes(searchValue) ||
      (document.frequency 
        ? document.frequency.toLowerCase() 
        : "").includes(searchValue) ||
      (document.duration 
        ? document.duration.toLowerCase() 
        : "").includes(searchValue) ||
      (new Date(document.issueDate).toLocaleDateString() 
        ? new Date(document.issueDate).toLocaleDateString().toLowerCase() 
        : "").includes(searchValue) ||
      (document.reason 
        ? document.reason.toLowerCase() 
        : "").includes(searchValue) ||
      (new Date(document.createdAt).toLocaleDateString() 
        ? new Date(document.createdAt).toLocaleDateString().toLowerCase() 
        : "").includes(searchValue) ||
      (new Date(document.updatedAt).toLocaleDateString() 
        ? new Date(document.updatedAt).toLocaleDateString().toLowerCase() 
        : "").includes(searchValue)
    )
  );

  return (
    <div className="flex flex-col h-full">
      <div className="w-full max-w-screen-xl mx-auto px-4">
        <div className="mb-4 flex justify-end items-center">
          <Button variant="contained" color="primary" onClick={handleModalOpen}>
            New Record
          </Button>
          <div className="ml-2">
            <TextField
              label="Search"
              size="small"
              value={searchValue}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <DataGrid
          getRowId={(row) => row._id}
          rows={filteredDocumentData}
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
        <ClinicVisitForm
          open={formOpen}
          addDocument={onDocumentCreate}
          updatedDocument={onDocumentUpdate}
          selectedDocument={selectedDocument}
          onClose={() => {
            setSelectedDocument(null);
            handleModalClose();
          }}
          onCancel={() => {
            setSelectedDocument(null);
            handleModalClose();
          }}
        />
      </div>
    </div>
  );
};

export default ClinicVisitGrid;