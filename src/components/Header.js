import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

function Header({ title }) {
  return (
    <Paper
      square
      elevation={3}
      sx={{ backgroundColor: "#1e3a8a" }}
      className="h-24 flex items-center"
    >
      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: "2rem", sm: "2rem", md: "2.25rem" },
          fontWeight: "bold",
          py: { xs: 3, md: 6 },
          color: "white",
          pl: 2,
        }}
      >
        {title}
      </Typography>
    </Paper>
  );
}

export default Header;
