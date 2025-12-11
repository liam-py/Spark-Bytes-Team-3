"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Link from "next/link";
import EventCard from "@/components/EventCard";

const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    dietaryFilters: [] as string[],
  });
  const [userPrefs, setUserPrefs] = useState<any>(null);

  useEffect(() => {
    fetchUser();
    fetchEvents();
    fetchUserPrefs();
  }, [filters]);

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

  const fetchUserPrefs = async () => {
    try {
      const res = await fetch(`${base}/api/dietary`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data) {
        setUserPrefs(data);
        // Auto-apply dietary filters if user has preferences
        const dietaryFilters: string[] = [];
        if (data.isVegan) dietaryFilters.push("vegan");
        if (data.isVegetarian) dietaryFilters.push("vegetarian");
        if (data.isHalal) dietaryFilters.push("halal");
        if (data.isKosher) dietaryFilters.push("kosher");
        if (dietaryFilters.length > 0 && filters.dietaryFilters.length === 0) {
          setFilters((prev) => ({ ...prev, dietaryFilters }));
        }
      }
    } catch {
      // User not logged in or no preferences
    }
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append("search", filters.search);
      if (filters.location) params.append("location", filters.location);
      filters.dietaryFilters.forEach((filter) => {
        params.append("dietaryFilters", filter);
      });

      const res = await fetch(`${base}/api/events?${params.toString()}`);
      const data = await res.json();
      setEvents(data);
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = user?.role === "ADMIN";

  return (
    <>
      {/* Admin CTA Banner */}
      {isAdmin && (
        <Paper
          elevation={4}
          square={true}
          sx={{
            width: "100%",
            background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
            color: "white",
            py: 6,
            mb: 4,
          }}
        >
          <Container maxWidth="lg">
            {/* Banner Content */}
            <Box
              sx={{
                background: "transparent",
                color: "white",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 3,
              }}
            >
              {/* Banner Title */}
              <Box sx={{ width: "100%", gap: 1.5, mb: 1.5 }}>
                  <Typography variant="h2" component="h2" fontWeight="bold" sx={{ width: "100%", textAlign: "center" }}>
                    Hungry Students Await
                  </Typography>
              </Box>
              {/* Banner Description */}
              <Box sx={{ width: "100%", gap: 1.5, mb: 1.5, display: "flex", justifyContent: "center" }}>
                <Link href="/events/new" style={{ textDecoration: "none", width: "50%" }}>
                  <Button
                    variant="contained"
                    size="large"
                    sx={{
                      bgcolor: "white",
                      color: "#1976d2",
                      textTransform: "none",
                      "&:hover": {
                        bgcolor: "rgba(255, 255, 255, 0.9)",
                        transform: "translateY(-2px)",
                      },
                      fontSize: "1.3rem",
                      fontWeight: 600,
                      transition: "all 0.2s ease-in-out",
                      flexShrink: 0,
                      width: "100%"
                    }}
                  >
                    Create Event
                  </Button>
                </Link>
              </Box>
              
            </Box>
          </Container>
        </Paper>
      )}

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{display: "flex", justifyContent: "left", gap: 3}}>
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            Browse Events
          </Typography>
          {isAdmin && (
            <Typography variant="h4" component="h1" gutterBottom sx={{ opacity: 0.5 }}>
              View My Past Events
            </Typography>
          )}
        </Box>

      <Box sx={{ mb: 4, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <TextField
          label="Search"
          value={filters.search}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, search: e.target.value }))
          }
          sx={{ minWidth: 200 }}
        />
        <TextField
          label="Location"
          value={filters.location}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, location: e.target.value }))
          }
          sx={{ minWidth: 200 }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Dietary Filters</InputLabel>
          <Select
            multiple
            value={filters.dietaryFilters}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                dietaryFilters: e.target.value as string[],
              }))
            }
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {(selected as string[]).map((value) => (
                  <Chip key={value} label={value} size="small" />
                ))}
              </Box>
            )}
          >
            <MenuItem value="vegan">Vegan</MenuItem>
            <MenuItem value="vegetarian">Vegetarian</MenuItem>
            <MenuItem value="halal">Halal</MenuItem>
            <MenuItem value="kosher">Kosher</MenuItem>
            <MenuItem value="gluten-free">Gluten-Free</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : events.length === 0 ? (
        <Typography>No events found</Typography>
      ) : (
        <Grid container spacing={3}>
          {events.map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event.id}>
              <EventCard event={event} />
            </Grid>
          ))}
        </Grid>
      )}
      </Container>
    </>
  );
}

