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
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
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

// Replace with your own api or use my own and add the local url here
const API_URL = "https://calmora-api.vercel.app/api";

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

  const mapContainerStyle = {
    width: "100%",
    height: "300px",
    marginBottom: "24px",
  };

  const ClinicMap = ({ clinic }) => {
    const [lat, lng] = clinic.split(",").map(Number);

    const { isLoaded, loadError } = useLoadScript({
      googleMapsApiKey: "AIzaSyDpSz9OQRpg90DMG9PDDHCxDpwaxOomkio",
    });

    if (loadError) return <div>Error loading maps</div>;
    if (!isLoaded) return <div>Loading Maps...</div>;

    return (
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={14}
        center={{ lat, lng }}
      >
        <Marker position={{ lat, lng }} />
      </GoogleMap>
    );
  };

  const ClinicAddress = ({ clinic }) => {
    const [address, setAddress] = useState("Loading address...");

    useEffect(() => {
      if (!clinic) return;

      const [lat, lng] = clinic.split(",").map(Number);

      const fetchAddress = async () => {
        try {
          const res = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyDpSz9OQRpg90DMG9PDDHCxDpwaxOomkio`
          );

          if (res.data.status === "OK" && res.data.results.length > 0) {
            setAddress(res.data.results[0].formatted_address);
          } else {
            setAddress(`Clinic: ${lat.toFixed(5)}, ${lng.toFixed(5)}`);
          }
        } catch (err) {
          console.error("Reverse geocode failed:", err);
          setAddress(`Clinic: ${lat.toFixed(5)}, ${lng.toFixed(5)}`);
        }
      };

      fetchAddress();
    }, [clinic]);

    return <div>{address}</div>;
  };

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight="bold" mb={3} sx={{ color: "white" }}>
        Specialists Management
      </Typography>

      {/* Search and Filter Bar */}
      <Box
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 4,
          backdropFilter: "blur(12px)",
          backgroundColor: "rgba(30, 41, 59, 0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
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
            backgroundColor: "rgba(255,255,255,0.1)",
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
              color: "white",
              caretColor: "white",
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
              border: "1px solid rgba(255,255,255,0.2)",
              backgroundColor: "rgba(255,255,255,0.05)",
              color: "white",
              fontSize: "16px",
            }}
          >
            <option
              style={{ backgroundColor: "#1e1e1e", color: "white" }}
              value=""
            >
              All Genders
            </option>
            <option
              style={{ backgroundColor: "#1e1e1e", color: "white" }}
              value="male"
            >
              Male
            </option>
            <option
              style={{ backgroundColor: "#1e1e1e", color: "white" }}
              value="female"
            >
              Female
            </option>
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
              border: "1px solid rgba(255,255,255,0.2)",
              backgroundColor: "rgba(255,255,255,0.05)",
              color: "white",
              fontSize: "16px",
            }}
          >
            <option
              style={{ backgroundColor: "#1e1e1e", color: "white" }}
              value=""
            >
              All Specialization
            </option>
            <option
              style={{ backgroundColor: "#1e1e1e", color: "white" }}
              value="Psychologist"
            >
              Psychologist
            </option>
            <option
              style={{ backgroundColor: "#1e1e1e", color: "white" }}
              value="Counselor"
            >
              Counselor
            </option>
            <option
              style={{ backgroundColor: "#1e1e1e", color: "white" }}
              value="Psychiatrist"
            >
              Psychiatrist
            </option>
          </select>
        </Box>
      </Box>

      {/* Table */}
      <Box
        sx={{
          p: 2,
          borderRadius: 4,
          backdropFilter: "blur(12px)",
          backgroundColor: "rgba(30, 41, 59, 0.6)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          overflowX: "auto",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              {[
                "Profile",
                "Name",
                "Email",
                "Specialization",
                "Status",
                "Actions",
              ].map((head) => (
                <TableCell
                  key={head}
                  sx={{ color: "white", fontWeight: "bold" }}
                >
                  {head}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredSpecialists.map((spec) => (
              <TableRow
                key={spec._id}
                sx={{
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.05)" },
                }}
              >
                <TableCell>
                  <Avatar
                    src={spec.profileImage || "/placeholder.png"}
                    sx={{ width: 48, height: 48 }}
                  />
                </TableCell>
                <TableCell sx={{ color: "white" }}>
                  {spec.firstName} {spec.lastName}
                </TableCell>
                <TableCell sx={{ color: "rgba(255,255,255,0.7)" }}>
                  {spec.email}
                </TableCell>
                <TableCell sx={{ color: "rgba(255,255,255,0.7)" }}>
                  {spec.specialization}
                </TableCell>
                <TableCell>
                  <Box
                    sx={{
                      backgroundColor:
                        spec.availability === "Online"
                          ? "rgba(72,187,120,0.2)"
                          : spec.availability === "Offline"
                          ? "rgba(255,255,255,0.1)"
                          : "rgba(255,193,7,0.2)",
                      color:
                        spec.availability === "Online"
                          ? "#48BB78"
                          : spec.availability === "Offline"
                          ? "#A0AEC0"
                          : "#FFC107",
                      borderRadius: "20px",
                      px: 2,
                      py: 0.5,
                      fontSize: "14px",
                      display: "inline-block",
                      fontWeight: "bold",
                    }}
                  >
                    {spec.availability}
                  </Box>
                </TableCell>
                <TableCell>
                  <IconButton onClick={(e) => handleMenuClick(e, spec._id)}>
                    <MoreVertIcon sx={{ color: "white" }} />
                  </IconButton>
                  {menuId === spec._id && (
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleCloseMenu}
                      PaperProps={{
                        sx: {
                          backgroundColor: "rgba(30, 41, 59, 0.9)",
                          color: "white",
                          borderRadius: 2,
                        },
                      }}
                    >
                      <MenuItem onClick={() => handleView(spec)}>
                        <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
                        View Profile
                      </MenuItem>
                      <MenuItem onClick={() => handleDelete(spec._id)}>
                        <DeleteIcon
                          fontSize="small"
                          sx={{ mr: 1, color: "#f87171" }}
                        />
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
                    icon: <BusinessIcon color="primary" />,
                    label: `Specialization: ${selectedUser.specialization}`,
                  },
                  {
                    icon: <WcIcon color="primary" />,
                    label: `Gender: ${selectedUser.gender}`,
                  },
                  {
                    icon: <LocationOnIcon color="primary" />,
                    label: `Location: ${selectedUser.location}`,
                  },
                  {
                    icon: <LocalHospitalIcon color="primary" />,
                    label: `Clinic: ${selectedUser.clinic}`,
                  },
                ].map((item, index) => (
                  <Box key={index} display="flex" alignItems="center" mb={1.5}>
                    <Box mr={2}>{item.icon}</Box>
                    <Typography variant="body1">{item.label}</Typography>
                  </Box>
                ))}
                {/* Clinic Map */}
                {selectedUser.clinic && (
                  <>
                    <Box display="flex" alignItems="center" mb={1.5}>
                      <Typography variant="body1" fontWeight="bold">
                        Clinic Map Preview
                      </Typography>
                    </Box>
                    <ClinicMap clinic={selectedUser.clinic} />
                  </>
                )}
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
