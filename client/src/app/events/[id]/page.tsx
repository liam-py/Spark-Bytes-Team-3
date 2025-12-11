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
<<<<<<< HEAD
} from "@mui/material";
=======
  Divider,
  Grid,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DeleteIcon from "@mui/icons-material/Delete";
>>>>>>> bc462f422b0c6a09b358738db66beaf94bfb33e4
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [hasReservation, setHasReservation] = useState(false);
<<<<<<< HEAD
=======
  const [reservedFoodItems, setReservedFoodItems] = useState<Set<string>>(new Set());
>>>>>>> bc462f422b0c6a09b358738db66beaf94bfb33e4
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
<<<<<<< HEAD
=======
  const [loading, setLoading] = useState<string | null>(null);
>>>>>>> bc462f422b0c6a09b358738db66beaf94bfb33e4

  useEffect(() => {
    fetchEvent();
    fetchUser();
<<<<<<< HEAD
    checkReservation();
    fetchFeedbacks();
  }, [params.id]);

=======
  }, [params.id]);

  useEffect(() => {
    if (user) {
      checkReservation();
      fetchFeedbacks();
    }
  }, [user, params.id]);

>>>>>>> bc462f422b0c6a09b358738db66beaf94bfb33e4
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
<<<<<<< HEAD
=======
    if (event && user && event.createdBy === user.id) return; // Event creators don't reserve
>>>>>>> bc462f422b0c6a09b358738db66beaf94bfb33e4
    try {
      const res = await fetch(`${base}/api/reservations`, {
        credentials: "include",
      });
      const data = await res.json();
<<<<<<< HEAD
      const hasReserved = data.some(
        (r: any) => r.eventId === params.id && r.status === "ACTIVE"
      );
      setHasReservation(hasReserved);
=======
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
>>>>>>> bc462f422b0c6a09b358738db66beaf94bfb33e4
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

<<<<<<< HEAD
  const handleReserve = async () => {
=======
  const handleReserve = async (foodItemId: string) => {
>>>>>>> bc462f422b0c6a09b358738db66beaf94bfb33e4
    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role === "ADMIN") {
      setError("Admins cannot reserve food. Please use student account.");
      return;
    }

<<<<<<< HEAD
=======
    if (isEventCreator) {
      setError("You cannot reserve food from your own event.");
      return;
    }

    if (reservedFoodItems.has(foodItemId)) {
      setError("You have already reserved this item");
      return;
    }

    setLoading(foodItemId);
>>>>>>> bc462f422b0c6a09b358738db66beaf94bfb33e4
    try {
      const res = await fetch(`${base}/api/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          eventId: params.id,
<<<<<<< HEAD
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
=======
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
>>>>>>> bc462f422b0c6a09b358738db66beaf94bfb33e4
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const canReserve = event.foodItems?.some(
    (item: any) => item.reserved < item.quantity
  );
  const isAdmin = user?.role === "ADMIN";
  const isStudent = user && user.role !== "ADMIN";
  const canEdit = isAdmin || (user && event.createdBy === user.id);
<<<<<<< HEAD

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
=======
  const imageSrc = (() => {
    if (event.image_url) return event.image_url;
    if (!event.imagePath) return null;
    return typeof event.imagePath === "string" && event.imagePath.startsWith("http")
      ? event.imagePath
      : `${base}${event.imagePath}`;
  })();
  const isEventCreator = user && event.createdBy === user.id;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Event Image */}
      {imageSrc && (
        <CardMedia
          component="img"
          height="400"
          image={imageSrc}
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
>>>>>>> bc462f422b0c6a09b358738db66beaf94bfb33e4
          No food available. Reservations closed.
        </Alert>
      )}

<<<<<<< HEAD
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
=======
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
>>>>>>> bc462f422b0c6a09b358738db66beaf94bfb33e4

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
