"use client";

import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Chip,
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

export default function EventForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [locationType, setLocationType] = useState("");
  const [customLocation, setCustomLocation] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [foodItems, setFoodItems] = useState([
    { name: "", description: "", quantity: 1, dietaryInfo: [] as string[] },
  ]);
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const addFoodItem = () => {
    setFoodItems([
      ...foodItems,
      { name: "", description: "", quantity: 1, dietaryInfo: [] },
    ]);
  };

  const removeFoodItem = (index: number) => {
    setFoodItems(foodItems.filter((_, i) => i !== index));
  };

  const updateFoodItem = (
    index: number,
    field: string,
    value: any
  ) => {
    const updated = [...foodItems];
    updated[index] = { ...updated[index], [field]: value };
    setFoodItems(updated);
  };

  const handleLocationChange = (value: string) => {
    setLocationType(value);
    if (value === "Other") {
      setLocation("");
    } else {
      setLocation(value);
      setCustomLocation("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setImageError("");
    setLoading(true);

    // Determine final location value
    const finalLocation = locationType === "Other" ? customLocation : location;
    
    if (!finalLocation) {
      setError("Please enter a location");
      setLoading(false);
      return;
    }

    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      setError("Please provide valid start and end times");
      setLoading(false);
      return;
    }
    if (endDate <= startDate) {
      setError("End time must be after start time");
      setLoading(false);
      return;
    }

    // Build multipart form data
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("location", finalLocation);
    formData.append("startTime", new Date(startTime).toISOString());
    formData.append("endTime", new Date(endTime).toISOString());
    formData.append(
      "foodItems",
      JSON.stringify(foodItems.filter((item) => item.name))
    );

    if (imageFile) {
      if (!imageFile.type.match(/^image\//)) {
        setImageError("Invalid image type");
        setLoading(false);
        return;
      }
      if (imageFile.size > 5 * 1024 * 1024) {
        setImageError("Image size must be less than 5MB");
        setLoading(false);
        return;
      }
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
      setTimeout(() => {
        router.push("/events");
      }, 1000);
    } catch {
      setError("Network error");
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 800, mx: "auto" }}>
      <TextField
        fullWidth
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        margin="normal"
      />
      <TextField
        fullWidth
        multiline
        rows={4}
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        margin="normal"
      />
      <FormControl fullWidth required margin="normal">
        <InputLabel id="location-label">Location</InputLabel>
        <Select
          labelId="location-label"
          value={locationType}
          onChange={(e) => handleLocationChange(e.target.value)}
          label="Location"
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 300,
              },
            },
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left',
            },
            transformOrigin: {
              vertical: 'top',
              horizontal: 'left',
            },
            transitionDuration: 200,
          }}
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
          sx={{ mt: 1 }}
        />
      )}
      <TextField
        fullWidth
        label="Start Time"
        type="datetime-local"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        required
        margin="normal"
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        fullWidth
        label="End Time"
        type="datetime-local"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
        required
        margin="normal"
        InputLabelProps={{ shrink: true }}
      />

      <Box sx={{ mt: 2, mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Event Image (Optional)
        </Typography>
        <Button variant="outlined" component="label">
          Upload Image
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setImageFile(file);
              setImageError("");
            }}
          />
        </Button>
        {imageFile && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            Selected: {imageFile.name}
          </Typography>
        )}
        {imageError && (
          <Alert severity="error" sx={{ mt: 1 }}>
            {imageError}
          </Alert>
        )}
      </Box>

      <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
        Food Items
      </Typography>
      {foodItems.map((item, index) => (
        <Box key={index} sx={{ mb: 2, p: 2, border: "1px solid #ccc", borderRadius: 1 }}>
          <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
            <TextField
              label="Food Name"
              value={item.name}
              onChange={(e) => updateFoodItem(index, "name", e.target.value)}
              required
              sx={{ flex: 1 }}
            />
            <TextField
              label="Quantity"
              type="number"
              value={item.quantity}
              onChange={(e) =>
                updateFoodItem(index, "quantity", parseInt(e.target.value) || 1)
              }
              required
              sx={{ width: 120 }}
              inputProps={{ min: 1 }}
            />
            {foodItems.length > 1 && (
              <IconButton onClick={() => removeFoodItem(index)} color="error">
                <DeleteIcon />
              </IconButton>
            )}
          </Box>
          <TextField
            fullWidth
            label="Description (optional)"
            value={item.description}
            onChange={(e) => updateFoodItem(index, "description", e.target.value)}
            margin="normal"
            size="small"
          />
        </Box>
      ))}
      <Button
        startIcon={<AddIcon />}
        onClick={addFoodItem}
        variant="outlined"
        sx={{ mb: 2 }}
      >
        Add Food Item
      </Button>

      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Event"}
      </Button>

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
        <Alert severity="success">Event created successfully!</Alert>
      </Snackbar>
    </Box>
  );
}
