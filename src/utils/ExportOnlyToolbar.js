import { IconButton, Tooltip, Typography, Box } from "@mui/material";
import { GridToolbarContainer } from "@mui/x-data-grid";
import GetAppRoundedIcon from "@mui/icons-material/GetAppRounded";

function ExportOnlyToolbar({ onExport }) {
  return (
    <GridToolbarContainer>
      <Tooltip title="Export">
        <IconButton
          onClick={onExport}
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

export default ExportOnlyToolbar;
