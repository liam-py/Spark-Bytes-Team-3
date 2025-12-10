"use client";

import React, { useEffect, useState } from "react";
import { Container, Typography, Alert, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import EventForm from "@/components/EventForm";

const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export default function NewEventPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
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
      setUser(data.user);
      // Allow admins or organizers
      if (!data.user || (data.user.role !== "ADMIN" && !data.user.isOrganizer)) {
        router.push("/events");
      }
    } catch {
      router.push("/login");
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

  if (!user || (user.role !== "ADMIN" && !user.isOrganizer)) {
    return (
      <Container>
        <Alert severity="error">
          Only admins and verified organizers can create events
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Create New Event
      </Typography>
      <EventForm />
    </Container>
  );
}
