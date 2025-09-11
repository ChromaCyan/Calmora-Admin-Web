import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogContent,
  Avatar,
  Snackbar,
  Alert,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "axios";
import { useEffect, useState } from "react";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import BadgeIcon from "@mui/icons-material/Badge";
import WcIcon from "@mui/icons-material/Wc";

const API_URL = "https://armstrong-api.vercel.app/api";

const SpecialistManagement = () => {
  const [specialists, setSpecialists] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [menuId, setMenuId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterGender, setFilterGender] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [filterSpecialization, setFilterSpecialization] = useState("");

  useEffect(() => {
    fetchSpecialists();
  }, []);

  const fetchSpecialists = async () => {
    const token = localStorage.getItem("authToken");
    const res = await axios.get(`${API_URL}/auth/admin/specialists`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setSpecialists(res.data.data);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this specialist?"
    );
    if (!confirm) return;

    const token = localStorage.getItem("authToken");
    await axios.delete(`${API_URL}/auth/admin/specialists/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchSpecialists();
    handleCloseMenu();
    setSnackbarOpen(true);
  };

  const handleView = (specialist) => {
    setSelectedUser(specialist);
    setModalOpen(true);
    handleCloseMenu();
  };

  const handleMenuClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setMenuId(id);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setMenuId(null);
  };

  const filteredSpecialists = specialists.filter((spec) => {
    const matchesSearch =
      `${spec.firstName} ${spec.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      spec.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGender =
      !filterGender || spec.gender.toLowerCase() === filterGender.toLowerCase();

    const matchesSpecialization =
      !filterSpecialization || spec.specialization === filterSpecialization;

    return matchesSearch && matchesGender && matchesSpecialization;
  });

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Specialists Management
      </Typography>

      {/* Search and Filter Bar */}
      <Box
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 2,
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        {/* Search */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flex: 1,
            minWidth: 250,
            borderRadius: "50px",
            px: 2,
          }}
        >
          <input
            type="text"
            placeholder="Search Specialists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              border: "none",
              outline: "none",
              background: "transparent",
              padding: "10px",
              width: "100%",
              fontSize: "16px",
            }}
          />
        </Box>

        {/* Filter by Gender */}
        <Box>
          <select
            value={filterGender}
            onChange={(e) => setFilterGender(e.target.value)}
            style={{
              padding: "10px 16px",
              borderRadius: "50px",
              border: "1px solid #ccc",
              fontSize: "16px",
            }}
          >
            <option value="">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </Box>
        {/* Specialization Filter */}
        <Box>
          <select
            value={filterSpecialization}
            onChange={(e) => setFilterSpecialization(e.target.value)}
            style={{
              padding: "10px 16px",
              borderRadius: "50px",
              border: "1px solid #ccc",
              fontSize: "16px",
            }}
          >
            <option value="">All Specialization</option>
            <option value="Psychologist">Psychologist</option>
            <option value="Counselor">Counselor</option>
            <option value="Psychiatrist">Psychiatrist</option>
          </select>
        </Box>
      </Box>

      {/* Table */}
      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          overflowX: "auto",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Profile</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Specialization</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSpecialists.map((spec) => (
              <TableRow key={spec._id}>
                <TableCell>
                  <Avatar
                    src={spec.profileImage || "/placeholder.png"}
                    sx={{ width: 48, height: 48 }}
                  />
                </TableCell>
                <TableCell>
                  {spec.firstName} {spec.lastName}
                </TableCell>
                <TableCell>{spec.email}</TableCell>
                <TableCell>{spec.specialization}</TableCell>
                <TableCell>
                  <Box
                    sx={{
                      backgroundColor:
                        spec.availability === "Online"
                          ? "#d4edda"
                          : spec.availability === "Offline"
                          ? "#f0f0f0"
                          : "#ffeeba",
                      color:
                        spec.availability === "Online"
                          ? "#28a745"
                          : spec.availability === "Offline"
                          ? "#6c757d"
                          : "#856404",
                      borderRadius: "20px",
                      px: 2,
                      py: 0.5,
                      fontSize: "14px",
                      display: "inline-block",
                    }}
                  >
                    {spec.availability}
                  </Box>
                </TableCell>
                <TableCell>
                  <IconButton onClick={(e) => handleMenuClick(e, spec._id)}>
                    <MoreVertIcon />
                  </IconButton>
                  {menuId === spec._id && (
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleCloseMenu}
                    >
                      <MenuItem onClick={() => handleView(spec)}>
                        <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
                        View Profile
                      </MenuItem>
                      <MenuItem onClick={() => handleDelete(spec._id)}>
                        <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                        Delete
                      </MenuItem>
                    </Menu>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      {/* Modal */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        {selectedUser && (
          <DialogContent
            sx={{
              p: 0,
              borderRadius: 2,
              overflow: "hidden",
              maxHeight: "90vh", // ✅ Limit dialog height
            }}
          >
            {/* ✅ Scrollable content container */}
            <Box
              sx={{
                overflowY: "auto",
                maxHeight: "90vh",
              }}
            >
              {/* Header */}
              <Box
                sx={{
                  background: "#002B5B",
                  color: "#fff",
                  py: 4,
                  textAlign: "center",
                }}
              >
                <Avatar
                  src={selectedUser.profileImage || "/placeholder.png"}
                  sx={{
                    width: 100,
                    height: 100,
                    mx: "auto",
                    mb: 2,
                    border: "3px solid white",
                  }}
                />
                <Typography variant="h5" fontWeight="bold">
                  {selectedUser.firstName} {selectedUser.lastName}
                </Typography>
                <Typography variant="subtitle1" sx={{ opacity: 0.8 }}>
                  {selectedUser.specialization}
                </Typography>
              </Box>

              {/* Content */}
              <Box sx={{ p: 3 }}>
                {[
                  {
                    icon: <PhoneIcon color="primary" />,
                    label: selectedUser.phoneNumber,
                  },
                  {
                    icon: <EmailIcon color="primary" />,
                    label: selectedUser.email,
                  },
                  {
                    icon: <LocalHospitalIcon color="primary" />,
                    label: `Clinic: ${selectedUser.clinic}`,
                  },
                  {
                    icon: <BusinessIcon color="primary" />,
                    label: `Specialization: ${selectedUser.specialization}`,
                  },
                  {
                    icon: <LocationOnIcon color="primary" />,
                    label: `Location: ${selectedUser.location}`,
                  },
                  {
                    icon: <WcIcon color="primary" />,
                    label: `Gender: ${selectedUser.gender}`,
                  },
                ].map((item, index) => (
                  <Box key={index} display="flex" alignItems="center" mb={1.5}>
                    <Box mr={2}>{item.icon}</Box>
                    <Typography variant="body1">{item.label}</Typography>
                  </Box>
                ))}

                {/* License Image Section */}
                {selectedUser.licenseNumber && (
                  <Box mt={4}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      gutterBottom
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <BadgeIcon color="primary" sx={{ mr: 1 }} />
                      License Image
                    </Typography>
                    <Box
                      component="img"
                      src={selectedUser.licenseNumber}
                      alt="License"
                      sx={{
                        width: "100%",
                        height: "auto",
                        borderRadius: 2,
                        border: "1px solid #ccc",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                )}
              </Box>
            </Box>
          </DialogContent>
        )}
      </Dialog>

      {/* Snackbar for deletion */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Specialist has been successfully deleted!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SpecialistManagement;
