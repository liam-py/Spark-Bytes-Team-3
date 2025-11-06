"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
} from "@mui/material";
import Link from "next/link";

const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export default function EventCard({ event }: { event: any }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Card>
      {event.imagePath && (
        <CardMedia
          component="img"
          height="200"
          image={`${base}${event.imagePath}`}
          alt={event.title}
        />
      )}
      <CardContent>
        <Typography variant="h6" component="h2" gutterBottom>
          {event.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {event.location}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {formatDate(event.startTime)} - {formatDate(event.endTime)}
        </Typography>
        <Box sx={{ mt: 1, mb: 1 }}>
          {event.foodItems?.map((item: any) => (
            <Chip
              key={item.id}
              label={`${item.name} (${item.quantity - item.reserved}/${item.quantity})`}
              size="small"
              sx={{ mr: 0.5, mb: 0.5 }}
            />
          ))}
        </Box>
        <Link href={`/events/${event.id}`} style={{ textDecoration: "none" }}>
          <Button variant="contained" fullWidth>
            View Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

