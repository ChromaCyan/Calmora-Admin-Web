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
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectingSpecialistId, setRejectingSpecialistId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterGender, setFilterGender] = useState("");
  const [filterSpecialization, setFilterSpecialization] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

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

  const openRejectDialog = (specialistId) => {
    setRejectReason("");
    setRejectingSpecialistId(specialistId);
    setRejectDialogOpen(true);
    handleCloseMenu();
  };

  const handleApprove = async (id) => {
    if (!window.confirm("Are you sure you want to APPROVE this specialist?"))
      return;

    try {
      const token = localStorage.getItem("authToken");
      await axios.put(
        `${API_URL}/auth/admin/specialists/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSnackbar({
        open: true,
        message: "Specialist approved!",
        severity: "success",
      });
      fetchPendingSpecialists();
      handleCloseMenu();
    } catch {
      setSnackbar({
        open: true,
        message: "Failed to approve specialist",
        severity: "error",
      });
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) {
      setSnackbar({
        open: true,
        message: "Please provide a rejection reason",
        severity: "warning",
      });
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      await axios.put(
        `${API_URL}/auth/admin/specialists/${rejectingSpecialistId}/reject`,
        { reason: rejectReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSnackbar({
        open: true,
        message: "Specialist rejected with reason.",
        severity: "info",
      });

      setRejectDialogOpen(false);
      fetchPendingSpecialists();
    } catch (error) {
      console.error("Reject failed:", error);
      setSnackbar({
        open: true,
        message: "Failed to reject specialist",
        severity: "error",
      });
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

  return (
    <Box className="p-6">
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Pending Specialist
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
        className="
  p-4 
  rounded-2xl 
  backdrop-blur-md 
  bg-[rgba(30,41,59,0.6)] 
  shadow-[0_4px_20px_rgba(0,0,0,0.4)] 
  overflow-x-auto
"
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
                  className="text-white font-semibold"
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
                className="hover:bg-[rgba(255,255,255,0.05)]"
              >
                {/* Profile */}
                <TableCell>
                  <Avatar
                    src={spec.profileImage || "/placeholder.png"}
                    sx={{ width: 48, height: 48 }}
                  />
                </TableCell>

                {/* Name */}
                <TableCell className="text-white">
                  {spec.firstName} {spec.lastName}
                </TableCell>

                {/* Email */}
                <TableCell className="text-gray-300">{spec.email}</TableCell>

                {/* Specialization */}
                <TableCell className="text-gray-300">
                  {spec.specialization}
                </TableCell>

                {/* Status */}
                <TableCell>
                  <span
                    className={`
                px-3 py-1 rounded-full text-sm font-semibold
                ${
                  spec.approvalStatus === "Approved"
                    ? "bg-green-200 text-green-800"
                    : spec.approvalStatus === "Rejected"
                    ? "bg-red-200 text-red-800"
                    : "bg-yellow-200 text-gray-800"
                }
              `}
                  >
                    {spec.approvalStatus || "Pending"}
                  </span>
                </TableCell>

                {/* Actions */}
                <TableCell>
                  <IconButton onClick={(e) => handleMenuClick(e, spec._id)}>
                    <MoreVertIcon className="text-white" />
                  </IconButton>
                  {menuId === spec._id && (
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleCloseMenu}
                      PaperProps={{
                        className:
                          "bg-[rgba(30,41,59,0.9)] text-white rounded-xl shadow-xl",
                      }}
                    >
                      <MenuItem onClick={() => handleView(spec)}>
                        <VisibilityIcon fontSize="small" className="mr-2" />
                        View Profile
                      </MenuItem>
                      <MenuItem
                        onClick={() => handleApprove(spec._id)}
                        className="text-green-400"
                      >
                        Approve
                      </MenuItem>
                      <MenuItem
                        onClick={() => openRejectDialog(spec._id)}
                        className="text-red-400"
                      >
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
          <DialogContent
            sx={{
              p: 0,
              borderRadius: 2,
              overflow: "hidden",
              maxHeight: "90vh",
            }}
          >
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

              {/* Body */}
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
                {/* License Image */}
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
      <Dialog
        open={rejectDialogOpen}
        onClose={() => setRejectDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent>
          <Typography variant="h6" mb={2}>
            Reject Specialist
          </Typography>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Enter rejection reason..."
            style={{
              width: "100%",
              minHeight: "100px",
              padding: "10px",
              fontSize: "16px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              resize: "vertical",
            }}
          />
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", mt: 2, gap: 2 }}
          >
            <button
              onClick={() => setRejectDialogOpen(false)}
              style={{ padding: "8px 16px", borderRadius: "8px" }}
            >
              Cancel
            </button>
            <button
              onClick={handleRejectSubmit}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                backgroundColor: "#f87171",
                color: "white",
              }}
            >
              Reject
            </button>
          </Box>
        </DialogContent>
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
