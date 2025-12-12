const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// For client bundles, only NEXT_PUBLIC_* is available. Keep the fallback for SSR safety.
const storageBucket =
  process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ||
  process.env.SUPABASE_STORAGE_BUCKET ||
  "event-images";

export type EventWithImage = {
  imagePath?: string | null;
  image_url?: string | null;
};

export const getEventImageSrc = (event: EventWithImage) => {
  const raw = event?.image_url || event?.imagePath;
  if (!raw) return null;

  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    return raw;
  }

  if (raw.startsWith("/uploads")) {
    return `${apiBase}${raw}`;
  }

  if (supabaseUrl && storageBucket) {
    return `${supabaseUrl}/storage/v1/object/public/${storageBucket}/${raw.replace(
      /^\/+/,
      ""
    )}`;
  }

  // If bucket or URL missing, gracefully fall back to the raw value (might be a relative path)
  return raw.startsWith("/") ? `${apiBase}${raw}` : raw;
};
