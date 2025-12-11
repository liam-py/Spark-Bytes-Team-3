"use client";

import React, { useEffect, useState } from "react";
<<<<<<< HEAD
import { Container, Typography, Alert } from "@mui/material";
=======
import { Container, Typography, Alert, CircularProgress } from "@mui/material";
>>>>>>> bc462f422b0c6a09b358738db66beaf94bfb33e4
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
<<<<<<< HEAD
      <Container>
        <Typography>Loading...</Typography>
=======
      <Container maxWidth="md" sx={{ py: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
>>>>>>> bc462f422b0c6a09b358738db66beaf94bfb33e4
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
<<<<<<< HEAD
      <EventForm />
=======
      <EventForm user={user} />
>>>>>>> bc462f422b0c6a09b358738db66beaf94bfb33e4
    </Container>
  );
}
