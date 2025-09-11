import { useState } from "react";
import { useLogin, useNotify } from "react-admin";
import {
  Box,
  Paper,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Link,
  CircularProgress,
} from "@mui/material";

export default function MyLoginPage() {
  const login = useLogin();
  const notify = useNotify();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await login({ username, password, remember });
    } catch (e) {
      notify(typeof e === "string" ? e : "Invalid email or password", {
        type: "error",
      });
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        backgroundImage: `url(https://www.ohzoneclinics.com/hubfs/Consulation%20BG.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        p: 2,
      }}
    >
      <Box sx={{ position: "relative", width: 420, maxWidth: "90vw" }}>
        {/* floating circular logo */}
        <Box
          sx={{
            position: "absolute",
            top: -60,
            left: "50%",
            transform: "translateX(-50%)",
            width: 120,
            height: 120,
            borderRadius: "9999px",
            backgroundColor: "#fff",
            boxShadow: 3,
            display: "grid",
            placeItems: "center",
            border: "4px solid #fff",
            overflow: "hidden",
            zIndex: 2,
          }}
        >
          <img
            src="/images/calmora_circle_crop.png"
            alt="logo"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Box>

        {/* white login card */}
        <Paper
          elevation={6}
          sx={{
            borderRadius: 3,
            pt: 10,
            px: 3,
            pb: 3,
            backgroundColor: "rgba(0, 0, 0, 0.6)", 
            color: "#fff",
            backdropFilter: "blur(10px)",
          }}
        >
          <form onSubmit={onSubmit}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="email"
              autoFocus
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />

            <Box
              sx={{
                mt: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                }
                label="Remember me"
              />
            </Box>

            <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
              >
                {loading ? <CircularProgress size={22} /> : "LOG IN"}
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Box>
  );
}
