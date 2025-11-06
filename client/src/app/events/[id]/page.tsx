"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  TextField,
  Rating,
  Alert,
  Snackbar,
} from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [hasReservation, setHasReservation] = useState(false);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEvent();
    fetchUser();
    checkReservation();
    fetchFeedbacks();
  }, [params.id]);

  const fetchEvent = async () => {
    try {
      const res = await fetch(`${base}/api/events/${params.id}`);
      const data = await res.json();
      setEvent(data);
    } catch {
      setError("Failed to load event");
    }
  };

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

  const checkReservation = async () => {
    if (user?.role === "ADMIN") return; // Admins don't reserve
    try {
      const res = await fetch(`${base}/api/reservations`, {
        credentials: "include",
      });
      const data = await res.json();
      const hasReserved = data.some(
        (r: any) => r.eventId === params.id && r.status === "ACTIVE"
      );
      setHasReservation(hasReserved);
    } catch {
      // Not logged in
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const res = await fetch(`${base}/api/feedback/event/${params.id}`);
      const data = await res.json();
      setFeedbacks(data);
    } catch {
      // Handle error
    }
  };

  const handleReserve = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role === "ADMIN") {
      setError("Admins cannot reserve food. Please use student account.");
      return;
    }

    try {
      const res = await fetch(`${base}/api/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          eventId: params.id,
          quantity: 1,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to reserve");
        return;
      }
      setSuccess("Reservation successful!");
      setHasReservation(true);
      fetchEvent(); // Refresh event to update availability
    } catch {
      setError("Network error");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      const res = await fetch(`${base}/api/events/${params.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to delete event");
        return;
      }
      setSuccess("Event deleted successfully!");
      setTimeout(() => {
        router.push("/events");
      }, 1000);
    } catch {
      setError("Network error");
    }
  };

  const handleSubmitFeedback = async () => {
    if (!hasReservation) {
      setError("You must reserve food from this event first");
      return;
    }

    try {
      const res = await fetch(`${base}/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          eventId: params.id,
          rating,
          comment,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to submit feedback");
        return;
      }
      setSuccess("Feedback submitted!");
      setRating(0);
      setComment("");
      fetchFeedbacks();
    } catch {
      setError("Network error");
    }
  };

  if (!event) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const canReserve = event.foodItems?.some(
    (item: any) => item.reserved < item.quantity
  );
  const isAdmin = user?.role === "ADMIN";
  const isStudent = user && user.role !== "ADMIN";
  const canEdit = isAdmin || (user && event.createdBy === user.id);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {event.imagePath && (
        <CardMedia
          component="img"
          height="400"
          image={`${base}${event.imagePath}`}
          alt={event.title}
          sx={{ mb: 2, borderRadius: 2 }}
        />
      )}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "start", mb: 2 }}>
        <Typography variant="h4" component="h1">
          {event.title}
        </Typography>
        {canEdit && (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Link href={`/events/${params.id}/edit`} style={{ textDecoration: "none" }}>
              <Button variant="outlined" size="small">
                Edit
              </Button>
            </Link>
            <Button variant="outlined" color="error" size="small" onClick={handleDelete}>
              Delete
            </Button>
          </Box>
        )}
      </Box>
      <Typography variant="body1" gutterBottom>
        <strong>Location:</strong> {event.location}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Time:</strong> {formatDate(event.startTime)} -{" "}
        {formatDate(event.endTime)}
      </Typography>
      {event.description && (
        <Typography variant="body1" sx={{ mt: 2 }}>
          {event.description}
        </Typography>
      )}

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Available Food
        </Typography>
        {event.foodItems?.map((item: any) => (
          <Chip
            key={item.id}
            label={`${item.name} - ${item.quantity - item.reserved}/${item.quantity} available`}
            sx={{ mr: 1, mb: 1 }}
            color={
              item.reserved < item.quantity ? "success" : "default"
            }
          />
        ))}
      </Box>

      {/* Student-only: Reserve button */}
      {isStudent && !hasReservation && canReserve && (
        <Box sx={{ mt: 3 }}>
          <Button variant="contained" onClick={handleReserve}>
            Reserve Food
          </Button>
        </Box>
      )}

      {isStudent && hasReservation && (
        <Alert severity="success" sx={{ mt: 2 }}>
          You have reserved food from this event
        </Alert>
      )}

      {!canReserve && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          No food available. Reservations closed.
        </Alert>
      )}

      {/* Student-only: Feedback form */}
      {isStudent && hasReservation && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Leave Feedback
          </Typography>
          <Rating
            value={rating}
            onChange={(_, newValue) => setRating(newValue || 0)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Comment (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" onClick={handleSubmitFeedback}>
            Submit Feedback
          </Button>
        </Box>
      )}

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Feedback ({feedbacks.length})
        </Typography>
        {feedbacks.length === 0 ? (
          <Typography>No feedback yet</Typography>
        ) : (
          feedbacks.map((feedback) => (
            <Card key={feedback.id} sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Typography variant="subtitle2">
                    {feedback.user?.name || feedback.user?.email}
                  </Typography>
                  <Rating value={feedback.rating} readOnly sx={{ ml: 2 }} />
                </Box>
                {feedback.comment && (
                  <Typography variant="body2">{feedback.comment}</Typography>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </Box>

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
