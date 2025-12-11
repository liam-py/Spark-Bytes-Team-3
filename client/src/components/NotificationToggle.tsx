"use client";

import React, { useState, useEffect } from "react";
import {
  FormControlLabel,
  Switch,
  Typography,
  Box,
  Alert,
  Snackbar,
} from "@mui/material";

const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export default function NotificationToggle() {
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch(`${base}/auth/me`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.user) {
        setEnabled(data.user.notificationEnabled ?? true);
      }
    } catch {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (newValue: boolean) => {
    setEnabled(newValue);
    try {
      const res = await fetch(`${base}/api/notifications/preferences`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ enabled: newValue }),
      });
      if (!res.ok) {
        setError("Failed to update preferences");
        setEnabled(!newValue); // Revert on error
      }
    } catch {
      setError("Network error");
      setEnabled(!newValue); // Revert on error
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Notification Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Receive email notifications when new events are posted
      </Typography>
      <FormControlLabel
        control={
          <Switch
            checked={enabled}
            onChange={(e) => handleToggle(e.target.checked)}
          />
        }
        label={enabled ? "Notifications Enabled" : "Notifications Disabled"}
      />

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError("")}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>
    </Box>
  );
}
