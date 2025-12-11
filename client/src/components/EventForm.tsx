"use client";

<<<<<<< HEAD
import React, { useState } from "react";
=======
import React, { useEffect, useState } from "react";
>>>>>>> bc462f422b0c6a09b358738db66beaf94bfb33e4
import {
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Chip,
  Alert,
  Snackbar,
<<<<<<< HEAD
=======
  FormControl,
  InputLabel,
  Select,
  MenuItem,
>>>>>>> bc462f422b0c6a09b358738db66beaf94bfb33e4
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRouter } from "next/navigation";
<<<<<<< HEAD
import ImageUpload from "./ImageUpload";

const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export default function EventForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [imagePath, setImagePath] = useState("");
=======

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
  const [imagePreview, setImagePreview] = useState("");
>>>>>>> bc462f422b0c6a09b358738db66beaf94bfb33e4
  const [foodItems, setFoodItems] = useState([
    { name: "", description: "", quantity: 1, dietaryInfo: [] as string[] },
  ]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

<<<<<<< HEAD
=======
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

>>>>>>> bc462f422b0c6a09b358738db66beaf94bfb33e4
  const addFoodItem = () => {
    setFoodItems([
      ...foodItems,
      { name: "", description: "", quantity: 1, dietaryInfo: [] },
    ]);
  };

  const removeFoodItem = (index: number) => {
    setFoodItems(foodItems.filter((_, i) => i !== index));
  };

<<<<<<< HEAD
  const updateFoodItem = (
    index: number,
    field: string,
    value: any
  ) => {
=======
  const updateFoodItem = (index: number, field: string, value: any) => {
>>>>>>> bc462f422b0c6a09b358738db66beaf94bfb33e4
    const updated = [...foodItems];
    updated[index] = { ...updated[index], [field]: value };
    setFoodItems(updated);
  };

<<<<<<< HEAD
=======
  const handleLocationChange = (value: string) => {
    setLocationType(value);
    if (value === "Other") {
      setLocation("");
    } else {
      setLocation(value);
      setCustomLocation("");
    }
  };

>>>>>>> bc462f422b0c6a09b358738db66beaf94bfb33e4
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

<<<<<<< HEAD
    try {
      const res = await fetch(`${base}/api/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title,
          description,
          location,
          startTime: new Date(startTime).toISOString(),
          endTime: new Date(endTime).toISOString(),
          imagePath: imagePath || undefined,
          foodItems: foodItems.filter((item) => item.name),
        }),
=======
    const finalLocation = locationType === "Other" ? customLocation : location;
    if (!finalLocation) {
      setError("Please enter a location");
      setLoading(false);
      return;
    }
    if (!startTime || !endTime) {
      setError("Please enter start and end times");
      setLoading(false);
      return;
    }
    const start = new Date(startTime);
    const end = new Date(endTime);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      setError("Please enter valid start and end times");
      setLoading(false);
      return;
    }
    if (end <= start) {
      setError("End time must be after start time.");
      setLoading(false);
      return;
    }

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
>>>>>>> bc462f422b0c6a09b358738db66beaf94bfb33e4
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
<<<<<<< HEAD
      <TextField
        fullWidth
        label="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        required
        margin="normal"
      />
=======

      <FormControl fullWidth required margin="normal">
        <InputLabel id="location-label">Location</InputLabel>
        <Select
          labelId="location-label"
          value={locationType}
          onChange={(e) => handleLocationChange(e.target.value)}
          label="Location"
          MenuProps={{
            PaperProps: {
              style: { maxHeight: 300 },
            },
            anchorOrigin: { vertical: "bottom", horizontal: "left" },
            transformOrigin: { vertical: "top", horizontal: "left" },
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

>>>>>>> bc462f422b0c6a09b358738db66beaf94bfb33e4
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

<<<<<<< HEAD
      <ImageUpload onUpload={(path) => setImagePath(path)} />
=======
      <Box sx={{ mt: 2, mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Event Image (Optional)
        </Typography>
        {imagePreview ? (
          <Box>
            <Box
              component="img"
              src={imagePreview}
              alt="Preview"
              sx={{ maxWidth: "100%", maxHeight: 300, mb: 1, borderRadius: 1 }}
            />
            <IconButton
              onClick={() => {
                if (imagePreview) URL.revokeObjectURL(imagePreview);
                setImagePreview("");
                setImageFile(null);
              }}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ) : (
          <Button variant="outlined" component="label" disabled={loading}>
            Upload Image
            <input
              type="file"
              hidden
              accept="image/jpeg,image/png"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                if (!/^image\/(jpeg|jpg|png)$/.test(file.type)) {
                  setError("Only JPEG and PNG images are allowed");
                  return;
                }
                if (file.size > 5 * 1024 * 1024) {
                  setError("Image size must be less than 5MB");
                  return;
                }
                if (imagePreview) {
                  URL.revokeObjectURL(imagePreview);
                }
                setError("");
                setImageFile(file);
                setImagePreview(URL.createObjectURL(file));
              }}
            />
          </Button>
        )}
      </Box>
>>>>>>> bc462f422b0c6a09b358738db66beaf94bfb33e4

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
<<<<<<< HEAD
      <Button
        startIcon={<AddIcon />}
        onClick={addFoodItem}
        variant="outlined"
        sx={{ mb: 2 }}
      >
=======

      <Button startIcon={<AddIcon />} onClick={addFoodItem} variant="outlined" sx={{ mb: 2 }}>
>>>>>>> bc462f422b0c6a09b358738db66beaf94bfb33e4
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

<<<<<<< HEAD
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
=======
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError("")}>
        <Alert severity="error">{error}</Alert>
      </Snackbar>

      <Snackbar open={success} autoHideDuration={2000} onClose={() => setSuccess(false)}>
>>>>>>> bc462f422b0c6a09b358738db66beaf94bfb33e4
        <Alert severity="success">Event created successfully!</Alert>
      </Snackbar>
    </Box>
  );
}
<<<<<<< HEAD

=======
>>>>>>> bc462f422b0c6a09b358738db66beaf94bfb33e4
