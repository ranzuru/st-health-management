import { IconButton, Tooltip, Typography, Box } from "@mui/material";
import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid";
import FileUploadRoundedIcon from "@mui/icons-material/FileUploadRounded";
import GetAppRoundedIcon from "@mui/icons-material/GetAppRounded";
import { exportToXLSX, importFromXLSX } from "./DataGridUtils";

function CustomGridToolbar({ gridApiRef, filename }) {
  const handleExport = () => {
    if (!gridApiRef.current) return; // Add this line

    const rows = gridApiRef.current.getRows();
    const columns = gridApiRef.current
      .getVisibleColumns()
      .map((col) => col.field);

    exportToXLSX(rows, columns, `${filename}.xlsx`);
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (
      file.type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      importFromXLSX(file, (importedData) => {
        console.log("Imported XLSX Data:", importedData);
      });
    }
  };
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <Tooltip title="Import">
        <label
          style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
        >
          <input type="file" hidden onChange={handleImport} />
          <IconButton
            component="span"
            style={{
              alignItems: "center",
              display: "flex",
            }}
          >
            <FileUploadRoundedIcon color="primary" />
            <Box component="span" ml={1} display="flex" alignItems="center">
              <Typography color="primary" variant="body2" fontWeight="420">
                IMPORT
              </Typography>
            </Box>
          </IconButton>
        </label>
      </Tooltip>
      <Tooltip title="Export">
        <IconButton
          onClick={handleExport}
          style={{ alignItems: "center", display: "flex" }}
        >
          <GetAppRoundedIcon color="primary" />
          <Box component="span" ml={1} display="flex" alignItems="center">
            <Typography color="primary" variant="body2" fontWeight="420">
              EXPORT
            </Typography>
          </Box>
        </IconButton>
      </Tooltip>
    </GridToolbarContainer>
  );
}

export default CustomGridToolbar;
