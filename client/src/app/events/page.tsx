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
} from "@mui/material";
import Link from "next/link";
import EventCard from "@/components/EventCard";

const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    dietaryFilters: [] as string[],
  });
  const [userPrefs, setUserPrefs] = useState<any>(null);

  useEffect(() => {
    fetchEvents();
    fetchUserPrefs();
  }, [filters]);

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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Browse Events
      </Typography>

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
  );
}

