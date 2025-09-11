import { Layout } from "react-admin";
import CustomSidebar from "./CustomSidebar";
import CustomAppBar from "./CustomAppBar";
import { Box } from "@mui/material";

const CustomLayout = (props) => (
  <Box
    sx={{
      height: "100vh",
      backgroundImage: `url(https://www.ohzoneclinics.com/hubfs/Consulation%20BG.jpg)`, 
      backgroundSize: "cover",
      backgroundPosition: "center",
      position: "relative",
      overflow: "hidden",
    }}
  >
    {/* Overlay */}
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        backgroundColor: "rgba(30, 41, 59, 0.75)", 
        backdropFilter: "blur(10px)", // blur effect
        zIndex: 0,
      }}
    />

    {/* The actual layout */}
    <Box sx={{ position: "relative", zIndex: 1, height: "100%" }}>
      <Layout {...props} menu={CustomSidebar} appBar={CustomAppBar} />
    </Box>
  </Box>
);

export default CustomLayout;
