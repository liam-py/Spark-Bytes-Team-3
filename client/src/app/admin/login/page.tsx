"use client";

import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import Link from "next/link";
import AdminLoginContent from "@/components/AdminLoginContent";
//added the theme to the page
import theme from "@/theme";

export default function AdminLoginPage() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        pt: 12,
      }}
    >
      <Link href="/" style={{ textDecoration: "none" }}>
        <Typography variant="h1" component="h1" gutterBottom sx={{ color: "primary.main" }}>
          Spark! Bytes
        </Typography>
      </Link>
      <Card sx={{ width: "50%", maxWidth: 600, mt: 4 }}>
        <Typography variant="h6" component="h2" sx={{ p: 2, pb: 0 }}>
          Admin Login
        </Typography>
        <CardContent>
          <AdminLoginContent />
        </CardContent>
      </Card>
    </Box>
  );
}

