import React, { useState, useEffect } from "react";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import axiosInstance from "../config/axios-instance";

const DEFAULT_GRADES = [
  {
    _id: "Grade 1",
    enrolled4Ps: 0,
    enrolledNon4Ps: 0,
    dewormed4Ps: 0,
    dewormedNon4Ps: 0,
  },
  {
    _id: "Grade 2",
    enrolled4Ps: 0,
    enrolledNon4Ps: 0,
    dewormed4Ps: 0,
    dewormedNon4Ps: 0,
  },
  {
    _id: "Grade 3",
    enrolled4Ps: 0,
    enrolledNon4Ps: 0,
    dewormed4Ps: 0,
    dewormedNon4Ps: 0,
  },
  {
    _id: "Grade 4",
    enrolled4Ps: 0,
    enrolledNon4Ps: 0,
    dewormed4Ps: 0,
    dewormedNon4Ps: 0,
  },
  {
    _id: "Grade 5",
    enrolled4Ps: 0,
    enrolledNon4Ps: 0,
    dewormed4Ps: 0,
    dewormedNon4Ps: 0,
  },
  {
    _id: "Grade 6",
    enrolled4Ps: 0,
    enrolledNon4Ps: 0,
    dewormed4Ps: 0,
    dewormedNon4Ps: 0,
  },
];

const DewormingGrid = () => {
  const [aggregateData, setAggregateData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAggregateData = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(
          "dewormingReport/dewormingData"
        );

        const dataStructure = DEFAULT_GRADES.reduce((acc, gradeObj) => {
          acc[gradeObj._id] = { ...gradeObj };
          return acc;
        }, {});

        response.data.forEach((item) => {
          const key = item.grade;

          // Determine if it's 4Ps or Non-4Ps
          const type = item.is4P ? "4Ps" : "Non4Ps";

          // Update the enrolled and dewormed counts based on the type
          dataStructure[key][`enrolled${type}`] += item.totalEnrolled;
          dataStructure[key][`dewormed${type}`] += item.totalDewormed;
        });

        const aggregatedData = Object.values(dataStructure);
        setAggregateData(aggregatedData);
      } catch (error) {
        console.error("Error fetching aggregate data:", error);
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAggregateData();
  }, []);

  const aggregateColumns = [
    { field: "_id", headerName: "Grade Level", width: 150 },
    {
      field: "enrolled4Ps",
      headerName: "No. of Enrolled Children (4Ps)",
      align: "center",
      headerAlign: "center",
      width: 210,
    },
    {
      field: "enrolledNon4Ps",
      headerName: "No. of Enrolled Children (non-4Ps)",
      align: "center",
      headerAlign: "center",
      width: 250,
    },
    {
      field: "totalEnrolled",
      headerName: "Total Enrolled",
      align: "center",
      headerAlign: "center",
      width: 150,
      valueGetter: (params) =>
        params.row.enrolled4Ps + params.row.enrolledNon4Ps,
    },
    {
      field: "dewormed4Ps",
      headerName: "No. of Children Dewormed (4Ps)",
      align: "center",
      headerAlign: "center",
      width: 250,
    },
    {
      field: "dewormedNon4Ps",
      headerName: "No. of Children Dewormed (non-4Ps)",
      align: "center",
      headerAlign: "center",
      width: 280,
    },
    {
      field: "totalDewormed",
      headerName: "Total Dewormed",
      align: "center",
      headerAlign: "center",
      width: 150,
      valueGetter: (params) =>
        params.row.dewormed4Ps + params.row.dewormedNon4Ps,
    },
    {
      field: "percentage",
      headerName: "%",
      align: "center",
      headerAlign: "center",
      width: 90,
      valueGetter: (params) => {
        const totalDewormed =
          params.row.dewormed4Ps + params.row.dewormedNon4Ps;
        const totalEnrolled =
          params.row.enrolled4Ps + params.row.enrolledNon4Ps;

        if (!totalEnrolled || totalEnrolled === 0) {
          return "0%";
        }

        const percentage = (totalDewormed / totalEnrolled) * 100;

        return `${Math.round(percentage * 100) / 100}%`;
      },
    },
  ];

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="w-full max-w-screen-xl mx-auto px-8">
        <div className="mb-4 flex justify-between items-center">
          <div className="flex items-center"></div>
        </div>
        <DataGrid
          rows={aggregateData}
          columns={aggregateColumns}
          getRowId={(row) => row._id}
          slots={{
            toolbar: CustomToolbar,
          }}
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
          loading={isLoading}
          pageSizeOptions={[10]}
          disableRowSelectionOnClick
          style={{ height: 440 }}
        />
      </div>
    </div>
  );
};

export default DewormingGrid;
