import React, { useEffect, useState } from "react";
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
  Chip,
  MenuItem,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  TextField,
  Snackbar,
  Alert,
  Avatar,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import WcIcon from "@mui/icons-material/Wc";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "axios";

const API_URL = "https://armstrong-api.vercel.app/api/auth";

const PendingArticles = () => {
  const [articles, setArticles] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [viewArticle, setViewArticle] = useState(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectingArticleId, setRejectingArticleId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterGender, setFilterGender] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchPendingArticles();
  }, []);

  const fetchPendingArticles = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.get(`${API_URL}/admin/articles/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setArticles(res.data.data);
    } catch (error) {
      console.error("Error fetching articles:", error);
      setSnackbar({
        open: true,
        message: "Failed to load articles",
        severity: "error",
      });
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm("Are you sure you want to APPROVE this article?"))
      return;
    try {
      const token = localStorage.getItem("authToken");
      await axios.put(
        `${API_URL}/admin/articles/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSnackbar({
        open: true,
        message: "Article approved!",
        severity: "success",
      });
      fetchPendingArticles();
      handleCloseMenu();
    } catch (error) {
      console.error("Approve failed:", error);
      setSnackbar({
        open: true,
        message: "Failed to approve article",
        severity: "error",
      });
    }
  };

  const openRejectDialog = (articleId) => {
    setRejectReason("");
    setRejectingArticleId(articleId);
    setRejectDialogOpen(true);
    handleCloseMenu();
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
        `${API_URL}/admin/articles/${rejectingArticleId}/reject`,
        { reason: rejectReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSnackbar({
        open: true,
        message: "Article rejected.",
        severity: "info",
      });
      setRejectDialogOpen(false);
      fetchPendingArticles();
    } catch (error) {
      console.error("Reject failed:", error);
      setSnackbar({
        open: true,
        message: "Failed to reject article",
        severity: "error",
      });
    }
  };

  const handleView = (article) => {
    setViewArticle(article);
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

  const filteredArticles = articles.filter((article) => {
    // Specialist full name lowercase
    const specialistName = article.specialistId
      ? `${article.specialistId.firstName} ${article.specialistId.lastName}`.toLowerCase()
      : "";

    // Search matches title or specialist name
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      specialistName.includes(searchQuery.toLowerCase());

    // Gender filter matches or empty
    const matchesGender =
      !filterGender ||
      (article.targetGender &&
        article.targetGender.toLowerCase() === filterGender.toLowerCase());

    const matchesCategory =
      !filterCategory || // no filter applied
      (article.categories &&
        article.categories.some(
          (cat) => cat.toLowerCase() === filterCategory.toLowerCase()
        ));

    return matchesSearch && matchesGender && matchesCategory;
  });

  return (
    <Box
      p={3}
      sx={{
        height: "100vh",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h4" fontWeight="bold" mb={3} sx={{ color: "white" }}>
        Pending Articles
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
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
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
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <input
            type="text"
            placeholder="Search articles or specialists..."
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
              appearance: "none", // keeps custom styling
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
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
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
              All Categories
            </option>
            <option
              style={{ backgroundColor: "#1e1e1e", color: "white" }}
              value="health"
            >
              Health
            </option>
            <option
              style={{ backgroundColor: "#1e1e1e", color: "white" }}
              value="social"
            >
              Social
            </option>
            <option
              style={{ backgroundColor: "#1e1e1e", color: "white" }}
              value="relationships"
            >
              Relationships
            </option>
            <option
              style={{ backgroundColor: "#1e1e1e", color: "white" }}
              value="growth"
            >
              Growth
            </option>
            <option
              style={{ backgroundColor: "#1e1e1e", color: "white" }}
              value="coping strategies"
            >
              Coping Strategies
            </option>
            <option
              style={{ backgroundColor: "#1e1e1e", color: "white" }}
              value="mental wellness"
            >
              Mental Wellness
            </option>
            <option
              style={{ backgroundColor: "#1e1e1e", color: "white" }}
              value="self-care"
            >
              Self-care
            </option>
          </select>
        </Box>
      </Box>

      {/* Grid of Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "1fr 1fr 1fr",
          },
          gap: 3,
          pb: 4,
        }}
      >
        {filteredArticles.map((article) => (
          <Box
            key={article._id}
            sx={{
              borderRadius: 3,
              backdropFilter: "blur(10px)",
              backgroundColor: "rgba(30, 41, 59, 0.7)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              cursor: "pointer",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 6px 20px rgba(0,0,0,0.6)",
              },
            }}
            onClick={() => handleView(article)}
          >
            {/* Hero Image */}
            <Box
              sx={{
                height: 140,
                backgroundImage: `url(${
                  article.heroImage || "/placeholder.png"
                })`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)",
                }}
              />
              {/* Specialist Info */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 8,
                  left: 8,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  color: "#fff",
                }}
              >
                <Avatar
                  src={article.specialistId?.profileImage || "/placeholder.png"}
                  sx={{ width: 32, height: 32, border: "2px solid white" }}
                />
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  sx={{ textShadow: "0 0 4px rgba(0,0,0,0.8)" }}
                  noWrap
                >
                  {article.specialistId?.firstName}{" "}
                  {article.specialistId?.lastName}
                </Typography>
              </Box>
            </Box>

            {/* Content */}
            <Box
              sx={{
                p: 2,
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                color: "white",
              }}
            >
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                gutterBottom
                noWrap
              >
                {article.title}
              </Typography>

              {/* Categories */}
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                  mb: 2,
                }}
              >
                {article.categories.map((category) => (
                  <Chip
                    key={category}
                    label={category}
                    size="small"
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.1)",
                      color: "white",
                      textTransform: "capitalize",
                    }}
                  />
                ))}
              </Box>

              {/* Metadata + Menu */}
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                  mt: "auto",
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <WcIcon fontSize="small" />
                  <Typography variant="body2" textTransform="capitalize">
                    {article.targetGender}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <CalendarTodayIcon fontSize="small" />
                  <Typography variant="body2">
                    {new Date(article.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>

                {/* Action Menu */}
                <Box sx={{ marginLeft: "auto" }}>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMenuClick(e, article._id);
                    }}
                    size="small"
                    sx={{ color: "white" }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  {menuId === article._id && (
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleCloseMenu}
                      onClick={(e) => e.stopPropagation()}
                      PaperProps={{
                        sx: {
                          backgroundColor: "rgba(30, 41, 59, 0.95)",
                          color: "white",
                          borderRadius: 2,
                        },
                      }}
                    >
                      <MenuItem onClick={() => handleView(article)}>
                        <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
                        View
                      </MenuItem>
                      <MenuItem onClick={() => handleApprove(article._id)}>
                        Approve
                      </MenuItem>
                      <MenuItem
                        onClick={() => openRejectDialog(article._id)}
                        sx={{ color: "#f87171" }}
                      >
                        Reject
                      </MenuItem>
                    </Menu>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
      <Dialog
        open={!!viewArticle}
        onClose={() => setViewArticle(null)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            maxHeight: "80vh", // limit dialog max height
            borderRadius: 2,
            overflow: "hidden",
          },
        }}
      >
        {viewArticle && (
          <>
            {/* Hero Image with Overlay */}
            <Box
              sx={{
                position: "relative",
                height: 250,
                backgroundImage: `url(${viewArticle.heroImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                color: "#fff",
                flexShrink: 0,
              }}
            >
              {/* Overlay gradient for readability */}
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.85) 100%)",
                }}
              />

              {/* Specialist Avatar and Info */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 16,
                  left: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Avatar
                  src={
                    viewArticle.specialistId?.profileImage || "/placeholder.png"
                  }
                  sx={{ width: 60, height: 60, border: "2px solid white" }}
                />
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" noWrap>
                    {viewArticle.specialistId?.firstName}{" "}
                    {viewArticle.specialistId?.lastName}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    {viewArticle.specialistId?.specialization || "Specialist"}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Scrollable Content */}
            <DialogContent
              dividers
              sx={{
                maxHeight: "calc(80vh - 250px)", // subtract hero image height
                overflowY: "auto",
                px: 3,
                pb: 2,
                pt: 3,
              }}
            >
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {viewArticle.title}
              </Typography>

              {/* Categories as Chips */}
              <Box sx={{ mb: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
                {viewArticle.categories.map((category) => (
                  <Chip
                    key={category}
                    label={category}
                    color="primary"
                    size="small"
                    sx={{ textTransform: "capitalize" }}
                  />
                ))}
              </Box>

              {/* Metadata with icons */}
              <Box
                sx={{
                  display: "flex",
                  gap: 3,
                  mb: 3,
                  flexWrap: "wrap",
                  alignItems: "center",
                  color: "text.secondary",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <WcIcon fontSize="small" />
                  <Typography variant="body2" textTransform="capitalize">
                    {viewArticle.targetGender}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <CalendarTodayIcon fontSize="small" />
                  <Typography variant="body2">
                    {new Date(viewArticle.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>

              {/* Article Content */}
              <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                {viewArticle.content}
              </Typography>
            </DialogContent>

            {/* Close Button */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                px: 3,
                pb: 2,
                pt: 0,
                backgroundColor: "background.paper",
              }}
            >
              <Button
                onClick={() => setViewArticle(null)}
                sx={{ color: "#002B5B" }}
              >
                Close
              </Button>
            </Box>
          </>
        )}
      </Dialog>
      {/* Reject Reason Dialog */}
      <Dialog
        open={rejectDialogOpen}
        onClose={() => setRejectDialogOpen(false)}
      >
        <DialogTitle>Reject Article</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Rejection Reason"
            type="text"
            fullWidth
            variant="standard"
            multiline
            rows={3}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleRejectSubmit}
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>
      {/* Snackbar Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
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

export default PendingArticles;
