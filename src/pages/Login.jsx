import { useState } from "react";
import { useLogin, useNotify } from "react-admin";
import {
  Box,
  Paper,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
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
        position: "relative",
      }}
    >
      {/* 🔥 Dark overlay instead of white */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backdropFilter: "blur(6px)",
          backgroundColor: "rgba(0,0,0,0.45)", // dark glass
          zIndex: 0,
        }}
      />

      {/* Centered Login Box */}
      <Box sx={{ position: "relative", width: 420, maxWidth: "90vw", zIndex: 1 }}>
        {/* Floating Logo */}
        <Box
          sx={{
            position: "absolute",
            top: -60,
            left: "50%",
            transform: "translateX(-50%)",
            width: 120,
            height: 120,
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.05)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            display: "grid",
            placeItems: "center",
            border: "3px solid rgba(255,255,255,0.8)",
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

        {/* 🌙 Semi-transparent Card (Frosted Glass) */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            pt: 10,
            px: 3,
            pb: 3,
            backgroundColor: "rgba(255,255,255,0.05)", 
            backdropFilter: "blur(50px) saturate(1.2)", 
            boxShadow: "0 8px 30px rgba(0,0,0,0.4)", 
            color: "#fff",
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
              InputLabelProps={{ style: { color: "#ddd" } }}
              InputProps={{ style: { color: "#fff" } }}
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
              InputLabelProps={{ style: { color: "#ddd" } }}
              InputProps={{ style: { color: "#fff" } }}
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
                sx={{ color: "#fff" }}
                control={
                  <Checkbox
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    sx={{ color: "#ccc" }}
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
                sx={{
                  backgroundColor: "#fff",
                  color: "#000",
                  "&:hover": { backgroundColor: "#ddd" },
                }}
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
