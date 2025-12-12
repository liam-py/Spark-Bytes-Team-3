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
  Divider,
  Grid,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DeleteIcon from "@mui/icons-material/Delete";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getEventImageSrc } from "@/lib/eventImage";

const base =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();

  const [event, setEvent] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [hasReservation, setHasReservation] = useState(false);
  const [reservedFoodItems, setReservedFoodItems] = useState<
    Set<string>
  >(new Set());
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchEvent();
    fetchUser();
  }, [params.id]);

  useEffect(() => {
    if (user) {
      checkReservation();
      fetchFeedbacks();
    }
  }, [user, params.id]);

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
    if (user?.role === "ADMIN") return;
    if (event && user && event.createdBy === user.id) return;

    try {
      const res = await fetch(`${base}/api/reservations`, {
        credentials: "include",
      });
      const data = await res.json();

      const eventReservations = data.filter(
        (r: any) =>
          r.eventId === params.id && r.status === "ACTIVE"
      );

      setHasReservation(eventReservations.length > 0);

      const reserved = new Set<string>();
      eventReservations.forEach((r: any) => {
        if (r.foodItemId) reserved.add(r.foodItemId);
      });

      setReservedFoodItems(reserved);
    } catch {}
  };

  const fetchFeedbacks = async () => {
    try {
      const res = await fetch(
        `${base}/api/feedback/event/${params.id}`
      );
      const data = await res.json();
      setFeedbacks(data);
    } catch {}
  };

  const handleReserve = async (foodItemId: string) => {
    if (!user) return router.push("/login");

    if (user.role === "ADMIN")
      return setError(
        "Admins cannot reserve food. Please use a student account."
      );

    if (isEventCreator)
      return setError(
        "You cannot reserve food from your own event."
      );

    if (reservedFoodItems.has(foodItemId))
      return setError("You already reserved this item.");

    setLoading(foodItemId);

    try {
      const res = await fetch(`${base}/api/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          eventId: params.id,
          foodItemId,
          quantity: 1,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to reserve");
        setLoading(null);
        return;
      }

      setSuccess(
        "Reservation successful! Check your email for confirmation."
      );
      setHasReservation(true);
      setReservedFoodItems(prev => new Set([...prev, foodItemId]));

      await fetchEvent();
      await checkReservation();

      setLoading(null);
    } catch {
      setError("Network error");
      setLoading(null);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this event?")) return;

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

      setSuccess("Event deleted!");
      setTimeout(() => router.push("/events"), 1000);
    } catch {
      setError("Network error");
    }
  };

  const handleSubmitFeedback = async () => {
    if (!hasReservation)
      return setError(
        "You must reserve food from this event before leaving feedback."
      );

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
      <Container
        maxWidth="md"
        sx={{
          py: 4,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  const formatDate = (d: string) =>
    new Date(d).toLocaleString();

  const canReserve = event.foodItems?.some(
    (item: any) => item.reserved < item.quantity
  );

  const isAdmin = user?.role === "ADMIN";
  const isStudent = user && user.role !== "ADMIN";
  const canEdit = isAdmin || (user && event.createdBy === user.id);
  const isEventCreator = user && event.createdBy === user.id;

  // ✅ Correct Supabase image logic
  const imageSrc = getEventImageSrc(event);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {imageSrc && (
        <CardMedia
          component="img"
          height="400"
          image={imageSrc}
          alt={event.title}
          sx={{ mb: 2, borderRadius: 2 }}
        />
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
          mb: 2,
        }}
      >
        <Typography variant="h4">{event.title}</Typography>

        {canEdit && (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Link
              href={`/events/${params.id}/edit`}
              style={{ textDecoration: "none" }}
            >
              <Button variant="outlined" size="small">
                Edit
              </Button>
            </Link>

            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </Box>
        )}
      </Box>

      <Typography sx={{ mb: 1 }}>
        <strong>Location:</strong> {event.location}
      </Typography>

      <Typography>
        <strong>Time:</strong>{" "}
        {formatDate(event.startTime)} –{" "}
        {formatDate(event.endTime)}
      </Typography>

      {event.description && (
        <Typography sx={{ mt: 2 }}>
          {event.description}
        </Typography>
      )}

      {/* FOOD SECTION */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Available Food
        </Typography>

        {event.foodItems?.map((item: any) => (
          <Chip
            key={item.id}
            label={`${item.name} — ${
              item.quantity - item.reserved
            }/${item.quantity} available`}
            color={
              item.reserved < item.quantity
                ? "success"
                : "default"
            }
            sx={{ mr: 1, mb: 1 }}
          />
        ))}
      </Box>

      {isStudent && !hasReservation && canReserve && (
        <Box sx={{ mt: 3 }}>
          <Button variant="contained" onClick={() => handleReserve(event.foodItems[0].id)}>
            Reserve Food
          </Button>
        </Box>
      )}

      {isStudent && hasReservation && (
        <Alert severity="success" sx={{ mt: 2 }}>
          You reserved food from this event.
        </Alert>
      )}

      {!canReserve && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          No food available. Reservations closed.
        </Alert>
      )}

      {isEventCreator && (
        <Alert severity="info" sx={{ mt: 2 }}>
          You created this event and cannot reserve food from it.
        </Alert>
      )}

      {/* FEEDBACK FORM */}
      {isStudent && hasReservation && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Leave Feedback
            </Typography>

            <Rating
              value={rating}
              onChange={(_, v) => setRating(v || 0)}
              size="large"
            />

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Comment (optional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              sx={{ mt: 2 }}
            />

            <Button
              sx={{ mt: 2 }}
              variant="contained"
              disabled={rating === 0}
              onClick={handleSubmitFeedback}
            >
              Submit Feedback
            </Button>
          </CardContent>
        </Card>
      )}

      {/* FEEDBACK LIST */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Feedback ({feedbacks.length})
          </Typography>

          {feedbacks.length === 0 ? (
            <Alert severity="info">
              No feedback yet.
            </Alert>
          ) : (
            feedbacks.map((fb: any, idx: number) => (
              <Box key={fb.id}>
                <Typography sx={{ fontWeight: 500 }}>
                  {fb.user?.name || fb.user?.email}
                </Typography>

                <Rating
                  value={fb.rating}
                  readOnly
                  size="small"
                  sx={{ my: 1 }}
                />

                {fb.comment && (
                  <Typography sx={{ mb: 2 }}>
                    {fb.comment}
                  </Typography>
                )}

                {idx < feedbacks.length - 1 && (
                  <Divider sx={{ my: 2 }} />
                )}
              </Box>
            ))
          )}
        </CardContent>
      </Card>

      {/* SNACKBARS */}
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
