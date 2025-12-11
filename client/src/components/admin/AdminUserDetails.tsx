"use client";

import React from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { AdminUserDetails } from "./types";

type AdminUserDetailsProps = {
  user: AdminUserDetails | null;
  loading: boolean;
  error?: string;
};

const formatDate = (value: string) => {
  const date = new Date(value);
  return date.toLocaleString();
};

export default function AdminUserDetailsPanel({
  user,
  loading,
  error,
}: AdminUserDetailsProps) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5 }}>
          User Details
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : !user ? (
          <Typography variant="body2" color="text.secondary">
            Select a user to view details.
          </Typography>
        ) : (
          <Stack spacing={2.5}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {user.name || user.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Chip
                  label={user.role}
                  color={user.role === "ADMIN" ? "primary" : "default"}
                  size="small"
                />
              </Box>
            </Box>

            <Stack direction="row" spacing={2}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 1,
                  backgroundColor: "grey.100",
                  minWidth: 120,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Created events
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {user.createdEventsCount}
                </Typography>
              </Box>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 1,
                  backgroundColor: "grey.100",
                  minWidth: 120,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Reservations
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {user.reservationsCount}
                </Typography>
              </Box>
            </Stack>

            <Divider />

            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Created Events
              </Typography>
              {user.createdEvents.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  None
                </Typography>
              ) : (
                <Stack spacing={1.2}>
                  {user.createdEvents.map((event) => (
                    <Box
                      key={event.id}
                      sx={{
                        p: 1.2,
                        borderRadius: 1,
                        border: "1px solid",
                        borderColor: "grey.200",
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {event.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {event.location}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(event.startTime)} - {formatDate(event.endTime)}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              )}
            </Box>

            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Reservations
              </Typography>
              {user.reservations.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  None
                </Typography>
              ) : (
                <Stack spacing={1.2}>
                  {user.reservations.map((reservation) => (
                    <Box
                      key={reservation.id}
                      sx={{
                        p: 1.2,
                        borderRadius: 1,
                        border: "1px solid",
                        borderColor: "grey.200",
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {reservation.eventTitle}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(reservation.createdAt)}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              )}
            </Box>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
