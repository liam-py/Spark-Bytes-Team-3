"use client";

<<<<<<< HEAD
import React, { useState, useEffect } from "react";
=======
import React, { useState } from "react";
>>>>>>> bc462f422b0c6a09b358738db66beaf94bfb33e4
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
<<<<<<< HEAD
=======
  CircularProgress,
>>>>>>> bc462f422b0c6a09b358738db66beaf94bfb33e4
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AccountCircle from "@mui/icons-material/AccountCircle";
<<<<<<< HEAD
import Image from "next/image";
import logo from "@/public/logo.png";
=======
import { useAuth } from "@/app/providers/AuthProvider";
>>>>>>> bc462f422b0c6a09b358738db66beaf94bfb33e4

const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export default function Navbar() {
  const router = useRouter();
<<<<<<< HEAD
  const [user, setUser] = useState<any>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch(`${base}/auth/me`, {
        credentials: "include",
      });
      const data = await res.json();
      setUser(data.user);
    } catch {
      setUser(null);
    }
  };
=======
  const { user, refreshUser } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loggingOut, setLoggingOut] = useState(false);
>>>>>>> bc462f422b0c6a09b358738db66beaf94bfb33e4

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
<<<<<<< HEAD
=======
    setLoggingOut(true);
>>>>>>> bc462f422b0c6a09b358738db66beaf94bfb33e4
    try {
      await fetch(`${base}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
<<<<<<< HEAD
      setUser(null);
      router.push("/");
    } catch {
      // Handle error
    }
    handleClose();
  };

  const isAdmin = user?.role === "ADMIN";
  const isStudent = user?.role === "STUDENT" || (!isAdmin && user);

  return (
    <AppBar position="static">
      <Toolbar>
        <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ flexGrow: 0, mr: 4, color: "primary.main" }}
=======
      // Update global auth state so Navbar can react
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
      <Toolbar sx={{ display: "flex", alignItems: "center", my: "9px"}}>
        <img src="/smallLogo.png" alt="Spark! Bytes" style={{ marginTop: 10, marginBottom: 10, width: 50, height: 50 }} />
        <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
          <Typography
            component="div"
            sx={{ mx: "28px", my: "12px", fontWeight: "bold", fontSize: "1.7rem", flexGrow: 0, mr: 4, color: "primary.main" }}
>>>>>>> bc462f422b0c6a09b358738db66beaf94bfb33e4
          >
            Spark! Bytes
          </Typography>
        </Link>

<<<<<<< HEAD
        <Box sx={{ flexGrow: 1, display: "flex", gap: 2 }}>
          <Link href="/events" style={{ textDecoration: "none" }}>
            <Button sx={{ color: "primary.main" }}>Events</Button>
          </Link>

          {/* ⭐ INSERTED ABOUT LINK RIGHT HERE */}
          <Link href="/about" style={{ textDecoration: "none" }}>
            <Button sx={{ color: "primary.main" }}>About</Button>
          </Link>
          {/* ⭐ END OF INSERTED ABOUT LINK */}

=======
        <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Link href="/events" style={{ textDecoration: "none" }}>
            <Button sx={{ fontWeight: "normal", fontSize: "1.2rem", color: "primary.main", "&:hover": { boxShadow: "none", backgroundColor: "inherit"} }}>Events</Button>
          </Link>

          {/* Only show these when we have a logged-in user */}
>>>>>>> bc462f422b0c6a09b358738db66beaf94bfb33e4
          {user && (
            <>
              {isStudent && (
                <Link href="/reservations" style={{ textDecoration: "none" }}>
<<<<<<< HEAD
                  <Button sx={{ color: "primary.main" }}>My Reservations</Button>
=======
                  <Button sx={{ fontWeight: "normal", fontSize: "1.2rem", color: "primary.main", "&:hover": { boxShadow: "none", backgroundColor: "inherit"} }}>My Reservations</Button>
>>>>>>> bc462f422b0c6a09b358738db66beaf94bfb33e4
                </Link>
              )}
              {isAdmin && (
                <>
                  <Link href="/events/new" style={{ textDecoration: "none" }}>
<<<<<<< HEAD
                    <Button sx={{ color: "primary.main" }}>Create Event</Button>
                  </Link>
                  <Link href="/admin/analytics" style={{ textDecoration: "none" }}>
                    <Button sx={{ color: "primary.main" }}>Analytics</Button>
=======
                    <Button sx={{ fontWeight: "normal", fontSize: "1.2rem", color: "primary.main", "&:hover": { boxShadow: "none", backgroundColor: "inherit"} }}>Create Event</Button>
                  </Link>
                  <Link href="/admin/analytics" style={{ textDecoration: "none" }}>
                    <Button sx={{ fontWeight: "normal", fontSize: "1.2rem", color: "primary.main", "&:hover": { boxShadow: "none", backgroundColor: "inherit"} }}>Analytics</Button>
>>>>>>> bc462f422b0c6a09b358738db66beaf94bfb33e4
                  </Link>
                </>
              )}
            </>
          )}
        </Box>

<<<<<<< HEAD
        {user ? (
=======
        {/* If user is undefined => still loading initial auth check */}
        {user === undefined ? (
          <CircularProgress color="inherit" size={24} />
        ) : user ? (
          // Authenticated
>>>>>>> bc462f422b0c6a09b358738db66beaf94bfb33e4
          <Box>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
<<<<<<< HEAD
              sx={{ color: "primary.main" }}
=======
              sx={{ width: 40, height: 40, color: "primary.main" }}
>>>>>>> bc462f422b0c6a09b358738db66beaf94bfb33e4
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
<<<<<<< HEAD
                vertical: "top",
=======
                vertical: "bottom",
>>>>>>> bc462f422b0c6a09b358738db66beaf94bfb33e4
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
<<<<<<< HEAD
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box sx={{ 
            display: "flex", 
            alignItems: "center", 
            cursor: "pointer", 
            transition: "transform 0.2s ease-in-out", 
            gap: 1,
            "&:hover": {
              transform: "scale(1.05)"
            }
          }}>
            <Link href="/login" style={{ textDecoration: "none" }}>
              <Button sx={{ color: "primary.main" }}>Student Login</Button>
            </Link>
            <Link href="/admin/login" style={{ textDecoration: "none" }}>
              <Button sx={{ color: "primary.main" }}>Admin Login</Button>
=======
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
              gap: 1
            }}
          >
            <Link href="/login" style={{ textDecoration: "none" }}>
              <Button sx={{ fontWeight: "normal", fontSize: "1.2rem", color: "primary.main", "&:hover": { boxShadow: "none", backgroundColor: "inherit"} }}>Student Login</Button>
            </Link>
            <Link href="/admin/login" style={{ textDecoration: "none" }}>
              <Button sx={{ fontWeight: "normal", fontSize: "1.2em", color: "primary.main", "&:hover": { boxShadow: "none", backgroundColor: "inherit"} }}>Admin Login</Button>
>>>>>>> bc462f422b0c6a09b358738db66beaf94bfb33e4
            </Link>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
