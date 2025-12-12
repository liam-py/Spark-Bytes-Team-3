import { NextResponse } from "next/server";
import { Buffer } from "buffer";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
const storageBucket =
  process.env.SUPABASE_STORAGE_BUCKET ||
  process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ||
  "event-images";

const buildImagePath = (fileName: string) => `events/${fileName}`;

const uploadImage = async (file: File) => {
  if (!storageBucket) {
    throw new Error("STORAGE_BUCKET_NOT_CONFIGURED");
  }
  const supabaseAdmin = getSupabaseAdmin();

  const fileExt = file.name.split(".").pop() || "jpg";
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
  const filePath = buildImagePath(safeName);

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error } = await supabaseAdmin.storage
    .from(storageBucket)
    .upload(filePath, buffer, { contentType: file.type || "image/jpeg" });

  if (error) {
    console.error("[events/upload] Failed to upload image:", error.message);
    throw new Error("IMAGE_UPLOAD_FAILED");
  }

  return filePath;
};

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const title = (formData.get("title") as string) || "";
    const description = (formData.get("description") as string) || "";
    const location = (formData.get("location") as string) || "";
    const startTime = (formData.get("startTime") as string) || "";
    const endTime = (formData.get("endTime") as string) || "";
    const foodItemsRaw = formData.get("foodItems") as string | null;
    const image = formData.get("image");

    if (!title || !location || !startTime || !endTime) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json({ error: "Invalid start or end time" }, { status: 400 });
    }
    if (endDate <= startDate) {
      return NextResponse.json({ error: "End time must be after start time" }, { status: 400 });
    }

    let foodItems: any[] = [];
    if (foodItemsRaw) {
      try {
        foodItems = JSON.parse(foodItemsRaw);
      } catch (e) {
        return NextResponse.json({ error: "Invalid food items payload" }, { status: 400 });
      }
    }

    let imagePath: string | null = null;
    let uploadedImagePath: string | null = null;
    if (image instanceof File && image.size > 0) {
      if (image.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: "Image must be under 5MB" }, { status: 400 });
      }
      if (!image.type.startsWith("image/")) {
        return NextResponse.json({ error: "Invalid image type" }, { status: 400 });
      }
      uploadedImagePath = await uploadImage(image);
      imagePath = uploadedImagePath;
    }

    const payload = {
      title,
      description,
      location,
      startTime,
      endTime,
      imagePath: imagePath || undefined,
      foodItems,
    };

    const backendResponse = await fetch(`${apiBase}/api/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: req.headers.get("cookie") || "",
      },
      body: JSON.stringify(payload),
    });

    const data = await backendResponse.json().catch(() => null);

    if (!backendResponse.ok) {
      if (uploadedImagePath) {
        // Attempt cleanup for orphaned uploads
        await getSupabaseAdmin().storage
          .from(storageBucket || "")
          .remove([uploadedImagePath])
          .catch(() => {});
      }
      const errorMessage = data?.error || "Failed to create event";
      return NextResponse.json({ error: errorMessage }, { status: backendResponse.status });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (e: any) {
    const message = e?.message === "IMAGE_UPLOAD_FAILED"
      ? "Failed to upload image"
      : e?.message === "STORAGE_BUCKET_NOT_CONFIGURED"
        ? "Storage bucket not configured"
        : "Failed to create event";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
