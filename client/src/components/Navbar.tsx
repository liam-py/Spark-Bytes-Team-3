"use client";

import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Image from "next/image";
import logo from "@/public/logo.png";

const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export default function Navbar() {
  const router = useRouter();
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

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await fetch(`${base}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
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
          >
            Spark! Bytes
          </Typography>
        </Link>

        <Box sx={{ flexGrow: 1, display: "flex", gap: 2 }}>
          <Link href="/events" style={{ textDecoration: "none" }}>
            <Button sx={{ color: "primary.main" }}>Events</Button>
          </Link>

          {/* ⭐ INSERTED ABOUT LINK RIGHT HERE */}
          <Link href="/about" style={{ textDecoration: "none" }}>
            <Button sx={{ color: "primary.main" }}>About</Button>
          </Link>
          {/* ⭐ END OF INSERTED ABOUT LINK */}

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

        {user ? (
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
            </Link>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
