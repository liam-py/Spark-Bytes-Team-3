"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Alert,
  CircularProgress,
  Button,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useRouter } from "next/navigation";

const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function AnalyticsPage() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(`${base}/api/analytics/overview`, {
        credentials: "include",
      });
      if (res.status === 401 || res.status === 403) {
        router.push("/");
        return;
      }
      const data = await res.json();
      setAnalytics(data);
    } catch {
      setError("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container
        maxWidth="lg"
        sx={{ py: 4, display: "flex", justifyContent: "center" }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (error || !analytics) {
    return (
      <Container>
        <Alert severity="error">
          {error || "You don't have permission to view analytics"}
        </Alert>
      </Container>
    );
  }

  const pieData = [
    { name: "With Dietary Options", value: analytics.eventsWithDietaryOptions },
    {
      name: "Without Dietary Options",
      value: analytics.totalEvents - analytics.eventsWithDietaryOptions,
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ fontWeight: 600, mb: 3 }}
      >
        Analytics Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ boxShadow: 2, height: "100%" }}>
            <CardContent>
              <Typography
                color="text.secondary"
                gutterBottom
                variant="body2"
                sx={{ fontWeight: 500 }}
              >
                Total Events
              </Typography>
              <Typography
                variant="h4"
                sx={{ fontWeight: 600, color: "primary.main" }}
              >
                {analytics.totalEvents}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ boxShadow: 2, height: "100%" }}>
            <CardContent>
              <Typography
                color="text.secondary"
                gutterBottom
                variant="body2"
                sx={{ fontWeight: 500 }}
              >
                Total Reservations
              </Typography>
              <Typography
                variant="h4"
                sx={{ fontWeight: 600, color: "primary.main" }}
              >
                {analytics.totalReservations}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ boxShadow: 2, height: "100%" }}>
            <CardContent>
              <Typography
                color="text.secondary"
                gutterBottom
                variant="body2"
                sx={{ fontWeight: 500 }}
              >
                Total Users
              </Typography>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 600, color: "primary.main" }}
                >
                  {analytics.totalUsers}
                </Typography>
                <Button
                  size="small"
                  onClick={() => router.push("/admin/users")}
                >
                  Manage
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ boxShadow: 2, height: "100%" }}>
            <CardContent>
              <Typography
                color="text.secondary"
                gutterBottom
                variant="body2"
                sx={{ fontWeight: 500 }}
              >
                Events with Dietary Options
              </Typography>
              <Typography
                variant="h4"
                sx={{ fontWeight: 600, color: "primary.main" }}
              >
                {analytics.eventsWithDietaryOptions}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ fontWeight: 600, mb: 2 }}
        >
          Events by Organizer
        </Typography>
        <BarChart
          width={800}
          height={300}
          data={analytics.organizerStats}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="organizerName" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="eventCount" fill="#8884d8" />
        </BarChart>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ fontWeight: 600, mb: 2 }}
        >
          Events with Dietary Options
        </Typography>
        <PieChart width={400} height={300}>
          <Pie
            data={pieData}
            cx={200}
            cy={150}
            labelLine={false}
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </Box>
    </Container>
  );
}

