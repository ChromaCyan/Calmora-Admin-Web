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
  Chip,
  Button,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import WcIcon from "@mui/icons-material/Wc";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "axios";
import { useEffect, useState } from "react";

const API_URL = "https://armstrong-api.vercel.app/api";

const ArticleManagement = () => {
  const [articles, setArticles] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterGender, setFilterGender] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    const token = localStorage.getItem("authToken");
    try {
      // Fetch approved articles (you already have admin route for this)
      const res = await axios.get(`${API_URL}/article/articles`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setArticles(res.data);
    } catch (error) {
      console.error("Failed to fetch articles:", error);
    }
  };

  const handleView = async (articleId) => {
    const token = localStorage.getItem("authToken");
    try {
      const res = await axios.get(
        `${API_URL}/auth/admin/articles/approved/${articleId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSelectedArticle(res.data.data);
      setModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch article:", error);
    }
    handleCloseMenu();
  };

  const handleUnpublish = async (articleId) => {
    const confirm = window.confirm(
      "Are you sure you want to unpublish this article?"
    );
    if (!confirm) return;

    const token = localStorage.getItem("authToken");
    try {
      await axios.put(
        `${API_URL}/auth/admin/articles/${articleId}/unpublish`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSnackbarMessage("Article unpublished successfully");
      setSnackbarOpen(true);
      fetchArticles();
      handleCloseMenu();
    } catch (error) {
      console.error("Failed to unpublish article:", error);
    }
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

    // Category filter: if filterCategories is empty or article categories include the filter value
    // Assuming filterCategories is a string (like "health", "social", etc)
    const matchesCategory =
      !filterCategory || // no filter applied
      (article.categories &&
        article.categories.some(
          (cat) => cat.toLowerCase() === filterCategory.toLowerCase()
        ));

    return matchesSearch && matchesGender && matchesCategory;
  });

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Approved Articles Management
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
            border: "1px solid #ccc",
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
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{
              padding: "10px 16px",
              borderRadius: "50px",
              border: "1px solid #ccc",
              fontSize: "16px",
            }}
          >
            <option value="">All Categories</option>
            <option value="health">Health</option>
            <option value="social">Social</option>
            <option value="relationships">Relationships</option>
            <option value="growth">Growth</option>
            <option value="coping strategies">Coping Strategies</option>
            <option value="mental wellness">Mental Wellness</option>
            <option value="self-care">Self-care</option>
          </select>
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "1fr 1fr 1fr",
          },
          gap: 3,
        }}
      >
        {filteredArticles.map((article) => (
          <Box
            key={article._id}
            sx={{
              borderRadius: 2,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              cursor: "pointer",
              bgcolor: "#fff",
            }}
            onClick={() => handleView(article._id)}
          >
            {/* Hero Image with overlay */}
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
                    "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%)",
                }}
              />

              {/* Specialist avatar + name */}
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
                  {article.specialistId
                    ? `${article.specialistId.firstName} ${article.specialistId.lastName}`
                    : "N/A"}
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
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 1,
                  mb: 2,
                }}
              >
                {article.categories.map((category) => (
                  <Chip
                    key={category}
                    label={category}
                    color="primary"
                    size="small"
                    sx={{ textTransform: "capitalize" }}
                  />
                ))}
              </Box>

              {/* Metadata */}
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                  color: "text.secondary",
                  mt: "auto",
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
                    {new Date(article.publishedDate).toLocaleDateString()}
                  </Typography>
                </Box>

                {/* Action Menu Button */}
                <Box sx={{ marginLeft: "auto" }}>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMenuClick(e, article._id);
                    }}
                    size="small"
                  >
                    <MoreVertIcon />
                  </IconButton>

                  {menuId === article._id && (
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleCloseMenu}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleView(article._id);
                          handleCloseMenu();
                        }}
                      >
                        <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
                        View
                      </MenuItem>
                      <MenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUnpublish(article._id);
                          handleCloseMenu();
                        }}
                      >
                        Unpublish
                      </MenuItem>
                    </Menu>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Article Detail Modal */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            maxHeight: "80vh",
            borderRadius: 2,
            overflow: "hidden",
          },
        }}
      >
        {selectedArticle && (
          <>
            {/* Hero Image with Overlay */}
            <Box
              sx={{
                position: "relative",
                height: 250,
                backgroundImage: `url(${selectedArticle.heroImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                color: "#fff",
                flexShrink: 0,
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.85) 100%)",
                }}
              />
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
                    selectedArticle.specialistId?.profileImage ||
                    "/placeholder.png"
                  }
                  sx={{ width: 60, height: 60, border: "2px solid white" }}
                />
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" noWrap>
                    {selectedArticle.specialistId?.firstName}{" "}
                    {selectedArticle.specialistId?.lastName}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    {selectedArticle.specialistId?.specialization ||
                      "Specialist"}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <DialogContent
              dividers
              sx={{
                maxHeight: "calc(80vh - 250px)",
                overflowY: "auto",
                px: 3,
                pb: 2,
                pt: 3,
              }}
            >
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {selectedArticle.title}
              </Typography>

              <Box sx={{ mb: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
                {selectedArticle.categories.map((category) => (
                  <Chip
                    key={category}
                    label={category}
                    color="primary"
                    size="small"
                    sx={{ textTransform: "capitalize" }}
                  />
                ))}
              </Box>

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
                    {selectedArticle.targetGender}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <CalendarTodayIcon fontSize="small" />
                  <Typography variant="body2">
                    {new Date(
                      selectedArticle.publishedDate
                    ).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>

              <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                {selectedArticle.content}
              </Typography>

              {/* Additional images preview */}
              {selectedArticle.additionalImages?.length > 0 && (
                <Box mt={2} sx={{ display: "flex", gap: 2, overflowX: "auto" }}>
                  {selectedArticle.additionalImages.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Additional ${idx + 1}`}
                      style={{
                        width: 100,
                        height: 100,
                        objectFit: "cover",
                        borderRadius: 4,
                      }}
                    />
                  ))}
                </Box>
              )}
            </DialogContent>

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
                onClick={() => setModalOpen(false)}
                sx={{ color: "#002B5B" }}
              >
                Close
              </Button>
            </Box>
          </>
        )}
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ArticleManagement;
