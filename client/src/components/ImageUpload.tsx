"use client";

import React, { useState } from "react";
import {
  Button,
  Box,
  Typography,
  IconButton,
  Alert,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";

const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export default function ImageUpload({
  onUpload,
}: {
  onUpload: (path: string) => void;
}) {
  const [imagePath, setImagePath] = useState("");
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
      setError("Only JPEG and PNG images are allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(`${base}/api/upload`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Upload failed");
        setUploading(false);
        return;
      }
      setImagePath(data.imagePath);
      setPreview(`${base}${data.imagePath}`);
      onUpload(data.imagePath);
      setUploading(false);
    } catch {
      setError("Network error");
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setImagePath("");
    setPreview("");
    onUpload("");
  };

  return (
    <Box sx={{ mt: 2, mb: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        Event Image (Optional)
      </Typography>
      {preview ? (
        <Box>
          <Box
            component="img"
            src={preview}
            alt="Preview"
            sx={{ maxWidth: "100%", maxHeight: 300, mb: 1 }}
          />
          <IconButton onClick={handleRemove} color="error">
            <DeleteIcon />
          </IconButton>
        </Box>
      ) : (
        <Button
          variant="outlined"
          component="label"
          startIcon={<CloudUploadIcon />}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload Image"}
          <input
            type="file"
            hidden
            accept="image/jpeg,image/png"
            onChange={handleFileSelect}
          />
        </Button>
      )}
      {error && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
}

