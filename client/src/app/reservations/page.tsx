"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  Alert,
  IconButton,
  Snackbar,
} from "@mui/material";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DeleteIcon from "@mui/icons-material/Delete";

const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export default function ReservationsPage() {
  const router = useRouter();
  const [reservations, setReservations] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUser();
    fetchReservations();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch(`${base}/auth/me`, {
        credentials: "include",
      });
      const data = await res.json();
      setUser(data.user);
      // Redirect admins - they don't have reservations
      if (data.user?.role === "ADMIN") {
        router.push("/admin/analytics");
      }
    } catch {
      // Not logged in
    }
  };

  const fetchReservations = async () => {
    try {
      const res = await fetch(`${base}/api/reservations`, {
        credentials: "include",
      });
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      const data = await res.json();
      setReservations(data);
    } catch {
      setError("Failed to load reservations");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (reservationId: string) => {
    try {
      const res = await fetch(`${base}/api/reservations/${reservationId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to cancel reservation");
        return;
      }
      setSuccess("Reservation cancelled");
      fetchReservations();
    } catch {
      setError("Network error");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (user?.role === "ADMIN") {
    return null; // Will redirect
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Reservations
      </Typography>
      {reservations.length === 0 ? (
        <Alert severity="info">You have no active reservations</Alert>
      ) : (
        reservations.map((reservation) => (
          <Card key={reservation.id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6">
                {reservation.event?.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Location: {reservation.event?.location}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Time: {formatDate(reservation.event?.startTime)} -{" "}
                {formatDate(reservation.event?.endTime)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Reserved: {formatDate(reservation.reservedAt)}
              </Typography>
              <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                <Link
                  href={`/events/${reservation.eventId}`}
                  style={{ textDecoration: "none" }}
                >
                  <Button variant="outlined" size="small">
                    View Event
                  </Button>
                </Link>
                <IconButton
                  color="error"
                  onClick={() => handleCancel(reservation.id)}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        ))
      )}

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess("")}
      >
        <Alert severity="success">{success}</Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError("")}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>
    </Container>
  );
}
