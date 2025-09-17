import { AppBar } from "react-admin";
import { Box, Typography } from "@mui/material";

const CustomAppBar = (props) => {
  return (
    <AppBar
      {...props}
      sx={{
        backgroundColor: "rgba(30, 41, 59, 0.6)", 
        color: "#FFF",
        backdropFilter: "blur(2px)", 
        boxShadow: "0 2px 10px rgba(255,255,255,0.1)", 
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        px: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <img
            src="/images/calmora_circle_crop.png"
            alt="Calmora Logo"
            style={{ width: 32, height: 32, borderRadius: "50%" }}
          />
          <Typography variant="h6" fontWeight="600">
            Calmora Admin Dashboard
          </Typography>
        </Box>
      </Box>
    </AppBar>
  );
};

export default CustomAppBar;
