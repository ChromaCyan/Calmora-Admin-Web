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
      backgroundColor: "rgba(30, 41, 59, 0.85)", // navy with opacity for slight transparency
      color: "white",
      display: "flex",
      flexDirection: "column",
      paddingY: 2,
      backdropFilter: "blur(6px)", // subtle blur behind sidebar for overlay effect
      borderRight: "1px solid rgba(255, 255, 255, 0.1)", // faint border for separation
    }}
  >
    {/* Menu Items */}
    <Box sx={{ flexGrow: 1 }}>
      <Menu
        sx={{
          "& .RaMenuItemLink-root": {
            color: "white",
            fontSize: "15px",
            paddingY: "10px",
            paddingX: "20px",
            borderRadius: 1,
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.15)",
            },
          },
          "& .RaMenuItemLink-active": {
            backgroundColor: "rgba(255, 255, 255, 0.25)",
          },
          "& .MuiSvgIcon-root": {
            color: "white",
          },
        }}
      >
        <Menu.Item to="/" primaryText="Specialist Management" leftIcon={<PeopleIcon />} />
        <Menu.Item to="/specialists-pending" primaryText="Specialist Pending" leftIcon={<AssignmentIndIcon />} />
        <Menu.Item to="/articles-dashboard" primaryText="Article Published" leftIcon={<NewspaperIcon />} />
        <Menu.Item to="/articles-pending" primaryText="Articles Pending" leftIcon={<AnnouncementIcon />} />
      </Menu>
    </Box>

    {/* Optional bottom divider */}
    <Divider sx={{ backgroundColor: "rgba(255, 255, 255, 0.2)", mx: 2 }} />
  </Box>
);

export default CustomSidebar;
