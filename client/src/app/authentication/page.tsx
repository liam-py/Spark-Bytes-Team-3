"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to student login page
    const searchParams = useSearchParams();
    console.log("redirecting to login.")
    console.log("search params: ");
    console.log(searchParams);
    router.push("/login");
  }, [router]);

  return null;
}
