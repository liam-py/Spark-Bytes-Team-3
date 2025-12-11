import { NextResponse } from "next/server";

import { eventImagesBucket, supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME = ["image/jpeg", "image/png", "image/jpg"];

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const title = formData.get("title")?.toString().trim();
    const description = formData.get("description")?.toString().trim() || null;
    const location = formData.get("location")?.toString().trim();
    const startTimeRaw = formData.get("startTime")?.toString();
    const endTimeRaw = formData.get("endTime")?.toString();
    const createdBy = formData.get("createdBy")?.toString();
    // foodItems are currently ignored because the Supabase Event table schema does not include them

    if (!title || !location || !startTimeRaw || !endTimeRaw) {
      return NextResponse.json(
        { error: "Missing required fields: title, location, startTime, endTime" },
        { status: 400 }
      );
    }

    const startTime = new Date(startTimeRaw);
    const endTime = new Date(endTimeRaw);
    if (Number.isNaN(startTime.getTime()) || Number.isNaN(endTime.getTime())) {
      return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
    }

    let imageUrl: string | null = null;
    let storagePath: string | null = null;

    const maybeFile = formData.get("image");
    if (maybeFile instanceof File && maybeFile.size > 0) {
      if (maybeFile.size > MAX_IMAGE_BYTES) {
        return NextResponse.json({ error: "Image must be under 5MB" }, { status: 400 });
      }
      if (!ALLOWED_MIME.includes(maybeFile.type)) {
        return NextResponse.json({ error: "Only JPEG or PNG images are allowed" }, { status: 400 });
      }

      const extension = maybeFile.name?.split(".").pop()?.toLowerCase() || "jpg";
      const fileName = `events/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;
      const buffer = Buffer.from(await maybeFile.arrayBuffer());

      const { data: uploaded, error: uploadError } = await supabaseAdmin.storage
        .from(eventImagesBucket)
        .upload(fileName, buffer, {
          contentType: maybeFile.type || "application/octet-stream",
          upsert: false,
        });

      if (uploadError) {
        return NextResponse.json({ error: uploadError.message }, { status: 400 });
      }

      storagePath = uploaded?.path ?? fileName;
      const { data: publicUrlData } = supabaseAdmin.storage
        .from(eventImagesBucket)
        .getPublicUrl(storagePath);
      imageUrl = publicUrlData.publicUrl;
    }

    if (!createdBy) {
      return NextResponse.json({ error: "Missing createdBy" }, { status: 400 });
    }

    const payload: Record<string, any> = {
      id: crypto.randomUUID(),
      title,
      description,
      location,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      imagePath: imageUrl || storagePath,
      createdBy,
      updatedAt: new Date().toISOString(),
    };

    const { data: event, error: insertError } = await supabaseAdmin
      .from("Event")
      .insert(payload)
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 400 });
    }

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("Error creating event with image:", error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
