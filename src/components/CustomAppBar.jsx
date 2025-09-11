import { AppBar } from "react-admin";
import { Box, Typography } from "@mui/material";

const CustomAppBar = (props) => {
  return (
    <AppBar
      {...props}
      sx={{
        backgroundColor: "rgba(30, 41, 59, 0.85)", // semi-transparent navy
        color: "#FFFFFF",
        boxShadow: "none",
        backdropFilter: "blur(10px)", // adds a smooth glass effect
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)", // subtle border
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          px: 2,
          py: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <img
            src="/images/calmora_circle_crop.png"
            alt="Calmora Logo"
            style={{ width: 32, height: 32, borderRadius: "50%" }}
          />
          <Typography variant="h6" fontWeight="bold">
            Calmora Admin Dashboard
          </Typography>
        </Box>
      </Box>
    </AppBar>
  );
};

export default CustomAppBar;
