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

const PendingSpecialists = () => {
  const [specialists, setSpecialists] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [menuId, setMenuId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterGender, setFilterGender] = useState("");
  const [filterSpecialization, setFilterSpecialization] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    fetchPendingSpecialists();
  }, []);

  const fetchPendingSpecialists = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.get(`${API_URL}/auth/admin/specialists/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSpecialists(res.data.data);
    } catch (error) {
      console.error("Failed to fetch pending specialists", error);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm("Are you sure you want to APPROVE this specialist?")) return;

    try {
      const token = localStorage.getItem("authToken");
      await axios.put(
        `${API_URL}/auth/admin/specialists/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSnackbar({ open: true, message: "Specialist approved!", severity: "success" });
      fetchPendingSpecialists();
      handleCloseMenu();
    } catch {
      setSnackbar({ open: true, message: "Failed to approve specialist", severity: "error" });
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Are you sure you want to REJECT this specialist?")) return;

    try {
      const token = localStorage.getItem("authToken");
      await axios.put(
        `${API_URL}/auth/admin/specialists/${id}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSnackbar({ open: true, message: "Specialist rejected.", severity: "info" });
      fetchPendingSpecialists();
      handleCloseMenu();
    } catch {
      setSnackbar({ open: true, message: "Failed to reject specialist", severity: "error" });
    }
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
        Pending Specialists
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
            <option value="">All Specializations</option>
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
                      backgroundColor: "#ffeeba",
                      color: "#856404",
                      borderRadius: "20px",
                      px: 2,
                      py: 0.5,
                      fontSize: "14px",
                      display: "inline-block",
                    }}
                  >
                    {spec.approvalStatus || "Pending"}
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
                      <MenuItem onClick={() => handleApprove(spec._id)}>
                        Approve
                      </MenuItem>
                      <MenuItem onClick={() => handleReject(spec._id)}>
                        Reject
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
          <DialogContent sx={{ p: 0, borderRadius: 2, overflow: "hidden" }}>
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
                  icon: <BadgeIcon color="primary" />,
                  label: `License #: ${selectedUser.licenseNumber}`,
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
            </Box>
          </DialogContent>
        )}
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PendingSpecialists;
