import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { userService } from "@/server/services/userService";

// If you want to force Node runtime (optional):
// export const runtime = "nodejs";

export async function GET() {
  try {
    // await cookies()
    const cookieStore = await cookies();
    const token = cookieStore.get("sb_session")?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const { userId } = verifyToken(token);
    const user = await userService.getPublicUser(userId);

    return NextResponse.json({ user }, { status: 200 });
  } catch {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
