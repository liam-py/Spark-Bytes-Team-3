"use client";

import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Snackbar,
} from "@mui/material";
import { useRouter } from "next/navigation";

const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export default function SignupContent() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateBUEmail = (email: string) => {
    return email.endsWith("@bu.edu");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateBUEmail(email)) {
      setError("Only BU email addresses (@bu.edu) are allowed");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${base}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Sign up failed");
        setLoading(false);
        return;
      }
      setSuccess(true);
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch {
      setError("Network error");
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Create a new account
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
          placeholder="your name (optional)"
        />

        <TextField
          fullWidth
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          margin="normal"
          placeholder="email@bu.edu"
          error={!!email && !validateBUEmail(email)}
          helperText={
            email && !validateBUEmail(email)
              ? "Only BU email addresses (@bu.edu) are allowed"
              : ""
          }
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          margin="normal"
          placeholder="password (≥ 6 chars)"
          inputProps={{ minLength: 6 }}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign up"}
        </Button>
      </form>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError("")}
      >
        <Alert severity="error" onClose={() => setError("")}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={success}
        autoHideDuration={2000}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success">Account created! Redirecting...</Alert>
      </Snackbar>
    </Box>
  );
}
