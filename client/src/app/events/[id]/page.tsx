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

const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [hasReservation, setHasReservation] = useState(false);
  const [reservedFoodItems, setReservedFoodItems] = useState<Set<string>>(new Set());
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
    if (user?.role === "ADMIN") return; // Admins don't reserve
    if (event && user && event.createdBy === user.id) return; // Event creators don't reserve
    try {
      const res = await fetch(`${base}/api/reservations`, {
        credentials: "include",
      });
      const data = await res.json();
      const eventReservations = data.filter(
        (r: any) => r.eventId === params.id && r.status === "ACTIVE"
      );
      const hasReserved = eventReservations.length > 0;
      setHasReservation(hasReserved);
      
      // Track which specific food items are reserved
      const reservedItems = new Set<string>();
      eventReservations.forEach((r: any) => {
        if (r.foodItemId) {
          reservedItems.add(r.foodItemId);
        }
      });
      setReservedFoodItems(reservedItems);
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

  const handleReserve = async (foodItemId: string) => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role === "ADMIN") {
      setError("Admins cannot reserve food. Please use student account.");
      return;
    }

    if (isEventCreator) {
      setError("You cannot reserve food from your own event.");
      return;
    }

    if (reservedFoodItems.has(foodItemId)) {
      setError("You have already reserved this item");
      return;
    }

    setLoading(foodItemId);
    try {
      const res = await fetch(`${base}/api/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          eventId: params.id,
          foodItemId: foodItemId,
          quantity: 1,
        }),
      });      
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to reserve");
        setLoading(null);
        return;
      }
      setSuccess("Reservation successful! Check your email for confirmation.");
      setHasReservation(true);
      setReservedFoodItems(prev => new Set([...prev, foodItemId]));
      await fetchEvent(); // Refresh event to update availability
      await checkReservation(); // Refresh reservation status
      setLoading(null);
    } catch {
      setError("Network error");
      setLoading(null);
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
      <Container maxWidth="md" sx={{ py: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
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
  const isEventCreator = user && event.createdBy === user.id;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Event Image */}
      {event.imagePath && (
        <CardMedia
          component="img"
          height="400"
          image={`${base}${event.imagePath}`}
          alt={event.title}
          sx={{ mb: 3, borderRadius: 2, boxShadow: 2 }}
        />
      )}

      {/* Event Header */}
      <Card sx={{ mb: 3, boxShadow: 2 }}>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "start", mb: 2 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
              {event.title}
            </Typography>
            {canEdit && (
              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton 
                  color="error" 
                  size="small" 
                  onClick={handleDelete}
                  title="Delete Event"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            )}
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Event Details */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LocationOnIcon color="primary" />
                <Typography variant="body1">
                  <strong>Location:</strong> {event.location}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <AccessTimeIcon color="primary" />
                <Typography variant="body1">
                  <strong>Time:</strong> {formatDate(event.startTime)} - {formatDate(event.endTime)}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {event.description && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body1" sx={{ mt: 2, color: "text.secondary" }}>
                {event.description}
              </Typography>
            </>
          )}
        </CardContent>
      </Card>

      {/* Food Items */}
      <Card sx={{ mb: 3, boxShadow: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
            Available Food
          </Typography>
          {event.foodItems?.length === 0 ? (
            <Alert severity="info">No food items available for this event.</Alert>
          ) : (
            <Grid container spacing={2}>
              {event.foodItems?.map((item: any) => {
                const isReserved = reservedFoodItems.has(item.id);
                const isAvailable = item.reserved < item.quantity;
                const isDisabled = !isAvailable || isReserved || loading === item.id || isEventCreator;

                return (
                  <Grid item xs={12} key={item.id}>
                    <Card
                      variant="outlined"
                      sx={{
                        p: 2,
                        backgroundColor: isReserved ? "action.selected" : "background.paper",
                        opacity: isReserved ? 0.7 : 1,
                        transition: "all 0.2s",
                      }}
                    >
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>
                            {item.name}
                          </Typography>
                          {item.description && (
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {item.description}
                            </Typography>
                          )}
                          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1 }}>
                            {item.dietaryInfo?.map((diet: string, idx: number) => (
                              <Chip
                                key={idx}
                                label={diet}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            ))}
                          </Box>
                          <Chip
                            label={`${item.quantity - item.reserved}/${item.quantity} available`}
                            color={isAvailable ? "success" : "default"}
                            size="small"
                            sx={{ mt: 1 }}
                          />
                        </Box>
                        <Box sx={{ ml: 2 }}>
                          {isReserved ? (
                            <Button
                              variant="outlined"
                              disabled
                              startIcon={<CheckCircleIcon />}
                              sx={{
                                minWidth: 120,
                                backgroundColor: "success.light",
                                color: "success.dark",
                                "&.Mui-disabled": {
                                  backgroundColor: "action.disabledBackground",
                                  color: "action.disabled",
                                  borderColor: "action.disabled",
                                },
                              }}
                            >
                              Reserved
                            </Button>
                          ) : (
                            <Button
                              variant="contained"
                              disabled={isDisabled}
                              onClick={() => handleReserve(item.id)}
                              sx={{ minWidth: 120 }}
                            >
                              {loading === item.id ? "Reserving..." : "Reserve"}
                            </Button>
                          )}
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </CardContent>
      </Card>

      {isStudent && hasReservation && (
        <Alert severity="success" sx={{ mb: 3 }} icon={<CheckCircleIcon />}>
          You have reserved food from this event. Check your email for confirmation!
        </Alert>
      )}

      {!canReserve && event.foodItems?.length > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          No food available. Reservations closed.
        </Alert>
      )}

      {isEventCreator && (
        <Alert severity="info" sx={{ mb: 3 }}>
          You created this event. You cannot reserve food from your own event.
        </Alert>
      )}

      {/* Student-only: Feedback form */}
      {isStudent && hasReservation && (
        <Card sx={{ mb: 3, boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Leave Feedback
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Share your experience with this event
            </Typography>
            <Rating
              value={rating}
              onChange={(_, newValue) => setRating(newValue || 0)}
              size="large"
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
              placeholder="Tell us what you thought about the food and event..."
            />
            <Button variant="contained" onClick={handleSubmitFeedback} disabled={rating === 0}>
              Submit Feedback
            </Button>
          </CardContent>
        </Card>
      )}

      <Card sx={{ boxShadow: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Feedback ({feedbacks.length})
          </Typography>
          {feedbacks.length === 0 ? (
            <Alert severity="info">No feedback yet. Be the first to share your thoughts!</Alert>
          ) : (
            <Box>
              {feedbacks.map((feedback, idx) => (
                <Box key={feedback.id}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      {feedback.user?.name || feedback.user?.email}
                    </Typography>
                    <Rating value={feedback.rating} readOnly size="small" sx={{ ml: 2 }} />
                  </Box>
                  {feedback.comment && (
                    <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
                      {feedback.comment}
                    </Typography>
                  )}
                  {idx < feedbacks.length - 1 && <Divider sx={{ my: 2 }} />}
                </Box>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>

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
