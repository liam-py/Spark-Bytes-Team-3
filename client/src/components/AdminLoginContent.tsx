"use client";

import React, { useState } from "react";
import { TextField, Button, Typography, Box, Alert, Snackbar, Divider } from "@mui/material";
import { useRouter } from "next/navigation";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/app/providers/AuthProvider";

const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export default function AdminLoginContent() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { refreshUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${base}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Login failed");
        setLoading(false);
        return;
      }
      
      // Check if user is admin
      if (data.user?.role !== "ADMIN") {
        setError("Access denied. Admin login required.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      await refreshUser(); // refresh global auth provider
      setTimeout(() => {
        router.push("/admin/analytics");
      }, 1000);
    } catch {
      setError("Network error");
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (codeResponse: any) => {
    setGoogleLoading(true);
    setError("");

    try {
      const redirectUri = window.location.origin;
      console.log('Sending Google OAuth code to backend:', { 
        hasCode: !!codeResponse.code,
        redirectUri 
      });
      
      const res = await fetch(`${base}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ code: codeResponse.code, redirectUri }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        console.error('Google OAuth error response:', data);
        setError(data?.error || "Google sign-in failed");
        setGoogleLoading(false);
        return;
      }

      // Check if user is admin
      if (data.user?.role !== "ADMIN") {
        setError("Access denied. Admin login required.");
        setGoogleLoading(false);
        return;
      }

      setSuccess(true);
      await refreshUser(); // refresh global auth provider
      setTimeout(() => {
        router.push("/admin/analytics");
      }, 1000);
    } catch (err: any) {
      console.error('Google OAuth network error:', err);
      setError("Network error during Google sign-in");
      setGoogleLoading(false);
    }
  };

  const handleGoogleError = (error: any) => {
    console.error('Google OAuth error:', error);
    setError("Google sign-in was cancelled or failed");
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: handleGoogleError,
    flow: "auth-code",
  });

  return (
    <Box>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Admin Login - Enter your admin credentials
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          margin="normal"
          placeholder="admin@bu.edu"
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          margin="normal"
          placeholder="password"
          inputProps={{ minLength: 6 }}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          disabled={loading || googleLoading}
        >
          {loading ? "Logging in..." : "Log in as Admin"}
        </Button>
      </form>

      <Divider sx={{ my: 3 }}>OR</Divider>

      <Button
        variant="outlined"
        fullWidth
        onClick={() => googleLogin()}
        disabled={loading || googleLoading}
        sx={{ 
          mb: 2,
          textTransform: "none",
        }}
      >
        {googleLoading ? "Signing in..." : "Sign in with Google"}
      </Button>

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
        <Alert severity="success">Login successful! Redirecting...</Alert>
      </Snackbar>
    </Box>
  );
}
