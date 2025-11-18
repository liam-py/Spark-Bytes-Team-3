"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
} from "@mui/material";

import { useRouter } from "next/navigation";
import EventCard from "@/components/EventCard";

const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export default function PastEventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user]);

  const fetchUser = async () => {
    try {
      const res = await fetch(`${base}/auth/me`, {
        credentials: "include",
      });
      const data = await res.json();
      setUser(data.user);
      
      // Redirect if not admin or organizer
      if (!data.user || (data.user.role !== "ADMIN" && !data.user.isOrganizer)) {
        router.push("/events");
      }
    } catch {
      setUser(null);
      router.push("/login");
    }
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      // Fetch past events created by the logged-in user
      const res = await fetch(`${base}/api/events/my/events?past=true`, {
        credentials: "include",
      });
      
      if (!res.ok) {
        throw new Error("Failed to fetch events");
      }
      
      const data = await res.json();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching past events:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        My Past Events
      </Typography>

      {loading ? (
        <Typography>Loading events...</Typography>
      ) : events.length === 0 ? (
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No past events found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Events you create will appear here once they've ended.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {events.map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event.id}>
              <EventCard event={event} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

