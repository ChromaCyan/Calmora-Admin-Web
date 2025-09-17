// CustomLayout.jsx
import { Layout } from "react-admin";
import CustomSidebar from "./CustomSidebar";
import CustomAppBar from "./CustomAppBar";
import { Box } from "@mui/material";

const CustomLayout = (props) => (
  <Box
    sx={{
      height: "100vh",
      backgroundImage: `url(/images/login_bg_image.png)`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      position: "relative",
      overflow: "hidden",
    }}
  >
    {/* ✅ Overlay matches Flutter's semi-dark + blur */}
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        backgroundColor: "rgba(30, 41, 59, 0.45)", 
        backdropFilter: "blur(15px) saturate(100%)",
        WebkitBackdropFilter: "blur(10px) saturate(160%)",
        zIndex: 0,
      }}
    />

    {/* Layout content on top */}
    <Box sx={{ position: "relative", zIndex: 1, height: "100%" }}>
      <Layout {...props} menu={CustomSidebar} appBar={CustomAppBar} />
    </Box>
  </Box>
);

export default CustomLayout;
