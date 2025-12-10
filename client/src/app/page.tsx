"use client";

import React, { useEffect, useState } from "react";
import { Typography, Button, Box, Container, Grid, CircularProgress, Alert } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import EventCard from "@/components/EventCard";

const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
    fetchEvents();
  }, []);

  useEffect(() => {
    if (user !== null && events.length >= 0) {
      setLoading(false);
    }
  }, [user, events]);

  useEffect(() => {
    // Redirect admins to admin dashboard
    if (user?.role === "ADMIN") {
      router.push("/admin/analytics");
    }
  }, [user, router]);

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

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${base}/api/events`);
      const data = await res.json();
      setEvents(data.slice(0, 6)); // Show first 6 events
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // Don't render student view if admin (will redirect)
  if (user?.role === "ADMIN") {
    return null;
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
        }}
      >
        <Typography variant="h1" component="h1" gutterBottom sx={{ color: "primary.main" }}>
          Spark! Bytes
        </Typography>
        <Typography variant="h2" component="h2" gutterBottom sx={{ color: "primary.main" }}>
          Free food is one click away!
        </Typography>
        <Link href="/login">
          <Button variant="contained" size="large" sx={{ mt: 2 }}>
            Continue
          </Button>
        </Link>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome back, {user.name || user.email}!
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 2, fontWeight: 600 }}>
        Featured Events
      </Typography>
      {events.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          No events available at the moment. Check back later!
        </Alert>
      ) : (
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {events.map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event.id}>
              <EventCard event={event} />
            </Grid>
          ))}
        </Grid>
      )}
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Link href="/events" style={{ textDecoration: "none" }}>
          <Button variant="contained" size="large">
            Browse All Events
          </Button>
        </Link>
      </Box>
    </Container>
  );
}
