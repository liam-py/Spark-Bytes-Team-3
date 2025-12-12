"use client";

import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRouter } from "next/navigation";

const BU_LOCATIONS = [
  "CAS Building (College of Arts & Sciences)",
  "GSU (George Sherman Union)",
  "COM (College of Communication)",
  "ENG (College of Engineering)",
  "Questrom School of Business",
  "Sargent College (Health & Rehabilitation Sciences)",
  "CDS (Center for Data Science)",
  "BU Spark! Space",
  "Metcalf Hall",
  "GSU Food Court",
  "CGSA (Center for Gender, Sexuality, and Activism)",
  "CGS (College of General Studies)",
  "CFA (College of Fine Arts)",
  "Mugar Memorial Library",
  "FitRec (Fitness & Recreation Center)",
  "Warren Towers",
  "West Campus",
  "East Campus",
  "Other",
];

export default function EventForm({ user }: { user: { id: string } }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [locationType, setLocationType] = useState("");
  const [location, setLocation] = useState("");
  const [customLocation, setCustomLocation] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [foodItems, setFoodItems] = useState([
    { name: "", description: "", quantity: 1 },
  ]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLocationChange = (value: string) => {
    setLocationType(value);
    if (value === "Other") {
      setLocation("");
    } else {
      setLocation(value);
      setCustomLocation("");
    }
  };

  const addFoodItem = () => {
    setFoodItems([
      ...foodItems,
      { name: "", description: "", quantity: 1 },
    ]);
  };

  const removeFoodItem = (index: number) => {
    setFoodItems(foodItems.filter((_, i) => i !== index));
  };

  const updateFoodItem = (index: number, field: string, value: any) => {
    const updated = [...foodItems];
    updated[index] = { ...updated[index], [field]: value };
    setFoodItems(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const finalLocation =
      locationType === "Other" ? customLocation : location;

    if (!finalLocation) {
      setError("Please enter a location.");
      setLoading(false);
      return;
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (end <= start) {
      setError("End time must be after start time.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("location", finalLocation);
    formData.append("startTime", start.toISOString());
    formData.append("endTime", end.toISOString());
    formData.append(
      "foodItems",
      JSON.stringify(foodItems.filter((i) => i.name))
    );

    if (user?.id) {
      formData.append("createdBy", user.id);
    }

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create event");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/events"), 1200);
    } catch {
      setError("Network error");
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 800, mx: "auto" }}
    >
      <TextField
        fullWidth
        label="Title"
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        margin="normal"
      />

      <TextField
        fullWidth
        multiline
        rows={3}
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        margin="normal"
      />

      {/* LOCATION SELECT */}
      <FormControl fullWidth required margin="normal">
        <InputLabel>Location</InputLabel>
        <Select
          value={locationType}
          onChange={(e) => handleLocationChange(e.target.value)}
          label="Location"
        >
          {BU_LOCATIONS.map((loc) => (
            <MenuItem key={loc} value={loc}>
              {loc}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {locationType === "Other" && (
        <TextField
          fullWidth
          label="Enter Location"
          value={customLocation}
          onChange={(e) => {
            setCustomLocation(e.target.value);
            setLocation(e.target.value);
          }}
          required
          margin="normal"
        />
      )}

      <TextField
        fullWidth
        label="Start Time"
        type="datetime-local"
        required
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        InputLabelProps={{ shrink: true }}
        margin="normal"
      />

      <TextField
        fullWidth
        label="End Time"
        type="datetime-local"
        required
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
        InputLabelProps={{ shrink: true }}
        margin="normal"
      />

      {/* IMAGE UPLOAD */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle1">Event Image (Optional)</Typography>

        <Button variant="outlined" component="label">
          Upload Image
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setImageFile(file);
            }}
          />
        </Button>

        {imageFile && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            Selected: {imageFile.name}
          </Typography>
        )}
      </Box>

      <Typography variant="h6" sx={{ mt: 3 }}>
        Food Items
      </Typography>

      {foodItems.map((item, index) => (
        <Box
          key={index}
          sx={{
            border: "1px solid #ccc",
            borderRadius: 1,
            p: 2,
            mt: 2,
          }}
        >
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <TextField
              label="Food Name"
              required
              value={item.name}
              onChange={(e) =>
                updateFoodItem(index, "name", e.target.value)
              }
              sx={{ flex: 1 }}
            />

            <TextField
              label="Qty"
              type="number"
              value={item.quantity}
              onChange={(e) =>
                updateFoodItem(index, "quantity", Number(e.target.value))
              }
              sx={{ width: 100 }}
            />

            {foodItems.length > 1 && (
              <IconButton
                onClick={() => removeFoodItem(index)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            )}
          </Box>

          <TextField
            fullWidth
            label="Description (optional)"
            margin="normal"
            value={item.description}
            onChange={(e) =>
              updateFoodItem(index, "description", e.target.value)
            }
          />
        </Box>
      ))}

      <Button
        startIcon={<AddIcon />}
        variant="outlined"
        sx={{ mt: 2 }}
        onClick={addFoodItem}
      >
        Add Food Item
      </Button>

      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{ mt: 4 }}
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Event"}
      </Button>

      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setError("")}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>

      <Snackbar
        open={success}
        autoHideDuration={2000}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success">
          Event created successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
}
