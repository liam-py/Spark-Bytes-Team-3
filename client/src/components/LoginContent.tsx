"use client";

import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Snackbar,
  Divider,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useGoogleLogin } from "@react-oauth/google";

const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export default function LoginContent({ userType = "student" }: { userType?: "student" | "admin" }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

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
      
      // For student login, reject admins
      if (userType === "student" && data.user?.role === "ADMIN") {
        setError("Please use the admin login page for admin access.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      // sends an event to let rest of site (navbar) know that there's been 
      window.dispatchEvent(new Event("authchange"));
      setTimeout(() => {
        // Redirect based on role
        if (data.user?.role === "ADMIN") {
          router.push("/admin/analytics");
        } else {
          router.push("/");
        }
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
      // The redirect URI must match exactly what's in Google Cloud Console
      // For @react-oauth/google with auth-code flow, it uses the current origin
      const redirectUri = window.location.origin;
      
      console.log('Google OAuth response:', {
        hasCode: !!codeResponse.code,
        redirectUri,
        fullResponse: codeResponse
      });
      
      const res = await fetch(`${base}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ 
          code: codeResponse.code, 
          redirectUri: redirectUri 
        }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        console.error('Google OAuth error response:', data);
        setError(data?.error || "Google sign-in failed");
        setGoogleLoading(false);
        return;
      }

      // For student login, reject admins
      if (userType === "student" && data.user?.role === "ADMIN") {
        setError("Please use the admin login page for admin access.");
        setGoogleLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        if (data.user?.role === "ADMIN") {
          router.push("/admin/analytics");
        } else {
          router.push("/");
        }
      }, 1000);
    } catch (err: any) {
      console.error('Google OAuth network error:', err);
      setError("Network error during Google sign-in: " + (err.message || "Unknown error"));
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
        Enter existing email and password
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
          placeholder="email@bu.edu"
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
          {loading ? "Logging in..." : "Log in"}
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
