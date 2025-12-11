"use client";

import React from "react";
import { Box } from "@mui/material";
import Navbar from "./Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Box>
      <Navbar />
      <Box component="main">{children}</Box>
    </Box>
  );
}

