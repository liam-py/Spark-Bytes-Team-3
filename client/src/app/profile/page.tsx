"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/navigation";
import DietaryPreferencesForm from "@/components/DietaryPreferencesForm";
import NotificationToggle from "@/components/NotificationToggle";

const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch(`${base}/auth/me`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!data.user) {
        router.push("/authentication");
        return;
      }
      setUser(data.user);
    } catch {
      router.push("/authentication");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Profile
      </Typography>
      <Card sx={{ boxShadow: 2, mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            {user.name || user.email}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            <strong>Email:</strong> {user.email}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            <strong>Role:</strong> {user.role}
          </Typography>
          {user.isOrganizer && (
            <Alert severity="info" sx={{ mt: 2 }}>
              You are a verified organizer and can create events.
            </Alert>
          )}
        </CardContent>
      </Card>

      <Box sx={{ mt: 4 }}>
        <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)}>
          <Tab label="Dietary Preferences" />
          <Tab label="Notifications" />
        </Tabs>

        <Box sx={{ mt: 3 }}>
          {tab === 0 && <DietaryPreferencesForm />}
          {tab === 1 && <NotificationToggle />}
        </Box>
      </Box>
    </Container>
  );
}

