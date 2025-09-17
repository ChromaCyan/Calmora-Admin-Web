// CustomSidebar.jsx
import { Menu } from "react-admin";
import { Box, Divider } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import AnnouncementIcon from "@mui/icons-material/Announcement";

const CustomSidebar = () => (
  <Box
    sx={{
      width: 240,
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      py: 1,
      backdropFilter: "blur(10px)",
    }}
  >
    <Box sx={{ flexGrow: 1 }}>
      <Menu
        sx={{
          "& .RaMenuItemLink-root": {
            color: "#F8FAFC", 
            fontWeight: 500,
            fontSize: "15px",
            paddingY: "10px",
            paddingX: "20px",
            borderRadius: 1,
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)", 
            },
          },
          "& .RaMenuItemLink-active": {
            backgroundColor: "rgba(255, 255, 255, 0.15)", 
            fontWeight: "600",
          },
          "& .MuiSvgIcon-root": {
            color: "#E2E8F0", 
          },
        }}
      >
        <Menu.Item
          to="/"
          primaryText="Specialist Management"
          leftIcon={<PeopleIcon />}
        />
        <Menu.Item
          to="/specialists-pending"
          primaryText="Specialist Pending"
          leftIcon={<AssignmentIndIcon />}
        />
        <Menu.Item
          to="/articles-dashboard"
          primaryText="Article Published"
          leftIcon={<NewspaperIcon />}
        />
        <Menu.Item
          to="/articles-pending"
          primaryText="Articles Pending"
          leftIcon={<AnnouncementIcon />}
        />
      </Menu>
    </Box>
    <Divider sx={{ backgroundColor: "rgba(255,255,255,0.1)", mx: 2 }} />
  </Box>
);

export default CustomSidebar;
