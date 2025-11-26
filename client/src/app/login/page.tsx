"use client";

import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  Tabs, 
  Tab, 
  Typography, 
  Box } 
  from "@mui/material";
import Link from "next/link";
import LoginContent from "@/components/LoginContent";
import SignupContent from "@/components/SignupContent";
//added the theme to the page
import theme from "@/theme";

export default function StudentLoginPage() {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #3C93A5 0%, #2B7280 50%, #CDFFFF 100%)",
        display: "flex",
        padding: 2,
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        pt: 12,
      }}
    >
      <Link href="/" style={{ textDecoration: "none" }}>
        <Typography variant="h1" component="h1" gutterBottom sx={{ color: "#FFFFFF" }}>
          Spark! Bytes
        </Typography>
      </Link>
      <Card sx={{ width: "50%", maxWidth: 600, mt: 4 }}>
        <Typography variant="h6" component="h2" sx={{ p: 2, pb: 0 }}>
          Student Login
        </Typography>
        <Tabs value={currentTab} onChange={handleTabChange} sx={{ px: 2 }}>
          <Tab label="Log in" />
          <Tab label="Sign up" />
        </Tabs>
        <CardContent>
          {currentTab === 0 ? <LoginContent userType="student" /> : <SignupContent />}
        </CardContent>
      </Card>
    </Box>
  );
}

