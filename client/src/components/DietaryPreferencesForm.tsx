"use client";

import React, { useState, useEffect } from "react";
import {
  FormControlLabel,
  Checkbox,
  TextField,
  Button,
  Box,
  Typography,
  Chip,
  Alert,
  Snackbar,
} from "@mui/material";
import { useRouter } from "next/navigation";

const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export default function DietaryPreferencesForm({ onSkip }: { onSkip?: () => void }) {
  const router = useRouter();
  const [isVegan, setIsVegan] = useState(false);
  const [isVegetarian, setIsVegetarian] = useState(false);
  const [isHalal, setIsHalal] = useState(false);
  const [isKosher, setIsKosher] = useState(false);
  const [allergies, setAllergies] = useState("");
  const [otherRestrictions, setOtherRestrictions] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const res = await fetch(`${base}/api/dietary`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data) {
        setIsVegan(data.isVegan || false);
        setIsVegetarian(data.isVegetarian || false);
        setIsHalal(data.isHalal || false);
        setIsKosher(data.isKosher || false);
        setAllergies(data.allergies?.join(", ") || "");
        setOtherRestrictions(data.otherRestrictions || "");
      }
    } catch {
      // Not logged in or no preferences
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const allergiesArray = allergies
        .split(",")
        .map((a) => a.trim())
        .filter((a) => a);

      const res = await fetch(`${base}/api/dietary`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          isVegan,
          isVegetarian,
          isHalal,
          isKosher,
          allergies: allergiesArray,
          otherRestrictions: otherRestrictions || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save preferences");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        if (onSkip) {
          onSkip();
        } else {
          router.push("/");
        }
      }, 1000);
    } catch {
      setError("Network error");
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>
        Dietary Preferences
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Help us show you food you can eat
      </Typography>

      <FormControlLabel
        control={
          <Checkbox
            checked={isVegan}
            onChange={(e) => setIsVegan(e.target.checked)}
          />
        }
        label="Vegan"
      />
      <br />
      <FormControlLabel
        control={
          <Checkbox
            checked={isVegetarian}
            onChange={(e) => setIsVegetarian(e.target.checked)}
          />
        }
        label="Vegetarian"
      />
      <br />
      <FormControlLabel
        control={
          <Checkbox
            checked={isHalal}
            onChange={(e) => setIsHalal(e.target.checked)}
          />
        }
        label="Halal"
      />
      <br />
      <FormControlLabel
        control={
          <Checkbox
            checked={isKosher}
            onChange={(e) => setIsKosher(e.target.checked)}
          />
        }
        label="Kosher"
      />

      <TextField
        fullWidth
        label="Allergies (comma-separated)"
        value={allergies}
        onChange={(e) => setAllergies(e.target.value)}
        margin="normal"
        placeholder="e.g., peanuts, shellfish, dairy"
      />

      <TextField
        fullWidth
        multiline
        rows={3}
        label="Other Restrictions"
        value={otherRestrictions}
        onChange={(e) => setOtherRestrictions(e.target.value)}
        margin="normal"
      />

      <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? "Saving..." : "Save Preferences"}
        </Button>
        {onSkip && (
          <Button variant="outlined" onClick={onSkip}>
            Skip
          </Button>
        )}
      </Box>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError("")}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>

      <Snackbar
        open={success}
        autoHideDuration={2000}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success">Preferences saved!</Alert>
      </Snackbar>
    </Box>
  );
}

