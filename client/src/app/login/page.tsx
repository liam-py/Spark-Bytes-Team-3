"use client";

import React, { useState } from "react";
import { Card, CardContent, Tabs, Tab, Typography, Box } from "@mui/material";
import Link from "next/link";
import LoginContent from "@/components/LoginContent";
import SignupContent from "@/components/SignupContent";

export default function StudentLoginPage() {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

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
        <Typography variant="h1" component="h1" gutterBottom>
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

