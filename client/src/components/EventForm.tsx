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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRouter } from "next/navigation";
import ImageUpload from "./ImageUpload";

const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
const FOOD_BUCKETS = [
  // is it okay that these are singular?
  {keywords: ["pizza", "slice", "pepperoni", "margherita", "hawaiian", "deep dish", "thin crust"], imagePath: "/uploads/events/pizza.jpg"}, // pizza
  {keywords: ["sandwich", "sub", "wrap", "hoagie", "panini",], imagePath: "/uploads/events/sandwich.jpg"}, // sandwiches
  {keywords: ["salad", "greens", "veggie bowl", "kale", "spinach", "quinoa bowl", "fruit salad", "coleslaw"], imagePath: "/uploads/events/healthy.jpg"}, // health foods
  {keywords: ["dessert", "cake", "brownie", "cookie", "cupcake", "pie", "donut", "doughnuts", "pastry", "danish", "ice cream", "chocolate", "candy"], imagePath: "/uploads/events/desserts.jpg"}, // desserts
  {keywords: ["chips", "pretzels", "popcorn", "nuts", "trail mix", "crackers"], imagePath: "/uploads/events/snacks.jpg"}, // snacks
  {keywords: ["burger", "hot dog", "hamburger", "fries", "french fry", "chicken fingers", "chicken nuggets", "fried chickent", "chicken tenders", "chicken strips"], imagePath: "/uploads/events/fastfoods.jpg"}, // fast foods 
  {keywords: ["juice", "water", "soda", "lemonade", "smoothie", "coffee", "tea", "milk", "hot chocolate", "cider"], imagePath: "/uploads/events/drinks.jpg"}, // drinks
  {keywords: ["eggs", "egg sandwich", "sausage patties", "sausage links", "toast", "bacon", "breakfast wrap"], imagePath: "/uploads/events/breakfast.jpg"}, // breakfast
  {keywords: [], imagePath: "/uploads/events/fallback.jpg"} // fallback
]

export default function EventForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [foodItems, setFoodItems] = useState([
    { name: "", description: "", quantity: 1, dietaryInfo: [] as string[] },
  ]);
  const [error, setError] = useState("");
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

  const assignImgByBucket = ( foodName: string, foodDescription: string, eventName: string, eventDescription: string) => {
    const sortingInfo = (foodName + " " + foodDescription + " " + eventName + " " + eventDescription).toLowerCase();
    for (const bucket of FOOD_BUCKETS) {
      for (const keyword of bucket.keywords) {
        if (sortingInfo.includes(keyword)) {
          setImagePath(bucket.imagePath);
          return bucket.imagePath; // Return early when match is found
        };
      };
    };

    // Fallback if no match found
    const fallbackPath = FOOD_BUCKETS[FOOD_BUCKETS.length - 1].imagePath;
    setImagePath(fallbackPath);
    return fallbackPath;
  }

  // Helper function to get image path without setting state (for use in submit)
  const getImagePathByBucket = (foodName: string, foodDescription: string, eventName: string, eventDescription: string): string => {
    const sortingInfo = (foodName + " " + foodDescription + " " + eventName + " " + eventDescription).toLowerCase();
    for (const bucket of FOOD_BUCKETS) {
      for (const keyword of bucket.keywords) {
        if (sortingInfo.includes(keyword)) {
          return bucket.imagePath;
        }
      }
    }
    // Fallback if no match found
    return FOOD_BUCKETS[FOOD_BUCKETS.length - 1].imagePath;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // If no image is provided, assign one based on food items and event details
    let finalImagePath = imagePath;
    if (!imagePath || imagePath.trim() === "") {
      // Combine all food item names and descriptions
      const allFoodNames = foodItems
        .filter((item) => item.name)
        .map((item) => item.name)
        .join(" ");
      const allFoodDescriptions = foodItems
        .filter((item) => item.description)
        .map((item) => item.description)
        .join(" ");
      
      // Get image path based on bucket matching
      finalImagePath = getImagePathByBucket(allFoodNames, allFoodDescriptions, title, description || "");
      
      // Also update state so the UI reflects the assigned image
      setImagePath(finalImagePath);
    }

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
          imagePath: finalImagePath || undefined,
          foodItems: foodItems.filter((item) => item.name),
        }),
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
      <TextField
        fullWidth
        label="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        required
        margin="normal"
      />
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

      <ImageUpload onUpload={(path) => setImagePath(path)} />

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

