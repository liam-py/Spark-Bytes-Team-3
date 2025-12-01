"use client";

import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useAuth } from "@/app/providers/AuthProvider"; // <-- adjust if your path differs

const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export default function Navbar() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch(`${base}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      // Update global auth state so Navbar and other consumers react
      await refreshUser();
      handleClose();
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  const isAdmin = user?.role === "ADMIN";
  const isStudent = user?.role === "STUDENT" || (!isAdmin && !!user);

  return (
    <AppBar position="static">
      <Toolbar>
        <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 0, mr: 4, color: "primary.main" }}
          >
            Spark! Bytes
          </Typography>
        </Link>

        <Box sx={{ flexGrow: 1, display: "flex", gap: 2 }}>
          <Link href="/events" style={{ textDecoration: "none" }}>
            <Button sx={{ color: "primary.main" }}>Events</Button>
          </Link>

          {/* Only show these when we have a logged-in user */}
          {user && (
            <>
              {isStudent && (
                <Link href="/reservations" style={{ textDecoration: "none" }}>
                  <Button sx={{ color: "primary.main" }}>My Reservations</Button>
                </Link>
              )}
              {isAdmin && (
                <>
                  <Link href="/events/new" style={{ textDecoration: "none" }}>
                    <Button sx={{ color: "primary.main" }}>Create Event</Button>
                  </Link>
                  <Link href="/admin/analytics" style={{ textDecoration: "none" }}>
                    <Button sx={{ color: "primary.main" }}>Analytics</Button>
                  </Link>
                </>
              )}
            </>
          )}
        </Box>

        {/* If user is undefined => still loading initial auth check */}
        {user === undefined ? (
          <CircularProgress color="inherit" size={24} />
        ) : user ? (
          // Authenticated
          <Box>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              sx={{ color: "primary.main" }}
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>
                <Link
                  href="/profile"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  Profile
                </Link>
              </MenuItem>
              <MenuItem onClick={handleLogout} disabled={loggingOut}>
                {loggingOut ? "Logging out..." : "Logout"}
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          // Not authenticated
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              transition: "transform 0.2s ease-in-out",
              gap: 1,
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          >
            <Link href="/login" style={{ textDecoration: "none" }}>
              <Button sx={{ color: "primary.main" }}>Student Login</Button>
            </Link>
            <Link href="/admin/login" style={{ textDecoration: "none" }}>
              <Button sx={{ color: "primary.main" }}>Admin Login</Button>
            </Link>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
