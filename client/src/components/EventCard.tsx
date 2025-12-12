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
import { getEventImageSrc } from "@/lib/eventImage";

export default function EventCard({ event }: { event: any }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // ✅ Correct Supabase-compatible image logic
  const imageSrc = getEventImageSrc(event);

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        boxShadow: 2,
        transition: "all 0.2s",
        "&:hover": { boxShadow: 4, transform: "translateY(-2px)" },
      }}
    >
      {imageSrc && (
        <CardMedia
          component="img"
          height="200"
          image={imageSrc}
          alt={event.title}
          sx={{ objectFit: "cover" }}
        />
      )}

      <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
          {event.title}
        </Typography>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          {event.location}
        </Typography>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          {formatDate(event.startTime)} – {formatDate(event.endTime)}
        </Typography>

        <Box sx={{ mt: 1, mb: 2, flexGrow: 1 }}>
          {event.foodItems?.length > 0 ? (
            event.foodItems.map((item: any) => (
              <Chip
                key={item.id}
                label={`${item.name} (${item.quantity - item.reserved}/${item.quantity})`}
                size="small"
                sx={{ mr: 0.5, mb: 0.5 }}
                color={item.quantity - item.reserved > 0 ? "primary" : "default"}
              />
            ))
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontStyle: "italic" }}
            >
              No food items listed
            </Typography>
          )}
        </Box>

        <Link href={`/events/${event.id}`} style={{ textDecoration: "none" }}>
          <Button variant="contained" fullWidth sx={{ mt: "auto" }}>
            View Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
